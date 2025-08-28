import React, { useState, useEffect } from "react";
import "../login/RegisterComponent.css"; // 회원가입 CSS 재사용
import { modifyMember } from "../../api/memberApi";
import { useSelector } from "react-redux";
import useCustomLogin from "../../hook/useCustomLogin";
import { getCookie } from "../../util/cookieUtil";

const initialForm = {
  userId: "",
  name: "",
  address: "",
  phoneNum: "",
};

const KakaoModifyComponent = () => {
  const loginInfo = useSelector((state) => state.login);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const { moveToPath } = useCustomLogin();

  // 로그인 정보가 바뀌면 폼 초기화
  useEffect(() => {
    const memberStr = getCookie("member");
    console.log("member cookie:", memberStr);
    if (loginInfo) {
      setForm({
        userId: loginInfo.userId || "",
        name: loginInfo.name || "",
        address: loginInfo.address || "",
        phoneNum: loginInfo.phoneNum || "",
      });
    }
  }, [loginInfo]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name } = form;

    if (!name) {
      setError("이름을 입력해주세요.");
      return;
    }

    try {
      setError("");
      await modifyMember(form);
      alert("회원정보가 수정되었습니다.");
      moveToPath("/");
    } catch (err) {
      setError("회원정보 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>회원정보 수정</h2>
        <form onSubmit={handleSubmit} className="register-form gap-3">
          <input
            type="email"
            name="userId"
            placeholder="이메일"
            value={form.userId}
            disabled
          />

          <input
            type="text"
            name="name"
            placeholder="이름"
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="text"
            name="address"
            placeholder="주소"
            value={form.address}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phoneNum"
            placeholder="전화번호"
            value={form.phoneNum}
            onChange={handleChange}
          />

          <button type="submit">정보 수정</button>

          {error && <p className="register-error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default KakaoModifyComponent;

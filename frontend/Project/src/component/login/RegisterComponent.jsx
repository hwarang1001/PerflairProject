import React, { useState } from "react";
import DaumPostcode from "react-daum-postcode";
import "./RegisterComponent.css";
import { registerPost } from "../../api/MemberApi";
import useCustomLogin from "../../hook/useCustomLogin";
const initialForm = {
  userId: "",
  pw: "",
  confirmPw: "", // 비밀번호 확인용
  name: "",
  phone1: "",
  phone2: "",
  phone3: "",
  zonecode: "", // 우편번호
  address: "", // 주소
  detailAddress: "", // 상세주소
};

const RegisterComponent = () => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [showPostcode, setShowPostcode] = useState(false);
  const { moveToPath } = useCustomLogin();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  // 주소창 선택 시 폼에 반영
  const handleAddressComplete = (data) => {
    setForm({
      ...form,
      zonecode: data.zonecode,
      address: data.address,
    });
    setShowPostcode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      userId,
      pw,
      confirmPw,
      name,
      phone1,
      phone2,
      phone3,
      zonecode,
      address,
      detailAddress,
    } = form;

    if (
      !userId ||
      !name ||
      !pw ||
      !confirmPw ||
      !phone1 ||
      !phone2 ||
      !phone3 ||
      !zonecode ||
      !address ||
      !detailAddress
    ) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    if (pw !== confirmPw) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    const fullAddress = `[${zonecode}] ${address} ${detailAddress}`;
    const fullPhoneNum = `${form.phone1}-${form.phone2}-${form.phone3}`;

    const dataToSend = {
      userId,
      pw,
      name,
      phoneNum: fullPhoneNum,
      address: fullAddress,
    };

    try {
      setError("");
      await registerPost(dataToSend);
      alert("회원가입이 성공적으로 완료되었습니다.");
      setForm(initialForm);
      moveToPath("/");
    } catch (err) {
      setError("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="register-container gap-4">
      <div className="register-box">
        <h2>회원가입</h2>
        <form onSubmit={handleSubmit} className="register-form gap-3">
          <input
            type="email"
            name="userId"
            placeholder="이메일"
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="name"
            placeholder="이름"
            value={form.name}
            onChange={handleChange}
          />
          <input
            type="password"
            name="pw"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirmPw"
            placeholder="비밀번호 확인"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          <div className="d-flex gap-2 justify-content-center align-items-center">
            <input
              type="text"
              name="phone1"
              maxLength={3}
              placeholder="010"
              value={form.phone1}
              onChange={handleChange}
            />
            <span>-</span>
            <input
              type="text"
              name="phone2"
              maxLength={4}
              placeholder="1234"
              value={form.phone2}
              onChange={handleChange}
            />
            <span>-</span>
            <input
              type="text"
              name="phone3"
              maxLength={4}
              placeholder="5678"
              value={form.phone3}
              onChange={handleChange}
            />
          </div>
          {/* 우편번호 + 주소 + 상세주소 */}
          <div className="address-group">
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                name="zonecode"
                value={form.zonecode}
                readOnly
                className="address-input"
              />
              <button
                type="button"
                onClick={() => setShowPostcode(true)}
                className="address-button"
              >
                주소 찾기
              </button>
            </div>

            <input
              type="text"
              name="address"
              value={form.address}
              readOnly
              className="address-input"
            />

            <input
              type="text"
              name="detailAddress"
              placeholder="상세 주소"
              value={form.detailAddress}
              onChange={handleChange}
              className="address-input"
            />
          </div>

          <button type="submit">회원가입</button>
          {error && <p className="register-error">{error}</p>}
        </form>

        {showPostcode && (
          <div className="modal-overlay" onClick={() => setShowPostcode(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button
                className="modal-close-button"
                onClick={() => setShowPostcode(false)}
              >
                &times;
              </button>
              <DaumPostcode onComplete={handleAddressComplete} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterComponent;

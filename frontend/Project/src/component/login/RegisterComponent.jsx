import React, { useState } from "react";
import "./RegisterComponent.css";
const a = {
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    realName: "", // 본명 추가
}
const RegisterComponent = () => {
  const [form, setForm] = useState(a);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { username, password, confirmPassword, email, realName } = form;

    // 필수 항목 확인
    if (!username || !password || !confirmPassword || !email || !realName) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setError("");

    // 콘솔 출력 (백엔드 연동 시 axios.post 등으로 대체)
    console.log("회원가입 정보:", form);
    alert("회원가입 요청 완료 (백엔드 연동 예정)");

    // 입력 초기화
    setForm({
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      realName: "",
    });
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>회원가입</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="username"
            placeholder="아이디"
            value={form.username}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="비밀번호 확인"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          <input
            type="text"
            name="realName"
            placeholder="성함"
            value={form.realName}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={form.email}
            onChange={handleChange}
          />
          <button type="submit">회원가입</button>
          {error && <p className="register-error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default RegisterComponent;

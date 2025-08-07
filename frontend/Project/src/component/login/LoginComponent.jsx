import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./LoginComponent.css";

const LoginComponent = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // 일반 로그인 처리 함수
  const handleLogin = (e) => {
    e.preventDefault();

    const validId = "testuser";
    const validPassword = "1234";

    if (id === validId && password === validPassword) {
      setIsSuccess(true);
      setMessage("로그인 성공!");
    } else {
      setIsSuccess(false);
      setMessage("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
  };

  // 추후 카카오 로그인 API 연동 예정
  const handleKakaoLogin = () => {
    alert("카카오 로그인은 추후 연동될 예정입니다.");
  };

  return (
    <div className="login-container">
      <div className="login-form-box">
        <h2 className="login-title">로그인</h2>

        {/* 일반 로그인 입력 폼 */}
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="아이디"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button type="submit" className="login-button">
            로그인
          </button>
        </form>

        {/* 카카오 로그인 버튼 (기능은 추후 구현) */}
        <button onClick={handleKakaoLogin} className="kakao-login-button">
          카카오로 로그인
        </button>

        {/* 로그인 메시지 */}
        {message && (
          <p className={`login-message ${isSuccess ? "success" : "error"}`}>
            {message}
          </p>
        )}

        {/* 링크 영역 */}
        <div className="login-links">
          <Link to="/login/register" className="login-link">
            회원가입
          </Link>
          <span className="login-separator">|</span>
          <Link to="/login/find-id" className="login-link">
            아이디 찾기
          </Link>
          <span className="login-separator">|</span>
          <Link to="/login/find-password" className="login-link">
            비밀번호 찾기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;

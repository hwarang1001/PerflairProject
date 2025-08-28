import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./LoginComponent.css";
import { useDispatch } from "react-redux";
import { loginPostAsync } from "../../slice/LoginSlice";
import KakaoLoginComponent from "../member/KakaoLoginComponent";
import { useNavigate } from "react-router-dom";
const LoginComponent = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 일반 로그인 처리 함수
  const handleLogin = (e) => {
    e.preventDefault();

    dispatch(loginPostAsync({ userId: id, pw: password }))
      .unwrap()
      .then((data) => {
        if (data.error) {
          // 실패 처리
          setIsSuccess(false);
          setMessage("이메일과 패스워드를 다시 확인하세요");
        } else {
          // 성공 처리
          setIsSuccess(true);
          setMessage("로그인 성공!");
          navigate("/", { replace: true });
        }
      })
      .catch((error) => {
        // 네트워크 오류 등 예외 상황
        setIsSuccess(false);
        setMessage("서버 오류가 발생했습니다.");
      });
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
        <KakaoLoginComponent />

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

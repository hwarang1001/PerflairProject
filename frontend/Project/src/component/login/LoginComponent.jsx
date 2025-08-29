import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginComponent.css";
import { useDispatch } from "react-redux";
import { loginPostAsync } from "../../slice/LoginSlice";
import KakaoLoginComponent from "../member/KakaoLoginComponent";

/*
  로그인 화면 컴포넌트
  - 목적: 아이디/비밀번호 입력 -> 서버 로그인 요청 -> 결과 메시지/페이지 이동
  - 데이터 흐름: 입력 상태(id, password) -> dispatch(loginPostAsync) -> unwrap()로 결과 분기 -> navigate
  - UX: 실패 문구는 한 가지로 고정해 불필요한 정보 노출 방지
  - 라우팅: 성공 시 navigate("/", { replace: true }) 사용 -> 뒤로가기로 로그인 화면 재노출 방지
*/
const LoginComponent = () => {
  // 입력 상태
  const [id, setId] = useState(""); // 아이디 입력값
  const [password, setPassword] = useState(""); // 비밀번호 입력값

  // 사용자 피드백
  const [message, setMessage] = useState(null); // 성공/오류 메시지
  const [isSuccess, setIsSuccess] = useState(false); // 메시지 스타일 분기용

  // 전역 디스패치, 라우팅
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 실패 문구를 한 곳에서 관리
  const getLoginErrorMessage = () => "아이디 또는 비밀번호가 틀렸습니다.";

  // 로그인 제출 핸들러
  // - Redux Thunk 사용 -> 비동기 요청을 action처럼 디스패치
  // - unwrap() -> payload를 직접 받고, 실패 시 catch로 흐름 이동
  const handleLogin = (e) => {
    e.preventDefault();

    dispatch(loginPostAsync({ userId: id, pw: password }))
      .unwrap()
      .then((data) => {
        // payload 형태 예시: { accessToken, roleNames, ... }
        if (data?.error || !data?.accessToken) {
          setIsSuccess(false);
          setMessage(getLoginErrorMessage());
        } else {
          setIsSuccess(true);
          setMessage("로그인 성공!");
          // 메인으로 이동. replace -> 브라우저 뒤로가기로 로그인 화면 재방문 차단
          navigate("/", { replace: true });
        }
      })
      .catch(() => {
        // 네트워크 오류/서버 오류 등 모든 실패 케이스를 동일 문구로 표시
        setIsSuccess(false);
        setMessage(getLoginErrorMessage());
      });
  };

  // 소셜 로그인 자리표시
  // - 실제 연동 전까지 간단 안내만 제공
  const handleKakaoLogin = () => {
    alert("카카오 로그인은 추후 연동 예정");
  };

  return (
    <div className="login-container">
      <div className="login-form-box">
        <h2 className="login-title">로그인</h2>

        {/* 로그인 폼 -> onSubmit에서 handleLogin 호출 */}
        <form onSubmit={handleLogin} className="login-form">
          {/* 아이디 입력 -> 자동완성 힌트(username) */}
          <input
            type="text"
            placeholder="아이디"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="login-input"
            autoComplete="username"
          />

          {/* 비밀번호 입력 -> 자동완성 힌트(current-password) */}
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            autoComplete="current-password"
          />

          {/* 제출 버튼 */}
          <button type="submit" className="login-button">
            로그인
          </button>
        </form>

        {/* 카카오 로그인 버튼 (기능은 추후 구현) */}
        <KakaoLoginComponent />

        {/* 결과 메시지 -> 성공/실패에 따라 스타일 분기 */}
        {message && (
          <p className={`login-message ${isSuccess ? "success" : "error"}`}>
            {message}
          </p>
        )}

        {/* 보조 링크 -> 회원가입/아이디 찾기/비밀번호 재설정 경로 제공 */}
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
            비밀번호 재설정
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;

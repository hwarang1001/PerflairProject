import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { startPasswordReset, confirmPasswordReset } from "../../api/memberApi";
import "./FindPasswordComponent.css";

/*
  비밀번호 재설정 화면
  - 전체 흐름: 1) 아이디 입력 -> 인증코드 전송 -> 2) 코드 + 새 비밀번호 입력 -> 3) 완료 화면
  - 아이디 힌트: 이전 화면(아이디 찾기)에서 넘겨준 마스킹 문자열(state) 표시
  - 검증 규칙: 이메일 형식 체크, 새 비밀번호는 8자 이상 + 영문 + 숫자 포함
*/
export default function FindPasswordComponent() {
  const navigate = useNavigate();
  const { state } = useLocation(); // 아이디 찾기 화면에서 전달된 state 접근

  // 힌트 문자열(", "로 연결) -> 화면에 뱃지로 보여줄 배열로 변환
  const hintsRaw = state?.userIdHint ?? "";
  const hintList = useMemo(
    () =>
      typeof hintsRaw === "string"
        ? hintsRaw
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    [hintsRaw]
  );

  // 화면 단계 상태
  // - "sendCode" -> 아이디 입력 단계
  // - "confirm"  -> 코드 + 새 비밀번호 입력 단계
  // - "done"     -> 완료 화면
  const [step, setStep] = useState("sendCode");
  const [loading, setLoading] = useState(false); // 서버 요청 중 여부

  // 입력 값 상태
  const [userIdFull, setUserIdFull] = useState(""); // 전체 아이디(이메일)
  const [code, setCode] = useState(""); // 인증코드
  const [newPassword, setNewPassword] = useState(""); // 새 비밀번호
  const [confirmPassword, setConfirmPassword] = useState(""); // 새 비밀번호 확인

  // 입력값 검증 유틸
  const emailRe = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);
  const pwPolicyOk = (pw) =>
    pw?.length >= 8 && /[a-z]/i.test(pw) && /[0-9]/.test(pw);

  // 1단계: 아이디 입력 -> 인증코드 전송
  // - 이메일 형식이 맞지 않으면 알림
  // - 서버로 { userId } 전송 -> 전송 성공 시 다음 단계로 전환
  const onSendCode = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!emailRe.test(userIdFull)) {
      alert("올바른 이메일(아이디)을 입력해주세요.");
      return;
    }
    setLoading(true);
    try {
      await startPasswordReset({ userId: userIdFull });
      alert("인증코드를 전송했습니다. 메일함(또는 SMS) 확인");
      setStep("confirm");
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "코드 전송 실패";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  // 2단계: 코드 + 새 비밀번호 제출
  // - 빈 코드 거부, 비밀번호 정책 체크, 비밀번호/확인 일치 여부 체크
  // - 서버로 { userId, code, newPassword } 전송 -> 성공 시 "done" 단계로 전환
  const onConfirmReset = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!code.trim()) {
      alert("인증코드를 입력하세요.");
      return;
    }
    if (!pwPolicyOk(newPassword)) {
      alert("8자 이상, 알파벳과 숫자 포함");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset({
        userId: userIdFull,
        code: code.trim(),
        newPassword,
      });
      setStep("done");
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "재설정 실패";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-center">
      <div className="container" style={{ maxWidth: 560 }}>
        {/* 1) 아이디 입력 단계 */}
        {step === "sendCode" && (
          <form onSubmit={onSendCode} className="myhub-form">
            <h2 className="form-title">비밀번호 재설정</h2>

            {/* 아이디 힌트(마스킹) -> 이전 화면에서 전달된 힌트가 있을 때만 표시 */}
            {hintList.length > 0 && (
              <div className="alert alert-secondary">
                <div className="mb-1">아이디 힌트(마스킹)</div>
                <div className="d-flex flex-wrap gap-2">
                  {hintList.map((h, i) => (
                    <span key={i} className="badge text-bg-light">
                      {h}
                    </span>
                  ))}
                </div>
                <div className="form-text mt-2">
                  힌트를 참고해 전체 아이디 입력
                </div>
              </div>
            )}

            {/* 아이디 입력칸 -> 이메일 전체 주소 기준 */}
            <div className="mb-3">
              <label className="form-label">아이디(이메일)</label>
              <input
                className="form-control"
                value={userIdFull}
                onChange={(e) => setUserIdFull(e.target.value)}
                placeholder="example@email.com"
                disabled={loading}
                autoFocus
              />
              <div className="form-text text-muted">전체 이메일 주소 기준</div>
            </div>

            {/* 하단 버튼 -> 로그인으로 이동 / 인증코드 전송 */}
            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate("/login")}
                disabled={loading}
              >
                로그인으로
              </button>
              <button type="submit" className="btn btn-dark" disabled={loading}>
                {loading ? "전송 중..." : "인증코드 전송"}
              </button>
            </div>
          </form>
        )}

        {/* 2) 코드 + 새 비밀번호 입력 단계 */}
        {step === "confirm" && (
          <form onSubmit={onConfirmReset} className="myhub-form">
            {/* 확인용 아이디 고정 표시 -> 이전 단계에서 입력한 값 */}
            <div className="mb-3">
              <label className="form-label">아이디(이메일)</label>
              <input className="form-control" value={userIdFull} disabled />
            </div>

            {/* 인증코드 입력칸 */}
            <div className="mb-3">
              <label className="form-label">인증코드</label>
              <input
                className="form-control"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="메일/SMS로 받은 코드"
                disabled={loading}
                autoFocus
              />
            </div>

            {/* 새 비밀번호 입력칸 -> 정책 안내문 함께 표시 */}
            <div className="mb-3">
              <label className="form-label">새 비밀번호</label>
              <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="새 비밀번호"
                disabled={loading}
              />
              <small
                className={`form-text ${
                  pwPolicyOk(newPassword) ? "text-success" : "text-muted"
                }`}
              >
                8자 이상, 알파벳과 숫자 포함
              </small>
            </div>

            {/* 새 비밀번호 확인 입력칸 */}
            <div className="mb-4">
              <label className="form-label">새 비밀번호 확인</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="새 비밀번호 확인"
                disabled={loading}
              />
            </div>

            {/* 하단 버튼 -> 아이디 다시 입력 / 비밀번호 재설정 */}
            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setStep("sendCode")}
                disabled={loading}
              >
                아이디 다시 입력
              </button>
              <button type="submit" className="btn btn-dark" disabled={loading}>
                {loading ? "변경 중..." : "비밀번호 재설정"}
              </button>
            </div>
          </form>
        )}

        {/* 3) 완료 단계 */}
        {step === "done" && (
          <div className="myhub-form text-center">
            <h4 className="mb-3">비밀번호 변경 완료</h4>
            <p className="text-muted mb-4">새 비밀번호로 로그인 진행</p>
            <button className="btn btn-dark" onClick={() => navigate("/login")}>
              로그인 화면으로 이동
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

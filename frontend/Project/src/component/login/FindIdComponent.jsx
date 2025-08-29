import React, { useMemo, useState } from "react";
import "./FindIdComponent.css";
import { findUserId } from "../../api/memberApi";
import { useNavigate } from "react-router-dom";

/*
  아이디(이메일) 찾기 화면
  - 입력 -> 이름, 휴대폰 번호
  - 처리 -> 서버 조회 결과를 마스킹된 아이디 목록으로 표시
  - 응답 스키마 변동 가능성 고려 -> 배열/객체/단일 값 케이스를 통합 처리
*/
export default function FindIdComponent() {
  const [loading, setLoading] = useState(false); // 서버 요청 중 상태
  const [name, setName] = useState(""); // 이름 입력 값
  const [phoneInput, setPhoneInput] = useState(""); // 휴대폰 원문 입력(숫자/하이픈 혼재 가능)
  const [maskedList, setMaskedList] = useState([]); // 마스킹된 아이디 배열
  const [feedback, setFeedback] = useState(""); // 조회 실패/미존재 등 안내 문구
  const navigate = useNavigate();

  // 휴대폰 포맷팅 유틸
  // - 입력에서 숫자만 추출(최대 11자리)
  // - 화면 표시 형식: 010-1234-5678 형태
  // - 내부 상태는 phoneInput에 원문을 유지, 표시 값은 phoneNum으로 관리
  const formatPhone = (v) => {
    const digits = (v || "").replace(/[^\d]/g, "").slice(0, 11);
    if (digits.length < 4) return digits;
    if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };
  const phoneNum = useMemo(() => formatPhone(phoneInput), [phoneInput]);

  // 아이디 조회 제출
  // - 입력 값 간단 검증 -> 서버 호출 -> 응답을 배열 형태로 정규화 -> 상태 반영
  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!name.trim()) return alert("이름을 입력하세요.");
    if (!phoneNum) return alert("휴대폰 번호를 입력하세요.");

    setLoading(true);
    setFeedback("");
    try {
      const res = await findUserId({ name: name.trim(), phoneNum });

      // 응답 케이스 통합
      // - 배열 그대로: [***]
      // - 객체 내 배열: { maskedUserIds: [***] }
      // - 단일 값: { maskedUserId: "***" }
      // - 그 외: 빈 배열
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.maskedUserIds)
        ? res.maskedUserIds
        : res?.maskedUserId
        ? [res.maskedUserId]
        : [];

      setMaskedList(list);
      if (list.length === 0) setFeedback("일치하는 계정을 찾지 못했습니다.");
    } catch (err) {
      console.error(err);
      setMaskedList([]);
      setFeedback("아이디 찾기에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 비밀번호 재설정 화면 이동
  // - 조회된 마스킹 아이디들을 ", "로 연결해 state로 전달
  // - 다음 화면에서 힌트 뱃지로 표시
  const goResetPassword = () => {
    const hint = maskedList.join(", ");
    navigate("/login/find-password", { state: { userIdHint: hint } });
  };

  return (
    <section className="auth-center">
      <div className="container" style={{ maxWidth: 560 }}>
        {/* 입력 폼 */}
        <form onSubmit={onSubmit} className="myhub-form">
          <h2 className="form-title">아이디 찾기</h2>

          {/* 이름 입력 */}
          <div className="mb-3">
            <label className="form-label">이름</label>
            <input
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              disabled={loading}
              autoFocus
            />
          </div>

          {/* 휴대폰 번호 입력 -> 표시 값은 phoneNum(포맷팅 적용), 원문은 phoneInput에 반영 */}
          <div className="mb-4">
            <label className="form-label">휴대폰 번호</label>
            <input
              className="form-control"
              value={phoneNum}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="010-1234-5678"
              inputMode="numeric"
              disabled={loading}
            />
            <div className="form-text text-muted">
              가입 시 입력한 번호 기준으로 조회됨
            </div>
          </div>

          {/* 제출 버튼 -> 로딩 중에는 비활성화 및 문구 변경 */}
          <div className="d-flex justify-content-end gap-2">
            <button type="submit" className="btn btn-dark" disabled={loading}>
              {loading ? "조회 중..." : "아이디 찾기"}
            </button>
          </div>
        </form>

        {/* 조회 결과 영역 -> 피드백 또는 마스킹 아이디 목록 표시 */}
        {(maskedList.length > 0 || feedback) && (
          <div className="myhub-form mt-3">
            <h3 className="form-subtitle">조회 결과</h3>

            {/* 조회 실패/미존재 피드백 */}
            {feedback && (
              <div className="alert alert-warning mb-2">{feedback}</div>
            )}

            {/* 마스킹 아이디 목록 */}
            {maskedList.length > 0 && (
              <>
                <ul className="list-unstyled m-0">
                  {maskedList.map((it, idx) => (
                    <li key={idx} className="py-2">
                      <span className="badge rounded-pill text-bg-light me-2">
                        ID
                      </span>
                      <strong>{it}</strong>
                    </li>
                  ))}
                </ul>

                {/* 다음 단계 이동 -> 비밀번호 재설정 화면으로, 힌트 전달 */}
                <div className="d-flex justify-content-end mt-3">
                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={goResetPassword}
                  >
                    비밀번호 재설정으로 이동
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

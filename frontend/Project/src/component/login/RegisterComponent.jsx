import React, { useEffect, useRef, useMemo, useState } from "react";
import DaumPostcode from "react-daum-postcode";
import "./RegisterComponent.css";
import { registerPost, checkUserId } from "../../api/memberApi";
import useCustomLogin from "../../hook/useCustomLogin";

/*
  회원가입 화면
  - 흐름: 이메일 중복 확인 -> 비밀번호 정책 확인 -> 기본 정보/주소 입력 -> 가입 요청
  - 주소 검색: DaumPostcode 모달 사용, 드래그 이동 가능
*/
const initialForm = {
  userId: "",
  pw: "",
  confirmPw: "",
  name: "",
  phone1: "",
  phone2: "",
  phone3: "",
  zonecode: "",
  address: "",
  detailAddress: "",
};

const RegisterComponent = () => {
  const [form, setForm] = useState(initialForm); // 폼 입력 상태
  const [error, setError] = useState(""); // 화면 하단 에러 메시지
  const [showPostcode, setShowPostcode] = useState(false); // 주소 모달 표시 여부
  const { moveToPath } = useCustomLogin();

  // 이메일 1차 형식 검증(간단 정규식). 서버에서 최종 검증 진행됨
  const emailRe = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);
  const isEmailValid = emailRe.test(form.userId || "");

  // 비밀번호 정책 체크: 8자 이상 + 영문 + 숫자 포함 여부
  const pwPolicyOk = useMemo(() => {
    const pw = form.pw || "";
    return pw.length >= 8 && /[A-Za-z]/.test(pw) && /\d/.test(pw);
  }, [form.pw]);

  // 비밀번호 일치 여부
  const pwMatch = useMemo(
    () => !!form.pw && form.pw === form.confirmPw,
    [form.pw, form.confirmPw]
  );

  // 이메일 중복 확인 상태
  // idle(미확인) / checking(확인 중) / ok(가능) / dup(중복) / invalid(형식) / error(오류)
  const [emailCheck, setEmailCheck] = useState({ state: "idle", msg: "" });

  // 숫자만 남기는 유틸리티
  const onlyDigits = (s) => (s || "").replace(/[^\d]/g, "");

  // 입력 변경 처리. userId 변경 시 이메일 중복 상태 초기화
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "userId") setEmailCheck({ state: "idle", msg: "" });
  };

  // 이메일 중복 확인 요청
  const handleCheckUserId = async () => {
    if (!isEmailValid) {
      setEmailCheck({
        state: "invalid",
        msg: "올바른 이메일 형식이 아닙니다.",
      });
      return;
    }
    try {
      setEmailCheck({ state: "checking", msg: "" });
      const data = await checkUserId(form.userId.trim());
      setEmailCheck(
        data?.available
          ? { state: "ok", msg: "사용 가능한 이메일입니다." }
          : { state: "dup", msg: "이미 사용 중인 이메일입니다." }
      );
    } catch (e) {
      console.error(e);
      setEmailCheck({ state: "error", msg: "중복 확인 중 오류 발생" });
    }
  };

  // 주소 선택 완료 콜백: zonecode/address 반영 후 모달 닫기
  const handleAddressComplete = (data) => {
    setForm({ ...form, zonecode: data.zonecode, address: data.address });
    setShowPostcode(false);
  };

  // 제출 처리: 필수값·형식 확인 -> payload 구성 -> API 전송
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = (form.userId || "").trim();
    const pw = (form.pw || "").trim();
    const confirmPw = (form.confirmPw || "").trim();
    const name = (form.name || "").trim();
    const phone1 = onlyDigits(form.phone1);
    const phone2 = onlyDigits(form.phone2);
    const phone3 = onlyDigits(form.phone3);
    const zonecode = (form.zonecode || "").trim();
    const address = (form.address || "").trim();
    const detailAddress = (form.detailAddress || "").trim();

    // 필드 확인
    if (!userId) return setError("이메일을 입력해주세요.");
    if (!emailRe.test(userId)) return setError("올바른 이메일 형식 아님");
    if (emailCheck.state !== "ok")
      return setError("이메일 중복확인을 진행해주세요.");
    if (!pw) return setError("비밀번호를 입력해주세요.");
    if (!(pw.length >= 8 && /[A-Za-z]/.test(pw) && /\d/.test(pw)))
      return setError("비밀번호는 8자 이상, 알파벳과 숫자 포함");
    if (!confirmPw) return setError("비밀번호 확인을 입력해주세요.");
    if (pw !== confirmPw) return setError("비밀번호 확인이 일치하지 않음");
    if (!name) return setError("이름을 입력해주세요.");
    if (!(phone1 && phone2 && phone3))
      return setError("휴대폰 번호를 모두 입력해주세요.");
    if (
      !(
        phone1.length === 3 &&
        (phone2.length === 3 || phone2.length === 4) &&
        phone3.length === 4
      )
    )
      return setError("휴대폰 번호 형식 오류 (예: 010-1234-5678)");
    if (!zonecode) return setError("우편번호 선택 필요");
    if (!address) return setError("주소 선택 필요");
    if (!detailAddress) return setError("상세 주소 입력 필요");

    // 서버 전송 포맷
    const fullAddress = `[${zonecode}] ${address} ${detailAddress}`;
    const fullPhoneNum = `${phone1}-${phone2}-${phone3}`;
    const dataToSend = {
      userId,
      pw,
      name,
      phoneNum: fullPhoneNum,
      social: false, // 소셜 여부는 false로 설정
      // AddressDTO
      addressDTO: {
        receiverName: name, // 받는 분은 이름
        phone: fullPhoneNum, // 전화번호
        zonecode: zonecode, // 우편번호
        address: address, // 기본 주소
        detailAddress: detailAddress, // 상세 주소
        memo: "", // 배송 메모는 빈 값으로 설정
        isDefault: true, // 기본 배송지로 설정
      },
    };

    try {
      setError("");
      await registerPost(dataToSend);
      alert("회원가입 완료");
      setForm(initialForm);
      setEmailCheck({ state: "idle", msg: "" });
      moveToPath("/login");
    } catch (err) {
      const status = err?.response?.status ?? "NO_STATUS";
      const serverMsg =
        err?.response?.data?.message || err?.message || "회원가입 중 오류";
      setError(`HTTP ${status} - ${serverMsg}`);
    }
  };

  // ----- 모달 드래그(UX 개선) -----
  // 마우스로 모달을 끌어 이동하는 기능.
  // 핵심: 현재 모달 위치(posRef)와 처음 누른 지점과의 거리(offsetRef)를 기억한 뒤,
  // 마우스 좌표를 따라 CSS transform(translate3d)로 위치를 갱신

  const modalRef = useRef(null); // 모달 DOM 참조. transform 대상
  const draggingRef = useRef(false); // 드래그 진행 여부 플래그
  const posRef = useRef({ x: 0, y: 0 }); // 모달의 현재 좌표(좌상단 기준)
  const offsetRef = useRef({ dx: 0, dy: 0 }); // 마우스를 누른 지점과 모달 좌상단 사이의 거리
  const startedRef = useRef(false); // 임계값(THRESHOLD) 초과 시 실제 드래그 시작
  const THRESHOLD = 4; // 클릭과 드래그를 구분하는 최소 이동 픽셀

  // 모달 중앙 배치
  // - 화면 크기와 모달 크기로 중앙 좌표 계산
  // - position: fixed/absolute 전제로 transform으로 위치 지정
  const centerModal = () => {
    const el = modalRef.current;
    if (!el) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const x = Math.max(8, (window.innerWidth - w) / 2); // 좌우 8px 여백
    const y = Math.max(8, (window.innerHeight - h) / 2); // 상하 8px 여백
    posRef.current = { x, y };
    el.style.left = "0"; // transform 기준점 정렬용
    el.style.top = "0";
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  // 경계 보정 포함 이동 적용
  // - 화면 밖으로 나가지 않도록 8px 여백 기준으로 좌표 보정
  // - 최신 좌표를 posRef에 저장하고 transform으로 반영
  const applyTransform = (x, y) => {
    const el = modalRef.current;
    if (!el) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const clampedX = Math.max(8, Math.min(x, window.innerWidth - w - 8));
    const clampedY = Math.max(8, Math.min(y, window.innerHeight - h - 8));
    posRef.current = { x: clampedX, y: clampedY };
    el.style.transform = `translate3d(${clampedX}px, ${clampedY}px, 0)`;
  };

  // 드래그 이동
  // - 마우스 현재 좌표에서 offset을 빼 모달 좌상단 목표 좌표 계산
  // - 임계값(THRESHOLD) 이상 움직였을 때만 실제 드래그로 인정
  const handleDragMouseMove = (e) => {
    if (!draggingRef.current) return;
    const { dx, dy } = offsetRef.current;
    const nextX = e.clientX - dx; // 마우스 기준으로 환산한 모달 좌상단 X
    const nextY = e.clientY - dy; // 마우스 기준으로 환산한 모달 좌상단 Y

    // 최초 누른 지점 부근의 미세 이동은 클릭으로 간주
    const dist =
      Math.abs(e.clientX - (posRef.current.x + dx)) +
      Math.abs(e.clientY - (posRef.current.y + dy));
    if (!startedRef.current && dist < THRESHOLD) return;

    // 실제 드래그 시작 표시 후 이동 반영
    startedRef.current = true;
    applyTransform(nextX, nextY);
  };

  // 드래그 종료 공통 처리
  // - 플래그 초기화 및 등록했던 전역 이벤트 해제
  const endDrag = () => {
    draggingRef.current = false;
    startedRef.current = false;
    window.removeEventListener("mousemove", handleDragMouseMove);
    window.removeEventListener("mouseup", handleDragMouseUp);
    window.removeEventListener("blur", handleWindowBlur);
  };

  // 드래그 시작
  // - 좌클릭만 허용(e.button === 0)
  // - 현재 모달 위치와 마우스 좌표 차이를 offsetRef로 저장
  // - 전역 이벤트(mousemove/mouseup/blur) 등록
  const handleDragMouseDown = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const { x, y } = posRef.current;
    offsetRef.current = { dx: e.clientX - x, dy: e.clientY - y };
    draggingRef.current = true;
    startedRef.current = false;

    window.addEventListener("mousemove", handleDragMouseMove);
    window.addEventListener("mouseup", handleDragMouseUp);
    window.addEventListener("blur", handleWindowBlur);
  };

  // 마우스 업/창 포커스 아웃 시 드래그 종료
  const handleDragMouseUp = () => endDrag();
  const handleWindowBlur = () => endDrag();

  // 주소 모달이 열릴 때 중앙 배치, 닫힐 때 드래그 관련 리스너 정리
  useEffect(() => {
    if (showPostcode) requestAnimationFrame(centerModal);
    else endDrag();
  }, [showPostcode]);

  return (
    <div className="register-container gap-4">
      <div className="register-box">
        <h2>회원가입</h2>

        {/* 가입 폼 */}
        <form onSubmit={handleSubmit} className="register-form">
          {/* 이메일 + 중복확인 */}
          <div className="field-group">
            <div className="row-line">
              <input
                type="email"
                name="userId"
                placeholder="이메일"
                value={form.userId}
                onChange={handleChange}
                className="address-input flex-grow-1"
              />
              <button
                type="button"
                onClick={handleCheckUserId}
                className="address-button id-check-btn"
                disabled={!form.userId || emailCheck.state === "checking"}
              >
                {emailCheck.state === "checking" ? "확인 중..." : "중복확인"}
              </button>
            </div>

            {form.userId && (
              <small
                className={
                  "helper-below " +
                  (emailCheck.state === "ok"
                    ? "text-success"
                    : emailCheck.state === "dup" ||
                      emailCheck.state === "invalid" ||
                      emailCheck.state === "error"
                    ? "register-error"
                    : "form-text")
                }
              >
                {emailCheck.msg ||
                  (isEmailValid ? "" : "올바른 이메일 형식 아님")}
              </small>
            )}
          </div>

          {/* 이름 */}
          <input
            type="text"
            name="name"
            placeholder="이름"
            value={form.name}
            onChange={handleChange}
          />

          {/* 비밀번호 */}
          <div className="field-block">
            <div className="field-group">
              <input
                type="password"
                name="pw"
                placeholder="비밀번호"
                value={form.pw}
                onChange={handleChange}
              />
              <small
                className={`${
                  pwPolicyOk ? "text-success" : "form-text"
                } helper-below`}
              >
                8자 이상, 알파벳과 숫자 포함
              </small>
            </div>
          </div>

          {/* 비밀번호 확인 */}
          <div className="field-block">
            <div className="field-group">
              <input
                type="password"
                name="confirmPw"
                placeholder="비밀번호 확인"
                value={form.confirmPw}
                onChange={handleChange}
              />
              {!!form.confirmPw && (
                <small
                  className={`${
                    pwMatch ? "text-success" : "register-error"
                  } helper-below`}
                >
                  {pwMatch ? "비밀번호 일치" : "비밀번호 불일치"}
                </small>
              )}
            </div>
          </div>

          {/* 휴대폰: 3칸 분할 */}
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
              value={form.phone2}
              onChange={handleChange}
            />
            <span>-</span>
            <input
              type="text"
              name="phone3"
              maxLength={4}
              value={form.phone3}
              onChange={handleChange}
            />
          </div>

          {/* 주소/우편번호 */}
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
                className="address-button address-button--full"
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

          {/* 제출 */}
          <button type="submit">회원가입</button>

          {/* 서버 에러 표시 */}
          {error && <p className="register-error">{error}</p>}
        </form>

        {/* 주소검색 모달(드래그 가능) */}
        {showPostcode && (
          <div className="modal-overlay" onClick={() => setShowPostcode(false)}>
            <div
              ref={modalRef}
              className="modal-content postcode draggable"
              onClick={(e) => e.stopPropagation()}
              style={{ position: "fixed", left: 0, top: 0 }}
            >
              <div
                className="modal-drag-handle"
                onMouseDown={handleDragMouseDown}
              >
                <strong>우편번호 검색</strong>
                <button
                  className="modal-close-button"
                  onClick={() => setShowPostcode(false)}
                >
                  &times;
                </button>
              </div>
              <div style={{ height: "calc(100% - 44px)" }}>
                <DaumPostcode
                  onComplete={handleAddressComplete}
                  style={{ height: "100%" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterComponent;

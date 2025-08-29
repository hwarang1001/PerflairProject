// src/component/mypage/AddressComponent.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import DaumPostcode from "react-daum-postcode";
import "./AddressComponent.css";
import {
  getMyAddresses,
  addAddress,
  updateAddress,
  removeAddress,
  setDefaultAddress,
} from "../../api/addressApi";

const emptyForm = {
  receiverName: "",
  phone: "", // 서버로 보낼 최종 문자열
  phone1: "", // UI용
  phone2: "", // UI용
  phone3: "", // UI용
  zonecode: "",
  address: "",
  detailAddress: "",
  memo: "",
  isDefault: false,
};

// 자주 쓰는 배송 메모 프리셋
const MEMO_PRESETS = [
  "문 앞에 놓아주세요",
  "경비실에 맡겨주세요",
  "택배함에 넣어주세요",
  "배송 전 연락주세요",
  "부재 시 문앞 보관 금지",
];

// "010-1234-5678" → {p1:"010", p2:"1234", p3:"5678"}
function splitPhoneParts(raw) {
  const d = String(raw || "")
    .replace(/\D/g, "")
    .slice(0, 11);
  if (d.length <= 3) return { p1: d, p2: "", p3: "" };
  if (d.length <= 7) return { p1: d.slice(0, 3), p2: d.slice(3), p3: "" };
  return { p1: d.slice(0, 3), p2: d.slice(3, 7), p3: d.slice(7, 11) };
}

export default function AddressComponent({ onSaved }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(false);
  const [showPostcode, setShowPostcode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  // 프리셋 선택 상태("CUSTOM"이면 직접입력)
  const [memoSelect, setMemoSelect] = useState("");

  // ====== PaymentComponent 스타일 배송 메모 상태 ======
  // none | door | guard | custom
  const [reqType, setReqType] = useState("none");
  const [reqText, setReqText] = useState("");
  const [doorPw, setDoorPw] = useState("");

  // 미리보기/저장용 최종 문자열 (PaymentComponent와 동일 규칙)
  const requestMemo = useMemo(() => {
    if (reqType === "door" && doorPw.trim())
      return `문 앞에 놓아주세요 (공동현관 비밀번호: ${doorPw.trim()})`;
    if (reqType === "custom" && reqText.trim()) return reqText.trim();
    if (reqType === "guard") return "경비실에 맡겨주세요";
    return "요청사항 없음";
  }, [reqType, reqText, doorPw]);

  // requestMemo 변경 시 form.memo 자동 동기화
  useEffect(() => {
    setForm((f) => ({ ...f, memo: requestMemo }));
  }, [requestMemo]);

  // 전화 입력칸 자동 포커스 이동
  const phone1Ref = useRef(null);
  const phone2Ref = useRef(null);
  const phone3Ref = useRef(null);

  // 최초 로드: 순서 유지(정렬 안 함)
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        let data = await getMyAddresses();
        let arr = Array.isArray(data) ? data : [];
        // 기본 배송지 처리: 기본 배송지가 있으면 첫 번째 주소로 설정
        if (arr.length > 0) {
          // 기본 배송지 설정: 첫 번째 주소를 기본 배송지로 설정
          arr = arr.map((addr, idx) => ({
            ...addr,
            isDefault: idx === 0, // 첫 번째 주소를 기본 배송지로 설정
          }));
          setList(arr);
        } else {
          setList([]);
        }
      } catch (e) {
        console.error("배송지 목록 로드 실패:", e);
        alert("배송지 목록을 불러오지 못했습니다.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [reloadFlag]);

  // 일반 입력 핸들러
  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  // 휴대폰 입력(숫자만) + 자동 포커스
  const onChangePhone = (name, value) => {
    // 숫자만 필터
    let v = value.replace(/\D/g, "");
    // 각 칸 길이 제한
    const max = name === "phone1" ? 3 : 4;
    if (v.length > max) v = v.slice(0, max);

    setForm((f) => ({ ...f, [name]: v }));

    // 자동 포커스 이동
    if (name === "phone1" && v.length === 3) {
      phone2Ref.current?.focus();
    } else if (name === "phone2" && v.length === 4) {
      phone3Ref.current?.focus();
    }
  };

  // 배송 메모 프리셋 변경
  const onChangeMemoPreset = (e) => {
    const v = e.target.value;
    setMemoSelect(v);
    if (v === "__CUSTOM__") {
      setForm((f) => ({ ...f, memo: f.memo || "" }));
    } else if (v === "") {
      setForm((f) => ({ ...f, memo: "" }));
    } else {
      setForm((f) => ({ ...f, memo: v }));
    }
  };

  // 다음주소 완료
  const onAddressComplete = (data) => {
    setForm((f) => ({
      ...f,
      zonecode: data.zonecode || data.zipcode || "",
      address: data.roadAddress || data.address || data.jibunAddress || "",
    }));
    setShowPostcode(false);
  };

  // 추가/수정 모드 열기
  const onStartAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMemoSelect("");
    setShowPostcode(false);
    setShowForm(true);
    // 약간의 딜레이 후 첫 칸 포커스
    setTimeout(() => phone1Ref.current?.focus(), 0);
  };

  const onStartEdit = (addr) => {
    const { p1, p2, p3 } = splitPhoneParts(addr.phone);
    setEditingId(addr.id);
    setForm({
      receiverName: addr.receiverName || "",
      phone: addr.phone || "",
      phone1: p1,
      phone2: p2,
      phone3: p3,
      zonecode: addr.zonecode || "",
      address: addr.address || "",
      detailAddress: addr.detailAddress || "",
      memo: addr.memo || "",
      isDefault: !!addr.isDefault,
    });

    if (addr.memo && MEMO_PRESETS.includes(addr.memo)) {
      setMemoSelect(addr.memo);
    } else if (addr.memo) {
      setMemoSelect("__CUSTOM__");
    } else {
      setMemoSelect("");
    }

    setShowPostcode(false);
    setShowForm(true);
    setTimeout(() => phone1Ref.current?.focus(), 0);
  };

  // 저장(추가/수정) — 순서 유지, isDefault 플래그만 갱신
  const onSave = async (e) => {
    e.preventDefault();
    if (!form.receiverName.trim()) return alert("받는 분을 입력하세요.");

    const { phone1, phone2, phone3 } = form;
    if (phone1.length !== 3 || phone3.length !== 4 || phone2.length < 3) {
      return alert("연락처를 올바르게 입력하세요. 예) 010 / 1234 / 5678");
    }
    const phoneCombined = `${phone1}-${phone2}-${phone3}`;

    if (!form.zonecode || !form.address) return alert("주소를 입력하세요.");

    setLoading(true);
    try {
      if (editingId) {
        const payload = { ...form, phone: phoneCombined };
        const saved = await updateAddress(editingId, payload);

        if (saved?.isDefault) {
          setList((prev) =>
            prev.map((a) =>
              a.id === editingId
                ? { ...saved, isDefault: true }
                : { ...a, isDefault: false }
            )
          );
        } else {
          setList((prev) => prev.map((a) => (a.id === editingId ? saved : a)));
        }

        alert("배송지가 수정되었습니다.");
      } else {
        const payload = { ...form, phone: phoneCombined };
        const saved = await addAddress(payload);

        if (saved?.isDefault) {
          setList((prev) => [
            saved,
            ...prev
              .filter((a) => a.id !== saved.id)
              .map((a) => ({ ...a, isDefault: false })),
          ]);
        } else {
          setList((prev) => prev.concat([saved]));
        }

        alert("새 배송지가 추가되었습니다.");
      }

      setEditingId(null);
      setForm(emptyForm);
      setMemoSelect("");
      setShowForm(false);
      setReloadFlag((f) => !f); // 주소 목록 다시 로드 트리거
      onSaved?.();
    } catch (e2) {
      console.error(e2);
      alert("저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 삭제 — 1개일 땐 버튼 아예 렌더 X (일반적으로 호출 안됨)
  const onDelete = async (id) => {
    if (list.length <= 1) {
      alert("배송지는 최소 1개 이상 유지해야 합니다.");
      return;
    }
    if (!window.confirm("해당 배송지를 삭제하시겠습니까?")) return;

    setLoading(true);
    try {
      const target = list.find((a) => a.id === id);
      await removeAddress(id);
      let next = list.filter((a) => a.id !== id); // 순서 유지

      // 기본을 지웠다면 남은 첫 항목을 기본으로 지정
      if (target?.isDefault && next.length > 0) {
        const newDef = next[0].id;
        await setDefaultAddress(newDef);
        next = next.map((a, idx) => ({ ...a, isDefault: idx === 0 }));
      }

      setList(next);
      alert("삭제되었습니다.");
      onSaved?.();
    } catch (e) {
      console.error(e);
      alert("삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 기본 배송지 지정 — 순서 변경 없이 플래그만 변경
  const onSelectDefault = async (id) => {
    setLoading(true);
    try {
      await setDefaultAddress(id);
      // isDefault 값을 갱신하여 상태 변경
      setList((arr) => arr.map((a) => ({ ...a, isDefault: a.id === id })));
      onSaved?.();
    } catch (e) {
      console.error(e);
      alert("기본 배송지 지정 실패");
    } finally {
      setLoading(false);
    }
  };

  const hasMultiple = list.length > 1;
  const isSingle = list.length === 1;

  // =========================
  //   다음주소 모달 — "클릭-홀드" 중에만 드래그
  // =========================
  const modalRef = useRef(null);
  const draggingRef = useRef(false);
  const posRef = useRef({ x: 0, y: 0 }); // 현재 transform 좌표(px)
  const offsetRef = useRef({ dx: 0, dy: 0 });
  const startedRef = useRef(false);
  const THRESHOLD = 4;

  const centerModal = () => {
    const el = modalRef.current;
    if (!el) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const x = Math.max(8, (window.innerWidth - w) / 2);
    const y = Math.max(8, (window.innerHeight - h) / 2);
    posRef.current = { x, y };
    el.style.left = "0";
    el.style.top = "0";
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

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

  const endDrag = () => {
    draggingRef.current = false;
    startedRef.current = false;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
    window.removeEventListener("blur", onWindowBlur);
  };

  const onMouseDown = (e) => {
    if (e.button !== 0) return; // 좌클릭만
    e.preventDefault();
    const { x, y } = posRef.current;
    offsetRef.current = { dx: e.clientX - x, dy: e.clientY - y };
    draggingRef.current = true;
    startedRef.current = false;

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("blur", onWindowBlur);
  };

  const onMouseMove = (e) => {
    if (!draggingRef.current) return;
    const { dx, dy } = offsetRef.current;
    const nextX = e.clientX - dx;
    const nextY = e.clientY - dy;

    // 임계치: 의도치 않은 소폭 이동 무시(클릭으로 인식)
    const dist =
      Math.abs(e.clientX - (posRef.current.x + dx)) +
      Math.abs(e.clientY - (posRef.current.y + dy));
    if (!startedRef.current && dist < THRESHOLD) return;
    startedRef.current = true;

    applyTransform(nextX, nextY);
  };

  const onMouseUp = () => endDrag();
  const onWindowBlur = () => endDrag();

  useEffect(() => {
    if (showPostcode) {
      requestAnimationFrame(centerModal);
    } else {
      endDrag();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPostcode]);

  return (
    <div className="mypage-form-wrapper controls-xl">
      {/* 헤더: 리스트만 보이고, 버튼으로 폼 열기 */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="fw-semibold">내 배송지</div>
        {!showForm && (
          <button
            type="button"
            className="btn btn-outline-dark btn-sm"
            onClick={onStartAdd}
          >
            배송지 추가
          </button>
        )}
      </div>

      {/* 리스트(입력/조회 순서 그대로) */}
      {loading && list.length === 0 ? (
        <div className="text-muted py-3">불러오는 중...</div>
      ) : list.length === 0 ? (
        <div className="text-muted py-3">등록된 배송지가 없습니다.</div>
      ) : (
        <ul className="list-unstyled d-flex flex-column gap-3 mb-4">
          {list.map((addr) => (
            <li key={addr.id} className="p-3 rounded-3 panel-elev">
              {/* 2개 이상일 때만 기본 선택 라디오 */}
              {hasMultiple && (
                <div className="d-flex align-items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name="defaultAddr"
                    checked={addr.isDefault === true}
                    onChange={() => onSelectDefault(addr.id)} // 기본 배송지 선택
                  />
                  <span className="small text-muted">현재 배송지로 지정</span>
                </div>
              )}

              <div className="d-flex justify-content-between flex-wrap gap-2">
                <div>
                  <div className="fw-semibold">
                    {addr.receiverName}{" "}
                    {addr.isDefault && (
                      <span className="badge text-bg-dark ms-2">
                        현재 배송지
                      </span>
                    )}
                  </div>
                  <div className="text-muted">{addr.phone}</div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-dark btn-sm"
                    onClick={() => onStartEdit(addr)}
                  >
                    수정
                  </button>
                  {!isSingle && (
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => onDelete(addr.id)}
                    >
                      삭제
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-2 small text-muted">
                ({addr.zonecode}) {addr.address} {addr.detailAddress}
                {addr.memo && <> · 메모: {addr.memo}</>}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* 추가/수정 폼: 버튼 눌렀을 때만 표시 */}
      {showForm && (
        <form onSubmit={onSave}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">받는 분</label>
              <input
                className="form-control"
                name="receiverName"
                value={form.receiverName}
                onChange={onChange}
                placeholder="홍길동"
                disabled={loading}
                required
              />
            </div>

            {/* 연락처: 3칸 입력(숫자만), 자동 포커스 이동 */}
            <div className="col-md-6">
              <label className="form-label">연락처</label>
              <div className="d-flex align-items-center gap-2">
                <input
                  ref={phone1Ref}
                  className="form-control text-center"
                  name="phone1"
                  inputMode="numeric"
                  maxLength={3}
                  placeholder="010"
                  value={form.phone1}
                  onChange={(e) => onChangePhone("phone1", e.target.value)}
                  disabled={loading}
                  style={{ width: 90 }}
                />
                <span>-</span>
                <input
                  ref={phone2Ref}
                  className="form-control text-center"
                  name="phone2"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder=""
                  value={form.phone2}
                  onChange={(e) => onChangePhone("phone2", e.target.value)}
                  disabled={loading}
                  style={{ width: 110 }}
                />
                <span>-</span>
                <input
                  ref={phone3Ref}
                  className="form-control text-center"
                  name="phone3"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder=""
                  value={form.phone3}
                  onChange={(e) => onChangePhone("phone3", e.target.value)}
                  disabled={loading}
                  style={{ width: 110 }}
                />
              </div>
            </div>

            <div className="col-12">
              <label className="form-label">우편번호</label>
              <div className="d-flex gap-2">
                <input
                  className="form-control"
                  name="zonecode"
                  value={form.zonecode}
                  readOnly
                />
                <button
                  type="button"
                  className="btn btn-outline-dark address-find-btn"
                  onClick={() => setShowPostcode(true)}
                  disabled={loading}
                >
                  <span>주소</span>
                  <span>찾기</span>
                </button>
              </div>
            </div>

            <div className="col-12">
              <label className="form-label">기본 주소</label>
              <input
                className="form-control"
                name="address"
                value={form.address}
                readOnly
              />
            </div>

            <div className="col-12">
              <label className="form-label">상세 주소</label>
              <input
                className="form-control"
                name="detailAddress"
                value={form.detailAddress}
                onChange={onChange}
                placeholder=""
                disabled={loading}
              />
            </div>

            {/* === 배송 메모: PaymentComponent 스타일 라디오 + 입력 === */}
            <div className="col-12">
              <label className="form-label">배송 요청사항</label>
              <div className="border rounded-3 p-3">
                <div className="vstack gap-2">
                  {[
                    { key: "none", label: "요청사항 없음" },
                    { key: "door", label: "문 앞에 놓아주세요" },
                    { key: "guard", label: "경비실에 맡겨주세요" },
                    { key: "custom", label: "직접 입력" },
                  ].map((opt) => (
                    <label key={opt.key} className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        name="req"
                        checked={reqType === opt.key}
                        onChange={() => setReqType(opt.key)}
                      />
                      <span className="form-check-label ms-1">{opt.label}</span>
                    </label>
                  ))}
                  {reqType === "custom" && (
                    <input
                      className="form-control"
                      placeholder="요청사항을 입력하세요"
                      value={reqText}
                      onChange={(e) => setReqText(e.target.value)}
                      disabled={loading}
                    />
                  )}
                  {reqType === "door" && (
                    <input
                      className="form-control"
                      placeholder="공동현관 비밀번호(선택)"
                      value={doorPw}
                      onChange={(e) => setDoorPw(e.target.value)}
                      disabled={loading}
                    />
                  )}
                </div>
                <div className="text-muted small mt-2">
                  요청 메모 미리보기: {requestMemo}
                </div>
              </div>
            </div>

            <div className="col-12 d-flex align-items-center gap-2">
              <input
                id="isDefault"
                type="checkbox"
                name="isDefault"
                checked={form.isDefault}
                onChange={onChange}
                disabled={loading}
              />
              <label htmlFor="isDefault" className="form-label mb-0">
                이 주소를 현재 배송지로 설정
              </label>
            </div>
          </div>

          <div className="qna-btn-row mt-4">
            <div className="d-flex gap-2 ms-auto">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm(emptyForm);
                  setMemoSelect("");
                  setReqType("none");
                  setReqText("");
                  setDoorPw("");
                }}
                disabled={loading}
              >
                취소
              </button>
              <button
                type="submit"
                className="btn btn-mz-style"
                disabled={loading}
              >
                저장
              </button>
            </div>
          </div>
        </form>
      )}

      {/* 다음주소 모달 (클릭-홀드 전용 드래그) */}
      {showPostcode && (
        <div className="modal-overlay" onClick={() => setShowPostcode(false)}>
          <div
            ref={modalRef}
            className="modal-content postcode draggable"
            onClick={(e) => e.stopPropagation()}
            style={{ position: "fixed", left: 0, top: 0 }}
          >
            <div className="modal-drag-handle" onMouseDown={onMouseDown}>
              <strong>우편번호 검색</strong>
              <button
                type="button"
                className="modal-close-button"
                onClick={() => setShowPostcode(false)}
              >
                &times;
              </button>
            </div>
            <div style={{ height: "calc(100% - 44px)" }}>
              <DaumPostcode
                onComplete={onAddressComplete}
                style={{ height: "100%" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

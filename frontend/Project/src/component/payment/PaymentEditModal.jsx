// src/component/payment/PaymentEditModal.jsx
/* eslint-disable react/prop-types */
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import DaumPostcode from "react-daum-postcode";

/**
 * 배송지 수정 모달 (react-daum-postcode 내장)
 * - open, initial, onClose, onSave API
 * - 저장 시 onSave(updatedAddress) 호출
 */
export default function PaymentEditModal({ open, initial, onClose, onSave }) {
  if (!open) return null;

  const [state, setState] = useState(() => ({
    receiver: initial?.receiver ?? "",
    phone: initial?.phone ?? "",
    zipcode: initial?.zipcode ?? "",
    address1: initial?.address1 ?? "",
    address2: initial?.address2 ?? "",
    isDefault: !!initial?.isDefault,
  }));
  const [showPostcode, setShowPostcode] = useState(false);

  const setZipcode = (v) => setState((s) => ({ ...s, zipcode: v }));
  const setAddress1 = (v) => setState((s) => ({ ...s, address1: v }));

  // 우편번호 검색 완료 → 자동 채움
  const handleComplete = (data) => {
    const addr = data.roadAddress || data.address || data.jibunAddress || "";
    setZipcode(data.zonecode || "");
    setAddress1(addr);
    setShowPostcode(false);
  };

  // 저장
  const save = () => {
    if (!state.receiver.trim()) return alert("받는 분을 입력하세요.");
    if (!state.phone.trim()) return alert("휴대폰 번호를 입력하세요.");
    if (!state.address1.trim()) return alert("주소를 입력하세요.");
    onSave({ ...state });
    onClose();
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100"
      style={{ background: "rgba(0,0,0,.35)", zIndex: 1050 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3 p-4"
        style={{ width: 640, maxWidth: "92%", margin: "8vh auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h4 className="text-center fw-semibold mb-3">배송지 상세</h4>
        <hr className="my-3 border-top" style={{ borderTopColor: "#e5e5e5", opacity: 1 }} />

        <div className="mb-3">
          <div className="text-muted small">받는 분</div>
          <input
            className="form-control border-0 border-bottom rounded-0"
            value={state.receiver}
            onChange={(e) => setState((s) => ({ ...s, receiver: e.target.value }))}
            placeholder="예) 홍길동"
          />
        </div>

        <div className="mb-3">
          <div className="text-muted small">휴대폰 번호</div>
          <input
            className="form-control border-0 border-bottom rounded-0"
            value={state.phone}
            onChange={(e) => setState((s) => ({ ...s, phone: e.target.value }))}
            placeholder="예) 01012345678"
          />
        </div>

        <div className="mb-2">
          <div className="text-muted small">주소</div>
          <div className="d-flex gap-2">
            <input className="form-control" placeholder="우편번호" style={{ maxWidth: 180 }} value={state.zipcode} readOnly />
            <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPostcode(true)}>
              주소찾기
            </button>
          </div>
        </div>

        <div className="mb-3">
          <input
            className="form-control border-0 border-bottom rounded-0"
            placeholder="기본 주소"
            value={state.address1}
            onChange={(e) => setAddress1(e.target.value)}
          />
          <input
            className="form-control border-0 border-bottom rounded-0 mt-2"
            placeholder="상세 주소"
            value={state.address2}
            onChange={(e) => setState((s) => ({ ...s, address2: e.target.value }))}
          />
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="isDefault"
            checked={state.isDefault}
            onChange={(e) => setState((s) => ({ ...s, isDefault: e.target.checked }))}
          />
          <label className="form-check-label" htmlFor="isDefault">기본 배송지로 선택</label>
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-outline-secondary" onClick={onClose}>취소</button>
          <button className="btn btn-dark" onClick={save}>저장하기</button>
        </div>

        {/* 주소찾기 라이트박스 */}
        {showPostcode && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ background: "rgba(0,0,0,.25)", zIndex: 1060 }}
            onClick={() => setShowPostcode(false)}
          >
            <div
              className="bg-white rounded-3 p-2"
              style={{ width: 520, maxWidth: "95%", margin: "12vh auto" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong className="fw-semibold">우편번호 검색</strong>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowPostcode(false)}>×</button>
              </div>
              <DaumPostcode onComplete={handleComplete} autoClose style={{ height: 420 }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

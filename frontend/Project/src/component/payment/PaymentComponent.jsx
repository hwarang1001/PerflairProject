// src/component/payment/PaymentComponent.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import PaymentEditModal from "./PaymentEditModal.jsx";

/* =========================================================
 * axios 로컬 인스턴스
 * - baseURL: VITE_API_HOST (없으면 DEV 기본 http://localhost:8080)
 * - Authorization: accessToken 자동 주입
 * =======================================================*/
const API_HOST =
  import.meta.env.VITE_API_HOST ||
  (import.meta.env.DEV ? "http://localhost:8080" : "");

const http = axios.create({
  baseURL: API_HOST,
  withCredentials: true,
});

http.interceptors.request.use((cfg) => {
  const token =
    localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

console.log("[Payment] API_HOST =", API_HOST, "| baseURL =", http.defaults.baseURL);

/* 이미지 URL 도우미 */
const toImageUrl = (row) => {
  if (row?.imageUrl?.startsWith?.("http")) return row.imageUrl;
  if (row?.imagePath) return `${API_HOST}${row.imagePath}`;
  if (row?.imageId) return `${API_HOST}/api/files/${row.imageId}`;
  return "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=300&auto=format&fit=crop";
};

/* 숫자 포맷터 */
const C = (n) => (Number(n) || 0).toLocaleString("ko-KR");

/* =========================================================
 * JWT 파서 (accessToken 에서 기본 배송지 폴백을 만들기 위함)
 * - Header.jsx 로그에 찍힌 토큰 payload: { address, name, phoneNum, userId, ... }
 * =======================================================*/
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/* JWT 기반 폴백 주소 생성기 */
function buildAddressFromJwt() {
  const token =
    localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
  const claims = token ? parseJwt(token) : null;

  if (!claims) return null;

  // Header.jsx 로그 예시에서 확인된 키: address, name, phoneNum
  return {
    receiver: claims.name || "수취인",
    phone: claims.phoneNum || "",
    zipcode: "", // JWT에 우편번호가 없으므로 비워두고, 주소찾기 버튼으로 보완
    address1: claims.address || "",
    address2: "",
    isDefault: true,
  };
}

export default function PaymentComponent() {
  const { state } = useLocation(); // Cart에서 넘어온 { items, from }
  const [items, setItems] = useState([]);
  const [address, setAddress] = useState(null);
  const [addrOpen, setAddrOpen] = useState(false);

  // 배송 요청사항
  const [reqType, setReqType] = useState("none"); // none | door | guard | custom
  const [reqText, setReqText] = useState("");
  const [doorPw, setDoorPw] = useState("");

  /* -----------------------------------------------------
   * 기본 배송지 조회
   * 1) 백엔드 API 시도: GET /api/members/me/default-address
   * 2) 404 등 실패 시: JWT 에서 폴백 생성
   * ---------------------------------------------------*/
  const loadDefaultAddress = async () => {
    try {
      const { data } = await http.get("/api/members/me/default-address");
      setAddress(data); // { receiver, phone, zipcode, address1, address2, isDefault }
    } catch (e) {
      console.warn("[Payment] 기본 배송지 API 404 → JWT 폴백 사용", e?.response?.status);
      const fallback = buildAddressFromJwt();
      if (fallback) {
        setAddress(fallback);
      } else {
        // 폴백도 없을 때: 최소 형태로라도 렌더되게 기본값 세팅
        setAddress({
          receiver: "",
          phone: "",
          zipcode: "",
          address1: "",
          address2: "",
          isDefault: true,
        });
      }
    }
  };

  /* 초기 데이터 */
  useEffect(() => {
    if (Array.isArray(state?.items) && state.items.length) {
      setItems(state.items); // { id/productId, name, price, qty, ... }
    }
    loadDefaultAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* 요청 메모 문자열 */
  const requestMemo = useMemo(() => {
    if (reqType === "door" && doorPw.trim())
      return `문 앞에 놓아주세요 (공동현관 비밀번호: ${doorPw.trim()})`;
    if (reqType === "custom" && reqText.trim()) return reqText.trim();
    if (reqType === "guard") return "경비실에 맡겨주세요";
    return "요청사항 없음";
  }, [reqType, reqText, doorPw]);

  /* 금액 합계 */
  const summary = useMemo(() => {
    const subtotal = items.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0);
    const shipping = subtotal > 0 ? 10000 : 0;
    return { subtotal, shipping, total: subtotal + shipping };
  }, [items]);

  /* 결제 진입 (카카오 Ready) */
  const handlePay = async () => {
    try {
      const payload = {
        items: items.map((it) => ({
          id: it.productId ?? it.id, // 서버 정책에 맞춤
          name: it.name,
          quantity: it.qty || 1,
          price: it.price,
        })),
        amount: summary.total,
        address,     // 기본 배송지(백/폴백 모두 동일 형태)
        requestMemo, // 배송 요청사항
      };

      console.log("[Payment] ready payload =", payload);
      const { data } = await http.post("/api/pay/kakao/ready", payload);
      if (!data?.next_redirect_pc_url) throw new Error("결제 리다이렉트 URL이 없습니다.");
      window.location.href = data.next_redirect_pc_url;
    } catch (e) {
      console.error("[Payment] 결제 준비 실패", e);
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "결제 준비 중 오류가 발생했습니다.";
      alert(msg);
    }
  };

  if (!address) return <div className="container py-5">로딩 중…</div>;

  return (
    <div className="container-lg mx-auto my-5 px-3" style={{ maxWidth: 1100 }}>
      {/* 윗줄 / 제목 / 아랫줄 */}
      <hr className="border-top" style={{ borderTopColor: "#e5e5e5", opacity: 1 }} />
      <h2 className="text-center fw-semibold my-3">주문/결제</h2>
      <hr className="border-top" style={{ borderTopColor: "#e5e5e5", opacity: 1 }} />

      {/* 주문상품 */}
      <section className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="fw-semibold">주문상품</div>
          <div className="text-muted small">{items.length}건</div>
        </div>
        <div className="border rounded-3 p-3">
          {items.map((it) => (
            <div
              key={it.id ?? it.productId}
              className="d-flex align-items-center justify-content-between py-2"
            >
              <div className="d-flex align-items-center gap-3">
                <img
                  src={toImageUrl(it)}
                  alt={it.name}
                  style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8 }}
                />
                <div>
                  {it.brand && <div className="text-muted small fw-semibold">{it.brand}</div>}
                  <div className="fw-normal">{it.name}</div>
                  {it.volume && <div className="text-muted small">{it.volume}</div>}
                </div>
              </div>
              <div className="text-end" style={{ minWidth: 140 }}>
                <div className="text-muted small">수량 {it.qty || 1}</div>
                <div className="fw-semibold">
                  {C((it.price || 0) * (it.qty || 1))}원
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 배송정보 */}
      <section className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="fw-semibold">배송정보</div>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setAddrOpen(true)}
          >
            변경
          </button>
        </div>
        <div className="border rounded-3 p-3">
          <span className="badge text-bg-light border me-2 fw-normal">기본배송지</span>
          <div className="row g-2 mt-2">
            <div className="col-12 col-md-6">
              <div className="text-muted small">받는 분</div>
              <div className="fw-semibold">{address.receiver}</div>
            </div>
            <div className="col-12 col-md-6">
              <div className="text-muted small">휴대폰 번호</div>
              <div className="fw-semibold">{address.phone}</div>
            </div>
            <div className="col-12">
              <div className="text-muted small">주소</div>
              <div className="fw-semibold">
                ({address.zipcode}) {address.address1} {address.address2}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 요청사항 */}
      <section className="mb-4">
        <div className="fw-semibold mb-2">배송 요청사항</div>
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
              />
            )}
            {reqType === "door" && (
              <input
                className="form-control"
                placeholder="공동현관 비밀번호(선택)"
                value={doorPw}
                onChange={(e) => setDoorPw(e.target.value)}
              />
            )}
          </div>
          <div className="text-muted small mt-2">
            요청 메모 미리보기: {requestMemo}
          </div>
        </div>
      </section>

      {/* 결제금액 */}
      <section className="mb-4">
        <div className="fw-semibold mb-2">결제금액</div>
        <div className="border rounded-3 p-3">
          <div className="d-flex justify-content-between py-1">
            <span className="text-muted">주문금액</span>
            <span className="fw-normal">{C(summary.subtotal)}원</span>
          </div>
          <div className="d-flex justify-content-between py-1">
            <span className="text-muted">배송비</span>
            <span className="fw-normal">{C(summary.shipping)}원</span>
          </div>
          <hr className="my-3" />
          <div className="d-flex justify-content-between">
            <strong className="fw-semibold">최종 결제 금액</strong>
            <strong className="fw-semibold">{C(summary.total)}원</strong>
          </div>
        </div>
      </section>

      {/* 결제 버튼 */}
      <div className="text-center">
        <button className="btn btn-dark btn-lg px-5" onClick={handlePay}>
          {C(summary.total)}원 결제하기 (카카오페이)
        </button>
      </div>

      {/* 주소 수정 모달 */}
      <PaymentEditModal
        open={addrOpen}
        initial={address}
        onClose={() => setAddrOpen(false)}
        onSave={(addr) => setAddress(addr)}
      />
    </div>
  );
}

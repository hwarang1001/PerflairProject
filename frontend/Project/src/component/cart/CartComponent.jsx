// src/component/cart/CartComponent.jsx
// -----------------------------------------------------------------------------
// 장바구니
// - 상단 "공통 hr(이미 존재)" 아래와, 본문 내부 "하단 hr" 사이에 제목을 중앙 배치
// - 상단 hr은 새로 만들지 않음. 대신 TITLE_GAP 으로 제목 위/아래 여백을 동일하게 부여
//   → 상단 hr 의 margin-bottom 도 TITLE_GAP 과 동일하게 맞추면 정확히 중앙!
// - (선택 n / 전체 m) 카운트, 수량 변경, 선택삭제, 구매하기(결제페이지로 선택상품 전달)
// - 이미지 URL 규칙: toImageUrl() 한 곳만 수정하면 전역 반영
// -----------------------------------------------------------------------------

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// ====== 설정: 제목 위/아래 여백(px). 상단 공통 hr 의 margin-bottom 값과 동일하게 맞추세요 ======
const TITLE_GAP = 24;

// ====== 이미지 URL 규칙(서버 연동 시 이 함수만 수정) ======
const API_HOST = import.meta.env.VITE_API_HOST ?? "";
function toImageUrl(item) {
  if (item?.imageUrl?.startsWith("http")) return item.imageUrl;          // 1) 절대 URL
  if (item?.imagePath) return `${API_HOST}${item.imagePath}`;            // 2) 상대 경로
  if (item?.imageId) return `${API_HOST}/api/files/${item.imageId}`;     // 3) 파일 ID
  return null;                                                            // 4) 없음 → FALLBACK_IMG
}

// ====== 더미 데이터(서버 ON 시 getCart()로 교체) ======
const MOCK_ITEMS = [
  { id: 1, brand: "CREED", name: "실버 마운틴 워터 오 드 퍼퓸", volume: "50ml", price: 219000, quantity: 1 },
  { id: 2, brand: "CREED", name: "실버 마운틴 워터 오 드 퍼퓸", volume: "100ml", price: 279000, quantity: 1 },
  { id: 3, brand: "MONT BLANC", name: "플럼재즈 오 드 퍼퓸", volume: "50ml", price: 109000, quantity: 1 },
];

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=300&auto=format&fit=crop";

export default function CartComponent() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [checkedMap, setCheckedMap] = useState({});
  const [loading, setLoading] = useState(true);

  // 1) 초기 로드(현재는 더미). 서버 연동 시 getCart()로 교체
  useEffect(() => {
    const list = MOCK_ITEMS;
    setItems(list);
    const init = {};
    list.forEach((it) => (init[it.id] = true)); // 기본 전체선택
    setCheckedMap(init);
    setLoading(false);
  }, []);

  const safeItems = Array.isArray(items) ? items : [];

  // 2) 선택/전체 개수
  const selectedCount = useMemo(
    () => safeItems.filter((it) => !!checkedMap[it.id]).length,
    [safeItems, checkedMap]
  );
  const totalCount = safeItems.length;
  const allChecked = selectedCount > 0 && selectedCount === totalCount;

  // 3) 합계(선택된 항목만 계산)
  const totals = useMemo(() => {
    const selected = safeItems.filter((it) => checkedMap[it.id]);
    const subtotal = selected.reduce(
      (sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1),
      0
    );
    const shipping = 0; // 정책 생기면 수정
    return { subtotal, shipping, final: subtotal + shipping, selected };
  }, [safeItems, checkedMap]);

  // 4) 전체선택/개별선택/수량/삭제
  const handleToggleAll = (checked) => {
    const next = {};
    safeItems.forEach((it) => (next[it.id] = checked));
    setCheckedMap(next);
  };
  const handleCheck = (id, checked) =>
    setCheckedMap((prev) => ({ ...prev, [id]: checked }));
  const handleQty = (id, qty) => {
    const newQty = Math.max(1, Number(qty) || 1);
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, quantity: newQty } : it)));
    // TODO: patchQuantity(id, newQty)
  };
  const handleDelete = () => {
    const ids = safeItems.filter((it) => checkedMap[it.id]).map((it) => it.id);
    if (!ids.length) return;
    setItems((prev) => prev.filter((it) => !ids.includes(it.id)));
    setCheckedMap((prev) => {
      const n = { ...prev };
      ids.forEach((id) => delete n[id]);
      return n;
    });
    // TODO: deleteSelected(ids)
  };

  // 5) 구매하기 → 선택상품만 결제 페이지로 전달(quantity → qty 매핑)
  const handlePurchase = () => {
    if (!totals.selected.length) {
      alert("구매할 상품을 선택해주세요.");
      return;
    }
    const payload = totals.selected.map((it) => ({
      ...it,
      qty: it.quantity ?? 1, // Payment에서는 qty 사용
    }));
    navigate("/payment", { state: { items: payload, from: "cart" } });
  };

  if (loading) return <div className="container py-5">로딩 중…</div>;

  return (
    // 헤더 컨테이너와 폭 일치(양옆 안 튀게)
    <div className="container-lg mx-auto my-5 px-3" style={{ maxWidth: 1100 }}>
      {/* ✅ 상단 공통 hr(이미 존재) 아래/아래쪽 hr 사이 중앙 배치
          - 상단 hr 은 "페이지 공통"에서 이미 렌더됨 → 여기선 만들지 않음
          - 아래 h2 의 marginTop/Bottom 을 동일값(TITLE_GAP)으로 지정
          - 상단 hr 의 margin-bottom 도 TITLE_GAP 으로 맞춰주세요(예: mb-3). */}
      <h2
        className="text-center fw-semibold"
        style={{ marginTop: TITLE_GAP, marginBottom: TITLE_GAP }}
      >
        장바구니
      </h2>

      {/* 하단 hr (우리 컴포넌트 안쪽 라인만 유지) */}
      <hr className="border-top" style={{ borderTopColor: "#e5e5e5", opacity: 1 }} />

      {/* 상단: 전체선택 + (선택/전체) + 선택삭제 */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="selectAll"
            checked={allChecked}
            onChange={(e) => handleToggleAll(e.target.checked)}
          />
          <label className="form-check-label ms-1" htmlFor="selectAll">
            전체 선택 <span className="text-muted">({selectedCount} / {totalCount})</span>
          </label>
        </div>
        <button className="btn btn-danger btn-sm" onClick={handleDelete}>
          선택삭제
        </button>
      </div>

      {/* 아이템 목록 */}
      <div>
        {safeItems.length === 0 ? (
          <div className="text-center py-5 text-muted">장바구니가 비어 있습니다.</div>
        ) : (
          safeItems.map((item) => {
            const imgSrc = toImageUrl(item) || FALLBACK_IMG;
            const linePrice =
              (Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString();

            return (
              <div
                key={item.id}
                className="d-flex align-items-center justify-content-between border p-3 mb-2 rounded-3 bg-white"
              >
                {/* 좌측: 체크 + 이미지 + 텍스트 */}
                <div className="d-flex align-items-center gap-3 flex-grow-1">
                  <div className="form-check mt-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`cb-${item.id}`}
                      checked={!!checkedMap[item.id]}
                      onChange={(e) => handleCheck(item.id, e.target.checked)}
                    />
                  </div>

                  <img
                    src={imgSrc}
                    onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                    alt={item.name}
                    className="rounded"
                    style={{ width: 72, height: 72, objectFit: "cover" }}
                  />

                  <div className="flex-grow-1">
                    <div className="text-muted small fw-semibold">{item.brand}</div>
                    <div className="fw-semibold">{item.name}</div>
                    <div className="text-muted small">{item.volume}</div>
                  </div>
                </div>

                {/* 수량 컨트롤 */}
                <div className="mx-3">
                  <div className="input-group input-group-sm" style={{ width: 116 }}>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => handleQty(item.id, (item.quantity || 1) - 1)}
                      aria-label="수량 감소"
                    >
                      −
                    </button>
                    <input
                      className="form-control text-center"
                      value={item.quantity}
                      onChange={(e) => handleQty(item.id, e.target.value)}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      aria-label="수량"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => handleQty(item.id, (item.quantity || 1) + 1)}
                      aria-label="수량 증가"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* 우측 금액 */}
                <div className="text-end" style={{ width: 140 }}>
                  <span className="fw-bold">{linePrice}</span>
                  <span className="ms-1">원</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 합계(오른쪽 살짝 들여쓰기) */}
      <hr />
      <div className="text-end" style={{ marginRight: "2rem" }}>
        <p className="mb-1">총 상품 가격: <span>{totals.subtotal.toLocaleString()}</span>원</p>
        <p className="mb-1">배송비: <span>{totals.shipping.toLocaleString()}</span>원</p>
        <h5 className="mt-2">결제 예정 금액: <strong>{totals.final.toLocaleString()}</strong>원</h5>
      </div>

      {/* 중앙 “구매하기” 버튼 */}
      <div className="text-center mt-3">
        <button className="btn btn-dark btn-lg px-5" onClick={handlePurchase}>
          구매하기
        </button>
      </div>
    </div>
  );
}

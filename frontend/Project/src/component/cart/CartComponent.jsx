import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  API_SERVER_HOST,
  deleteSelected,
  getCart,
  updateItemQty,
} from "../../api/cartApi";
import { useSelector } from "react-redux";

// 초기 상태 설정
const initState = [
  {
    cino: 0,
    qty: 0,
    productOptionId: 0,
    pname: "",
    price: 0,
    perfumeVol: 0,
    imageFile: "",
  },
];

export default function CartComponent() {
  const navigate = useNavigate();
  const loginState = useSelector((s) => s.login);
  const [cart, setCart] = useState(initState);
  const [checkedMap, setCheckedMap] = useState({});
  const isLoggedIn = Boolean(loginState?.userId);

  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // 카트 데이터 호출
  useEffect(() => {
    // 데이터 로드 함수 호출
    getCart({})
      .then((data) => {
        setCart(data); // 데이터를 상태에 저장
      })
      .catch((error) => {
        console.error("장바구니 데이터 로드 실패:", error);
      });
  }, []);

  const safeItems = Array.isArray(cart) ? cart : [];

  // 선택/전체 개수
  const selectedCount = useMemo(
    () => safeItems.filter((it) => !!checkedMap[it.cino]).length,
    [safeItems, checkedMap]
  );
  const totalCount = safeItems.length;
  const allChecked = selectedCount > 0 && selectedCount === totalCount;

  // 합계(선택된 항목만 계산)
  const totals = useMemo(() => {
    const selected = safeItems.filter((it) => checkedMap[it.cino]);
    const subtotal = selected.reduce(
      (sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 1),
      0
    );
    const shipping = 0; // 정책 생기면 수정
    return { subtotal, shipping, final: subtotal + shipping, selected };
  }, [safeItems, checkedMap]);

  // 전체선택/개별선택/수량/삭제
  const handleToggleAll = (checked) => {
    const next = {};
    safeItems.forEach((it) => (next[it.cino] = checked));
    setCheckedMap(next);
  };
  const handleCheck = (cino, checked) =>
    setCheckedMap((prev) => ({ ...prev, [cino]: checked }));
  // 수량 변경 핸들러
  const handleQty = async (cino, qty) => {
    const newQty = Math.max(1, Number(qty) || 1); // 수량은 최소 1로 설정
    try {
      // updateItemQty 함수 호출하여 DB 수량 변경
      await updateItemQty(cino, newQty);

      // 수량 변경 후 상태 업데이트
      setCart((prev) =>
        prev.map((item) =>
          item.cino === cino ? { ...item, qty: newQty } : item
        )
      );
    } catch (error) {
      console.error("수량 변경 실패:", error);
      alert("수량 변경에 실패했습니다.");
    }
  };

  // 장바구니 아이템 삭제 핸들러
  const handleDelete = async () => {
    // 선택된 아이템들의 cino 값을 배열로 모음
    const cinos = safeItems
      .filter((it) => checkedMap[it.cino]) // 선택된 아이템만 필터링
      .map((it) => it.cino); // cino 값만 추출
    console.log(cinos);
    if (!cinos.length) return alert("아이템을 선택해주세요."); // 선택된 아이템이 없으면 반환

    try {
      // 선택된 아이템들 삭제 요청 (배치 삭제)
      await deleteSelected(cinos);

      // 삭제 완료 후 상태 갱신
      setCart((prev) => prev.filter((it) => !cinos.includes(it.cino))); // 삭제된 아이템 제외
      setCheckedMap((prev) => {
        const newCheckedMap = { ...prev };
        cinos.forEach((cino) => delete newCheckedMap[cino]);
        return newCheckedMap;
      });
      alert("선택된 아이템이 삭제되었습니다.");
    } catch (error) {
      console.error("아이템 삭제 실패:", error);
      alert("삭제에 실패했습니다.");
    }
  };

  // 구매하기 → 선택상품만 결제 페이지로 전달(quantity → qty 매핑)
  const handlePurchase = () => {
    if (!totals.selected.length) {
      alert("구매할 상품을 선택해주세요.");
      return;
    }
    const payload = totals.selected.map((it) => ({
      ...it,
    }));
    navigate("/payment", { state: { items: payload, from: "cart" } });
  };

  return (
    <section className="py-5">
      <div className="container px-4 px-lg-5">
        <div className="mb-5">
          <h1 className="text-center mb-5">장바구니</h1>
          <hr />
        </div>

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
              전체 선택{" "}
              <span className="text-muted">
                ({selectedCount} / {totalCount})
              </span>
            </label>
          </div>
          <button className="btn btn-danger btn-sm" onClick={handleDelete}>
            선택삭제
          </button>
        </div>

        {/* 아이템 목록 */}
        <div>
          {safeItems.length === 0 ? (
            <div className="text-center py-5 text-muted">
              장바구니가 비어 있습니다.
            </div>
          ) : (
            safeItems.map((item) => {
              const linePrice = (
                Number(item.price || 0) * Number(item.qty || 0)
              ).toLocaleString();

              return (
                <div
                  key={item.cino}
                  className="d-flex align-items-center justify-content-between border p-3 mb-2 rounded-3 bg-white"
                >
                  {/* 좌측: 체크 + 이미지 + 텍스트 */}
                  <div className="d-flex align-items-center gap-3 flex-grow-1">
                    <div className="form-check mt-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`cb-${item.cino}`}
                        checked={!!checkedMap[item.cino]}
                        onChange={(e) =>
                          handleCheck(item.cino, e.target.checked)
                        }
                      />
                    </div>
                    <img
                      src={
                        item.imageFile?.length > 0
                          ? `${API_SERVER_HOST}/api/product/view/${item.imageFile}`
                          : "https://dummyimage.com/400x300/dee2e6/6c757d.jpg"
                      }
                      alt={item.pname}
                      className="rounded"
                      style={{ width: 72, height: 72, objectFit: "cover" }}
                    />

                    <div className="flex-grow-1">
                      <div className="text-muted small fw-semibold">
                        {item.pname}
                      </div>
                      <div className="fw-semibold">{item.pname}</div>
                      <div className="text-muted small">
                        {item.perfumeVol} ml
                      </div>
                    </div>
                  </div>

                  {/* 수량 컨트롤 */}
                  <div className="mx-3">
                    <div
                      className="input-group input-group-sm"
                      style={{ width: 116 }}
                    >
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => handleQty(item.cino, item.qty - 1)}
                        aria-label="수량 감소"
                      >
                        −
                      </button>
                      <input
                        className="form-control text-center"
                        value={item.qty}
                        onChange={(e) => handleQty(item.cino, e.target.value)}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        aria-label="수량"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => handleQty(item.cino, item.qty + 1)}
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

        {/* 합계 */}
        <hr />
        <div className="text-end">
          <p className="mb-1">
            총 상품 가격: <span>{totals.subtotal.toLocaleString()}</span>원
          </p>
          <p className="mb-1">
            배송비: <span>{totals.shipping.toLocaleString()}</span>원
          </p>
          <h5 className="mt-2">
            결제 예정 금액: <strong>{totals.final.toLocaleString()}</strong>원
          </h5>
        </div>

        {/* 중앙 “구매하기” 버튼 */}
        <div className="text-center mt-3">
          <button className="btn btn-dark btn-lg px-5" onClick={handlePurchase}>
            구매하기
          </button>
        </div>
      </div>
    </section>
  );
}

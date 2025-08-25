import React, { useEffect, useMemo, useState } from "react";
// TODO: 실서비스 연결 시 아래를 사용하세요.
// import { getMyOrders, cancelOrder } from "../../api/orderApi";

const USE_MOCK = true;

const statusLabel = {
  PENDING: "입금대기",
  PAID: "주문완료",
  SHIPPING: "배송중",
  DELIVERED: "배송완료",
};

function mockFetchOrders() {
  // 서버 붙이기 전 임시 데이터
  return Promise.resolve({
    content: [
      {
        id: 1001,
        orderNo: "ORD-2025-0001",
        orderDate: "2025-08-10",
        status: "PENDING",
        items: [
          { name: "브랜드1 니트", qty: 1 },
          { name: "브랜드2 팬츠", qty: 2 },
        ],
        totalPrice: 139000,
      },
      {
        id: 1002,
        orderNo: "ORD-2025-0002",
        orderDate: "2025-08-12",
        status: "SHIPPING",
        items: [{ name: "브랜드3 셔츠", qty: 1 }],
        totalPrice: 59000,
      },
      {
        id: 1003,
        orderNo: "ORD-2025-0003",
        orderDate: "2025-08-13",
        status: "DELIVERED",
        items: [{ name: "브랜드1 스커트", qty: 1 }],
        totalPrice: 79000,
      },
    ],
    totalPages: 1,
    totalElements: 3,
    number: 0,
    size: 10,
  });
}

export default function OrderComponent() {
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("ALL"); // ALL | PENDING | PAID | SHIPPING | DELIVERED
  const [loading, setLoading] = useState(false);

  // 주문 목록 로드(mock 데이터)
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        let data;
        if (USE_MOCK) {
          data = await mockFetchOrders();
        } else {
          // 이 시점에만 모듈 로드
          const { getMyOrders } = await import("../../api/orderApi");
          data = await getMyOrders({ page: 1, size: 10 });
        }
        if (alive) setOrders(data.content || []);
      } catch (e) {
        console.error("주문목록 로드 실패:", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (tab === "ALL") return orders;
    return orders.filter((o) => o.status === tab);
  }, [orders, tab]);

  // 주문 취소
  const onCancel = async (orderId) => {
    if (!window.confirm("이 주문을 취소하시겠습니까?")) return;
    try {
      if (USE_MOCK) {
        setOrders((arr) =>
          arr.map((o) => (o.id === orderId ? { ...o, status: "CANCELED" } : o))
        );
      } else {
        const { cancelOrder, getMyOrders } = await import("../../api/orderApi");
        await cancelOrder(orderId);
        const data = await getMyOrders({ page: 1, size: 10 });
        setOrders(data.content || []);
      }
      alert("취소 처리되었습니다.");
    } catch (e) {
      console.error(e);
      alert("취소에 실패했습니다.");
    }
  };

  return (
    <div className="myhub-panel">
      {/* 탭 */}
      <div className="d-flex gap-2 mb-3 mypage-tabs">
        {["ALL", "PENDING", "PAID", "SHIPPING", "DELIVERED"].map((k) => (
          <button
            key={k}
            type="button"
            className={`btn btn-sm ${
              tab === k ? "btn-dark" : "btn-outline-dark"
            }`}
            onClick={() => setTab(k)}
          >
            {k === "ALL" ? "전체" : statusLabel[k]}
          </button>
        ))}
      </div>

      {/* 리스트 */}
      {loading ? (
        <div className="text-muted py-4">불러오는 중...</div>
      ) : filtered.length === 0 ? (
        <div className="text-muted py-4">표시할 주문이 없습니다.</div>
      ) : (
        <ul className="list-unstyled d-flex flex-column gap-3">
          {filtered.map((o) => (
            <li key={o.id} className="p-3 rounded-3 panel-elev">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div className="fw-semibold">
                  {o.orderNo}{" "}
                  <span className="text-muted">| {o.orderDate}</span>
                </div>
                <div>
                  <span className="badge text-bg-light border">
                    {statusLabel[o.status] || o.status}
                  </span>
                </div>
              </div>

              <div className="mt-2 text-muted">
                {o.items?.map((it, idx) => (
                  <span key={idx}>
                    {it.name} x {it.qty}
                    {idx < (o.items?.length || 0) - 1 ? " · " : ""}
                  </span>
                ))}
              </div>

              <div className="mt-3 d-flex justify-content-between align-items-center">
                <div className="fw-semibold">
                  합계&nbsp;
                  {o.totalPrice?.toLocaleString?.() ?? o.totalPrice}원
                </div>

                <div className="d-flex gap-2">
                  <a
                    href={`/orders/${o.id}`}
                    className="btn btn-outline-dark btn-sm"
                  >
                    상세보기
                  </a>
                  {o.status === "PENDING" && (
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => onCancel(o.id)}
                    >
                      주문취소
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

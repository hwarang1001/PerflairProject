import { useEffect, useMemo, useState } from "react";
import { paymentList } from "../../api/paymentApi";
import { useSelector } from "react-redux";
import { API_SERVER_HOST } from "../../api/cartApi";
import { postReview } from "../../api/reviewApi";

const paymentInitState = {
  paymentId: 0,
  userId: "",
  totalAmount: 0,
  paymentDate: "",
  payMethod: "kakaopay",
  details: [],
  shippingAddress: "",
};

export default function OrderComponent() {
  const [orders, setOrders] = useState([paymentInitState]);
  const [tab, setTab] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const loginState = useSelector((s) => s.login);
  const userId = loginState.userId;

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 0,
    content: "",
    uploadFile: null,
  });

  // 주문 목록 불러오기
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await paymentList(userId);
        setOrders(data);
      } catch (err) {
        console.error("결제 내역 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [userId]);

  const filtered = useMemo(() => {
    if (tab === "ALL") return orders;
    return orders.filter((o) => o.status === tab);
  }, [orders, tab]);

  // 리뷰 모달 열기/닫기
  const openModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setNewReview({ rating: 0, content: "", uploadFile: null });
    setSelectedProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingChange = (rate) => {
    setNewReview((prev) => ({ ...prev, rating: rate }));
  };

  const handleFileChange = (e) => {
    setNewReview((prev) => ({
      ...prev,
      uploadFile: e.target.files,
    }));
  };

  const handleSubmitReview = async () => {
    if (!selectedProduct) return;

    const formData = new FormData();
    formData.append("pno", selectedProduct.pno);
    formData.append("content", newReview.content);
    formData.append("rating", newReview.rating);

    if (newReview.uploadFile) {
      for (let i = 0; i < newReview.uploadFile.length; i++) {
        formData.append("files", newReview.uploadFile[i]);
      }
    }

    try {
      const res = await postReview(formData);
      alert("리뷰가 등록되었습니다.");
      closeModal();
    } catch (err) {
      console.error("리뷰 등록 실패", err);
      alert("리뷰 등록 실패 (이미지를 해주세요.)");
    }
  };

  return (
    <div className="myhub-panel">
      {loading ? (
        <div className="text-muted py-4">불러오는 중...</div>
      ) : filtered.length === 0 ? (
        <div className="text-muted py-4">표시할 주문이 없습니다.</div>
      ) : (
        <ul className="list-unstyled">
          {filtered.map((o) => (
            <li
              key={o.paymentId}
              className="border rounded shadow-sm p-4 mb-4 bg-white"
            >
              {/* 주문번호 & 날짜 */}
              <div className="d-flex justify-content-between flex-wrap mb-3">
                <div className="fw-bold">
                  주문번호: ORD-{o.paymentId.toString().padStart(6, "0")}
                  <span className="text-muted ms-2">{o.paymentDate}</span>
                </div>
                <div>
                  <span className="badge bg-success">주문완료</span>
                </div>
              </div>

              {/* 상품 목록 */}
              <div className="border-top pt-3">
                {o.details?.map((it, idx) => (
                  <div
                    key={idx}
                    className="d-flex align-items-center mb-3 pb-3 border-bottom"
                  >
                    <img
                      src={
                        it.imageFile
                          ? `${API_SERVER_HOST}/api/product/view/${it.imageFile}`
                          : "https://dummyimage.com/72x72/dee2e6/6c757d.jpg"
                      }
                      alt={it.pname}
                      className="rounded me-3"
                      style={{ width: 72, height: 72, objectFit: "cover" }}
                    />
                    <div className="flex-grow-1">
                      <div className="fw-semibold mb-2">
                        {it.brand} {it.pname}
                      </div>
                      <div className="text-muted small">
                        용량: {it.perfumeVol}ml | 수량: {it.qty} | 가격:{" "}
                        {it.price.toLocaleString()}원
                      </div>
                      <button
                        className="btn btn-sm btn-outline-primary mt-2"
                        onClick={() => openModal(it)}
                      >
                        리뷰 작성
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 총액 */}
              <div className="d-flex justify-content-end mt-3">
                <div className="fw-bold fs-5">
                  합계: {o.totalAmount.toLocaleString()}원
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* 리뷰작성 모달 */}
      {showModal && (
        <div
          className="modal show fade d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={closeModal}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedProduct ? `${selectedProduct.pname} ` : ""}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">별점</label>
                  <div>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        style={{
                          fontSize: "1.5rem",
                          color:
                            newReview.rating >= star ? "#ffc107" : "#e4e5e9",
                          cursor: "pointer",
                        }}
                        onClick={() => handleRatingChange(star)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="content" className="form-label">
                    내용
                  </label>
                  <textarea
                    className="form-control"
                    id="content"
                    name="content"
                    rows="3"
                    value={newReview.content}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="uploadFile" className="form-label">
                    이미지 업로드 (선택)
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="uploadFile"
                    name="uploadFile"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  취소
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmitReview}
                  disabled={!newReview.content || newReview.rating === 0}
                >
                  등록
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

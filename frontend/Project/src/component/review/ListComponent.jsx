import { useEffect, useState } from "react";
import { getList } from "../../api/reviewApi";
import { API_SERVER_HOST } from "../../api/productApi";
import { useSearchParams } from "react-router-dom";
import useCustomLogin from "../../hook/useCustomLogin";

const reviewInitState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totoalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0,
};
const ListComponent = () => {
  const [review, setReview] = useState(reviewInitState);
  const [searchParams] = useSearchParams();
  const pno = searchParams.get("pno");
  const { moveToPath } = useCustomLogin();
  useEffect(() => {
    getList(pno).then((data) => setReview(data));
  }, []);

  const maskUserId = (email) => {
    if (!email) return "익명";
    const [local, domain] = email.split("@");
    return `${local.slice(0, 2)}${"*".repeat(local.length - 2)}@${domain}`;
  };

  // 이미지 클릭 핸들러
  const onClickImage = (reviewId) => {
    moveToPath(`/review/read/${reviewId}`);
  };

  return (
    <section className="py-5">
      <div className="container px-4 px-lg-5">
        <div className="text-center mb-5">
          <h1 className="mb-5">상품 리뷰</h1>
          <hr />
        </div>
        <div className="d-flex flex-column justify-content-center gap-4 w-75 mx-auto">
          {review.dtoList
            .sort((a, b) => b.reviewId - a.reviewId)
            .map((rev, idx) => (
              <div
                key={idx}
                className="d-flex align-items-start border rounded shadow-sm p-3"
                style={{
                  backgroundColor: "#fff",
                  gap: "16px", // 여백 간단하게 gap으로 처리
                  fontSize: "0.9rem", // 폰트 전체 살짝 축소
                }}
              >
                {/* 왼쪽 이미지 */}
                {rev.uploadFileNames?.length > 0 ? (
                  <img
                    src={`${API_SERVER_HOST}/api/product/view/${rev.uploadFileNames[0]}`}
                    alt="리뷰 이미지"
                    onClick={() => onClickImage(rev.reviewId)}
                    style={{
                      width: "120px", // 기존 180px → 줄임
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  />
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center bg-light text-muted"
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                    }}
                  >
                    이미지 없음
                  </div>
                )}

                {/* 오른쪽 본문 */}
                <div
                  className="flex-grow-1 d-flex flex-column justify-content-between"
                  style={{ minWidth: 0 }}
                >
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <div>
                        <span className="text-warning fs-5">
                          {"★".repeat(rev.rating || 0)}
                        </span>
                        <span className="text-muted fs-5">
                          {"☆".repeat(5 - (rev.rating || 0))}
                        </span>
                      </div>
                      <small className="text-muted">{rev.createdAt}</small>
                    </div>
                    <div className="mb-1">
                      <strong>{maskUserId(rev.userId)}</strong>
                    </div>
                    <p
                      className="mb-0 text-body"
                      style={{
                        overflowWrap: "break-word",
                        lineHeight: "1.4",
                      }}
                    >
                      {rev.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default ListComponent;

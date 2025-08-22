import { useEffect, useState } from "react";
import { getOne } from "../../api/reviewApi";
import { API_SERVER_HOST } from "../../api/productApi";
import { useParams } from "react-router-dom";
import ReviewCarousel from "../../include/ReviewCarousel";
const initState = {
  reviewId: 0,
  userId: "",
  pno: 0,
  rating: 0,
  createdAt: "",
  content: "",
  files: [],
  uploadFileNames: [],
};

const ReadComponent = () => {
  const [review, setReview] = useState(initState);
  const { id } = useParams();
  console.log("reviewId:", id);
  useEffect(() => {
    getOne(id).then((data) => setReview(data));
  }, [id]);
  console.log(review);
  const maskUserId = (email) => {
    if (!email) return "익명";
    const [local, domain] = email.split("@");
    return `${local.slice(0, 2)}${"*".repeat(local.length - 2)}@${domain}`;
  };

  return (
    <section className="py-5">
      <div className="container px-4 px-lg-5">
        <div className="text-center mb-5">
          <h1 className="mb-4">리뷰 상세</h1>
          <hr />
        </div>
        <div className="d-flex flex-column align-items-center">
          {/* 이미지 */}
          {review.uploadFileNames.length > 0 ? (
            <div className="col-md-6">
              <ReviewCarousel
                images={review.uploadFileNames.map(
                  (fileName) =>
                    `${API_SERVER_HOST}/api/reviews/view/${fileName}`
                )}
              />
            </div>
          ) : (
            <div
              className="bg-light text-muted d-flex align-items-center justify-content-center mb-4"
              style={{
                width: "100%",
                maxWidth: "600px",
                height: "300px",
                borderRadius: "12px",
                fontSize: "1rem",
              }}
            >
              이미지 없음
            </div>
          )}

          {/* 본문 정보 */}
          <div className="w-100" style={{ maxWidth: "700px" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <span className="text-warning fs-4">
                  {"★".repeat(review.rating)}
                </span>
                <span className="text-muted fs-4">
                  {"☆".repeat(5 - review.rating)}
                </span>
              </div>
              <small className="text-muted">{review.createdAt}</small>
            </div>

            <h5 className="mb-3">{maskUserId(review.userId)}</h5>

            <p
              className="text-body"
              style={{
                overflowWrap: "break-word",
                fontSize: "1.1rem",
                lineHeight: "1.6",
              }}
            >
              {review.content}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReadComponent;

import { useEffect, useState } from "react";
import "../../App.css";
import ProductCarousel from "../../include/ProductCarousel";
import { getOne } from "../../api/productApi";
import { API_SERVER_HOST } from "../../api/productApi";

const initState = {
  pno: 0,
  brand: "",
  pname: "",
  pdesc: "",
  uploadFileNames: [],
  options: [],
};

const dummyReviews = [
  {
    reviewer: "유저1",
    rating: 5,
    content: "정말 좋은 향수예요!",
    date: "2025-08-08",
  },
  {
    reviewer: "유저2",
    rating: 4,
    content: "향이 오래가고 좋아요.",
    date: "2025-08-08",
  },
  { reviewer: "유저3", rating: 3, content: "무난해요.", date: "2025-08-08" },
  {
    reviewer: "유저4",
    rating: 5,
    content: "선물용으로 추천합니다.",
    date: "2025-08-08",
  },
  {
    reviewer: "유저5",
    rating: 2,
    content: "저는 별로였어요.",
    date: "2025-08-08",
  },
];

const ReadComponent = ({ pno }) => {
  const [count, setCount] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0); // 선택된 옵션 index
  const [product, setProduct] = useState(initState);

  const options = product.options || [];

  // 총 가격 계산
  useEffect(() => {
    if (options.length > 0) {
      setTotal(count * options[selectedIndex].price);
    }
  }, [count, selectedIndex, options]);

  // + 버튼
  const handleIncrement = () => {
    if (options.length > 0) {
      setCount((prev) =>
        prev >= options[selectedIndex].stock ? prev : prev + 1
      );
    }
  };

  // - 버튼
  const handleDecrement = () => {
    setCount((prev) => (prev > 1 ? prev - 1 : 1));
  };

  // 직접 입력
  const handleChange = (e) => {
    const value = parseInt(e.target.value);
    if (
      !isNaN(value) &&
      value >= 1 &&
      options.length > 0 &&
      options[selectedIndex].stock >= value
    ) {
      setCount(value);
    } else if (e.target.value === "") {
      setCount("");
    }
  };

  // 데이터 가져오기
  useEffect(() => {
    getOne(pno).then((data) => {
      console.log(data);
      setProduct(data);
    });
  }, [pno]);

  return (
    <>
      {/* 상품장바구니, 결제 */}
      <section className="py-5">
        <div className="container px-4 px-lg-5 my-5">
          <div className="row gx-4 gx-lg-5 align-items-center justify-content-around">
            <div className="col-md-6">
              <ProductCarousel
                images={product.uploadFileNames.map(
                  (fileName) =>
                    `${API_SERVER_HOST}/api/product/view/${fileName}`
                )}
              />
            </div>
            <div className="col-md-5 align-content-center">
              <h3 className="fw-bolder mb-3">{product.brand}</h3>
              <h1 className="fw-bolder mb-3">{product.pname}</h1>

              {/* 현재 가격 */}
              <div className="fs-5 mb-4">
                {options.length > 0 && (
                  <span>{options[selectedIndex].price.toLocaleString()}원</span>
                )}
                <hr />
              </div>

              {/* 옵션 선택 */}
              <div className="mb-4 d-flex flex-wrap gap-3">
                {options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedIndex(idx);
                      setCount(1); // 옵션 변경 시 수량 초기화
                    }}
                    className={`flex flex-col items-center text-center px-4 py-2 border rounded ${
                      selectedIndex === idx
                        ? "border-2 border-blue-500"
                        : "bg-white text-gray-800 border-gray-300"
                    }`}
                  >
                    {opt.perfumeVol}ml <br /> {opt.price.toLocaleString()}원
                  </button>
                ))}
              </div>
              {/* 수량 조절 */}
              <div className="mb-5 bg-gradient">
                <h5 className="mb-3">수량</h5>

                <div className="d-flex justify-content-between">
                  <div className="input-group" style={{ maxWidth: "120px" }}>
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={handleDecrement}
                    >
                      −
                    </button>
                    <input
                      className="form-control text-center"
                      value={count}
                      onChange={handleChange}
                      onBlur={() => {
                        if (count === "") {
                          setCount(1);
                        }
                      }}
                      min={1}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={handleIncrement}
                    >
                      +
                    </button>
                  </div>
                  <span className="fs-5">{total.toLocaleString()}원</span>
                </div>
                <hr />
              </div>

              {/* 버튼 */}
              <div className="d-flex justify-content-center gap-3">
                <button
                  className="btn btn-dark flex-shrink-0 p-3"
                  type="button"
                >
                  <i className="bi-cart-fill me-1"></i>
                  구매하기
                </button>
                <button
                  className="btn btn-outline-dark flex-shrink-0 p-3"
                  type="button"
                >
                  <i className="bi-cart-fill me-1"></i>
                  장바구니 담기
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 상세정보 */}
      <section className="py-5 bg-light">
        <div className="container px-4 px-lg-5 mt-5">
          <h2 className="fw-bolder mb-4 text-center">상세정보</h2>
          <h6 className="text-center">{product.pdesc}</h6>
        </div>
      </section>

      {/* 리뷰 */}
      <section className="py-5 bg-light">
        <div className="container px-4 px-lg-5">
          <h2 className="fw-bolder mb-4 text-center">리뷰</h2>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
            {dummyReviews.map((review, idx) => (
              <div className="col" key={idx}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    {product.uploadFileNames.length > 0 && (
                      <img
                        src={`${API_SERVER_HOST}/api/product/view/${product.uploadFileNames[0]}`}
                        className="card-img mb-3"
                      />
                    )}
                    <h6 className="card-title mb-1">{review.reviewer}</h6>
                    <p className="mb-2">
                      <span className="text-warning">
                        {"★".repeat(review.rating)}
                      </span>
                      <span className="text-muted">
                        {"☆".repeat(5 - review.rating)}
                      </span>
                    </p>
                    <p className="card-text text-muted">{review.content}</p>
                    <p className="card-text text-muted fs-6">{review.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ReadComponent;

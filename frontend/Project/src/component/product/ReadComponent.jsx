import { useEffect, useState } from "react";
import "../../App.css";
import ProductCarousel from "../../include/ProductCarousel";
import { getOne } from "../../api/productApi";
import { API_SERVER_HOST } from "../../api/productApi";
import { getList } from "../../api/reviewApi";
import useCustomLogin from "../../hook/useCustomLogin";
import useCustomMove from "../../hook/useCustomMove";
import { postAdd } from "../../api/cartApi";
const initState = {
  pno: 0,
  brand: "",
  pname: "",
  pdesc: "",
  uploadFileNames: [],
  options: [],
};

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

const ReadComponent = ({ pno }) => {
  const [count, setCount] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0); // 선택된 옵션 index
  const [product, setProduct] = useState(initState);
  const [review, setReview] = useState(reviewInitState);
  const { moveToPayment } = useCustomMove();
  const { moveToPath } = useCustomLogin();

  const options = product.options || [];

  // 총 가격 계산
  useEffect(() => {
    if (options.length > 0) {
      setTotal(count * options[selectedIndex].price); // 수량 * 선택 옵션의 가격
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

  // 상품 데이터, 리뷰 데이터 불러오기
  useEffect(() => {
    getOne(pno).then((data) => setProduct(data));
    getList(pno).then((data) => setReview(data));
  }, [pno]);

  // 유저 아이디 마스크처리
  const maskUserId = (email) => {
    if (!email || typeof email !== "string") return "익명";

    const [local, domain] = email.split("@");

    // 너무 짧은 이메일은 그대로 반환
    if (!domain || local.length < 3) return email;

    const visible = local.slice(0, 2); // 앞 2글자 보이기
    const masked = "*".repeat(Math.max(local.length - 2, 1));

    return `${visible}${masked}@${domain}`;
  };

  // 리뷰 이미지 클릭 핸들러
  const onClickImage = (reviewId) => {
    moveToPath(`/review/read/${reviewId}`);
  };

  // 장바구니 담기 핸들러
  const handleAddToCart = async (e) => {
    e.preventDefault(); // 페이지 새로고침 방지

    // 선택한 옵션
    const selectedOption = options[selectedIndex];

    // 장바구니에 추가할 데이터 생성
    const data = {
      productOptionId: selectedOption.oid, // 상품 옵션 ID
      qty: count, // 수량
    };

    try {
      // postAdd 함수 호출 (비동기 처리)
      await postAdd(data); // 데이터가 정상적으로 전송될 때까지 기다림
      alert("장바구니 등록 성공"); // 성공 메시지
    } catch (error) {
      alert("장바구니 등록 실패"); // 실패 메시지
      console.error("장바구니 등록 실패:", error); // 에러 콘솔에 출력
    }
  };

  const handleBuyNow = async () => {
    const selectedOption = options[selectedIndex];

    const data = {
      productOptionId: selectedOption.oid,
      qty: count,
    };

    try {
      const cino = await postAdd(data); // 응답에서 cino 받아옴
      console.log("받은 cino:", cino);
      if (!cino || isNaN(cino)) {
        alert("상품 추가 실패: cino 없음");
        return;
      }
      const itemData = {
        cino: Number(cino),
        productOptionId: selectedOption.oid,
        pname: product.pname,
        price: selectedOption.price,
        perfumeVol: selectedOption.perfumeVol,
        qty: count,
        imageFile: product.uploadFileNames[0] || "",
      };

      moveToPayment("/payment", {
        state: {
          items: [itemData],
          from: "direct",
        },
      });
    } catch (error) {
      console.error("구매하기 실패:", error);
      alert("구매 중 문제가 발생했습니다.");
    }
  };

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
                  <p>{options[selectedIndex].price.toLocaleString()}원</p>
                )}
                <h6 className="text-center mb-4">{product.pdesc}</h6>
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
                  onClick={handleBuyNow}
                >
                  <i className="bi-cart-fill me-1"></i>
                  구매하기
                </button>
                <button
                  className="btn btn-outline-dark flex-shrink-0 p-3"
                  type="button"
                  onClick={handleAddToCart}
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
          {review.dtoList.length === 0 ? (
            <div className="text-center">
              <p>등록된 리뷰가 없습니다.</p>
            </div>
          ) : (
            <div className="row">
              {review.dtoList
                .sort((a, b) => b.reviewId - a.reviewId) // reviewId 기준 내림차순 정렬
                .slice(0, 5)
                .map((rev, idx) => (
                  <div
                    key={idx}
                    className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
                    style={{ width: "20%" }}
                  >
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        {rev.uploadFileNames &&
                        rev.uploadFileNames.length > 0 ? (
                          <img
                            src={`${API_SERVER_HOST}/api/product/view/${rev.uploadFileNames[0]}`}
                            onClick={() => onClickImage(rev.reviewId)}
                            style={{
                              cursor: "pointer",
                              width: "100%",
                              height: "150px",
                              objectFit: "cover",
                            }}
                            className="card-img mb-2"
                          />
                        ) : (
                          <div className="text-center text-muted mb-2">
                            이미지 없음
                          </div>
                        )}
                        <p className="mb-1">
                          <span className="text-warning fs-5">
                            {"★".repeat(rev.rating || 0)}
                          </span>
                          <span className="text-muted fs-5">
                            {"☆".repeat(5 - (rev.rating || 0))}
                          </span>
                        </p>
                        <div className="mb-1">
                          <strong>{maskUserId(rev.userId)}</strong>
                        </div>
                        <p
                          className="card-text"
                          style={{
                            height: "2.8em",
                            fontSize: "1rem",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {rev.content}
                        </p>
                        <p className="card-text text-muted fs-6">
                          {rev.createdAt}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
          {/* 더보기 버튼, 중앙 정렬 */}
          <div className="d-flex justify-content-center mt-4">
            <button
              className="btn btn-outline-dark"
              onClick={() => {
                console.log("더보기 버튼 클릭, pno:", pno);
                moveToPath(`/review/list?pno=${pno}`);
              }}
            >
              더보기
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ReadComponent;

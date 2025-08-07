import { useEffect, useState } from "react";
import "../../App.css";
import ProductCarousel from "../../include/ProductCarousel";
import { getOne } from "../../api/productApi";
import { API_SERVER_HOST } from "../../api/productApi";
const initState = {
  pno: 0,
  pname: "",
  price: 0,
  pdesc: "",
  stock: 0,
  perfumeVol: 0,
  uploadFileNames: [],
};

const ReadComponent = ({ pno }) => {
  const [count, setCount] = useState(1);
  const [total, setTotal] = useState(0);
  const [product, setProduct] = useState(initState);
  useEffect(() => {
    setTotal(count * product.price);
  }, [count, product.price]);
  // + 버튼
  const handleIncrement = () => {
    setCount((prev) => (prev >= product.stock ? prev : prev + 1)); // 재고보다 많으면 증가 안됨
  };

  // - 버튼
  const handleDecrement = () => {
    setCount((prev) => (prev > 1 ? prev - 1 : 1));
  };
  const handleChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && product.stock >= value) {
      setCount(value);
    } else if (e.target.value === "") {
      setCount("");
    }
  };
  useEffect(() => {
    getOne(pno).then((data) => {
      setProduct(data);
      console.log(data);
    });
  }, [pno]);

  return (
    <>
      {/* Product section */}
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
              <h1 className="display-6 fw-bolder mb-3">{product.pname}</h1>
              <div className="fs-5 mb-3">
                <span> {product.price.toLocaleString()}원</span>
              </div>
              <hr />
              <div className="mb-5 bg-gradient">
                <h5 className="mb-5">수량</h5>
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

      {/* Related items section */}
      <section className="py-5 bg-light">
        <div className="container px-4 px-lg-5 mt-5">
          <h2 className="fw-bolder mb-4 text-center">상세정보</h2>
          <h6 className="text-center">{product.pdesc}</h6>
        </div>
      </section>
    </>
  );
};

export default ReadComponent;

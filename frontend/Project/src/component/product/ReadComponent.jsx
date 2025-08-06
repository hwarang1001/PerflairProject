import "../../App.css";
import Carousel from "../../include/ProductCarousel";

const ReadComponent = () => {
  return (
    <>
      {/* Product section */}
      <section className="py-5">
        <div className="container px-4 px-lg-5 my-5">
          <div className="row gx-4 gx-lg-5 align-items-center">
            <div className="col-md-6">
              <Carousel />
            </div>
            <div className="col-md-6">
              <h1 className="display-5 fw-bolder">상품 이름</h1>
              <div className="fs-5 mb-5">
                <span className="text-decoration-line-through">120,000원</span>
                <span> 100,000원</span>
              </div>
              <p className="lead">
                상품설명: Lorem ipsum dolor sit amet consectetur adipisicing
                elit. Praesentium at dolorem quidem modi. Nam sequi consequatur
                obcaecati excepturi alias magni, accusamus eius blanditiis
                delectus ipsam minima ea iste laborum vero?
              </p>
              <div className="d-flex">
                <p> </p>
                <input
                  className="form-control text-center me-3"
                  id="inputQuantity"
                  type="number"
                  defaultValue={1}
                  style={{ maxWidth: "3rem" }}
                />
                <button
                  className="btn btn-outline-dark flex-shrink-0"
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
          <h2 className="fw-bolder mb-4">Related products</h2>
          <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
            {/* Reusable Product Card */}
            {[
              {
                name: "Fancy Product",
                price: "$40.00 - $80.00",
                img: "https://dummyimage.com/450x300/dee2e6/6c757d.jpg",
                isSale: false,
                isRated: false,
              },
              {
                name: "Special Item",
                price: "$18.00",
                oldPrice: "$20.00",
                img: "https://dummyimage.com/450x300/dee2e6/6c757d.jpg",
                isSale: true,
                isRated: true,
              },
              {
                name: "Sale Item",
                price: "$25.00",
                oldPrice: "$50.00",
                img: "https://dummyimage.com/450x300/dee2e6/6c757d.jpg",
                isSale: true,
                isRated: false,
              },
              {
                name: "Popular Item",
                price: "$40.00",
                img: "https://dummyimage.com/450x300/dee2e6/6c757d.jpg",
                isSale: false,
                isRated: true,
              },
            ].map((product, index) => (
              <div className="col mb-5" key={index}>
                <div className="card h-100 position-relative">
                  {product.isSale && (
                    <div
                      className="badge bg-dark text-white position-absolute"
                      style={{ top: "0.5rem", right: "0.5rem" }}
                    >
                      Sale
                    </div>
                  )}
                  <img
                    className="card-img-top"
                    src={product.img}
                    alt={product.name}
                  />
                  <div className="card-body p-4">
                    <div className="text-center">
                      <h5 className="fw-bolder">{product.name}</h5>
                      {product.isRated && (
                        <div className="d-flex justify-content-center small text-warning mb-2">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <div className="bi-star-fill" key={i}></div>
                            ))}
                        </div>
                      )}
                      {product.oldPrice ? (
                        <>
                          <span className="text-muted text-decoration-line-through">
                            {product.oldPrice}
                          </span>{" "}
                          {product.price}
                        </>
                      ) : (
                        product.price
                      )}
                    </div>
                  </div>
                  <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
                    <div className="text-center">
                      <a className="btn btn-outline-dark mt-auto" href="#">
                        {product.name === "Fancy Product"
                          ? "View options"
                          : "Add to cart"}
                      </a>
                    </div>
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

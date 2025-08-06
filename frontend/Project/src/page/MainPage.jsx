import Header from "../include/Header";
import Footer from "../include/Footer";
import "../App.css";
import Carousel from "../include/BannerCarousel";
import banner from "../assets/banner.jpg";
const MainPage = () => {
  return (
    <>
      <Header />
      <div className="container px-4 px-lg-5">
        <Carousel />
      </div>
      <section className="py-5">
        <div className="container px-4 px-lg-5 mt-5">
          <img className="img-fluid" src={banner} alt="배너1" />
          <h6 className="fw-bolder">🏆 인기 아이템 </h6>
          <p className="fw-light">BEST 아이템 컬렉션</p>
          <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
            <div className="col mb-5">
              <div className="card h-100">
                <img
                  className="card-img-top"
                  src="https://dummyimage.com/450x300/dee2e6/6c757d.jpg"
                  alt="..."
                />
                <div className="card-body p-4">
                  <div className="text-center">
                    <h6 className="fw-bolder">브랜드명</h6>
                    <h6 className="fw-normal">제품명</h6>
                    100,000원
                  </div>
                </div>
                <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
                  <div className="text-center">
                    <a className="btn btn-outline-dark mt-auto" href="#">
                      보러가기
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col mb-5">
              <div className="card h-100">
                <img
                  className="card-img-top"
                  src="https://dummyimage.com/450x300/dee2e6/6c757d.jpg"
                  alt="..."
                />
                <div className="card-body p-4">
                  <div className="text-center">
                    <h6 className="fw-bolder">브랜드명</h6>
                    <h6 className="fw-normal">제품명</h6>
                    100,000원
                  </div>
                </div>
                <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
                  <div className="text-center">
                    <a className="btn btn-outline-dark mt-auto" href="#">
                      보러가기
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col mb-5">
              <div className="card h-100">
                <img
                  className="card-img-top"
                  src="https://dummyimage.com/450x300/dee2e6/6c757d.jpg"
                  alt="..."
                />
                <div className="card-body p-4">
                  <div className="text-center">
                    <h6 className="fw-bolder">브랜드명</h6>
                    <h6 className="fw-normal">제품명</h6>
                    100,000원
                  </div>
                </div>
                <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
                  <div className="text-center">
                    <a className="btn btn-outline-dark mt-auto" href="#">
                      보러가기
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col mb-5">
              <div className="card h-100">
                <img
                  className="card-img-top"
                  src="https://dummyimage.com/450x300/dee2e6/6c757d.jpg"
                  alt="..."
                />
                <div className="card-body p-4">
                  <div className="text-center">
                    <h6 className="fw-bolder">브랜드명</h6>
                    <h6 className="fw-normal">제품명</h6>
                    100,000원
                  </div>
                </div>
                <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
                  <div className="text-center">
                    <a className="btn btn-outline-dark mt-auto" href="#">
                      보러가기
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container px-4 px-lg-5 mt-5">
          <img className="img-fluid" src={banner} alt="배너1" />
          <h6 className="fw-bolder">🏆 인기 아이템 </h6>
          <p className="fw-light">BEST 아이템 컬렉션</p>
          <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
            <div className="col mb-5">
              <div className="card h-100">
                <img
                  className="card-img-top"
                  src="https://dummyimage.com/450x300/dee2e6/6c757d.jpg"
                  alt="..."
                />
                <div className="card-body p-4">
                  <div className="text-center">
                    <h6 className="fw-bolder">브랜드명</h6>
                    <h6 className="fw-normal">제품명</h6>
                    100,000원
                  </div>
                </div>
                <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
                  <div className="text-center">
                    <a className="btn btn-outline-dark mt-auto" href="#">
                      보러가기
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col mb-5">
              <div className="card h-100">
                <img
                  className="card-img-top"
                  src="https://dummyimage.com/450x300/dee2e6/6c757d.jpg"
                  alt="..."
                />
                <div className="card-body p-4">
                  <div className="text-center">
                    <h6 className="fw-bolder">브랜드명</h6>
                    <h6 className="fw-normal">제품명</h6>
                    100,000원
                  </div>
                </div>
                <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
                  <div className="text-center">
                    <a className="btn btn-outline-dark mt-auto" href="#">
                      보러가기
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col mb-5">
              <div className="card h-100">
                <img
                  className="card-img-top"
                  src="https://dummyimage.com/450x300/dee2e6/6c757d.jpg"
                  alt="..."
                />
                <div className="card-body p-4">
                  <div className="text-center">
                    <h6 className="fw-bolder">브랜드명</h6>
                    <h6 className="fw-normal">제품명</h6>
                    100,000원
                  </div>
                </div>
                <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
                  <div className="text-center">
                    <a className="btn btn-outline-dark mt-auto" href="#">
                      보러가기
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col mb-5">
              <div className="card h-100">
                <img
                  className="card-img-top"
                  src="https://dummyimage.com/450x300/dee2e6/6c757d.jpg"
                  alt="..."
                />
                <div className="card-body p-4">
                  <div className="text-center">
                    <h6 className="fw-bolder">브랜드명</h6>
                    <h6 className="fw-normal">제품명</h6>
                    100,000원
                  </div>
                </div>
                <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
                  <div className="text-center">
                    <a className="btn btn-outline-dark mt-auto" href="#">
                      보러가기
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};
export default MainPage;

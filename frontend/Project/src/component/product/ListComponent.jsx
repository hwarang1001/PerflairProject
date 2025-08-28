import { getList } from "../../api/productApi";
import { API_SERVER_HOST } from "../../api/productApi";
import { useEffect, useState } from "react";
import PageComponent from "../common/PageComponent";
import useCustomMove from "../../hook/useCustomMove";

const host = API_SERVER_HOST;

const initState = {
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
  const { page, size, moveToRead } = useCustomMove();
  const [serverData, setServerData] = useState(initState);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);

  // 브랜드 체크 핸들링
  const handleBrandChange = (e) => {
    const { value, checked } = e.target;
    setSelectedBrands((prev) =>
      checked ? [...prev, value] : prev.filter((brand) => brand !== value)
    );
  };

  // 가격 체크 핸들링
  const handlePriceChange = (e) => {
    const { value, checked } = e.target;
    setSelectedPrices((prev) =>
      checked ? [...prev, value] : prev.filter((price) => price !== value)
    );
  };

  //  브랜드 중복 제거
  const uniqueBrands = [
    ...new Set(serverData.dtoList.map((product) => product.brand)),
  ];

  // 필터링 로직
  const filteredList = serverData.dtoList.filter((product) => {
    const price = product.options[0].price;

    // 가격 필터
    const isPriceMatch =
      selectedPrices.length === 0 ||
      selectedPrices.some((range) => {
        if (range === "300000+") return price > 300000;
        const [min, max] = range.split("-").map(Number);
        return price >= min && price <= max;
      });

    // 브랜드 필터
    const isBrandMatch =
      selectedBrands.length === 0 || selectedBrands.includes(product.brand);

    return isPriceMatch && isBrandMatch;
  });

  // 데이터 가져오기
  useEffect(() => {
    getList({ page, size }).then((data) => {
      setServerData(data);
    });
  }, [page, size]);

  return (
    <section className="py-5">
      <div className="container px-4 px-lg-5">
        <div className="text-center mb-5">
          <h1 className="mb-5">브랜드 명</h1>
          <hr />
        </div>

        <div className="row w-100">
          {/* === 필터 영역 === */}
          <div className="col-md-2 mb-4">
            <div className="p-3 border rounded">
              {/* 브랜드 필터 */}
              <h5 className="mb-3">브랜드</h5>
              {uniqueBrands.map((brand) => (
                <div className="form-check mb-2" key={brand}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`brand-${brand}`}
                    value={brand}
                    onChange={handleBrandChange}
                    checked={selectedBrands.includes(brand)}
                  />
                  <label
                    className="form-check-label cursor-pointer"
                    htmlFor={`brand-${brand}`}
                  >
                    {brand}
                  </label>
                </div>
              ))}

              {/* 가격 필터 */}
              <h5 className="mt-4 mb-3">가격</h5>
              {[
                { label: "5만원 이하", value: "0-50000" },
                { label: "5 ~ 10만원", value: "50000-100000" },
                { label: "10 ~ 15만원", value: "100000-150000" },
                { label: "15 ~ 20만원", value: "150000-200000" },
                { label: "20 ~ 25만원", value: "200000-250000" },
                { label: "25 ~ 30만원", value: "250000-300000" },
                { label: "30만원 이상", value: "300000+" },
              ].map(({ label, value }, idx) => (
                <div className="form-check mb-2" key={idx}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`price${idx}`}
                    value={value}
                    onChange={handlePriceChange}
                    checked={selectedPrices.includes(value)}
                  />
                  <label
                    className="form-check-label cursor-pointer"
                    htmlFor={`price${idx}`}
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* === 제품 리스트 영역 === */}
          <div className="col-md-10">
            <div className="row gx-4 gx-lg-5 row-cols-1 row-cols-md-3 row-cols-xl-4">
              {filteredList.map((product) => (
                <div className="col mb-5" key={product.pno}>
                  <div className="card d-flex flex-column h-100">
                    <img
                      className="card-img"
                      onClick={() => moveToRead(product.pno)}
                      src={
                        product.uploadFileNames?.length > 0
                          ? `${host}/api/product/view/${product.uploadFileNames[0]}`
                          : "https://dummyimage.com/400x300/dee2e6/6c757d.jpg"
                      }
                      alt={product.pname}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                    />
                    <div className="card-body p-4 flex-grow-1">
                      <div className="text-center">
                        <h6 className="fw-bolder">{product.brand}</h6>
                        <h6 className="fw-normal">{product.pname}</h6>
                        {product.options[0].price.toLocaleString()}원
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 결과 없음 */}
            {filteredList.length === 0 && (
              <div className="text-center mt-5">
                <h5>등록된 제품이 없습니다.</h5>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* <PageComponent serverData={serverData} moveToList={moveToProductList} /> */}
    </section>
  );
};

export default ListComponent;

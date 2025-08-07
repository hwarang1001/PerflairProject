import { getList } from "../../api/productApi";
import { API_SERVER_HOST } from "../../api/productApi";
import { useEffect, useState } from "react";
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
  const { page, size } = useCustomMove();
  const [serverData, setServerData] = useState(initState);

  useEffect(() => {
    getList({ page, size }).then((data) => {
      console.log(data);
      setServerData(data);
    });
  }, [page, size]);

  return (
    <section className="py-5">
      <div className="container px-4 px-lg-5">
        <div className="mb-5 text-center">
          <h1 className="mb-3">브랜드 명</h1>
          <hr />
          <h2>페스티벌 향수</h2>
          <h6>추천 자유롭고 대담하게 🎸</h6>
        </div>

        <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
          {serverData.dtoList.map((product) => (
            <div className="col mb-5" key={product.pno}>
              <div className="card h-100">
                <img
                  className="card-img-top"
                  src={
                    product.uploadFileNames &&
                    product.uploadFileNames.length > 0
                      ? `${host}/api/product/view/${product.uploadFileNames[0]}`
                      : "https://dummyimage.com/450x300/dee2e6/6c757d.jpg"
                  }
                  alt={product.pname}
                />
                <div className="card-body p-4">
                  <div className="text-center">
                    <h6 className="fw-bolder">브랜드명</h6>
                    <h6 className="fw-normal">{product.pname}</h6>
                    {product.price.toLocaleString()}원
                  </div>
                </div>
                <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
                  <div className="text-center">
                    <a
                      className="btn btn-outline-dark mt-auto"
                      href={`/product/read/${product.pno}`}
                    >
                      보러가기
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* 데이터 없을 경우 */}
          {serverData.dtoList.length === 0 && (
            <div className="text-center mt-5">
              <h5>등록된 제품이 없습니다.</h5>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ListComponent;

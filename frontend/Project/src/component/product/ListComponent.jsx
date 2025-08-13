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
  const { page, size, moveToRead } = useCustomMove();
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
        <div className="text-center mb-5">
          <h1 className=" mb-5">브랜드 명</h1>
          <hr />
        </div>
        <div className="text-center mb-5">
          <h2>페스티벌 향수</h2>
          <h6>추천 자유롭고 대담하게 🎸</h6>
        </div>

        <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
          {serverData.dtoList.map((product) => (
            <div className="col mb-5" key={product.pno}>
              <div className="card d-flex flex-column h-100">
                <a href={`/product/read/${product.pno}`}>
                  <img
                    className="card-img"
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
                    }}
                  />
                </a>
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

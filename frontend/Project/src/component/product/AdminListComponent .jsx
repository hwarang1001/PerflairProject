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

const AdminListComponent = () => {
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
        <div className="text-center mb-5">
          <h1 className="mb-5">상품 관리</h1>
          <hr />
        </div>

        {/* 상품 리스트 플렉스 컨테이너 */}
        <div className="d-flex flex-column">
          {serverData.dtoList.map((product) => (
            <div
              className="d-flex flex-column flex-md-row align-items-center mb-4 p-3 border rounded justify-content-between"
              key={product.pno}
            >
              {/* 상품 이미지 */}
              <div className="d-flex justify-content-center mb-3 mb-md-0">
                <img
                  src={
                    product.uploadFileNames &&
                    product.uploadFileNames.length > 0
                      ? `${host}/api/product/view/${product.uploadFileNames[0]}`
                      : "https://dummyimage.com/100x100/dee2e6/6c757d.jpg"
                  }
                  alt={product.pname}
                  className="img-fluid rounded"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              </div>

              <h5>{product.pname}</h5>
              <p>{product.price.toLocaleString()}원</p>
              <a
                className="btn btn-outline-dark"
                href={`/product/read/${product.pno}`}
              >
                보러가기
              </a>
            </div>
          ))}

          {/* 데이터가 없을 경우 */}
          {serverData.dtoList.length === 0 && (
            <div className="text-center">
              <h5>등록된 제품이 없습니다.</h5>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminListComponent;

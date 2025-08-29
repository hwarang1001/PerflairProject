import {
  API_SERVER_HOST,
  deleteRemove,
  getAdminList,
} from "../../api/productApi";
import { useEffect, useState } from "react";
import useCustomMove from "../../hook/useCustomMove";
import PageComponent from "../common/PageComponent";

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
  const { page, size, moveToAdd, moveToModify, moveToAdminProductList } =
    useCustomMove();
  const [serverData, setServerData] = useState(initState);
  useEffect(() => {
    getAdminList({ page, size }).then((data) => {
      console.log(data);
      setServerData(data);
    });
  }, [page, size]);

  const btnClickDelete = async (product) => {
    // 삭제 할지 여부 체크
    const confirmDelete = window.confirm(
      `${product.pname}을(를) 삭제하시겠습니까?`
    );
    if (!confirmDelete) return;

    // 해당 상품 삭제
    await deleteRemove(product.pno);

    // 삭제 후 리스트를 다시 받음
    const data = await getAdminList({ page, size });
    setServerData(data);
  };

  return (
    <section className="py-5">
      <div className="container px-4 px-lg-5">
        <div className="text-center mb-5">
          <h1 className="mb-5">상품 관리</h1>
          <hr />
        </div>

        {/* 상품 리스트 플렉스 컨테이너 */}
        <div className="d-flex flex-column m-auto w-100">
          {/* 상품 추가 버튼 - 오른쪽 정렬 */}
          <div className="d-flex justify-content-end mb-4">
            <button
              className="btn btn-outline-primary"
              onClick={() => {
                moveToAdd();
              }}
            >
              상품 추가
            </button>
          </div>
          {serverData.dtoList.map((product) => (
            <div
              className="d-flex flex-column flex-md-row align-items-center mb-4 p-2 border rounded justify-content-between"
              key={product.pno}
            >
              {/* 상품 이미지 */}
              <div className="d-flex justify-content-center ">
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
                    width: "70px",
                    height: "70px",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div className="d-flex align-items-center  w-100 m-auto justify-content-center  ">
                <h5 className="w-25 text-center m-0">{product.brand}</h5>
                <h5 className="w-25 text-center m-0">{product.pname}</h5>
                <h5 className="w-25 text-center m-0 ">
                  {product.options[0].price.toLocaleString()}원
                </h5>
              </div>
              <div className="d-flex gap-2 justify-content-center align-content-center w-25">
                <button
                  className="btn btn-outline-success"
                  onClick={() => moveToModify(product.pno)}
                >
                  수정
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => btnClickDelete(product)}
                >
                  삭제
                </button>
              </div>
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
      <PageComponent
        serverData={serverData}
        moveToList={moveToAdminProductList}
      />
    </section>
  );
};

export default AdminListComponent;

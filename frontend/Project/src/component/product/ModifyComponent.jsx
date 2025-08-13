import { useEffect, useRef, useState } from "react";
import { API_SERVER_HOST, getOne, putModify } from "../../api/productApi";
import useCustomMove from "../../hook/useCustomMove";
import { useParams } from "react-router-dom";

const host = API_SERVER_HOST;

const initState = {
  pno: 0,
  brand: "",
  pname: "",
  pdesc: "",
  uploadFileNames: [],
  options: [],
};

const ModifyComponent = () => {
  const [product, setProduct] = useState(initState);
  const { pno } = useParams();
  const uploadRef = useRef();
  const { moveToAdminList } = useCustomMove();

  const handleChangeProduct = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 데이터 가져오기
  useEffect(() => {
    getOne(pno).then((data) => {
      console.log(data);
      setProduct(data);
    });
  }, [pno]);

  // 수정버튼 클릭 시
  const handleClickModify = async (e) => {
    e.preventDefault();

    const files = uploadRef.current.files;

    // 기존 파일과 새로 추가한 파일 둘 다 없으면 경고
    if (
      (!product.uploadFileNames || product.uploadFileNames.length === 0) &&
      (!files || files.length === 0)
    ) {
      alert(
        "기존 이미지가 없고 새로 추가한 이미지도 없습니다. 이미지를 한 개 이상 업로드해야 합니다."
      );
      return;
    }

    const formData = new FormData();
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
    }

    const productDTO = {
      pno: product.pno,
      brand: product.brand,
      pname: product.pname,
      pdesc: product.pdesc,
      uploadFileNames: product.uploadFileNames,
      options: product.options,
    };

    formData.append(
      "productDTO",
      new Blob([JSON.stringify(productDTO)], { type: "application/json" })
    );

    try {
      putModify(pno, formData);
      alert("수정 성공!");
      moveToAdminList();
    } catch (err) {
      console.error(err);
      alert("수정 실패. 다시 시도해주세요.");
    }
  };
  // 이전 이미지 삭제버튼
  const deleteOldImages = (imageName) => {
    const resultFileNames = product.uploadFileNames.filter(
      (fileName) => fileName !== imageName
    );
    setProduct((prev) => ({
      ...prev,
      uploadFileNames: resultFileNames,
    }));
  };
  return (
    <section className="py-5">
      <div className="container px-4 px-lg-5 ">
        <div className="text-center mb-5">
          <h1 className=" mb-5">상품 관리</h1>
          <hr />
        </div>
        <form onSubmit={handleClickModify} className="d-flex flex-column gap-4">
          {/* 브랜드명 + 상품명 입력 */}
          <div className="row mb-3 align-items-center text-center">
            <label className="col-sm-3 col-form-label fs-5">
              브랜드 / 상품명
            </label>
            <div className="col-sm-4">
              <input
                type="text"
                name="brand"
                className="form-control"
                placeholder="브랜드명"
                value={product.brand || ""}
                onChange={handleChangeProduct}
                required
              />
            </div>
            <div className="col-sm-5">
              <input
                type="text"
                name="pname"
                className="form-control"
                placeholder="상품명"
                value={product.pname || ""}
                onChange={handleChangeProduct}
                required
              />
            </div>
          </div>

          {/* 설명 */}
          <div className="row mb-3 text-center">
            <label className="col-sm-3 col-form-label fs-5 ">설명</label>
            <div className="col-sm-9">
              <textarea
                name="pdesc"
                className="form-control"
                value={product.pdesc}
                onChange={handleChangeProduct}
                rows="7"
                required
                placeholder="상품 설명을 적어주세요."
              />
            </div>
          </div>
          {/* 옵션 */}
          <div>
            {product.options.map((opt, idx) => (
              <div
                key={idx}
                className="d-flex align-items-center justify-content-center text-center mb-3"
              >
                {/* 옵션 번호 */}
                <label className="col-sm-3 col-form-label fs-5">
                  옵션{idx + 1}
                </label>
                <div
                  className="d-flex w-100 gap-1 justify-content-around align-content-center border p-2"
                  style={{ borderRadius: "10px" }}
                >
                  {/* 용량 */}
                  <div className="d-flex align-items-center flex-grow-1">
                    <label className="text-muted w-50">용량(ml)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={opt.perfumeVol === 0 ? "" : opt.perfumeVol}
                      required
                      onChange={(e) => {
                        const newOptions = [...product.options];
                        newOptions[idx].perfumeVol =
                          parseInt(e.target.value) || 0;
                        setProduct({ ...product, options: newOptions });
                      }}
                    />
                  </div>
                  {/* 가격 */}
                  <div className="d-flex align-items-center flex-grow-1">
                    <label className="text-muted w-25">가격</label>
                    <input
                      type="number"
                      className="form-control w-75"
                      value={opt.price === 0 ? "" : opt.price}
                      required
                      onChange={(e) => {
                        const newOptions = [...product.options];
                        newOptions[idx].price = parseInt(e.target.value) || 0;
                        setProduct({ ...product, options: newOptions });
                      }}
                    />
                  </div>

                  {/* 재고 */}
                  <div className="d-flex align-items-center flex-grow-1">
                    <label className="text-muted w-25">재고</label>
                    <input
                      type="number"
                      className="form-control"
                      value={opt.stock === 0 ? "" : opt.stock}
                      required
                      onChange={(e) => {
                        const newOptions = [...product.options];
                        newOptions[idx].stock = parseInt(e.target.value) || 0;
                        setProduct({ ...product, options: newOptions });
                      }}
                    />
                  </div>

                  {/* 삭제 버튼 */}
                  <div className="text-center" style={{ width: "15%" }}>
                    {product.options.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-outline-danger w-50"
                        onClick={() => {
                          const newOptions = product.options.filter(
                            (_, i) => i !== idx
                          );
                          setProduct({ ...product, options: newOptions });
                        }}
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="col-sm-3 col-form-label fs-5 text-center">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => {
                  const newOptions = [
                    ...product.options,
                    { price: 0, stock: 0, perfumeVol: 0 },
                  ];
                  setProduct({ ...product, options: newOptions });
                }}
              >
                옵션 추가
              </button>
            </div>
          </div>
          {/* 이미지 업로드 */}

          <div className="d-flex text-center">
            <label className="col-sm-3 col-form-label fs-5">상품 이미지</label>
            <div className="d-flex flex-column gap-3 w-100">
              {product.uploadFileNames.map((imgFile, i) => (
                <div
                  key={i}
                  className="d-flex w-100 gap-1 justify-content-around align-items-center border p-2"
                  style={{ borderRadius: "10px" }}
                >
                  <div className="align-items-center flex-grow-1">
                    <img
                      alt="img"
                      className="img-thumbnail"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                      }}
                      src={`${host}/api/product/view/s_${imgFile}`}
                    />
                  </div>
                  <div className="flex-grow-3">
                    <span className="text-muted">{imgFile}</span>
                  </div>

                  <div className=" text-center flex-grow-1">
                    <button
                      type="button"
                      className="btn btn-outline-danger w-50"
                      onClick={() => deleteOldImages(imgFile)}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
              <div className="">
                <input
                  type="file"
                  className="form-control"
                  multiple
                  ref={uploadRef}
                />
              </div>
            </div>
          </div>

          {/* 등록 버튼 */}
          <div className="text-center">
            <button type="submit" className="btn btn-dark px-4 py-2">
              수정하기
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
export default ModifyComponent;

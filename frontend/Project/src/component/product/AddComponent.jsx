import { useRef, useState } from "react";
import { postAdd } from "../../api/productApi";

const initState = {
  pname: "",
  price: 0,
  pdesc: "",
  stock: 0,
  perfumeVol: 0,
  files: [],
};

const AddComponent = () => {
  const [product, setProduct] = useState(initState);
  const uploadRef = useRef();

  const handleChangeProduct = (e) => {
    product[e.target.name] = e.target.value;
    setProduct({ ...product });
  };

  const handleClickAdd = (e) => {
    e.preventDefault(); // 새로고침 방지
    const files = uploadRef.current.files;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    formData.append("pname", product.pname);
    formData.append("price", product.price);
    formData.append("pdesc", product.pdesc);
    formData.append("stock", product.stock);
    formData.append("perfumeVol", product.perfumeVol);

    console.log(formData);
    postAdd(formData);
  };

  return (
    <section className="py-5">
      <div className="container px-4 px-lg-5">
        <div className="text-center mb-5">
          <h1 className=" mb-5">상품 추가</h1>
          <hr />
        </div>
        <form onSubmit={handleClickAdd}>
          {/* 상품명 */}
          <div className="row mb-3 align-items-center text-center">
            <label className="col-sm-3 col-form-label fs-5">상품명</label>
            <div className="col-sm-9">
              <input
                type="text"
                name="pname"
                className="form-control"
                value={product.pname}
                onChange={handleChangeProduct}
                required
              />
            </div>
          </div>

          {/* 가격 */}
          <div className="row mb-3 align-items-center text-center">
            <label className="col-sm-3 col-form-label fs-5">가격</label>
            <div className="col-sm-9">
              <input
                type="number"
                name="price"
                className="form-control"
                value={product.price}
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
                rows="3"
                required
              />
            </div>
          </div>

          {/* 재고 */}
          <div className="row mb-3 align-items-center text-center">
            <label className="col-sm-3 col-form-label fs-5">재고</label>
            <div className="col-sm-9">
              <input
                type="number"
                name="stock"
                className="form-control"
                value={product.stock}
                onChange={handleChangeProduct}
                required
              />
            </div>
          </div>

          {/* 용량 */}
          <div className="row mb-3 align-items-center text-center">
            <label className="col-sm-3 col-form-label fs-5">용량 (ml)</label>
            <div className="col-sm-9">
              <input
                type="number"
                name="perfumeVol"
                className="form-control"
                value={product.perfumeVol}
                onChange={handleChangeProduct}
                required
              />
            </div>
          </div>

          {/* 이미지 업로드 */}
          <div className="row mb-4 text-center">
            <label className="col-sm-3 col-form-label fs-5">상품 이미지</label>
            <div className="col-sm-9">
              <input
                type="file"
                className="form-control"
                multiple
                ref={uploadRef}
              />
            </div>
          </div>

          {/* 등록 버튼 */}
          <div className="text-center">
            <button type="submit" className="btn btn-dark px-4 py-2">
              등록하기
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddComponent;

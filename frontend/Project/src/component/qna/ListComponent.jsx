import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useCustomLogin from "../../hook/useCustomLogin";
import "./ListComponent.css";
import "../../App.css";
import qnaDummy from "../../data/qnaDummy";


  
  const ListComponent = () => {
  const isAdmin = true;
  const [qnaList, setQnaList] = useState([]);
  const { exceptionHandle, loginState } = useCustomLogin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loginState || !loginState.userId) {
      // 로그인 안 된 경우 로그인 페이지로 강제 이동
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }

    axios
      .get("/qna") // 실제 API 주소 넣기
      .then((res) => {
        setQnaList(res.data);
      })
      .catch((err) => {
        exceptionHandle(err); // 에러 공통 처리
      });
  }, [loginState, navigate, exceptionHandle]);

  return (
    <section className="py-5">
      <div className="container px-4 px-lg-5">
        <div className="mb-5">
          <h1 className="text-center mb-5">Q&A</h1>
          <hr />
        </div>

        <div className="text-center mb-5">
          <h2>궁금한 점을 남겨주세요</h2>
          <h6>제품, 배송, 교환 등 모든 문의 환영합니다 🙋</h6>
        </div>

        {/* 작성 버튼 */}
        {isAdmin && (
          <div className="d-flex justify-content-end mb-4">
            <button
              className="btn btn-mz-style"
              onClick={() => alert("작성 기능은 추후 추가 예정입니다.")}
            >
              Q&A 작성
            </button>
          </div>
        )}

        {/* 리스트 카드 그리드 */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {qnaDummy.map((qna) => (
            <div key={qna.id} className="col">
              <div className="card h-100 shadow-sm text-center">
                <div className="card-body d-flex flex-column justify-content-between">
                  <Link
                    to={`/qna/${qna.id}`}
                    className="card-title h5 text-decoration-none text-dark mt-2"
                  >
                    {qna.title}
                  </Link>
                  <p className="card-text text-muted mt-3 mb-2">{qna.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ListComponent;

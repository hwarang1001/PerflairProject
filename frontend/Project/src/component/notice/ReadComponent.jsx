import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNotice, deleteNotice, modifyNotice } from "../../api/noticeApi"; // 실제 API 호출 함수
import { useSelector } from "react-redux";
import "./ReadComponent.css";

const initState = {
  title: "",
  content: "",
  createdAt: "",
  updateAt: "",
};

const ReadComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(initState);
  const loginInfo = useSelector((state) => state.login);

  // isAdmin 계산
  const isAdmin =
    loginInfo && loginInfo.roleNames && loginInfo.roleNames.includes("ADMIN");

  useEffect(() => {
    getNotice(id).then((data) => {
      setNotice(data);
    });
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await deleteNotice(id);
        alert("삭제되었습니다.");
        navigate("/notice");
      } catch (error) {
        alert("삭제 실패");
        console.error(error);
      }
    }
  };

  return (
    <section className="py-5">
      <div className="container px-4 px-lg-5">
        <div className="mb-5">
          <h1 className="text-center mb-5">공지사항</h1>
          <hr />
        </div>

        <div className="container-sm mt-5">
          <h2>{notice.title}</h2>
          <p className="notice-date">
            {notice.updateAt
              ? `${notice.updateAt}`
              : `${notice.createdAt}`}
          </p>

          <p className="notice-content">{notice.content}</p>

          <div className="notice-button-row mt-5">
            <div className="button-back-left">
              <button
                className="btn btn-secondary btn-fixed-width"
                onClick={() => navigate("/notice")}
              >
                목록으로 돌아가기
              </button>
            </div>

            {/* ✅ 관리자만 수정/삭제 버튼 보이기 */}
            {isAdmin && (
              <div className="button-group-right">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => navigate(`/notice/edit/${notice.noticeId}`)}
                >
                  수정
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={handleDelete}
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReadComponent;

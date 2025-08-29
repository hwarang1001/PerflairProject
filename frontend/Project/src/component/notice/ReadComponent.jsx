import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNotice, deleteNotice, modifyNotice } from "../../api/noticeApi";
import { useSelector } from "react-redux";
import "./ReadComponent.css";

/*
  - 공지 한 개의 상세 내용
  - 어떤 공지를 볼지: URL의 id 값을 사용
  - 화면에 보여줄 것: 제목, 내용, 날짜
  - 관리자 계정이면: 수정/삭제 버튼도 함께 보임
*/
const initState = {
  title: "",
  content: "",
  createdAt: "",
  updateAt: "",
};

const ReadComponent = () => {
  const { id } = useParams(); // /notice/:id 에서 id 꺼내기
  const navigate = useNavigate(); // 다른 화면으로 이동할 때 사용
  const [notice, setNotice] = useState(initState); // 공지 상세 데이터 상태

  // 로그인 정보에서 역할 목록을 읽고, ADMIN 포함 여부 확인
  const loginInfo = useSelector((state) => state.login);
  const isAdmin =
    loginInfo && loginInfo.roleNames && loginInfo.roleNames.includes("ADMIN");

  // 화면이 열리거나 id가 바뀔 때, 서버에서 공지 상세를 가져와 상태에 담음
  useEffect(() => {
    getNotice(id).then((data) => {
      setNotice(data);
    });
  }, [id]);

  // 삭제 버튼 클릭 시 동작
  // - 정말 삭제할지 한 번 확인
  // - 성공하면 알림 후 목록으로 이동
  // - 실패하면 실패 알림
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
        {/* 상단 제목 영역 */}
        <div className="mb-5">
          <h1 className="text-center mb-5">공지사항</h1>
          <hr />
        </div>

        {/* 본문 내용 영역 */}
        <div className="container-sm mt-5">
          {/* 공지 제목 */}
          <h2>{notice.title}</h2>

          {/* 날짜 표시: 수정일(updateAt)이 있으면 그 값을, 없으면 작성일(createdAt) */}
          <p className="notice-date">
            {notice.updateAt ? `${notice.updateAt}` : `${notice.createdAt}`}
          </p>

          {/* 공지 내용: 텍스트 기준으로 표시 */}
          <p className="notice-content">{notice.content}</p>

          {/* 하단 버튼 묶음: 목록으로 + (관리자 전용) 수정/삭제 */}
          <div className="notice-button-row mt-5">
            {/* 목록으로 이동 */}
            <div className="button-back-left">
              <button
                className="btn btn-secondary btn-fixed-width"
                onClick={() => navigate("/notice")}
              >
                목록으로 돌아가기
              </button>
            </div>

            {/* 관리자 전용 버튼: 수정/삭제 */}
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

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ReadComponent.css";

// 같은 더미 데이터 (실제로는 공용 mock 파일로 분리 가능)
const dummyNotices = [
  {
    id: 1,
    title: "서비스 점검 안내",
    content: "8월 10일 점검 예정입니다.",
    date: "2025-08-01",
  },
  {
    id: 2,
    title: "신규 기능 출시!",
    content: "많은 이용 바랍니다.",
    date: "2025-07-25",
  },
  {
    id: 3,
    title: "여름 휴무 일정 안내",
    content: "8월 15~17일 휴무입니다.",
    date: "2025-07-10",
  },
];

const ReadComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAdmin = true;

  const notice = dummyNotices.find((n) => n.id === Number(id));

  if (!notice) {
    return <p>해당 공지사항을 찾을 수 없습니다.</p>;
  }

  return (
    <div className="notice-detail-container">
      <h2>{notice.title}</h2>
      <p className="notice-date">작성일: {notice.date}</p>
      <p className="notice-content">{notice.content}</p>

      {isAdmin && (
        <div className="notice-admin-buttons">
          <button onClick={() => alert("수정 기능은 나중에 구현")}>수정</button>
          <button onClick={() => alert("삭제 기능은 나중에 구현")}>삭제</button>
        </div>
      )}

      <button onClick={() => navigate("/notice")} className="back-button">
        목록으로 돌아가기
      </button>
    </div>
  );
};

export default ReadComponent;

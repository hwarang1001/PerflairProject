import React from "react";
import { Link } from "react-router-dom";
import "./ListComponent.css";

// 가짜 공지 데이터
const dummyNotices = [
  { id: 1, title: "서비스 점검 안내", date: "2025-08-01" },
  { id: 2, title: "신규 기능 출시!", date: "2025-07-25" },
  { id: 3, title: "여름 휴무 일정 안내", date: "2025-07-10" },
];

const ListComponent = () => {
  // 관리자 여부는 임시로 true (나중에 사용자 권한에 따라 분기 처리)
  const isAdmin = true;

  return (
    <div className="notice-list-container">
      <h2>공지사항</h2>

      {isAdmin && (
        <div className="notice-admin-actions">
          <button onClick={() => alert("작성 페이지는 나중에 구현!")}>
            공지사항 작성
          </button>
        </div>
      )}

      <ul className="notice-list">
        {dummyNotices.map((notice) => (
          <li key={notice.id}>
            <Link to={`/notice/${notice.id}`} className="notice-title">
              {notice.title}
            </Link>
            <span className="notice-date">{notice.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListComponent;

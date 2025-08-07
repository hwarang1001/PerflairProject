// ListComponent.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./ListComponent.css";
import "../../App.css";

const dummyNotices = [
  { id: 1, title: "신제품 출시 안내", date: "2025-08-01" },
  { id: 2, title: "한정판 컬렉션 예약 판매 시작", date: "2025-07-25" },
  { id: 3, title: "여름 휴무 및 배송 일정 안내", date: "2025-07-10" },
  { id: 4, title: "회원 전용 할인 이벤트 진행 중", date: "2025-06-30" },
  { id: 5, title: "향수 사용법 및 관리 팁 공유", date: "2025-06-15" },
  { id: 6, title: "공식 매장 리뉴얼 오픈 안내", date: "2025-06-01" },
  { id: 7, title: "고객 설문조사 참여 이벤트 당첨자 발표", date: "2025-05-20" },
  { id: 8, title: "신규 리뷰 영상 공개", date: "2025-05-10" },
  { id: 9, title: "무료 샘플 신청 서비스 재개", date: "2025-04-25" },
];

const ListComponent = () => {
  const isAdmin = true;

  return (
    <section className="py-5">
      <div className="container px-4 px-lg-5">
        <div className="mb-5">
          <h1 className="text-center mb-5">공지사항</h1>
          <hr />
        </div>

        <div className="text-center mb-5">
          <h2>최신 소식을 확인하세요</h2>
          <h6>업데이트, 이벤트, 점검 안내 등 📢</h6>
        </div>

        {isAdmin && (
          <div className="d-flex justify-content-end mb-4">
            <button
              className="btn btn-mz-style"
              onClick={() => alert("작성 페이지는 나중에 구현!")}
            >
              공지사항 작성
            </button>
          </div>
        )}

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {dummyNotices.map((notice) => (
            <div key={notice.id} className="col">
              <div className="card h-100 shadow-sm text-center">
                <div className="card-body d-flex flex-column justify-content-between">
                  <Link
                    to={`/notice/${notice.id}`}
                    className="card-title h5 text-decoration-none text-dark mt-2"
                  >
                    {notice.title}
                  </Link>
                  <p className="card-text text-muted mt-3 mb-2">
                    {notice.date}
                  </p>
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

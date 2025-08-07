import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ReadComponent.css";

const dummyNotices = [
  {
    id: 1,
    title: "신제품 출시 안내",
    content: "곧 새로운 향수 컬렉션이 출시됩니다. 많은 관심 부탁드립니다.",
    date: "2025-08-01",
  },
  {
    id: 2,
    title: "한정판 컬렉션 예약 판매 시작",
    content: "한정판 향수 예약 판매가 시작되었습니다. 서둘러 주세요!",
    date: "2025-07-25",
  },
  {
    id: 3,
    title: "여름 휴무 및 배송 일정 안내",
    content: "8월 15일부터 17일까지 휴무로 배송이 지연될 수 있습니다.",
    date: "2025-07-10",
  },
  {
    id: 4,
    title: "회원 전용 할인 이벤트 진행 중",
    content:
      "회원님들을 위한 특별 할인 이벤트가 진행 중입니다. 지금 확인해 보세요!",
    date: "2025-06-30",
  },
  {
    id: 5,
    title: "향수 사용법 및 관리 팁 공유",
    content: "더 오래 향기를 즐길 수 있는 향수 관리법을 안내해드립니다.",
    date: "2025-06-15",
  },
  {
    id: 6,
    title: "공식 매장 리뉴얼 오픈 안내",
    content: "매장이 새롭게 리뉴얼 오픈하였습니다. 방문을 환영합니다.",
    date: "2025-06-01",
  },
  {
    id: 7,
    title: "고객 설문조사 참여 이벤트 당첨자 발표",
    content: "설문조사 참여 고객 대상 이벤트 당첨자를 발표합니다.",
    date: "2025-05-20",
  },
  {
    id: 8,
    title: "신규 리뷰 영상 공개",
    content: "새롭게 공개된 리뷰 영상을 통해 제품을 자세히 확인하세요.",
    date: "2025-05-10",
  },
  {
    id: 9,
    title: "무료 샘플 신청 서비스 재개",
    content: "무료 샘플 신청 서비스가 다시 시작되었습니다. 지금 신청하세요.",
    date: "2025-04-25",
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
    <section className="py-5">
      <div className="container px-4 px-lg-5">
        {/* ListComponent 상단 동일 UI */}
        <div className="mb-5">
          <h1 className="text-center mb-5">공지사항</h1>
          <hr />
        </div>

        {/* Read 내용 영역 */}
        <div className="container-sm mt-5">
          <h2>{notice.title}</h2>
          <p className="notice-date">작성일: {notice.date}</p>
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

            {isAdmin && (
              <div className="button-group-right">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => alert("수정 기능은 나중에 구현")}
                >
                  수정
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => alert("삭제 기능은 나중에 구현")}
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

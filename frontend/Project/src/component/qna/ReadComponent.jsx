import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import qnaDummy from "../../data/qnaDummy"; 
import "./ReadComponent.css";

const ReadComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAdmin = true;

  const qna = qnaDummy.find((q) => q.id === Number(id));

  if (!qna) {
    return <p className="text-center">해당 질문을 찾을 수 없습니다.</p>;
  }

  return (
    <section className="py-5">
      <div className="container px-4 px-lg-5">
        {/* 상단 타이틀 */}
        <div className="mb-5 text-center">
          <h1 className="mb-5">Q&A</h1>
          <hr />
        </div>

        {/* QnA 본문 */}
        <div className="container-sm mt-5">
          <h2>{qna.title}</h2>
          <p className="notice-date">작성일: {qna.date}</p>
          <p className="notice-content">{qna.content}</p>

          {/* 답변 유무에 따른 UI */}
          {qna.answer ? (
            <div className="qna-answer-section">
              <h5>답변</h5>
              <p>{qna.answer}</p>
              <p className="qna-answer-meta">
                {qna.answeredAt} | 답변자: {qna.answeredBy}
              </p>
            </div>
          ) : (
            <div className="qna-answer-empty">
              📭 아직 등록된 답변이 없습니다.
            </div>
          )}

          {/* 하단 버튼 */}
          <div className="notice-button-row mt-5">
            <div className="button-back-left">
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/qna")}
              >
                목록으로 돌아가기
              </button>
            </div>

            {isAdmin && (
              <div className="button-group-right">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => alert("수정 기능은 준비 중입니다.")}
                >
                  수정
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => alert("삭제 기능은 준비 중입니다.")}
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

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import qnaDummy from "../../data/qnaDummy";
import "./ReadComponent.css";

const ReadComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isAdmin = true; // TODO: 로그인 연동 후 실제 admin 여부 판단

  const qna = qnaDummy.find((q) => q.id === Number(id));
  const [answer, setAnswer] = useState(""); // 관리자 답변 입력용
  const [hasAnswered, setHasAnswered] = useState(!!qna?.answer);

  if (!qna) return <p>존재하지 않는 질문입니다.</p>;

  const handleAnswerSubmit = () => {
    alert(`답변 저장: ${answer}`);
    setHasAnswered(true);
    // 실제 API 연동 시 서버로 전송
  };

  return (
    <div className="qna-detail-container">
      <h2 className="qna-detail-title">{qna.title}</h2>
      <div className="qna-detail-meta">
        <span>작성자: {qna.author}</span>
        <span>작성일: {qna.date}</span>
      </div>

      <p className="qna-detail-content">{qna.content}</p>

      <div className="qna-answer-section">
        <h3>답변</h3>
        {hasAnswered ? (
          <div className="qna-answer-box">
            <p>{qna.answer}</p>
            <p className="qna-answer-meta">
              답변자: {qna.answeredBy} | {qna.answeredAt}
            </p>
          </div>
        ) : isAdmin ? (
          <div className="qna-answer-form">
            <textarea
              placeholder="답변 내용을 입력하세요"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <button onClick={handleAnswerSubmit}>답변 등록</button>
          </div>
        ) : (
          <p className="qna-waiting">답변 대기 중입니다.</p>
        )}
      </div>

      <button className="qna-back-button" onClick={() => navigate("/qna")}>
        목록으로 돌아가기
      </button>
    </div>
  );
};

export default ReadComponent;

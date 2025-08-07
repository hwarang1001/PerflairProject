import { Link } from "react-router-dom";
import qnaDummy from "../../data/qnaDummy";
import "./ListComponent.css";

const ListComponent = () => {
  return (
    <div className="qna-list-container">
      <h2 className="qna-title">Q&A 게시판</h2>

      <div className="qna-write-button-wrap">
        <Link to="/qna/write" className="qna-write-button">
          질문 작성하기
        </Link>
      </div>

      <ul className="qna-list">
        {qnaDummy.map((qna) => (
          <li key={qna.id} className="qna-item">
            <Link to={`/qna/${qna.id}`} className="qna-link">
              <div className="qna-question-title">{qna.title}</div>
              <div className="qna-meta">
                <span>작성자: {qna.author}</span>
                <span>작성일: {qna.date}</span>
                <span
                  className={`qna-status ${
                    qna.answer ? "answered" : "waiting"
                  }`}
                >
                  {qna.answer ? "답변 완료" : "대기 중"}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListComponent;

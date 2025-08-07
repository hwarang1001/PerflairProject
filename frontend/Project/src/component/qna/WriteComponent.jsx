import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WriteComponent.css";

const WriteComponent = () => {
  const navigate = useNavigate();

  // 임시 로그인 사용자 이름
  const currentUser = "user999";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    alert("질문이 등록되었습니다. (임시)");
    // 실제 서버 전송 대신 console.log
    console.log({
      title,
      content,
      author: currentUser,
      date: new Date().toISOString().split("T")[0],
    });

    // 질문 목록으로 이동
    navigate("/qna");
  };

  return (
    <div className="qna-write-container">
      <h2>질문 작성</h2>
      <form onSubmit={handleSubmit} className="qna-write-form">
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="질문 내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <button type="submit">등록하기</button>
      </form>
    </div>
  );
};

export default WriteComponent;

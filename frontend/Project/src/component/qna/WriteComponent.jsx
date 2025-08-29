import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getQna, postQna, modifyQna } from "../../api/qnaApi";
import "./WriteComponent.css";

/*
  Q&A 작성/수정 화면
  - 모드 결정 -> URL의 id 존재 여부로 분기(isEdit)
  - 수정 모드 -> 기존 제목/내용을 불러와 입력칸에 채움
  - 작성 모드 -> 빈 입력칸에서 시작
  - 제출 흐름 -> 제목/내용 공백 체크 -> (수정) modifyQna | (작성) postQna -> 목록으로 이동
*/
const WriteComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // /qna/edit/:id 같은 경로에서 id 추출
  const isEdit = !!id; // id가 있으면 true -> 수정 모드

  // 폼 입력 상태
  const [title, setTitle] = useState(""); // 제목
  const [content, setContent] = useState(""); // 내용
  const [loading, setLoading] = useState(false); // 서버 통신 중 비활성화용

  // 수정 모드일 때 기존 데이터 불러오기
  // - 화면 최초 진입 또는 id 변경 시 실행
  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      (async () => {
        try {
          const qna = await getQna(id); // 단건 조회
          if (qna) {
            setTitle(qna.title); // 응답값으로 제목 채움
            setContent(qna.content); // 응답값으로 내용 채움
          } else {
            alert("해당 질문을 찾을 수 없습니다.");
            navigate("/qna");
          }
        } catch (error) {
          console.error("Q&A 불러오기 실패:", error);
          alert("질문을 불러오는 중 오류가 발생했습니다.");
          navigate("/qna");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id, isEdit, navigate]);

  // 작성/수정 제출
  // - 공백 입력 방지 -> trim으로 간단 확인
  // - isEdit 기준으로 API 분기
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      if (isEdit) {
        await modifyQna(id, { title, content }); // PUT /api/qna/:id
        alert("질문이 수정되었습니다.");
      } else {
        await postQna({ title, content }); // POST /api/qna
        alert("질문이 등록되었습니다.");
      }
      navigate("/qna"); // 완료 후 목록으로 이동
    } catch (error) {
      alert("저장 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  return (
    <section className="py-5">
      <div className="container px-4 px-lg-5">
        {/* 상단 타이틀 -> 모드에 따라 문구 변경 */}
        <div className="mb-5">
          <h1 className="text-center mb-5">
            {isEdit ? "Q&A 수정" : "Q&A 작성"}
          </h1>
          <hr />
        </div>

        {/* 입력 폼 -> 제목/내용, 하단 버튼 */}
        <div className="qna-form-wrapper">
          <form onSubmit={handleSubmit}>
            {/* 제목 입력 */}
            <div className="mb-4">
              <label htmlFor="title" className="form-label">
                제목
              </label>
              <input
                type="text"
                id="title"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="질문 제목을 입력하세요"
                disabled={loading} // 로딩 중 입력 잠금
              />
            </div>

            {/* 내용 입력 */}
            <div className="mb-5">
              <label htmlFor="content" className="form-label">
                내용
              </label>
              <textarea
                id="content"
                className="form-control"
                rows="10"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="질문 내용을 입력하세요"
                disabled={loading} // 로딩 중 입력 잠금
              />
            </div>

            {/* 하단 버튼 -> 목록으로 / 작성·수정 완료 */}
            <div className="qna-btn-row">
              <button
                type="button"
                className="btn btn-mz-outline"
                onClick={() => navigate("/qna")}
                disabled={loading}
              >
                목록으로 돌아가기
              </button>
              <button
                type="submit"
                className="btn btn-mz-style"
                disabled={loading}
              >
                {isEdit ? "수정 완료" : "작성 완료"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default WriteComponent;

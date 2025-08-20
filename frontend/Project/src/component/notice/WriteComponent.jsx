import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getNotice, postNotice, modifyNotice } from "../../api/noticeApi"; // 실제 API 호출 함수
import "./WriteComponent.css";

const WriteComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      (async () => {
        try {
          const notice = await getNotice(id);
          if (notice) {
            setTitle(notice.title);
            setContent(notice.content);
          } else {
            alert("해당 공지사항을 찾을 수 없습니다.");
            navigate("/notice");
          }
        } catch (error) {
          console.error("공지사항 불러오기 실패:", error);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id, isEdit, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      if (isEdit) {
        await modifyNotice(id, { title, content });
        alert("공지사항이 수정되었습니다.");
      } else {
        await postNotice({ title, content });
        alert("공지사항이 등록되었습니다.");
      }
      navigate("/notice");
    } catch (error) {
      alert("오류가 발생했습니다.");
      console.error(error);
    }
  };

  return (
    <section className="py-5">
      <div className="container px-4 px-lg-5">
        {/* ✅ 헤더 부분 통일 */}
        <div className="mb-5">
          <h1 className="text-center mb-5">
            {isEdit ? "공지사항 수정" : "공지사항 작성"}
          </h1>
          <hr />
        </div>

        <div className="notice-form-wrapper">
          <form onSubmit={handleSubmit}>
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
                placeholder="공지 제목을 입력하세요"
              />
            </div>

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
                placeholder="공지 내용을 입력하세요"
              />
            </div>

            <div className="notice-btn-row">
              <button
                type="button"
                className="btn btn-mz-outline"
                onClick={() => navigate("/notice")}
              >
                목록으로 돌아가기
              </button>
              <button type="submit" className="btn btn-mz-style">
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

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getNotice, postNotice, modifyNotice } from "../../api/noticeApi";
import "./WriteComponent.css";

/*
  공지사항 작성/수정 화면
  - 모드 결정 -> URL 파라미터의 id 존재 여부로 판단(isEdit)
  - 수정 모드 -> 최초 로딩 시 서버에서 기존 제목/내용을 가져와 입력칸에 채움
  - 작성 모드 -> 빈 입력칸에서 시작
  - 제출 흐름 -> 필수값 확인 -> (작성) postNotice | (수정) modifyNotice -> 목록 페이지로 이동
*/
const WriteComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id; // id가 있으면 수정 모드, 없으면 작성 모드

  // 폼 입력 상태
  const [title, setTitle] = useState(""); // 제목 입력값
  const [content, setContent] = useState(""); // 내용 입력값
  const [loading, setLoading] = useState(false); // 서버 통신 중 UI 비활성화를 위한 플래그

  // 수정 모드일 때 기존 데이터 로드
  // - 서버에서 상세를 받아와 제목/내용 입력칸에 세팅
  // - 데이터가 없을 경우 간단 안내 후 목록으로 복귀
  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    (async () => {
      try {
        const notice = await getNotice(id);
        if (!notice) {
          alert("해당 공지사항을 찾을 수 없습니다.");
          navigate("/notice");
          return;
        }
        setTitle(notice.title || ""); // title 미존재 대비 기본값 처리
        setContent(notice.content || ""); // content 미존재 대비 기본값 처리
      } catch (error) {
        console.error("공지사항 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit, navigate]);

  // 제출 처리
  // - 공통 검증 -> 제목/내용 공백 제거 후 비어 있으면 안내
  // - 분기 -> isEdit 기준으로 modifyNotice | postNotice 호출
  // - 성공 시 공용 안내 문구 후 목록으로 이동
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
        {/* 화면 타이틀 -> 모드에 따라 문구 변경 */}
        <div className="mb-5">
          <h1 className="text-center mb-5">
            {isEdit ? "공지사항 수정" : "공지사항 작성"}
          </h1>
          <hr />
        </div>

        {/* 입력 폼 래퍼 */}
        <div className="notice-form-wrapper">
          <form onSubmit={handleSubmit}>
            {/* 제목 입력칸 -> 로딩 중에는 편집 불가 */}
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
                disabled={loading}
              />
            </div>

            {/* 내용 입력칸 -> 여러 줄 입력, 로딩 중 비활성화 */}
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
                disabled={loading}
              />
            </div>

            {/* 하단 버튼 영역
               - 목록으로 돌아가기 -> 단순 네비게이션
               - 작성/수정 완료 -> handleSubmit으로 처리
               - 로딩 중에는 버튼 비활성화로 중복 제출 방지 */}
            <div className="notice-btn-row">
              <button
                type="button"
                className="btn btn-mz-outline"
                onClick={() => navigate("/notice")}
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

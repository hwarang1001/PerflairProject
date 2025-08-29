import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQna, deleteQna } from "../../api/qnaApi";
import { createAnswer, updateAnswer } from "../../api/answerApi";
import { useSelector } from "react-redux";
import "./ReadComponent.css";

/*
  Q&A 상세 화면
  - 목적 -> 질문 제목/내용 표시, 답변 조회/등록/수정, 삭제
  - 권한 -> ADMIN이면 답변 등록/수정 가능, 작성자이면 미답변일 때 수정/삭제 버튼 노출
  - id 소스 -> props.id 우선, 없으면 URL 파라미터(id)
*/
const initState = {
  title: "",
  content: "",
  userId: "",
  // 답변 표시/수정용 필드
  answer: "",
  answerId: null, // 답변 수정 시 필요
  answeredAt: "",
  answeredBy: "",
  createdAt: "",
};

const ReadComponent = ({ id }) => {
  const navigate = useNavigate();

  // 로그인 정보에서 권한/사용자 아이디 읽기
  const loginInfo = useSelector((state) => state.login);
  const isAdmin = loginInfo?.roleNames?.includes("ADMIN");
  const userId = loginInfo?.userId;

  // URL 파라미터와 props 둘 다 대응 -> props.id가 있으면 우선 사용
  const { id: idParam } = useParams();
  const qnaId = id ?? idParam;

  // 화면 상태
  const [qna, setQna] = useState(initState); // 질문/답변 데이터 묶음
  const [isAnswering, setIsAnswering] = useState(false); // 답변 입력 폼 토글
  const [answerText, setAnswerText] = useState(""); // 답변 입력값
  const [loading, setLoading] = useState(false); // 상세 불러오는 중
  const [saving, setSaving] = useState(false); // 답변 저장 중

  // 상세 조회 -> 서버 응답 모양이 달라도 안전하게 매핑
  const fetchQna = async () => {
    if (!qnaId) return;
    setLoading(true);
    try {
      const data = await getQna(qnaId);

      // 답변 객체 후보 -> answerObj 우선, 없으면 answer가 객체일 때 사용
      const ansObj =
        data?.answerObj ??
        (typeof data?.answer === "object" ? data.answer : null);

      // 답변 본문 -> answer가 문자열이면 그대로, 아니면 ansObj.content
      const answerText =
        (typeof data?.answer === "string" && data.answer) ||
        ansObj?.content ||
        "";

      // 답변 식별자 -> answerId 우선, 없으면 ansObj의 id/answerId
      const answerId = data?.answerId ?? ansObj?.answerId ?? ansObj?.id ?? null;

      // 답변 메타 -> 시간/작성자
      const answeredAt = data?.answeredAt ?? ansObj?.createdAt ?? "";
      const answeredBy =
        data?.answeredBy ?? ansObj?.adminId ?? ansObj?.userId ?? "";

      setQna({
        title: data?.title ?? "",
        content: data?.content ?? "",
        userId: data?.userId ?? "",
        answer: answerText,
        answerId,
        answeredAt,
        answeredBy,
        createdAt: data?.createdAt ?? "",
      });
    } catch (e) {
      console.error(e);
      alert("질문을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 화면 진입/아이디 변경 시 상세 재조회
  useEffect(() => {
    fetchQna();
  }, [qnaId]);

  // 작성자 여부
  const isAuthor = qna?.userId === userId;

  // 답변 존재 여부 -> 본문/answerId/answeredAt 중 하나만 있어도 true
  const hasAnswer = Boolean(
    (qna.answer && qna.answer.trim()) || qna.answerId || qna.answeredAt
  );

  // 답변 등록/수정 제출
  // - 서버 규약 -> 본문 키는 content
  // - 기존 답변이 있으면 수정, 없으면 등록
  const handleAnswerSubmit = async () => {
    const body = answerText.trim();
    if (!body) {
      alert("답변 내용을 입력해주세요.");
      return;
    }

    setSaving(true);
    try {
      if (qna.answer?.trim()) {
        // 수정 플로우
        if (!qna.answerId) {
          alert(
            "answerId가 없습니다. 단건 조회 응답에 answerId를 포함해 주세요."
          );
        } else {
          // PUT /api/answers/{answerId}
          await updateAnswer(qna.answerId, { content: body });
          alert("답변이 수정되었습니다.");
        }
      } else {
        // 등록 플로우
        // POST /api/answers/
        await createAnswer({ questionId: qnaId, content: body });
        alert("답변이 등록되었습니다.");
      }

      // 저장 후 최신 데이터로 새로 반영
      await fetchQna();
      setIsAnswering(false);
      setAnswerText("");
    } catch (e) {
      console.error(e);
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        "답변 등록/수정에 실패했습니다.";
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  // 질문 삭제 -> 확인창 후 진행, 완료 시 목록으로
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteQna(qnaId);
      alert("삭제되었습니다.");
      navigate("/qna");
    } catch (e) {
      console.error(e);
      alert("삭제 실패");
    }
  };

  return (
    <section className="py-5">
      <div className="container px-4 px-lg-5">
        {/* 상단 타이틀/구분선 */}
        <div className="mb-5 text-center">
          <h1 className="mb-5">Q&A</h1>
          <hr />
        </div>

        <div className="qna-container mt-5">
          {/* 로딩 표시 */}
          {loading ? (
            <div className="text-center py-5">불러오는 중...</div>
          ) : (
            <>
              {/* 질문 본문 */}
              <h2>{qna.title}</h2>
              <p className="qna-date">작성일: {qna.createdAt}</p>
              <div className="qna-content-slot">
                <p className="qna-content">{qna.content}</p>
              </div>

              {/* 답변 영역 */}
              {qna.answer ? (
                <div className="qna-answer-box">
                  <h5>답변</h5>

                  {/* 관리자 -> 수정 모드일 때 textarea 노출 */}
                  {isAdmin && isAnswering ? (
                    <>
                      <textarea
                        className="form-control"
                        rows={6}
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        placeholder="답변 내용을 입력하세요"
                        disabled={saving}
                      />
                      <div className="mt-3 d-flex justify-content-end gap-2">
                        <button
                          className="btn btn-mz-style"
                          onClick={handleAnswerSubmit}
                          disabled={saving}
                        >
                          {saving ? "저장 중..." : "답변 수정 완료"}
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={() => {
                            setIsAnswering(false);
                            setAnswerText("");
                          }}
                          disabled={saving}
                        >
                          취소
                        </button>
                      </div>
                    </>
                  ) : (
                    // 일반 보기 모드
                    <>
                      <p>{qna.answer}</p>

                      {/* 답변 메타 + (관리자) 수정 버튼 */}
                      <div className="qna-answer-meta-row swap">
                        <p className="qna-answer-meta">
                          {qna.answeredAt} | 답변자: {qna.answeredBy}
                        </p>
                        {isAdmin && (
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => {
                              setIsAnswering(true);
                              setAnswerText(qna.answer || "");
                            }}
                          >
                            답변 수정
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                // 아직 답변 없음
                <>
                  {isAdmin ? (
                    // 관리자에게는 클릭해서 바로 입력 가능
                    !isAnswering ? (
                      <div
                        className="qna-answer-empty"
                        onClick={() => setIsAnswering(true)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ")
                            setIsAnswering(true);
                        }}
                      >
                        📭 아직 등록된 답변이 없습니다. 클릭해서 답변 등록하기
                      </div>
                    ) : (
                      <div className="qna-answer-form">
                        <textarea
                          className="form-control"
                          rows={6}
                          value={answerText}
                          onChange={(e) => setAnswerText(e.target.value)}
                          placeholder="답변 내용을 입력하세요"
                          disabled={saving}
                        />
                        <div className="mt-3 d-flex justify-content-end gap-2">
                          <button
                            className="btn btn-mz-style"
                            onClick={handleAnswerSubmit}
                            disabled={saving}
                          >
                            {saving ? "저장 중..." : "답변 등록"}
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() => {
                              setIsAnswering(false);
                              setAnswerText("");
                            }}
                            disabled={saving}
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="qna-answer-empty">
                      📭 아직 등록된 답변이 없습니다.
                    </div>
                  )}
                </>
              )}

              {/* 하단 버튼 -> 목록으로, 수정/삭제(조건부) */}
              <div className="qna-button-row mt-5">
                <div className="button-back-left">
                  <button
                    className="btn btn-secondary btn-fixed-width"
                    onClick={() => navigate("/qna")}
                  >
                    목록으로 돌아가기
                  </button>
                </div>

                {/* 오른쪽 버튼
                   - 관리자 -> 삭제 항상 노출
                   - 작성자 -> 미답변일 때 수정/삭제 노출 */}
                {(isAdmin || (isAuthor && !hasAnswer)) && (
                  <div className="button-group-right">
                    {isAuthor && !hasAnswer && (
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => navigate(`/qna/edit/${qnaId}`)}
                      >
                        수정
                      </button>
                    )}

                    {(isAdmin || (isAuthor && !hasAnswer)) && (
                      <button
                        className="btn btn-outline-danger"
                        onClick={handleDelete}
                      >
                        삭제
                      </button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReadComponent;

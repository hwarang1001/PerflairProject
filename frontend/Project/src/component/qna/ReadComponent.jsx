import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQna, deleteQna } from "../../api/qnaApi";
import { createAnswer, updateAnswer } from "../../api/answerApi";
import { useSelector } from "react-redux";
import "./ReadComponent.css";

const initState = {
  title: "",
  content: "",
  userId: "",
  // 답변 표시/수정용
  answer: "",
  answerId: null, // 수정 시 필요
  answeredAt: "",
  answeredBy: "",
  createdAt: "",
};

const ReadComponent = ({ id }) => {
  const navigate = useNavigate();
  const loginInfo = useSelector((state) => state.login);
  const isAdmin = loginInfo?.roleNames?.includes("ADMIN");
  const userId = loginInfo?.userId;

  // URL 파라미터와 props 둘 다 대응
  const { id: idParam } = useParams();
  const qnaId = id ?? idParam;

  const [qna, setQna] = useState(initState);
  const [isAnswering, setIsAnswering] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchQna = async () => {
    if (!qnaId) return;
    setLoading(true);
    try {
      const data = await getQna(qnaId);

      // 서버 응답 형태에 방어적으로 매핑
      const ansObj =
        data?.answerObj ??
        (typeof data?.answer === "object" ? data.answer : null);

      const answerText =
        (typeof data?.answer === "string" && data.answer) ||
        ansObj?.content ||
        "";

      const answerId = data?.answerId ?? ansObj?.answerId ?? ansObj?.id ?? null;

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

  useEffect(() => {
    fetchQna();
  }, [qnaId]);

  const isAuthor = qna?.userId === userId;

  // ✅ 답변 존재 여부 (있으면 true)
  const hasAnswer = Boolean(
    (qna.answer && qna.answer.trim()) || qna.answerId || qna.answeredAt
  );

  // 답변 등록/수정 (서버 컨트롤러 규약: content 키 사용)
  // 
  const handleAnswerSubmit = async () => {
    const body = answerText.trim();
    
    if (!body) {
      alert("답변 내용을 입력해주세요.");
      return;
    }

    setSaving(true);
    try {
      if (qna.answer?.trim()) {
        // 수정
        if (!qna.answerId) {
          alert(
            "answerId가 없습니다. 단건 조회 응답에 answerId를 포함해 주세요."
          );
        } else {
          await updateAnswer(qna.answerId, { content: body }); // PUT /api/answers/{answerId}
          alert("답변이 수정되었습니다.");
        }
      } else {
        // 등록
        await createAnswer({ questionId: qnaId, content: body }); // POST /api/answers/
        alert("답변이 등록되었습니다.");
      }

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
        <div className="mb-5 text-center">
          <h1 className="mb-5">Q&A</h1>
          <hr />
        </div>

        <div className="qna-container mt-5">
          {loading ? (
            <div className="text-center py-5">불러오는 중...</div>
          ) : (
            <>
              <h2>{qna.title}</h2>
              <p className="qna-date">작성일: {qna.createdAt}</p>
              <div className="qna-content-slot">
                <p className="qna-content">{qna.content}</p>
              </div>

              {qna.answer ? (
                <div className="qna-answer-box">
                  <h5>답변</h5>

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
                    <>
                      <p>{qna.answer}</p>

                      {/* 메타 + 수정 버튼 한 줄 정렬 */}
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
                <>
                  {isAdmin ? (
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

              <div className="qna-button-row mt-5">
                <div className="button-back-left">
                  <button
                    className="btn btn-secondary btn-fixed-width"
                    onClick={() => navigate("/qna")}
                  >
                    목록으로 돌아가기
                  </button>
                </div>

                {/* 오른쪽 버튼 그룹: 관리자 = 삭제 항상 표시, 수정은 작성자+미답변일 때만 */}
                {(isAdmin || (isAuthor && !hasAnswer)) && (
                  <div className="button-group-right">
                    {/* 수정: 작성자 & 미답변일 때만 */}
                    {isAuthor && !hasAnswer && (
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => navigate(`/qna/edit/${qnaId}`)}
                      >
                        수정
                      </button>
                    )}

                    {/* 삭제: 관리자면 항상, 작성자는 미답변일 때만 */}
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

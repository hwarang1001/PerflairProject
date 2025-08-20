import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getQnaList, getQna } from "../../api/qnaApi"; // 상세 호출 쓰는 경우
import useCustomLogin from "../../hook/useCustomLogin";
import useCustomMove from "../../hook/useCustomMove";
import "./ListComponent.css";
import "../../App.css";

const initState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totoalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0,
};

const ListComponent = () => {
  const { exceptionHandle, loginState } = useCustomLogin();
  const { page, size } = useCustomMove();
  const navigate = useNavigate();
  const [serverData, setServerData] = useState(initState);

  // 답변 유무를 상세로 합성하는 경우 사용 (옵션)
  const [answeredById, setAnsweredById] = useState({});

  const loginInfo = useSelector((state) => state.login);
  const roleNames = loginInfo?.roleNames || [];
  const isAdmin = roleNames.includes("ADMIN");

  const isLoggedIn = Boolean(loginState?.userId);

  // 1) 로그인 체크: 의존성은 boolean과 navigate만
  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // 2) 목록 호출: page/size만 의존성에 둠
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getQnaList({ page, size });
        if (alive) setServerData(data);
      } catch (err) {
        console.error(err);
        // exceptionHandle은 deps에 넣지 않음 (무한루프 방지)
        exceptionHandle?.(err);
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size]);

  // 3) (옵션) 상세로 답변 유무 합성 — 목록 바뀔 때만 1회
  useEffect(() => {
    const ids = serverData.dtoList?.map((d) => d.questionId) || [];
    if (ids.length === 0) {
      setAnsweredById({});
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const results = await Promise.all(
          ids.map((id) => getQna(id).catch(() => null))
        );
        const map = {};
        results.forEach((detail, i) => {
          const qid = ids[i];
          const ansObj =
            detail?.answerObj ??
            (typeof detail?.answer === "object" ? detail.answer : null);
          const hasAnswer = Boolean(
            (typeof detail?.answer === "string" && detail.answer) ||
              detail?.answerId ||
              detail?.answeredAt ||
              ansObj?.content ||
              ansObj?.answerId
          );
          map[qid] = hasAnswer;
        });
        if (!cancelled) setAnsweredById(map);
      } catch (e) {
        // intentionally ignored – 목록은 상세 실패시에도 렌더링
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [serverData.dtoList]);

  const isAnsweredFromList = (q) => {
    if (typeof q?.status === "string") return q.status !== "WAITING";
    return Boolean(q?.answerId || q?.answeredAt || q?.answer);
  };

  return (
    <section className="py-5">
      <div className="container px-4 px-lg-5">
        <div className="mb-5">
          <h1 className="text-center mb-5">Q&amp;A</h1>
          <hr />
        </div>

        <div className="text-center mb-5">
          <h2>궁금한 점을 남겨주세요</h2>
          <h6>제품, 배송, 교환 등 모든 문의 환영합니다 🙋</h6>
        </div>

        {isLoggedIn && (
          <div className="d-flex justify-content-end mb-4">
            <button
              className="btn btn-mz-style"
              onClick={() => navigate("/qna/write")}
            >
              Q&amp;A 작성
            </button>
          </div>
        )}

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {serverData.dtoList.length === 0 ? (
            <div className="w-100 text-center mt-5">
              <h5>작성된 Q&amp;A가 없습니다.</h5>
            </div>
          ) : (
            serverData.dtoList.map((qna) => {
              const displayDate = qna.updatedAt || qna.createdAt;
              const answered =
                answeredById[qna.questionId] ?? isAnsweredFromList(qna);

              return (
                <div key={qna.questionId} className="col">
                  <div className="card h-100 shadow-sm text-center position-relative">
                    {/* ✅ 관리자에게만 뱃지 노출 */}
                    {isAdmin && (
                      <div
                        className={`qna-badge ${
                          answered ? "answered" : "unanswered"
                        }`}
                      >
                        {answered ? "답변 완료" : "미답변"}
                      </div>
                    )}

                    <div
                      className="card-body d-flex flex-column justify-content-between"
                      style={{ marginTop: 40 }}
                    >
                      <Link
                        to={`/qna/${qna.questionId}`}
                        className="card-title h5 text-decoration-none text-dark mt-2"
                      >
                        {qna.title}
                      </Link>
                      <p className="card-text text-muted mt-3 mb-2">
                        {displayDate}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default ListComponent;

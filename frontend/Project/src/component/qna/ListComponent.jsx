import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getQnaList, getQna } from "../../api/qnaApi";
import useCustomLogin from "../../hook/useCustomLogin";
import PageComponent from "../common/PageComponent";
import useCustomMove from "../../hook/useCustomMove";
import "./ListComponent.css";
import "../../App.css";

/*
  Q&A 목록 화면
  - 기본 흐름 -> 로그인 확인 -> 목록 불러오기 -> 카드로 출력
  - 답변 상태 표시 -> 관리자에게만 뱃지 노출(답변 완료/미답변)
  - 보강 로직(선택) -> 목록 후 각 질문의 상세를 확인해 답변 여부를 더 정확히 계산
*/

const initState = {
  dtoList: [], // 질문 카드 리스트
  pageNumList: [], // 페이지 번호 리스트(페이지네이션에 사용 가능)
  pageRequestDTO: null, // 서버에 보낸 페이지 요청 정보
  prev: false, // 이전 페이지 그룹 존재 여부
  next: false, // 다음 페이지 그룹 존재 여부
  totoalCount: 0, // 전체 개수(오탈자 유지)
  prevPage: 0, // 이전 페이지 그룹 시작 페이지
  nextPage: 0, // 다음 페이지 그룹 시작 페이지
  totalPage: 0, // 전체 페이지 수
  current: 0, // 현재 페이지 번호
};

const ListComponent = () => {
  // 로그인 관련 -> 로그인 상태(loginState), 공통 오류 처리(exceptionHandle)
  const { exceptionHandle, loginState } = useCustomLogin();
  const { page, size, moveToQnaList } = useCustomMove();
  const navigate = useNavigate();
  const [serverData, setServerData] = useState(initState);

  // 상세 보강용 -> { [questionId]: true|false } 형태의 답변 여부 맵
  const [answeredById, setAnsweredById] = useState({});

  // 권한/로그인 정보
  const loginInfo = useSelector((state) => state.login);
  const roleNames = loginInfo?.roleNames || [];
  const isAdmin = roleNames.includes("ADMIN");
  const isLoggedIn = Boolean(loginState?.userId);

  // 1) 로그인 체크 -> 비로그인이면 안내 후 로그인 화면으로 이동
  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // 2) 목록 불러오기 -> page/size가 바뀔 때마다 실행
  //    alive 플래그 -> 화면을 떠난 뒤 도착한 응답으로 setState 되는 것 방지
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getQnaList({ page, size });
        if (alive) setServerData(data);
      } catch (err) {
        console.error(err);
        exceptionHandle?.(err);
      }
    })();
    return () => {
      alive = false;
    };
  }, [page, size]);

  // 3) (선택) 상세로 답변 여부 보강 -> 목록이 바뀔 때 한 번 실행
  //    cancelled 플래그 -> 언마운트 후 응답 도착 시 setState 방지
  useEffect(() => {
    const ids = serverData.dtoList?.map((d) => d.questionId) || [];
    if (ids.length === 0) {
      setAnsweredById({});
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        // 여러 건을 한 번에 요청 -> 빠르게 모아 확인
        const results = await Promise.all(
          ids.map((id) => getQna(id).catch(() => null))
        );
        const map = {};
        results.forEach((detail, i) => {
          const qid = ids[i];

          // 다양한 응답 케이스에서 답변 흔적을 찾음
          const ansObj =
            detail?.answerObj ??
            (typeof detail?.answer === "object" ? detail.answer : null);

          const hasAnswer = Boolean(
            (typeof detail?.answer === "string" && detail.answer) || // answer가 문자열 내용
              detail?.answerId || // answerId 존재
              detail?.answeredAt || // 답변 시각 존재
              ansObj?.content || // answerObj.content 존재
              ansObj?.answerId // answerObj.answerId 존재
          );

          map[qid] = hasAnswer;
        });
        if (!cancelled) setAnsweredById(map);
      } catch (e) {
        // 실패는 무시 -> 목록 렌더는 그대로 진행
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [serverData.dtoList]);

  // 목록 데이터만으로 답변 여부 추정 -> 상세 보강값이 없을 때 사용
  const isAnsweredFromList = (q) => {
    if (typeof q?.status === "string") return q.status !== "WAITING";
    return Boolean(q?.answerId || q?.answeredAt || q?.answer);
  };

  return (
    <section className="py-5">
      <div className="container px-4 px-lg-5">
        {/* 상단 제목/구분선 */}
        <div className="mb-5">
          <h1 className="text-center mb-5">Q&amp;A</h1>
          <hr />
        </div>

        {/* 안내 문구 */}
        <div className="text-center mb-5">
          <h2>궁금한 점을 남겨주세요</h2>
          <h6>제품, 배송, 교환 등 모든 문의 환영합니다 🙋</h6>
        </div>

        {/* 로그인 사용자 전용 -> 작성 버튼 */}
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

        {/* 카드 목록 */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {/* 비었을 때 안내 */}
          {serverData.dtoList.length === 0 ? (
            <div className="w-100 text-center mt-5">
              <h5>작성된 Q&amp;A가 없습니다.</h5>
            </div>
          ) : (
            serverData.dtoList.map((qna) => {
              const displayDate = qna.updatedAt || qna.createdAt; // 수정일 우선
              // 상세 보강값 우선 -> 없으면 목록 데이터로 판별
              const answered =
                answeredById[qna.questionId] ?? isAnsweredFromList(qna);

              return (
                <div key={qna.questionId} className="col">
                  <div className="card h-100 shadow-sm text-center position-relative">
                    {/* 관리자 전용 뱃지 -> 답변 완료/미답변 */}
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
                      style={{ marginTop: 40 }} // 뱃지와 겹치지 않도록 상단 여백
                    >
                      {/* 제목 클릭 -> 상세 페이지로 이동 */}
                      <Link
                        to={`/qna/${qna.questionId}`}
                        className="card-title h5 text-decoration-none text-dark mt-2"
                      >
                        {qna.title}
                      </Link>

                      {/* 날짜 표시 */}
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
      <PageComponent serverData={serverData} moveToList={moveToQnaList} />
    </section>
  );
};

export default ListComponent;

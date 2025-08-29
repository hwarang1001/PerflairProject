import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getNoticeList } from "../../api/noticeApi";
import PageComponent from "../common/PageComponent";
import useCustomMove from "../../hook/useCustomMove";
import "./ListComponent.css";
import "../../App.css";

/*
  - 공지 목록을 카드 형태로 보여줌.
  - 페이지 정보(page, size)는 useCustomMove 훅에서 가져옴.
  - 서버에서 목록을 받아와 serverData(dtoList 등)에 저장함.
  - 로그인 정보의 roleNames에 "ADMIN"이 있으면 '공지사항 작성' 버튼이 보임.
*/
const initState = {
  dtoList: [], // 공지 데이터 배열
  pageNumList: [], // 페이지 번호 배열(페이지네이션 UI에 사용 가능)
  pageRequestDTO: null, // 서버에 보낸 페이지 요청 정보
  prev: false, // 이전 페이지 그룹 존재 여부
  next: false, // 다음 페이지 그룹 존재 여부
  totoalCount: 0, // 전체 개수(오탈자 그대로 유지)
  prevPage: 0, // 이전 페이지 그룹의 시작 페이지
  nextPage: 0, // 다음 페이지 그룹의 시작 페이지
  totalPage: 0, // 전체 페이지 수
  current: 0, // 현재 페이지 번호
};

const ListComponent = () => {
  const { page, size, moveToNoticeList } = useCustomMove();
  const [serverData, setServerData] = useState(initState);

  // 로그인 정보에서 권한 배열 꺼내기(없을 수 있어 안전하게 처리)
  const loginInfo = useSelector((state) => state.login);
  const roleNames = Array.isArray(loginInfo?.roleNames)
    ? loginInfo.roleNames
    : [];
  const isAdmin = roleNames.includes("ADMIN");

  // 화면이 처음 열릴 때와 page/size가 바뀔 때마다 목록 조회
  useEffect(() => {
    getNoticeList({ page, size }).then((data) => setServerData(data));
  }, [page, size]);

  return (
    <section className="py-5">
      <div className="container px-4 px-lg-5">
        {/* 상단 제목/구분선 */}
        <div className="mb-5">
          <h1 className="text-center mb-5">공지사항</h1>
          <hr />
        </div>

        {/* 간단한 안내 문구 */}
        <div className="text-center mb-5">
          <h2>최신 소식을 확인하세요</h2>
          <h6>업데이트, 이벤트, 점검 안내 등</h6>
        </div>

        {/* 관리자 전용: 작성 버튼 */}
        {isAdmin && (
          <div className="d-flex justify-content-end mb-4">
            {/* 별도 페이지로 이동하여 공지 작성 */}
            <button
              className="btn btn-mz-style"
              onClick={() => window.location.assign("/notice/write")}
            >
              공지사항 작성
            </button>
          </div>
        )}

        {/* 공지 카드 그리드 영역 */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {/* 목록이 비어 있을 때의 안내 */}
          {serverData.dtoList.length === 0 ? (
            <div className="w-100 text-center mt-5">
              <h5>작성된 공지사항이 없습니다.</h5>
            </div>
          ) : (
            // 공지 목록을 카드로 렌더링
            serverData.dtoList.map((notice) => {
              // 수정일이 있으면 수정일, 없으면 작성일을 표시
              const displayDate = notice.updateAt || notice.createdAt;

              return (
                <div key={notice.noticeId} className="col">
                  <div className="card h-100 shadow-sm text-center">
                    <div className="card-body d-flex flex-column justify-content-between">
                      {/* 제목을 클릭하면 상세 페이지로 이동 */}
                      <Link
                        to={`/notice/${notice.noticeId}`}
                        className="card-title h5 text-decoration-none text-dark mt-2"
                      >
                        {notice.title}
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
      <PageComponent serverData={serverData} moveToList={moveToNoticeList} />
    </section>
  );
};

export default ListComponent;

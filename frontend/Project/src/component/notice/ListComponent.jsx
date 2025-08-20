import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getNoticeList } from "../../api/noticeApi";
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
  const { page, size } = useCustomMove();
  const [serverData, setServerData] = useState(initState);

  const loginInfo = useSelector((state) => state.login);

  let roleNames = [];
  if (loginInfo && loginInfo.roleNames) {
    roleNames = loginInfo.roleNames;
  }
  const isAdmin = roleNames.indexOf("ADMIN") !== -1;

  useEffect(() => {
    getNoticeList({ page, size }).then((data) => {
      console.log("Notice List from API:", data.dtoList);
      setServerData(data);
    });
  }, [page, size]);

  return (
    <section className="py-5">
      <div className="container px-4 px-lg-5">
        <div className="mb-5">
          <h1 className="text-center mb-5">공지사항</h1>
          <hr />
        </div>

        <div className="text-center mb-5">
          <h2>최신 소식을 확인하세요</h2>
          <h6>업데이트, 이벤트, 점검 안내 등 📢</h6>
        </div>

        {isAdmin && (
          <div className="d-flex justify-content-end mb-4">
            <button
              className="btn btn-mz-style"
              onClick={() => window.location.assign("/notice/write")}
            >
              공지사항 작성
            </button>
          </div>
        )}

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {serverData.dtoList.length === 0 ? (
            <div className="w-100 text-center mt-5">
              <h5>작성된 공지사항이 없습니다.</h5>
            </div>
          ) : (
            serverData.dtoList.map((notice) => {
              const displayDate = notice.updateAt
                ? notice.updateAt
                : notice.createdAt;

              return (
                <div key={notice.noticeId} className="col">
                  <div className="card h-100 shadow-sm text-center">
                    <div className="card-body d-flex flex-column justify-content-between">
                      <Link
                        to={`/notice/${notice.noticeId}`}
                        className="card-title h5 text-decoration-none text-dark mt-2"
                      >
                        {notice.title}
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

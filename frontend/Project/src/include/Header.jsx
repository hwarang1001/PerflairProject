import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../App.css";
import { useSelector } from "react-redux";
const Header = () => {
  const loginState = useSelector((state) => state.login);
  console.log("loginState:", loginState);
  const name = loginState?.name;
  return (
    <>
      {/* 상단 네비게이션 바 */}
      <nav className="navbar navbar-expand-lg p-4 bg-white border-bottom fixed-top">
        <div className="container px-4 px-lg-5 ">
          <a className="navbar-brand" href="/">
            PERFLAIR
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav m-auto gap-5">
              <li className="nav-item">
                <a className="nav-link" href="/">
                  HOME
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  id="navbarDropdown"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  브랜드
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <a className="dropdown-item" href="/product/list">
                      브랜드1
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a className="dropdown-item" href="#!">
                      브랜드2
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a className="dropdown-item" href="#!">
                      브랜드3
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/notice">
                  공지사항
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/qna">
                  질의응답
                </a>
              </li>
            </ul>

            {/* 로그인 버튼 (JSP 조건부 로직은 React에서는 상태로 처리해야 함) */}
            {loginState.name ? (
              // 로그인 되었을 때 UI
              <>
                <span>{name}님 환영합니다.</span>
                <button>로그아웃</button>
              </>
            ) : (
              // 로그인 안 됐을 때 UI
              <a href="/login" className="nav-link">
                로그인
              </a>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;

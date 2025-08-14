import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../App.css";
import { useSelector } from "react-redux";
import useCustomLogin from "../hook/useCustomLogin";
const Header = () => {
  const loginState = useSelector((state) => state.login);
  const { doLogout, moveToPath } = useCustomLogin();
  // 로그인한 유저가 ADMIN인지 계산
  const isAdmin =
    loginState &&
    loginState.roleNames &&
    loginState.roleNames.includes("ADMIN");
  console.log("loginState:", loginState);
  const handleClickLogout = () => {
    const confirmed = window.confirm("로그아웃 하시겠습니까?");
    if (confirmed) {
      doLogout(); // 서버 로그아웃 처리 등
      alert("로그아웃되었습니다.");
      moveToPath("/");
    }
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg p-4 pb-3 bg-white border-bottom fixed-top">
        <div className="container d-flex flex-column px-4 px-lg-5">
          {/* === 상단 영역 === */}
          <div className="d-flex ms-auto">
            {/* 우측 상단 메뉴 */}
            <div className="d-flex gap-3 small">
              <a href="/support" className="text-dark text-decoration-none">
                고객센터
              </a>
              <a href="/cart" className="text-dark text-decoration-none">
                장바구니
              </a>
              {loginState.name !== "" ? (
                <button
                  onClick={handleClickLogout}
                  className="btn btn-link text-dark text-decoration-none p-0 m-0 border-0"
                  style={{ fontSize: "inherit" }}
                >
                  로그아웃
                </button>
              ) : (
                <a href="/login" className="text-dark text-decoration-none">
                  로그인
                </a>
              )}
            </div>
          </div>

          {/* === 하단 네비게이션 === */}
          <div className="d-flex align-items-center justify-content-between w-100">
            {/* 좌측 - 로고 */}
            <a className="navbar-brand mb-0" href="/">
              PERFLAIR
            </a>
            {/* 우측 - 네비게이션 메뉴 */}
            <div>
              <ul className="navbar-nav flex-row gap-3">
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
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
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
                {isAdmin && (
                  <li className="nav-item">
                    <a className="nav-link" href="/product/admin/list">
                      상품 관리
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;

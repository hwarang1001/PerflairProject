import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../App.css";
const Footer = () => {
  return (
    <footer className="bg-white text-dark py-4 mt-5 border-top">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3 text-center">
            <h5>PerFlair Project</h5>
            <p>향수에 대한 세련되고 특별한 감각을 위한 팀 프로젝트</p>
          </div>

          <div className="col-md-4 mb-3 text-center">
            <h5>Team</h5>
            <ul className="list-unstyled">
              <li>👩‍💻 프론트엔드: 김화랑, 차기훈</li>
              <li>🧑‍💻 백엔드: 박찬희, 이호준</li>
            </ul>
          </div>

          <div className="col-md-4 mb-3 text-center">
            <h5>Links & Info</h5>
            <ul className="list-unstyled">
              <li>
                <a
                  href="https://github.com/team-fragrance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark text-decoration-none"
                >
                  GitHub Repository
                </a>
              </li>
              <li>기술 스택: React · Spring Boot · Oracle</li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-3">
          <small>© 2025 Team Fragrance. All rights reserved.</small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

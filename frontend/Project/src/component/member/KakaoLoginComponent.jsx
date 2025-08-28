import { Link } from "react-router-dom";
import { getKakaoLoginLink } from "../../api/kakaoApi";
import { Button } from "react-bootstrap";

const KakaoLoginComponent = () => {
  const link = getKakaoLoginLink();
  return (
    <div className="d-grid gap-2 mt-3">
      <Button variant="warning">
        <Link className="text-decoration-none text-dark" to={link}>
          KAKAO LOGIN
        </Link>
      </Button>
    </div>
  );
};
export default KakaoLoginComponent;

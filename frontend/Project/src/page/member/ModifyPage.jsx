import { Container } from "react-bootstrap";
import Header from "../../include/Header";
import KakaoModifyComponent from "../../component/member/KakaoModifyComponent";
import Footer from "../../include/Footer";

const ModifyPage = () => {
  return (
    <Container>
      <Header />
      <div className="d-grid gap-2 mt-5 p-5">
        <KakaoModifyComponent />
      </div>
      <Footer />
    </Container>
  );
};
export default ModifyPage;

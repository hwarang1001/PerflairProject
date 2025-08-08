import { useParams } from "react-router-dom";
import ReadComponent from "../../component/product/ReadComponent";
import Footer from "../../include/Footer";
import Header from "../../include/Header";

const ReadPage = () => {
  const { pno } = useParams();
  return (
    <>
      <Header />
      <ReadComponent pno={pno} />
      <Footer />
    </>
  );
};
export default ReadPage;

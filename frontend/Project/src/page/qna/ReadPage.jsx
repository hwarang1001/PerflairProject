import ReadComponent from "../../component/qna/ReadComponent";
import Footer from "../../include/Footer";
import Header from "../../include/Header";
import { useParams } from "react-router-dom";

const ReadPage = () => {
  const { id } = useParams(); 
  console.log("ReadPage id:", id); 
  return (
    <>
      <Header />
      <ReadComponent id={id}/>
      <Footer />
    </>
  );
};
export default ReadPage;

import { Container } from "react-bootstrap";
import Pagination from "react-bootstrap/Pagination";
import "./PageComponent.css";
const PageComponent = ({ serverData, moveToList }) => {
  return (
    <Container className="d-flex justify-content-center mt-3">
      <Pagination size="md">
        {serverData.prev ? (
          <Pagination.Prev
            onClick={() => {
              moveToList({ page: serverData.prevPage });
            }}
          />
        ) : (
          <></>
        )}
        {serverData.pageNumList.map((pageNum) =>
          serverData.current === pageNum ? (
            <Pagination.Item
              key={pageNum}
              active
              onClick={() => {
                moveToList({ page: pageNum });
              }}
            >
              {pageNum}
            </Pagination.Item>
          ) : (
            <Pagination.Item
              key={pageNum}
              onClick={() => {
                moveToList({ page: pageNum });
              }}
            >
              {pageNum}
            </Pagination.Item>
          )
        )}
        {serverData.next ? (
          <Pagination.Next
            onClick={() => {
              moveToList({ page: serverData.nextPage });
            }}
          />
        ) : (
          <></>
        )}
      </Pagination>
    </Container>
  );
};
export default PageComponent;

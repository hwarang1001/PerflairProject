import { useState } from "react";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
const getNum = (param, defaultValue) => {
  if (!param) {
    return defaultValue;
  }
  return parseInt(param);
};
const useCustomMove = () => {
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);
  const [queryParams] = useSearchParams();
  const page = getNum(queryParams.get("page"), 1);
  const size = getNum(queryParams.get("size"), 20);
  const queryDefault = createSearchParams({ page, size }).toString(); //새로 추가

  const moveToList = (pageParam) => {
    let queryStr = "";
    if (pageParam) {
      const pageNum = getNum(pageParam.page, page);
      const sizeNum = getNum(pageParam.size, size);
      queryStr = createSearchParams({
        page: pageNum,
        size: sizeNum,
      }).toString();
    } else {
      queryStr = queryDefault;
    }

    navigate({
      pathname: `../product/list`,
      search: queryStr,
    });
    setRefresh(!refresh); //추가
  };

  const moveToAdminList = (pageParam) => {
    let queryStr = "";
    if (pageParam) {
      const pageNum = getNum(pageParam.page, page);
      const sizeNum = getNum(pageParam.size, size);
      queryStr = createSearchParams({
        page: pageNum,
        size: sizeNum,
      }).toString();
    } else {
      queryStr = queryDefault;
    }

    navigate({
      pathname: `../product/admin/list`,
      search: queryStr,
    });
    setRefresh(!refresh); //추가
  };

  const moveToAdd = () => {
    console.log(queryDefault);
    navigate({
      pathname: "../product/add",
    });
  };

  const moveToRead = (num) => {
    navigate({
      pathname: `../product/read/${num}`,
    });
  };

  const moveToModify = (num) => {
    navigate({
      pathname: `../product/modify/${num}`,
    });
  };
  const moveToPayment = (path, options = {}) => {
    navigate(path, { replace: true, ...options });
  };

  //notice
  const moveToNoticeList = (pageParam) => {
    let queryStr = "";
    if (pageParam) {
      const pageNum = getNum(pageParam.page, page);
      const sizeNum = getNum(pageParam.size, size);
      queryStr = createSearchParams({
        page: pageNum,
        size: sizeNum,
      }).toString();
    } else {
      queryStr = queryDefault;
    }

    navigate({
      pathname: `../notice/`,
      search: queryStr,
    });
    setRefresh(!refresh); //추가
  };
  //qna
  const moveToQnaList = (pageParam) => {
    let queryStr = "";
    if (pageParam) {
      const pageNum = getNum(pageParam.page, page);
      const sizeNum = getNum(pageParam.size, size);
      queryStr = createSearchParams({
        page: pageNum,
        size: sizeNum,
      }).toString();
    } else {
      queryStr = queryDefault;
    }

    navigate({
      pathname: `../qna/`,
      search: queryStr,
    });
    setRefresh(!refresh); //추가
  };
  //product
  const moveToProductList = (pageParam) => {
    let queryStr = "";
    if (pageParam) {
      const pageNum = getNum(pageParam.page, page);
      const sizeNum = getNum(pageParam.size, size);
      queryStr = createSearchParams({
        page: pageNum,
        size: sizeNum,
      }).toString();
    } else {
      queryStr = queryDefault;
    }

    navigate({
      pathname: `../product/list`,
      search: queryStr,
    });
    setRefresh(!refresh); //추가
  };
  const moveToAdminProductList = (pageParam) => {
    let queryStr = "";
    if (pageParam) {
      const pageNum = getNum(pageParam.page, page);
      const sizeNum = getNum(pageParam.size, size);
      queryStr = createSearchParams({
        page: pageNum,
        size: sizeNum,
      }).toString();
    } else {
      queryStr = queryDefault;
    }

    navigate({
      pathname: `../product/admin/list`,
      search: queryStr,
    });
    setRefresh(!refresh); //추가
  };

  return {
    moveToList,
    moveToModify,
    moveToAdminList,
    moveToAdd,
    moveToRead,
    moveToPayment,
    moveToNoticeList,
    moveToQnaList,
    moveToProductList,
    moveToAdminProductList,
    page,
    size,
  }; //moveToModify 추가
};
export default useCustomMove;

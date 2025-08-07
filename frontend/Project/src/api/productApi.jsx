import axios from "axios";

//서버 주소
export const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${API_SERVER_HOST}/api/product`;

export const getOne = async (pno) => {
  const res = await axios.get(`${prefix}/${pno}`);
  return res.data;
};

export const getList = async (pageParam) => {
  const { page, size } = pageParam;
  const res = await axios.get(`${prefix}/list`, {
    params: { page: page, size: size },
  });
  return res.data;
};

import axios from "axios";
import jwtAxios from "../util/jwtUtil";

export const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${API_SERVER_HOST}/api/qna`;

// Q&A 리스트 가져오기
export const getQnaList = async (pageParam) => {
  const { page, size } = pageParam;
  const res = await axios.get(`${prefix}/list`, {
    params: { page, size },
  });
  return res.data;
};

// Q&A 단건 조회
export const getQna = async (id) => {
  const res = await axios.get(`${prefix}/${id}`);
  return res.data;
};

// Q&A 등록 (로그인 필요)
export const postQna = async (qnaData) => {
  const res = await jwtAxios.post(`${prefix}/`, qnaData);
  return res.data;
};

// Q&A 수정 (로그인 필요)
export const modifyQna = async (id, qnaData) => {
  const res = await jwtAxios.put(`${prefix}/${id}`, qnaData);
  return res.data;
};

// Q&A 삭제 (로그인 필요)
export const deleteQna = async (id) => {
  const res = await jwtAxios.delete(`${prefix}/${id}`);
  return res.data;
};

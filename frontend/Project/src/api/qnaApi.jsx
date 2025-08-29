import axios from "axios";
import jwtAxios from "../util/jwtUtil";

/*
  Q&A API 모듈
  - axios -> 공개 요청용(로그인 필요 없음)
  - jwtAxios -> 인증 요청용(Authorization 헤더 자동 부착)
  - prefix -> 공통 기본 경로 (예: http://localhost:8080/api/qna)
*/
export const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${API_SERVER_HOST}/api/qna`;

/*
  getQnaList -> Q&A 목록 조회
  - 요청: GET /api/qna/list?page={page}&size={size}
  - 보냄: { page, size } 쿼리 파라미터
  - 받음: 서버 페이징 스키마(예: dtoList, totalPage, current 등)
*/
export const getQnaList = async (pageParam) => {
  const { page, size } = pageParam;
  const res = await jwtAxios.get(`${prefix}/list`, {
    params: { page, size },
  });
  return res.data;
};

/*
  getQna -> Q&A 단건 조회
  - 요청: GET /api/qna/{id}
  - 보냄: 경로 파라미터 id
  - 받음: { questionId, title, content, userId, createdAt, ... } 형태
*/
export const getQna = async (id) => {
  const res = await jwtAxios.get(`${prefix}/${id}`);
  return res.data;
};

/*
  postQna -> Q&A 등록(로그인 필요)
  - 요청: POST /api/qna/
  - 보냄: qnaData (예: { title, content })
  - 받음: 생성 결과
*/
export const postQna = async (qnaData) => {
  const res = await jwtAxios.post(`${prefix}/`, qnaData);
  return res.data;
};

/*
  modifyQna -> Q&A 수정(로그인 필요)
  - 요청: PUT /api/qna/{id}
  - 보냄: qnaData (예: { title, content })
  - 받음: 수정 결과
*/
export const modifyQna = async (id, qnaData) => {
  const res = await jwtAxios.put(`${prefix}/${id}`, qnaData);
  return res.data;
};

/*
  deleteQna -> Q&A 삭제(로그인 필요)
  - 요청: DELETE /api/qna/{id}
  - 보냄: 경로 파라미터 id
  - 받음: 삭제 결과
*/
export const deleteQna = async (id) => {
  const res = await jwtAxios.delete(`${prefix}/${id}`);
  return res.data;
};

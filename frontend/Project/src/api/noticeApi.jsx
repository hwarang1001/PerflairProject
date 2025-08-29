import axios from "axios";
import jwtAxios from "../util/jwtUtil";

/*
  공지사항 API 모듈
  - axios -> 공개 요청용(토큰 없이 호출)
  - jwtAxios -> 인증 필요 요청용(Authorization 헤더 자동 부착)
  - prefix -> 이 모듈에서 공통으로 쓰는 기본 경로
    예) http://localhost:8080/api/notice
*/
export const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${API_SERVER_HOST}/api/notice`;

/*
  getNoticeList -> 공지 목록 조회
  - 요청: GET /api/notice/list?page={page}&size={size}
  - 보냄: { page, size } 쿼리 파라미터
  - 받음: 서버 페이징 스키마(예: dtoList, totalPage, current 등)
*/
export const getNoticeList = async (pageParam) => {
  const { page, size } = pageParam;
  const res = await axios.get(`${prefix}/list`, {
    params: { page, size },
  });
  return res.data;
};

/*
  getNotice -> 공지 상세 조회
  - 요청: GET /api/notice/{id}
  - 보냄: 경로 파라미터 id
  - 받음: { noticeId, title, content, createdAt, updateAt ... } 형태
*/
export const getNotice = async (id) => {
  const res = await axios.get(`${prefix}/${id}`);
  return res.data;
};

/*
  postNotice -> 공지 등록
  - 요청: POST /api/notice
  - 보냄: noticeData (예: { title, content })
  - 받음: 생성 결과
*/
export const postNotice = async (noticeData) => {
  const res = await jwtAxios.post(`${prefix}`, noticeData);
  return res.data;
};

/*
  modifyNotice -> 공지 수정
  - 요청: PUT /api/notice/{id}
  - 보냄: noticeData (예: { title, content })
  - 받음: 수정 결과
*/
export const modifyNotice = async (id, noticeData) => {
  const res = await jwtAxios.put(`${prefix}/${id}`, noticeData);
  return res.data;
};

/*
  deleteNotice -> 공지 삭제
  - 요청: DELETE /api/notice/{id}
  - 보냄: 경로 파라미터 id
  - 받음: 삭제 결과
*/
export const deleteNotice = async (id) => {
  const res = await jwtAxios.delete(`${prefix}/${id}`);
  return res.data;
};

import jwtAxios from "../util/jwtUtil";
import { API_SERVER_HOST } from "./productApi";

/*
  답변 API 모듈
  - jwtAxios -> 인증 토큰을 자동으로 붙여서 요청 보내는 axios 인스턴스
  - prefix -> 이 모듈에서 공통으로 쓰는 기본 주소
    예) http://localhost:8080/api/answers
*/
const prefix = `${API_SERVER_HOST}/api/answers`;

/*
  createAnswer -> 답변 등록
  - 요청: POST /api/answers/
  - 보냄: { questionId, content }  // 어떤 질문에, 무슨 내용으로
  - 받음: { result: <answerId> }   // 새로 만들어진 답변의 id
  - 성공 시 res.data만 돌려줌
*/
export const createAnswer = async ({ questionId, content }) => {
  const res = await jwtAxios.post(`${prefix}/`, { questionId, content });
  return res.data; // { result: <answerId> }
};

/*
  updateAnswer -> 답변 내용 수정
  - 요청: PUT /api/answers/{answerId}
  - 보냄: { content }              // 바꿀 내용
  - 받음: { result: "SUCCESS" }    // 성공 시 성공 문자
  - 성공 시 res.data만 돌려줌
*/
export const updateAnswer = async (answerId, { content }) => {
  const res = await jwtAxios.put(`${prefix}/${answerId}`, { content });
  return res.data; // { result: "SUCCESS" }
};

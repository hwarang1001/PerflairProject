import jwtAxios from "../util/jwtUtil";
import { API_SERVER_HOST } from "./productApi";

const prefix = `${API_SERVER_HOST}/api/answers`;

// 등록: POST /api/answers/   (payload: { questionId, content })
export const createAnswer = async ({ questionId, content }) => {
  const res = await jwtAxios.post(`${prefix}/`, { questionId, content });
  return res.data; // { result: <answerId> }
};

// 수정: PUT /api/answers/{answerId}  (payload: { content })
export const updateAnswer = async (answerId, { content }) => {
  const res = await jwtAxios.put(`${prefix}/${answerId}`, { content });
  return res.data; // { result: "SUCCESS" }
};

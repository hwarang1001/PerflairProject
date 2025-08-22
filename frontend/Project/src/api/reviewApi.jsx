import axios from "axios";
import jwtAxios from "../util/jwtUtil";

//서버 주소
export const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${API_SERVER_HOST}/api/reviews`;

export const postReview = async (formData) => {
  const res = await jwtAxios.post(`${prefix}/`, formData);
  return res.data;
};

export const getOne = async (reviewId) => {
  const res = await axios.get(`${prefix}/${reviewId}`);
  return res.data;
};

export const getList = async (pno) => {
  const res = await axios.get(`${prefix}/list`, {
    params: { pno },
  });
  return res.data;
};

export const deleteRemove = async (pno) => {
  const res = await axios.delete(`${prefix}/${pno}`);
  return res.data;
};

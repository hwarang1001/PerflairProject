import axios from "axios";
import jwtAxios from "../util/jwtUtil";

export const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${API_SERVER_HOST}/api/notice`;

export const getNoticeList = async (pageParam) => {
  const { page, size } = pageParam;
  const res = await axios.get(`${prefix}/list`, {
    params: { page, size },
  });
  return res.data;
};

export const getNotice = async (id) => {
  const res = await axios.get(`${prefix}/${id}`);
  return res.data;
};

export const postNotice = async (noticeData) => {
  const res = await jwtAxios.post(`${prefix}/`, noticeData);
  return res.data;
};

export const modifyNotice = async (id, noticeData) => {
  const res = await jwtAxios.put(`${prefix}/${id}`, noticeData);
  return res.data;
};

export const deleteNotice = async (id) => {
  const res = await jwtAxios.delete(`${prefix}/${id}`);
  return res.data;
};
  
import jwtAxios from "../util/jwtUtil";
import { API_SERVER_HOST } from "./qnaApi";

const prefix = `${API_SERVER_HOST}/api/member/address`;

export const getMyAddresses = async () => {
  const res = await jwtAxios.get(`${prefix}/me`);
  return res.data;
};

export const addAddress = async (pay) => {
  const res = await jwtAxios.post(prefix, pay);
  return res.data; // 생성된 id 포함 객체 반환을 기대
};

export const updateAddress = async (id, pay) => {
  const res = await jwtAxios.put(`${prefix}/${id}`, pay);
  return res.data;
};

export const removeAddress = async (id) => {
  const res = await jwtAxios.delete(`${prefix}/${id}`);
  return res.data;
};

export const setDefaultAddress = async (id) => {
  const res = await jwtAxios.put(`${prefix}/${id}/default`);
  return res.data;
};

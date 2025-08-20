import axios from "axios";
import { API_SERVER_HOST } from "./productApi";
import jwtAxios from "../util/jwtUtil";

const prefix = `${API_SERVER_HOST}/api/member`;

// 로그인 (public) — x-www-form-urlencoded
export const loginPost = async ({ userId, pw }) => {
  const body = new URLSearchParams();
  body.append("username", userId);
  body.append("password", pw);
  const res = await axios.post(`${prefix}/login`, body);
  return res.data; // { accessToken, refreshToken, ... } 가정
};

// 마이페이지: 내 정보 조회 (로그인 필요)
export const getMyProfile = async () => {
  const res = await jwtAxios.get(`${prefix}/me`);
  return res.data;
};

// 마이페이지: 내 정보 수정 (로그인 필요)
export const updateMyProfile = async (profileData) => {
  const res = await jwtAxios.put(`${prefix}/me`, profileData);
  return res.data;
};

// 마이페이지: 비밀번호 변경 (로그인 필요)
export const changePassword = async ({ currentPassword, newPassword }) => {
  const res = await jwtAxios.put(`${prefix}/me/password`, {
    currentPassword,
    newPassword,
  });
  return res.data;
};

export const registerPost = async (data) => {
  const res = await axios.post(`${prefix}/signup`, data);
  return res.data;
};

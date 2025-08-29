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
export const changePassword = async (
  userId,
  { currentPassword, newPassword }
) => {
  const res = await jwtAxios.put(
    `${prefix}/me/password`,
    {
      currentPassword,
      newPassword,
    },
    { params: { userId } }
  );
  return res.data;
};
export const modifyMember = async (member) => {
  const res = await jwtAxios.put(`${prefix}/social/modify`, member);
  return res.data;
};

export const registerPost = async (data) => {
  const res = await axios.post(`${prefix}/signup`, data);
  return res.data;
};

/* 아이디/비번 찾기 (public) */
export const checkUserId = async (userId) => {
  const res = await axios.get(`${prefix}/check-id`, { params: { userId } });
  return res.data;
};
// 1) 아이디 찾기: 이름 + 휴대폰으로 마스킹된 이메일 반환
// 응답 예시: { maskedUserId: "gi**@mail.com" }
export const findUserId = async ({ name, phoneNum }) => {
  const res = await axios.post(`${prefix}/find-id`, { name, phoneNum });
  return res.data;
};

// 2) 비밀번호 재설정 시작: userId로 인증코드 발송(이메일/SMS)
// 응답은 보통 200 OK (바디 없음 또는 {result:"OK"})
export const startPasswordReset = async ({ userId }) => {
  const res = await axios.post(`${prefix}/password-reset`, { userId });
  return res.data;
};

// 3) 비밀번호 재설정 확정: userId + code + newPassword
// 백엔드에서 code 검증 후 새 비번으로 저장
export const confirmPasswordReset = async ({ userId, code, newPassword }) => {
  const res = await axios.post(`${prefix}/password-reset/confirm`, {
    userId,
    code,
    newPassword,
  });
  return res.data;
};

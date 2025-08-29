import jwtAxios from "../util/jwtUtil";
import { API_SERVER_HOST } from "./qnaApi";

/*
  주소 API 모듈
  - jwtAxios -> 인증 토큰을 자동으로 붙여 요청하는 axios 인스턴스
  - prefix   -> 이 모듈 공통 기본 경로 (예: http://localhost:8080/api/member/address)
*/
const prefix = `${API_SERVER_HOST}/api/member/address`;

/*
  getMyAddresses -> 내 주소 목록 조회
  - 요청: GET /api/member/address/me
  - 반환: res.data (배열 또는 서버 스키마에 맞는 목록 객체)
  - 비고: jwtAxios 사용 -> 로그인 토큰이 헤더에 실림
*/
export const getMyAddresses = async () => {
  const res = await jwtAxios.get(`${prefix}/me`);
  return res.data;
};

/*
  addAddress -> 주소 추가
  - 요청: POST /api/member/address
  - 보냄: pay (예: { receiver, phoneNum, zonecode, address, detailAddress, isDefault } 형태)
  - 반환: res.data (예: 생성된 id를 포함한 객체를 기대)
*/
export const addAddress = async (pay) => {
  const res = await jwtAxios.post(prefix, pay);
  return res.data; // 생성된 id 포함 객체 반환을 기대
};

/*
  updateAddress -> 주소 수정
  - 요청: PUT /api/member/address/{id}
  - 보냄: pay (수정할 필드만 포함 가능)
  - 반환: res.data (서버 규약에 따름)
*/
export const updateAddress = async (id, pay) => {
  const res = await jwtAxios.put(`${prefix}/${id}`, pay);
  return res.data;
};

/*
  removeAddress -> 주소 삭제
  - 요청: DELETE /api/member/address/{id}
  - 반환: res.data (삭제 결과에 대한 서버 응답)
*/
export const removeAddress = async (id) => {
  const res = await jwtAxios.delete(`${prefix}/${id}`);
  return res.data;
};

/*
  setDefaultAddress -> 기본 배송지 설정
  - 요청: PUT /api/member/address/{id}/default
  - 동작: 해당 id를 기본 주소로 표시(서버가 나머지는 기본 해제 처리)
  - 반환: res.data (서버 규약에 따름)
*/
export const setDefaultAddress = async (id) => {
  const res = await jwtAxios.put(`${prefix}/${id}/default`);
  return res.data;
};

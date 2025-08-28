import jwtAxios from "../util/jwtUtil";

export const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${API_SERVER_HOST}/api/payment`;

// 결제 기능
export const paymentPost = async (data) => {
  const res = await jwtAxios.post(`${prefix}/complete`, data);
  return res.data;
};

// 주문 내역 기능
export const paymentList = async (userId) => {
  const res = await jwtAxios.get(`${prefix}/history/${userId}`);
  return res.data;
};

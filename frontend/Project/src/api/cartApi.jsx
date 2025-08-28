import jwtAxios from "../util/jwtUtil";

export const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${API_SERVER_HOST}/api/cart`;

// 장바구니 조회
export const getCart = async () => {
  const res = await jwtAxios.get(`${prefix}/`);
  return res.data;
};

// 장바구니등록
export const postAdd = async (data) => {
  const res = await jwtAxios.post(`${prefix}/`, data);
  return res.data;
};

// 장바구니 수량 수정
export const updateItemQty = async (cino, qty) => {
  const res = await jwtAxios.put(`${prefix}/${cino}`, {
    qty: qty,
  });
  return res.data;
};

// 장바구니 선택 삭제
export const deleteSelected = async (cinos) => {
  const res = await jwtAxios.delete(`${prefix}/`, { data: cinos });
  return res.data;
};

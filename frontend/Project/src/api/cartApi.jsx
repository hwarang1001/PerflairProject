import axios from "axios";

const API_HOST = import.meta.env.VITE_API_HOST ?? "";
const prefix = `${API_HOST}/api/cart`;

// 어떤 모양이 와도 배열로 바꿔주는 헬퍼
const normalizeToArray = (d) => {
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.items)) return d.items;
  if (Array.isArray(d?.content)) return d.content;
  if (Array.isArray(d?.data)) return d.data;
  // 흔한 페이지 응답: { data: { content: [...] } }
  if (Array.isArray(d?.data?.items)) return d.data.items;
  if (Array.isArray(d?.data?.content)) return d.data.content;
  return [];
};

export const getCart = async () => {
  const res = await axios.get(prefix);
  return normalizeToArray(res.data);
};

export const patchQuantity = async (id, quantity) =>
  (await axios.patch(`${prefix}/${id}`, { quantity })).data;

export const deleteSelected = async (ids) =>
  (await axios.delete(prefix, { data: { ids } })).data;

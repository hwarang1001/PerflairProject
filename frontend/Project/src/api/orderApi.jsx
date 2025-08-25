import jwtAxios from "../util/jwtUtil";
import { API_SERVER_HOST } from "./qnaApi"; // 이미 있는 상수 재사용 (아니면 고정 문자열로 써도 OK)

const prefix = `${API_SERVER_HOST}/api/orders`;

// 실제 백엔드 붙이면 구현 바꾸세요
export const getMyOrders = async ({ page = 1, size = 10 } = {}) => {
  throw new Error("getMyOrders not implemented. (Using mock data now)");
};

export const cancelOrder = async (orderId) => {
  throw new Error("cancelOrder not implemented. (Using mock data now)");
};

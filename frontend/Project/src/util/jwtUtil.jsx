import axios from "axios";
import { getCookie, setCookie } from "./cookieUtil";
import { API_SERVER_HOST } from "../api/productApi";

const jwtAxios = axios.create();

const refreshJWT = async (accessToken, refreshToken) => {
  const host = API_SERVER_HOST;
  const config = { headers: { Authorization: `Bearer ${accessToken}` } };
  const res = await axios.get(
    `${host}/api/member/refresh?refreshToken=${refreshToken}`,
    config
  );
  console.log("Refresh token result:", res.data);
  return res.data;
};

const beforeReq = (config) => {
  console.log("before request .......................................... ");
  const memberInfoStr = getCookie("member");

  if (!memberInfoStr) {
    console.log("Member NOT FOUND");
    return Promise.reject({
      response: {
        data: { error: "REQUIRE_LOGIN" },
      },
    });
  }
  const memberObj =
    typeof memberInfo === "string" ? JSON.parse(memberInfoStr) : memberInfoStr;

  config.headers.Authorization = `Bearer ${memberObj.accessToken}`;
  return config;
};

const requestFail = (err) => {
  console.log("request error. ........................................ ");
  return Promise.reject(err);
};

const beforeRes = async (res) => {
  console.log(
    "before return response............................................... "
  );
  const data = res.data;
  if (data && data.error === "ERROR_ACCESS_TOKEN") {
    const memberInfoStr = getCookie("member");
    if (!memberInfoStr)
      return Promise.reject({ response: { data: { error: "REQUIRE_LOGIN" } } });
    const memberInfo = JSON.parse(memberInfoStr);
    try {
      const result = await refreshJWT(
        memberInfo.accessToken,
        memberInfo.refreshToken
      );
      memberInfo.accessToken = result.accessToken;
      memberInfo.refreshToken = result.refreshToken;
      setCookie("member", JSON.stringify(memberInfo), 1);
      const originalRequest = res.config;
      originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;
      return await jwtAxios(originalRequest);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  return res;
};

const responseFail = (err) => {
  console.log(
    "response fail error. ............................................... "
  );
  return Promise.reject(err);
};

jwtAxios.interceptors.request.use(beforeReq, requestFail);
jwtAxios.interceptors.response.use(beforeRes, responseFail);

export default jwtAxios;

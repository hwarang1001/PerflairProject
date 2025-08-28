import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getAccessToken, getMemberWithAccessToken } from "../../api/kakaoApi";
import { useDispatch } from "react-redux";
import { login } from "../../slice/LoginSlice";
import useCustomLogin from "../../hook/useCustomLogin";
import Footer from "../../include/Footer";
import Header from "../../include/Header";

const KakaoRedirectPage = () => {
  const [searchParams] = useSearchParams();
  const authCode = searchParams.get("code");
  const dispatch = useDispatch();
  const { moveToPath } = useCustomLogin();
  useEffect(() => {
    getAccessToken(authCode).then((accessToken) => {
      console.log(accessToken);
      getMemberWithAccessToken(accessToken).then((memberInfo) => {
        console.log(" -------------------------- ");
        console.log(memberInfo);
        dispatch(login(memberInfo));
        //소셜 회원이 아니라면
        const isEmpty = (value) => !value || value.trim() === "";
        if (
          memberInfo.social &&
          !isEmpty(memberInfo.address) &&
          !isEmpty(memberInfo.phoneNum)
        ) {
          moveToPath("/");
        } else {
          moveToPath("/member/modify");
        }
      });
    });
  }, [authCode]);
  return (
    <div>
      <div>Kakao Login Redirect</div>
    </div>
  );
};
export default KakaoRedirectPage;

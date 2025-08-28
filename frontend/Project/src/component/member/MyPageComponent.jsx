import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { getMyProfile } from "../../api/memberApi";
import ProfileComponent from "./ProfileComponent";
import AddressComponent from "./AddressComponent";
import OrderComponent from "./OrderComponent";
import "./MyPageComponent.css";
import { useNavigate } from "react-router-dom";

export default function MyPage() {
  const loginState = useSelector((s) => s.login);
  const fallbackName =
    loginState?.name ||
    loginState?.realName ||
    loginState?.nickname ||
    loginState?.userId ||
    "회원";

  const [me, setMe] = useState({ realName: fallbackName, email: "" });
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState(false);
  const [openSecurity, setOpenSecurity] = useState(false);
  const [openAddress, setOpenAddress] = useState(false);
  const [openOrders, setOpenOrders] = useState(false);
  const isLoggedIn = Boolean(loginState?.userId);
  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);
  const loadMe = useCallback(async () => {
    try {
      const d = await getMyProfile();
      setMe({
        realName: d?.realName ?? d?.name ?? fallbackName,
        // 백엔드는 이메일을 userId 로 주기도 함
        email: d?.email ?? d?.userId ?? "",
      });
    } catch (e) {
      // 401 등: 필요시 로그인 리다이렉트
      // window.location.assign("/login?redirect=/mypage");
    }
  }, [fallbackName]);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  return (
    <section className="py-5 myhub-surface">
      <div className="container px-4 px-lg-5">
        <div className="mb-5">
          <h1 className="text-center mb-5">마이페이지</h1>
          <hr />
        </div>

        <div className="myhub-card rounded-4">
          {/* 유저 인사 */}
          <div className="myhub-row">
            <div className="myhub-left">
              <div className="fw-semibold">{me.realName} 님</div>
            </div>
          </div>
          <hr className="myhub-sep" />

          {/* 개인정보/회원정보 */}
          <div className="myhub-row">
            <div className="myhub-left">
              <div className="myhub-label">개인정보/회원정보</div>
              <div className="myhub-sub text-muted">
                {me.email || "이메일 정보가 없습니다"}
              </div>
            </div>
            <div className="myhub-right">
              <button
                className="btn btn-outline-dark btn-sm"
                onClick={() => setOpenProfile((v) => !v)}
              >
                {openProfile ? "닫기" : "변경"}
              </button>
            </div>
          </div>
          {openProfile && (
            <div className="myhub-panel">
              {/* 저장 시 상단 요약도 즉시 반영되도록 콜백 전달 */}
              <ProfileComponent onSaved={loadMe} />
            </div>
          )}
          <hr className="myhub-sep" />

          {/* 장바구니 */}
          <div className="myhub-row">
            <div className="myhub-left">
              <div className="myhub-label">장바구니</div>
              <div className="myhub-sub text-muted">
                담아둔 상품을 확인하세요
              </div>
            </div>
            <div className="myhub-right">
              <a href="/cart" className="btn btn-outline-dark btn-sm">
                이동
              </a>
            </div>
          </div>
          <hr className="myhub-sep" />

          {/* 주문내역 */}
          <div className="myhub-row">
            <div className="myhub-left">
              <div className="myhub-label">주문내역</div>
            </div>
            <div className="myhub-right">
              <button
                className="btn btn-outline-dark btn-sm"
                onClick={() => setOpenOrders((v) => !v)}
              >
                {openOrders ? "닫기" : "이동"}
              </button>
            </div>
          </div>
          {openOrders && (
            <div className="myhub-panel">
              <OrderComponent />
            </div>
          )}
          <hr className="myhub-sep" />

          {/* 배송지 관리 */}
          <div className="myhub-row">
            <div className="myhub-left">
              <div className="myhub-label">배송지 관리</div>
            </div>
            <div className="myhub-right">
              <button
                className="btn btn-outline-dark btn-sm"
                onClick={() => setOpenAddress((v) => !v)}
              >
                {openAddress ? "닫기" : "이동"}
              </button>
            </div>
          </div>
          {openAddress && (
            <div className="myhub-panel">
              {/* 주소 저장 후 상단 요약도 즉시 반영 */}
              <AddressComponent onSaved={loadMe} />
            </div>
          )}
          <hr className="myhub-sep" />

          {/* 1:1 문의 / 공지사항 */}
          <div className="myhub-row">
            <div className="myhub-left">
              <div className="myhub-label">1:1 문의하기</div>
            </div>
            <div className="myhub-right">
              <a href="/qna" className="btn btn-outline-dark btn-sm">
                이동
              </a>
            </div>
          </div>
          <hr className="myhub-sep" />

          <div className="myhub-row">
            <div className="myhub-left">
              <div className="myhub-label">공지사항</div>
            </div>
            <div className="myhub-right">
              <a href="/notice" className="btn btn-outline-dark btn-sm">
                이동
              </a>
            </div>
          </div>
        </div>

        <div style={{ height: 24 }} />
      </div>
    </section>
  );
}

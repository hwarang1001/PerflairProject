import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getMyProfile } from "../../api/memberApi";
import ProfileComponent from "./ProfileComponent";
import PasswordComponent from "./PasswordComponent";
//import AddressComponent from "./AddressComponent";
//import OrdersSection from "./OrdersSection";

import "./MyPageComponent.css";

export default function MyPage() {
  const loginState = useSelector((s) => s.login);

  // 주문현황(더미) — 실제 API 연결 시 치환
  const orderStat = { pending: 0, paid: 0, shipping: 0, delivered: 0 };

  // 이름 폴백 계산
  const fallbackName =
    loginState?.name || loginState?.nickname || loginState?.userId || "회원";

  // 프로필 표시용 상태
  const [me, setMe] = useState({ realName: fallbackName, email: "" });

  // 펼침 제어
  const [openProfile, setOpenProfile] = useState(false);
  const [openSecurity, setOpenSecurity] = useState(false);
  const [openAddress, setOpenAddress] = useState(false);
  const [openOrders, setOpenOrders] = useState(false);

  // 프로필 가져오기 (간소화 버전)
  useEffect(() => {
    getMyProfile()
      .then((d) =>
        setMe({
          realName: d?.realName || fallbackName,
          email: d?.email || "",
        })
      )
      .catch(() => {
        // 필요시 401 처리: location.assign("/login?redirect=/mypage");
      });
  }, [fallbackName]);

  return (
    <section className="py-5 myhub-surface">
      <div className="container px-4 px-lg-5">
        {/* ===== 공지사항 페이지와 동일한 톤의 헤더 ===== */}
        <div className="mb-5">
          <h1 className="text-center mb-5">마이페이지</h1>
          <hr />
        </div>
        {/* =========================================== */}

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
              <ProfileComponent />
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
              <a href="/member/cart" className="btn btn-outline-dark btn-sm">
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
              <OrdersSection />
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
              <AddressComponent />
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

function StatusChip({ label, value }) {
  return (
    <div className="myhub-chip">
      <div className="myhub-chip-label">{label}</div>
      <div className="myhub-chip-value">{value}</div>
    </div>
  );
}

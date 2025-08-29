import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import Loading from "../page/Loading";

const MainPage = lazy(() => import("../page/MainPage"));

// product
const ProductListPage = lazy(() => import("../page/product/ListPage"));
const ProductReadPage = lazy(() => import("../page/product/ReadPage"));
const ProductAddPage = lazy(() => import("../page/product/AddPage"));
const ProductModyfyPage = lazy(() => import("../page/product/ModifyPage"));
const ProductAdminListPage = lazy(() =>
  import("../page/product/AdminListPage")
);

// notice
const NoticeListPage = lazy(() => import("../page/notice/ListPage"));
const NoticeReadPage = lazy(() => import("../page/notice/ReadPage"));
const NoticeWritePage = lazy(() => import("../page/notice/WritePage"));

// qna
const QnaListPage = lazy(() => import("../page/qna/ListPage"));
const QnaReadPage = lazy(() => import("../page/qna/ReadPage"));
const QnaWritePage = lazy(() => import("../page/qna/WritePage"));

// login
const LoginPage = lazy(() => import("../page/login/LoginPage"));
const RegisterPage = lazy(() => import("../page/login/RegisterPage"));
const FindIdPage = lazy(() => import("../page/login/FindIdPage"));
const FindPasswordPage = lazy(() => import("../page/login/FindPasswordPage"));

// cart
const CartPage = lazy(() => import("../page/cart/CartPage"));

// payment
const PaymentPage = lazy(() => import("../page/payment/PaymentPage.jsx"));

// member
const MyPage = lazy(() => import("../page/member/MyPage"));
const AdminPage = lazy(() => import("../page/member/AdminPage.jsx"));

// review
const ReviewListPage = lazy(() => import("../page/review/ListPage.jsx"));
const ReviewReadPage = lazy(() => import("../page/review/ReadPage.jsx"));
// kakaoredierct
const KakaoRedirect = lazy(() =>
  import("../page/member/KakaoRedirectPage.jsx")
);
const KakaoModify = lazy(() => import("../page/member/ModifyPage.jsx"));

const root = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Loading />}>
        <MainPage />
      </Suspense>
    ),
  },
  // product
  {
    path: "/product/list",
    element: (
      <Suspense fallback={<Loading />}>
        <ProductListPage />
      </Suspense>
    ),
  },
  {
    path: `/product/read/:pno`,
    element: (
      <Suspense fallback={<Loading />}>
        <ProductReadPage />
      </Suspense>
    ),
  },
  {
    path: `/product/add`,
    element: (
      <Suspense fallback={<Loading />}>
        <ProductAddPage />
      </Suspense>
    ),
  },
  {
    path: `/product/modify/:pno`,
    element: (
      <Suspense fallback={<Loading />}>
        <ProductModyfyPage />
      </Suspense>
    ),
  },
  {
    path: `/product/admin/list`,
    element: (
      <Suspense fallback={<Loading />}>
        <ProductAdminListPage />
      </Suspense>
    ),
  },
  // notice
  {
    path: "/notice",
    element: (
      <Suspense fallback={<Loading />}>
        <NoticeListPage />
      </Suspense>
    ),
  },
  {
    path: "/notice/:id",
    element: (
      <Suspense fallback={<Loading />}>
        <NoticeReadPage />
      </Suspense>
    ),
  },
  {
    path: "/notice/write",
    element: (
      <Suspense fallback={<Loading />}>
        <NoticeWritePage />
      </Suspense>
    ),
  },
  {
    path: "/notice/edit/:id",
    element: (
      <Suspense fallback={<Loading />}>
        <NoticeWritePage />
      </Suspense>
    ),
  },
  // qna
  {
    path: "/qna",
    element: (
      <Suspense fallback={<Loading />}>
        <QnaListPage />
      </Suspense>
    ),
  },
  {
    path: "/qna/:id",
    element: (
      <Suspense fallback={<Loading />}>
        <QnaReadPage />
      </Suspense>
    ),
  },
  {
    path: "/qna/write",
    element: (
      <Suspense fallback={<Loading />}>
        <QnaWritePage />
      </Suspense>
    ),
  },
  {
    path: "/qna/edit/:id",
    element: (
      <Suspense fallback={<Loading />}>
        <QnaWritePage />
      </Suspense>
    ),
  },
  // login
  {
    path: "/login",
    element: (
      <Suspense fallback={<Loading />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: "/login/register",
    element: (
      <Suspense fallback={<Loading />}>
        <RegisterPage />
      </Suspense>
    ),
  },
  {
    path: "/login/find-id",
    element: (
      <Suspense fallback={<Loading />}>
        <FindIdPage />
      </Suspense>
    ),
  },
  {
    path: "/login/find-password",
    element: (
      <Suspense fallback={<Loading />}>
        <FindPasswordPage />
      </Suspense>
    ),
  },
  {
    path: "/cart",
    element: (
      <Suspense fallback={<Loading />}>
        <CartPage />
      </Suspense>
    ),
  },
  //payment
  {
    path: "/payment",
    element: (
      <Suspense fallback={<Loading />}>
        <PaymentPage />
      </Suspense>
    ),
  },
  // member(마이페이지)
  {
    path: "/member/mypage",
    element: (
      <Suspense fallback={<Loading />}>
        <MyPage />
      </Suspense>
    ),
  },
  {
    path: "/member/adminpage",
    element: (
      <Suspense fallback={<Loading />}>
        <AdminPage />
      </Suspense>
    ),
  },
  //review
  {
    path: "/review/list",
    element: (
      <Suspense fallback={<Loading />}>
        <ReviewListPage />
      </Suspense>
    ),
  },
  {
    path: "/review/read/:id",
    element: (
      <Suspense fallback={<Loading />}>
        <ReviewReadPage />
      </Suspense>
    ),
  },
  // kakao
  {
    path: "/member/kakao",
    element: (
      <Suspense fallback={<Loading />}>
        <KakaoRedirect />
      </Suspense>
    ),
  },
  {
    path: "/member/modify",
    element: (
      <Suspense fallback={Loading}>
        <KakaoModify />
      </Suspense>
    ),
  },
]);
export default root;

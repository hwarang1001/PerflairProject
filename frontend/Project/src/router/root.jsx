import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import Loading from "../page/Loading";
const MainPage = lazy(() => import("../page/MainPage"));
// product
const ProductListPage = lazy(() => import("../page/product/ListPage"));
const ProductReadPage = lazy(() => import("../page/product/ReadPage"));
// notice
const NoticeListPage = lazy(() => import("../page/notice/ListPage"));
const NoticeReadPage = lazy(() => import("../page/notice/ReadPage"));
// qna
const QnaListPage = lazy(() => import("../page/qna/ListPage"));
const QnaReadPage = lazy(() => import("../page/qna/ReadPage"));
const QnaWritePage = lazy(() => import("../page/qna/WritePage"));

// login
const LoginPage = lazy(() => import("../page/LoginPage"));
const RegisterPage = lazy(() => import("../page/RegisterPage"));

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
    path: `/product/read${3}`,
    element: (
      <Suspense fallback={<Loading />}>
        <ProductReadPage />
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
]);
export default root;

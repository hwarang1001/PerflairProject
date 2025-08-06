import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import Loading from "../page/Loading";
const MainPage = lazy(() => import("../page/MainPage"));
// product
const ProductListPage = lazy(() => import("../page/product/ListPage"));
const ProductReadPage = lazy(() => import("../page/product/ReadPage"));

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
]);
export default root;

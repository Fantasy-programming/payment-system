import React from "react";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
  RouteObject,
} from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { UserDashboardLayout } from "./user/root";
import { UserHomeView } from "./user/home";
import { HistoryView } from "./user/history";
import { Login } from "./auth/login";
import { homeLoader, historyLoader, productsLoader } from "./user/loaders";
import {
  adminHomeLoader,
  ordersLoader,
  adminProductsLoader,
  usersLoader,
} from "./admin/loaders";
import Verify from "./auth/verify";
import { AdminDashboardLayout } from "./admin/root";
import { AdminHomeView } from "./admin/home";
import SettingsView from "./user/settings";
import { UnProtectedRoute } from "./UnProtectedRoute";
import { QueryClient } from "@tanstack/react-query";
import { SubscribeView } from "./user/subscribe";
import { HistoryDetailView } from "./user/historyDetail";
import { HistoryIndex } from "./user/historyindex";
import { ErrorPage } from "./error-page";
import { AdminOrdersView } from "./admin/orders";
import { AdminProductsView } from "./admin/products";
import { AdminCustomerView } from "./admin/customers";
import { AdminAnalyticsView } from "./admin/analytics";
import AdminSettingsView from "./admin/settings";

const Routes: React.FC = () => {
  const queryClient = new QueryClient();

  const protectedUserRoutes: RouteObject[] = [
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute role="user">
          <UserDashboardLayout />
        </ProtectedRoute>
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          path: "",
          element: <Navigate to="home" replace />,
        },
        {
          path: "home",
          element: <UserHomeView />,
          loader: homeLoader(queryClient),
        },
        {
          path: "subscribe",
          element: <SubscribeView />,
          loader: productsLoader(queryClient),
        },
        {
          path: "history",
          element: <HistoryView />,
          loader: historyLoader(queryClient),
          children: [
            {
              index: true,
              element: <HistoryIndex />,
            },
            {
              path: ":id",
              element: <HistoryDetailView />,
              loader: homeLoader(queryClient),
            },
          ],
        },

        {
          path: "settings",
          element: <SettingsView />,
        },
      ],
    },
  ];

  const protectedAdminRoutes: RouteObject[] = [
    {
      path: "/admin",
      element: (
        <ProtectedRoute role="admin">
          <AdminDashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "",
          element: <Navigate to="home" replace />,
        },
        {
          path: "home",
          element: <AdminHomeView />,
          loader: adminHomeLoader(queryClient),
        },
        {
          path: "orders",
          children: [
            {
              index: true,
              element: <AdminOrdersView />,
              loader: ordersLoader(queryClient),
            },
            {
              path: ":id",
            },
          ],
        },
        {
          path: "products",
          children: [
            {
              index: true,
              element: <AdminProductsView />,
              loader: adminProductsLoader(queryClient),
            },
            {
              path: ":id",
            },
          ],
        },
        {
          path: "customers",
          children: [
            {
              index: true,
              element: <AdminCustomerView />,
              loader: usersLoader(queryClient),
            },
            {
              path: ":id",
            },
          ],
        },
        {
          path: "analytics",
          element: <AdminAnalyticsView />,
        },
        {
          path: "settings",
          element: <AdminSettingsView />,
        },
      ],
    },
  ];

  const nonAuthenticatedRoutes: RouteObject[] = [
    {
      path: "/",
      element: <Navigate to="/login" replace />,
    },
    {
      path: "/login",
      element: (
        <UnProtectedRoute>
          <Login />
        </UnProtectedRoute>
      ),
    },
    {
      path: "/verify",
      element: (
        <UnProtectedRoute>
          <Verify />
        </UnProtectedRoute>
      ),
    },
  ];

  const router = createBrowserRouter([
    ...nonAuthenticatedRoutes,
    ...protectedUserRoutes,
    ...protectedAdminRoutes,
    {
      path: "*",
      element: <Navigate to="/login" replace />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;

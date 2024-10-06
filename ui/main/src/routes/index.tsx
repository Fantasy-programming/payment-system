import React from "react";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
  RouteObject,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ProtectedRoute } from "./ProtectedRoute";
import { UnProtectedRoute } from "./UnProtectedRoute";
import { ErrorPage } from "./error-page";

import { Login } from "./auth/login";
import { Verify } from "./auth/verify";

import { UserDashboardLayout } from "./user/root";
import { UserHomeView } from "./user/home";
import { HistoryView } from "./user/history";
import { HistoryDetailView } from "./user/historyDetail";
import { SettingsView } from "./user/settings";
import { HistoryIndex } from "./user/historyindex";
import { SubscribeView } from "./user/subscribe";
import {
  homeLoader,
  historyLoader,
  productsLoader,
  settingsLoader,
  historyDetailLoader,
} from "./user/loaders";

import { AdminDashboardLayout } from "./admin/root";
import { AdminHomeView } from "./admin/home";
import { AdminOrdersView } from "./admin/orders";
import { AdminProductsView } from "./admin/products";
import { SelectedProductView } from "./admin/product-view";
import { AdminCustomerView } from "./admin/customers";
import { AdminAlertingSettings } from "./admin/settings-alerting";
import {
  adminHomeLoader,
  ordersLoader,
  adminProductsLoader,
  usersLoader,
  adminProductLoader,
  userLoader,
  adminSettingsLoader,
} from "./admin/loaders";
import { NewProductView } from "./admin/newproduct-view";
import { UserCreationPage } from "./admin/customer-view";
import { UserViewPage } from "./admin/newcustomer-view";
import { AdminGeneralSetting } from "./admin/settings-general";
import { AdminSettingsView } from "./admin/settings-root";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
    },
  },
});

const Routes: React.FC = () => {
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
          element: <Navigate to="home" replace />,
        },
        {
          path: "subscribe/:paymentContext",
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
              loader: historyDetailLoader(queryClient),
            },
          ],
        },

        {
          path: "settings",
          element: <SettingsView />,
          loader: settingsLoader(queryClient),
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
      errorElement: <ErrorPage />,
      children: [
        {
          path: "",
          element: <Navigate to="home" replace />,
        },
        {
          path: "home",
          element: <AdminHomeView />,
          loader: adminHomeLoader(queryClient),
          errorElement: <ErrorPage />,
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
              path: "new",
              element: <NewProductView />,
            },
            {
              path: ":id",
              element: <SelectedProductView />,
              loader: adminProductLoader(queryClient),
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
              path: "new",
              element: <UserCreationPage />,
            },
            {
              path: ":id",
              element: <UserViewPage />,
              loader: userLoader(queryClient),
            },
          ],
        },
        {
          path: "settings",
          element: <AdminSettingsView />,
          children: [
            {
              path: "",
              element: <Navigate to="general" replace />,
            },
            {
              path: "general",
              element: <AdminGeneralSetting />,
              loader: adminSettingsLoader(queryClient),
            },
            {
              path: "alerting",
              element: <AdminAlertingSettings />,
              loader: adminSettingsLoader(queryClient),
            },
          ],
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

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default Routes;

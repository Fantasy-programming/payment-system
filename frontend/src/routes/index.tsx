import React from "react";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
  RouteObject,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "@/providers/AuthProvider";
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
} from "./user/loaders";

import { AdminDashboardLayout } from "./admin/root";
import { AdminHomeView } from "./admin/home";
import { AdminOrdersView } from "./admin/orders";
import { AdminProductsView } from "./admin/products";
import { SelectedProductView } from "./admin/product-view";
import { AdminCustomerView } from "./admin/customers";
import { AdminSettingsView } from "./admin/settings";
import {
  adminHomeLoader,
  ordersLoader,
  adminProductsLoader,
  usersLoader,
  adminProductLoader,
  userLoader,
} from "./admin/loaders";
import { NewProductView } from "./admin/newproduct-view";
import { UserCreationPage } from "./admin/customer-view";
import { UserViewPage } from "./admin/newcustomer-view";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
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
          element: <SubscribeView type="subscription" />,
          loader: productsLoader(queryClient),
        },
        {
          path: "top-up",
          element: <SubscribeView type="top-up" />,
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
          children: [
            {
              index: true,
              element: <AdminSettingsView />,
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
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default Routes;

import React from "react";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
  RouteObject,
} from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { homeLoader, UserDashboardLayout } from "./user/root";
import { UserHomeView } from "./user/home";
import { HistoryView } from "./user/history";
import { Login } from "./auth/login";
import Signup from "./auth/signup";
import Verify from "./auth/verify";
import { AdminHomeView } from "./admin/root";
import { AdminDashboardLayout } from "./admin/home";
import SettingsView from "./user/settings";
import { UnProtectedRoute } from "./UnProtectedRoute";

const Routes: React.FC = () => {
  const protectedUserRoutes: RouteObject[] = [
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute role="user">
          <UserDashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "",
          element: <Navigate to="home" replace />,
        },
        {
          path: "home",
          element: <UserHomeView />,
          loader: homeLoader,
        },
        {
          path: "history",
          element: <HistoryView />,
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
          <AdminDashboardLayout />{" "}
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
    {
      path: "/signup",
      element: (
        <UnProtectedRoute>
          <Signup />
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

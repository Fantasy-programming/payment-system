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
import { Login } from "./auth/login";
import Signup from "./auth/signup";
import Verify from "./auth/verify";
import { AdminHomeView } from "./admin/root";
import { AdminDashboardLayout } from "./admin/home";

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
        },
        // Add more nested routes as needed
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
      element: <Login />,
    },
    {
      path: "/verify",
      element: <Verify />,
    },
    {
      path: "/signup",
      element: <Signup />,
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

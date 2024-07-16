import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

interface UnProtectedRouteProps {
  children: React.ReactNode;
}

export const UnProtectedRoute = ({ children }: UnProtectedRouteProps) => {
  const { user } = useAuth();

  if (user.token && user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (user.token && user.role === "user") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  role: "user" | "admin";
  children: React.ReactNode;
}

export const ProtectedRoute = ({ role, children }: ProtectedRouteProps) => {
  const { user } = useAuth();

  // if the user is not authenticated
  if (!user.token || (role && user.role !== role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

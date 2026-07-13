import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/auth/useAuth";

export default function AdminRoute({ children }) {
  const { data: user, isLoading, isFetching } = useAuth();

  if (isLoading || isFetching) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/auth/useAuth";

export default function ProtectedRoute({ allowedRoles }) {
  const { data: user, isLoading, isFetching } = useAuth();

  if (isLoading || isFetching) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-500 font-medium">
          Đang xác thực tài khoản...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

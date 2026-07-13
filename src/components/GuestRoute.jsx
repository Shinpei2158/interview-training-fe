import { useQueryClient } from "@tanstack/react-query";
import { Navigate, Outlet } from "react-router-dom";

export default function GuestRoute({ children }) {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(["auth"]);

  if (user) {
    return (
      <Navigate
        to={user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"}
        replace
      />
    );
  }

  return children ?? <Outlet />;
}

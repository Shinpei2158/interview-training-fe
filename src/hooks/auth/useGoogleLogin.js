import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { loginWithGoogle, me } from "../../api/auth";
import { useToast } from "../../context/ToastContext";
import { getErrorMessage } from "../../utils/error";

export function useGoogleLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (idToken) => loginWithGoogle(idToken),
    onSuccess: async (data) => {
      queryClient.clear();
      const authData = await queryClient.fetchQuery({
        queryKey: ["auth"],
        queryFn: me,
      });

      toast.success(data.message || "Đăng nhập bằng Google thành công");
      navigate(authData.role === "ADMIN" ? "/admin/dashboard" : "/dashboard", {
        replace: true,
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

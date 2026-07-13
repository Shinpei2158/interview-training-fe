import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth";
import { useToast } from "../../context/ToastContext";
import { getErrorMessage } from "../../utils/error";
import { me } from "../../api/auth";

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ email, password }) => login(email, password),

    onSuccess: async (data) => {
      const authData = await queryClient.fetchQuery({
        queryKey: ["auth"],
        queryFn: me,
      });
      toast.success(data.message || "Login successful");

      navigate(authData.role === "ADMIN" ? "/admin/dashboard" : "/dashboard", {
        replace: true,
      });
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

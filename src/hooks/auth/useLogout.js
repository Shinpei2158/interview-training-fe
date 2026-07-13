import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logout } from "../../api/auth";
import { useToast } from "../../context/ToastContext";
import { getErrorMessage } from "../../utils/error";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: logout,
    onSuccess: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["auth"] });
      queryClient.setQueryData(["auth"], null);
      queryClient.removeQueries({ queryKey: ["categories"] });
      toast.success(data.message || "Signed out");
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

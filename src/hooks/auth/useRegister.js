import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { register } from "../../api/auth";
import { useToast } from "../../context/ToastContext";
import { getErrorMessage } from "../../utils/error";

export function useRegister() {
  const navigate = useNavigate();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ username, email, password, otp }) =>
      register(username, email, password, otp),
    onSuccess: (data) => {
      toast.success(
        data.message || "Account created successfully. Please sign in.",
      );
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

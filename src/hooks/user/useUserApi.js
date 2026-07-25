import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUserProfile, updateUserProfile, uploadUserAvatar } from "@/api/users";
import { useToast } from "@/context/ToastContext";

export const userKeys = {
  profile: ["user-profile"],
};

export function useUserProfile() {
  return useQuery({
    queryKey: userKeys.profile,
    queryFn: fetchUserProfile,
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      toast.success("Cập nhật thông tin cá nhân thành công!");
      queryClient.invalidateQueries({ queryKey: userKeys.profile });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (error) => {
      toast.error(error?.message || "Cập nhật thông tin thất bại");
    },
  });
}

export function useUploadUserAvatar() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: uploadUserAvatar,
    onSuccess: (data) => {
      toast.success("Cập nhật ảnh đại diện thành công!");
      queryClient.invalidateQueries({ queryKey: userKeys.profile });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (error) => {
      toast.error(error?.message || "Cập nhật ảnh đại diện thất bại");
    },
  });
}

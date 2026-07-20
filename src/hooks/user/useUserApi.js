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
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: userKeys.profile });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to update profile");
    },
  });
}

export function useUploadUserAvatar() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: uploadUserAvatar,
    onSuccess: (data) => {
      toast.success("Avatar uploaded successfully!");
      queryClient.invalidateQueries({ queryKey: userKeys.profile });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to upload avatar");
    },
  });
}

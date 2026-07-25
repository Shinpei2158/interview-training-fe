import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  acceptInterviewBooking,
  completeInterviewBooking,
  createInterviewRequest,
  fetchInterviewProfiles,
  fetchMyInterviewBookings,
  fetchMyInterviewProfile,
  fetchProfileBookings,
  rejectInterviewBooking,
  saveMyInterviewProfile,
  submitInterviewFeedback,
  uploadInterviewerDocuments,
  uploadVerificationImage,
  deleteVerificationImage,
  deleteVerificationDocument,
  fetchBookingFeedback,
  fetchRoomAccess,
  createReport,
} from "@/api/interviews";
import { useToast } from "@/context/ToastContext";

export const interviewKeys = {
  profiles: (filters) => ["interview-profiles", filters],
  myProfile: ["interview-profile", "me"],
  profileBookings: (profileId, startsAt) => ["profile-bookings", profileId, startsAt],
  myBookings: ["interview-bookings"],
  bookingFeedback: (bookingId) => ["booking-feedback", bookingId],
  roomAccess: (bookingId) => ["room-access", bookingId],
};

export function useInterviewProfiles(filters) {
  return useQuery({
    queryKey: interviewKeys.profiles(filters),
    queryFn: () => fetchInterviewProfiles(filters),
  });
}

export function useMyInterviewProfile(user) {
  return useQuery({
    queryKey: interviewKeys.myProfile,
    queryFn: fetchMyInterviewProfile,
    enabled: user?.role === "INTERVIEWER",
    retry: false,
  });
}

export function useSaveMyInterviewProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: saveMyInterviewProfile,
    onSuccess: () => {
      toast.success("Hồ sơ phỏng vấn đã được lưu");
      queryClient.invalidateQueries({ queryKey: interviewKeys.myProfile });
      queryClient.invalidateQueries({ queryKey: ["interview-profiles"] });
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useUploadInterviewerDocuments() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: uploadInterviewerDocuments,
    onSuccess: () => {
      toast.success("Tải lên tài liệu xác minh thành công!");
      queryClient.invalidateQueries({ queryKey: interviewKeys.myProfile });
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useUploadVerificationImage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: uploadVerificationImage,
    onSuccess: () => {
      toast.success("Tải lên ảnh xác minh thành công!");
      queryClient.invalidateQueries({ queryKey: interviewKeys.myProfile });
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useDeleteVerificationImage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteVerificationImage,
    onSuccess: () => {
      toast.success("Đã xóa ảnh xác minh.");
      queryClient.invalidateQueries({ queryKey: interviewKeys.myProfile });
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useDeleteVerificationDocument() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteVerificationDocument,
    onSuccess: () => {
      toast.success("Đã xóa tài liệu.");
      queryClient.invalidateQueries({ queryKey: interviewKeys.myProfile });
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useProfileBookings(profileId, window) {
  return useQuery({
    queryKey: interviewKeys.profileBookings(profileId, window.startsAt),
    queryFn: () => fetchProfileBookings(profileId, window),
    enabled: Boolean(profileId && window?.startsAt && window?.endsAt),
  });
}

export function useCreateInterviewRequest({ onSuccess } = {}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ profileId, payload }) => createInterviewRequest(profileId, payload),
    onSuccess: () => {
      toast.success("Yêu cầu phỏng vấn đã được gửi");
      queryClient.invalidateQueries({ queryKey: interviewKeys.myBookings });
      onSuccess?.();
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useMyInterviewBookings() {
  return useQuery({
    queryKey: interviewKeys.myBookings,
    queryFn: () => fetchMyInterviewBookings(),
  });
}

function useBookingAction(actionFn, successMessage) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: actionFn,
    onSuccess: () => {
      toast.success(successMessage);
      queryClient.invalidateQueries({ queryKey: interviewKeys.myBookings });
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useAcceptInterviewBooking() {
  return useBookingAction(acceptInterviewBooking, "Yêu cầu đã được chấp nhận");
}

export function useRejectInterviewBooking() {
  return useBookingAction(rejectInterviewBooking, "Yêu cầu đã bị từ chối");
}

export function useCompleteInterviewBooking() {
  return useBookingAction(completeInterviewBooking, "Cuộc phỏng vấn đã hoàn thành");
}

export function useSubmitInterviewFeedback() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ bookingId, payload }) => submitInterviewFeedback(bookingId, payload),
    onSuccess: (_, { bookingId }) => {
      toast.success("Đã nộp phản hồi");
      queryClient.invalidateQueries({ queryKey: interviewKeys.myBookings });
      queryClient.invalidateQueries({ queryKey: interviewKeys.bookingFeedback(bookingId) });
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useBookingFeedback(bookingId) {
  return useQuery({
    queryKey: interviewKeys.bookingFeedback(bookingId),
    queryFn: () => fetchBookingFeedback(bookingId),
    enabled: Boolean(bookingId),
  });
}

export function useRoomAccess(bookingId) {
  return useQuery({
    queryKey: interviewKeys.roomAccess(bookingId),
    queryFn: () => fetchRoomAccess(bookingId),
    enabled: Boolean(bookingId),
    refetchInterval: 10000,
  });
}

export function useSubmitReport() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: createReport,
    onSuccess: () => {
      toast.success("Gửi báo cáo thành công");
    },
    onError: (error) => toast.error(error.message || "Gửi báo cáo thất bại"),
  });
}

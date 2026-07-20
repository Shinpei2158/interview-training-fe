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
} from "@/api/interviews";
import { useToast } from "@/context/ToastContext";

export const interviewKeys = {
  profiles: (filters) => ["interview-profiles", filters],
  myProfile: ["interview-profile", "me"],
  profileBookings: (profileId, startsAt) => ["profile-bookings", profileId, startsAt],
  myBookings: ["interview-bookings"],
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
      toast.success("Interview profile saved");
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
      toast.success("Verification documents uploaded successfully!");
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
      toast.success("Verification image uploaded!");
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
      toast.success("Verification image removed.");
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
      toast.success("Document removed.");
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
      toast.success("Interview request sent");
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
  return useBookingAction(acceptInterviewBooking, "Request accepted");
}

export function useRejectInterviewBooking() {
  return useBookingAction(rejectInterviewBooking, "Request rejected");
}

export function useCompleteInterviewBooking() {
  return useBookingAction(completeInterviewBooking, "Interview completed");
}

export function useSubmitInterviewFeedback() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ bookingId, payload }) => submitInterviewFeedback(bookingId, payload),
    onSuccess: () => {
      toast.success("Feedback submitted");
      queryClient.invalidateQueries({ queryKey: interviewKeys.myBookings });
    },
    onError: (error) => toast.error(error.message),
  });
}

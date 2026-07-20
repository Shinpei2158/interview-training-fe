import apiClient from "../config/apiClient";

export function fetchInterviewProfiles({ keyword, subCategoryIds, page = 0, size = 12 } = {}) {
  const params = { page, size };

  if (keyword) params.keyword = keyword;
  if (subCategoryIds && subCategoryIds.length > 0) {
    params.subCategoryIds = subCategoryIds;
  }

  return apiClient.get("/api/interviews/profiles", {
    params,
    paramsSerializer: (p) => {
      const searchParams = new URLSearchParams();
      Object.entries(p).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(key, v));
        } else {
          searchParams.append(key, value);
        }
      });
      return searchParams.toString();
    },
  });
}

export function fetchMyInterviewProfile() {
  return apiClient.get("/api/interviews/profiles/me");
}

export function saveMyInterviewProfile(payload) {
  return apiClient.put("/api/interviews/profiles/me", payload);
}

export function uploadInterviewerDocuments(files) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });
  return apiClient.post("/api/interviews/profiles/me/documents", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function uploadVerificationImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  return apiClient.post("/api/interviews/profiles/me/verification-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function deleteVerificationImage() {
  return apiClient.delete("/api/interviews/profiles/me/verification-image");
}

export function deleteVerificationDocument(docIndex) {
  return apiClient.delete(`/api/interviews/profiles/me/documents/${docIndex}`);
}

export function createInterviewRequest(profileId, payload) {
  return apiClient.post(
    `/api/interviews/profiles/${profileId}/requests`,
    payload,
  );
}

export function fetchProfileBookings(profileId, { startsAt, endsAt }) {
  return apiClient.get(`/api/interviews/profiles/${profileId}/bookings`, {
    params: { startsAt, endsAt },
  });
}

export function fetchMyInterviewBookings({ page = 0, size = 20 } = {}) {
  return apiClient.get("/api/interviews/bookings/me", {
    params: { page, size },
  });
}

export function acceptInterviewBooking(bookingId) {
  return apiClient.patch(`/api/interviews/bookings/${bookingId}/accept`);
}

export function rejectInterviewBooking(bookingId) {
  return apiClient.patch(`/api/interviews/bookings/${bookingId}/reject`);
}

export function completeInterviewBooking(bookingId) {
  return apiClient.patch(`/api/interviews/bookings/${bookingId}/complete`);
}

export function submitInterviewFeedback(bookingId, payload) {
  return apiClient.post(
    `/api/interviews/bookings/${bookingId}/feedback`,
    payload,
  );
}

export function submitInterviewSummary(bookingId, payload) {
  return apiClient.post(
    `/api/interviews/bookings/${bookingId}/summary`,
    payload,
  );
}

export function fetchInterviewSummary(bookingId) {
  return apiClient.get(`/api/interviews/bookings/${bookingId}/summary`);
}

export function fetchStringeeToken() {
  return apiClient.post("/api/interviews/stringee-token");
}

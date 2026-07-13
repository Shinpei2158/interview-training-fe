import apiClient from "@/config/apiClient";

export function fetchNotifications() {
  return apiClient.get("/api/notifications/me");
}

export function markNotificationRead(notificationId) {
  return apiClient.patch(`/api/notifications/${notificationId}/read`);
}

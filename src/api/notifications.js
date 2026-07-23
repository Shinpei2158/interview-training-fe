// API utilities for notification operations
import apiClient from "@/config/apiClient";

/**
 * Fetch the current user's notification feed.
 * The backend returns { unreadCount, notifications }.
 * apiClient interceptor already unwraps response.data, so we return directly.
 */
export const fetchNotifications = async () => {
  const result = await apiClient.get("/api/notifications/me");
  // result is already the parsed body thanks to the axios interceptor
  return result ?? { unreadCount: 0, notifications: [] };
};

/**
 * Mark a specific notification as read.
 * @param {string} id - Notification UUID
 */
export const markNotificationRead = async (id) => {
  await apiClient.patch(`/api/notifications/${id}/read`);
};

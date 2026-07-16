// API utilities for notification operations
import apiClient from "@/config/apiClient";

/**
 * Fetch the current user's notification feed.
 * The backend returns { unreadCount, notifications }.
 */
export const fetchNotifications = async () => {
  const { data } = await apiClient.get("/api/notifications/me");
  return data;
};

/**
 * Mark a specific notification as read.
 * @param {string|number} id - Notification UUID
 */
export const markNotificationRead = async (id) => {
  await apiClient.patch(`/api/notifications/${id}/read`);
};

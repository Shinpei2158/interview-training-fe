import apiClient from "@/config/apiClient";

/**
 * Fetch all users with optional filters.
 * The backend returns a paginated response; for the admin UI we request a large page size.
 */
export function fetchUsers(params = { size: 1000 }) {
  return apiClient.get("/api/users", { params });
}

/**
 * Update a user's role.
 * @param {string} userId - UUID of the user
 * @param {string} role - New role (e.g., 'USER' or 'INTERVIEWER')
 */
export function updateUserRole(userId, role) {
  return apiClient.patch(`/api/users/${userId}/role`, { role });
}

/**
 * Update a user's active status (ban/unban).
 * @param {string} userId - UUID of the user
 * @param {boolean} isActive - true to enable, false to ban
 */
export function updateUserActive(userId, isActive) {
  return apiClient.patch(`/api/users/${userId}/active`, { active: isActive });
}

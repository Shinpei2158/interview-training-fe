import apiClient from "@/config/apiClient";

/**
 * Fetch overall system statistics for Admin Dashboard.
 */
export function fetchAdminOverviewStats() {
  return apiClient.get("/api/admin/overview");
}

/**
 * Fetch pending interviewer registration requests.
 */
export function fetchPendingInterviewerRequests() {
  return apiClient.get("/api/admin/interviewer-requests");
}

/**
 * Approve interviewer registration request (upgrades user to INTERVIEWER).
 */
export function approveInterviewerRequest(userId) {
  return apiClient.post(`/api/admin/interviewer-requests/${userId}/approve`);
}

/**
 * Reject interviewer registration request.
 */
export function rejectInterviewerRequest(userId, reason) {
  return apiClient.post(`/api/admin/interviewer-requests/${userId}/reject`, { reason });
}

/**
 * Fetch quizzes for Admin management.
 */
export function fetchAdminQuizzes() {
  return apiClient.get("/api/admin/quizzes");
}

/**
 * Approve quiz for public catalog.
 */
export function approveQuizAdmin(quizId) {
  return apiClient.patch(`/api/admin/quizzes/${quizId}/approve`);
}

/**
 * Request edits for a quiz.
 */
export function requestQuizEditAdmin(quizId, note) {
  return apiClient.patch(`/api/admin/quizzes/${quizId}/request-edit`, { note });
}

/**
 * Fetch incident reports for Admin.
 */
export async function fetchAdminReports() {
  const data = await apiClient.get("/api/reports");
  return Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : [];
}

/**
 * Resolve report.
 */
export function resolveReportAdmin(reportId, resolutionNote) {
  return apiClient.patch(`/api/reports/${reportId}/resolve`, { resolutionNote });
}

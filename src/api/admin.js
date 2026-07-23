import apiClient from "@/config/apiClient";

/**
 * Fetch overall system statistics for Admin Dashboard.
 */
export async function fetchAdminOverviewStats() {
  const res = await apiClient.get("/api/admin/overview");
  return res.data;
}

/**
 * Fetch pending interviewer registration requests.
 */
export async function fetchPendingInterviewerRequests() {
  const res = await apiClient.get("/api/admin/interviewer-requests");
  return res.data;
}

/**
 * Approve interviewer registration request (upgrades user to INTERVIEWER).
 */
export async function approveInterviewerRequest(userId) {
  const res = await apiClient.post(`/api/admin/interviewer-requests/${userId}/approve`);
  return res.data;
}

/**
 * Reject interviewer registration request.
 */
export async function rejectInterviewerRequest(userId, reason) {
  const res = await apiClient.post(`/api/admin/interviewer-requests/${userId}/reject`, { reason });
  return res.data;
}

/**
 * Fetch quizzes for Admin management.
 */
export async function fetchAdminQuizzes() {
  const res = await apiClient.get("/api/admin/quizzes");
  return res.data;
}

/**
 * Approve quiz for public catalog.
 */
export async function approveQuizAdmin(quizId) {
  const res = await apiClient.patch(`/api/admin/quizzes/${quizId}/approve`);
  return res.data;
}

/**
 * Request edits for a quiz.
 */
export async function requestQuizEditAdmin(quizId, note) {
  const res = await apiClient.patch(`/api/admin/quizzes/${quizId}/request-edit`, { note });
  return res.data;
}

/**
 * Fetch incident reports for Admin.
 */
export async function fetchAdminReports() {
  const res = await apiClient.get("/api/reports");
  const rawData = res.data;
  return Array.isArray(rawData?.content) ? rawData.content : Array.isArray(rawData) ? rawData : [];
}

/**
 * Resolve report.
 */
export async function resolveReportAdmin(reportId, resolutionNote) {
  const res = await apiClient.patch(`/api/reports/${reportId}/resolve`, { resolutionNote });
  return res.data;
}

import apiClient from "../config/apiClient";

export async function fetchQuiz({ keyword, subCategoryIds, page = 0 }) {
  const params = {
    page,
    size: 12,
  };

  if (keyword) {
    params.keyword = keyword;
  }

  if (subCategoryIds?.length) {
    params.subCategoryIds = subCategoryIds;
  }

  return await apiClient.get("/api/quizzes", { params });
}

export function fetchQuizQuestions(quizId) {
  return apiClient.get(`/api/quizzes/${quizId}/questions`);
}

export function fetchQuizAnswers(quizId, questionIds = []) {
  const params = {};

  if (questionIds.length) {
    params.questionIds = questionIds;
  }

  return apiClient.get(`/api/quizzes/${quizId}/answers`, { params });
}

export function fetchQuizLevelCounts(quizId) {
  return apiClient.get(`/api/quizzes/${quizId}/level-counts`);
}

export function generateQuizTest(quizId, payload) {
  return apiClient.post(`/api/quizzes/${quizId}/tests`, payload);
}

export function saveQuizTestProgress(quizId, payload) {
  return apiClient.post(`/api/quizzes/${quizId}/test-progress`, payload);
}

export function fetchQuizProgress() {
  return apiClient.get("/api/quizzes/progress/me");
}

export function fetchQuizProgressDetail(progressId) {
  return apiClient.get(`/api/quizzes/progress/${progressId}`);
}

export function retakeProgress(progressId) {
  return apiClient.post(`/api/quizzes/progress/${progressId}/retake`);
}

export function fetchLikedQuizzes() {
  return apiClient.get("/api/quizzes/liked/me");
}

export function likeQuiz(quizId) {
  return apiClient.post(`/api/quizzes/${quizId}/like`);
}

export function rateQuiz(quizId, rating) {
  return apiClient.post(`/api/quizzes/${quizId}/rating`, { rating });
}

export function saveQuestion(questionId) {
  return apiClient.post(`/api/quizzes/questions/${questionId}/save`);
}

export function fetchSavedQuestions() {
  return apiClient.get("/api/quizzes/saved-questions/me");
}

export function createQuiz(payload) {
  return apiClient.post("/api/quizzes", payload);
}

export function reportContent(payload) {
  return apiClient.post("/api/reports", payload);
}

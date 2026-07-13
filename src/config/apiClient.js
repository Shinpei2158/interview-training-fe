import axios from "axios";
import { API_BASE_URL } from "./env";

export class ApiError extends Error {
  constructor(message, status, code = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise = null;

const SKIP_REFRESH_ENDPOINTS = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/google",
  "/api/auth/refresh",
  "/api/auth/logout",
  "/api/auth/register/send-otp",
  "/api/auth/forgot-password/send-otp",
  "/api/auth/forgot-password/reset",
];

function shouldSkipRefresh(url = "") {
  return SKIP_REFRESH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

function toApiError(error, fallbackMessage = "Something went wrong") {
  if (error instanceof ApiError) {
    return error;
  }

  const data = error.response?.data;
  const message = data?.message || error.message || fallbackMessage;
  const status = error.response?.status || 500;
  const code = data?.code || null;

  return new ApiError(message, status, code);
}

apiClient.interceptors.response.use(
  (response) => response.data,

  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url ?? "";

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !shouldSkipRefresh(requestUrl)
    ) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = axios
          .post(
            `${API_BASE_URL}/api/auth/refresh`,
            {},
            {
              withCredentials: true,
            },
          )
          .finally(() => {
            refreshPromise = null;
          });
      }

      try {
        await refreshPromise;
        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(
          toApiError(refreshError, "Your session has expired. Please sign in again."),
        );
      }
    }

    return Promise.reject(toApiError(error));
  },
);

export default apiClient;

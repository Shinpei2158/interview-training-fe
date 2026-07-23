import apiClient from "../config/apiClient";

export async function login(email, password) {
  return apiClient.post("/api/auth/login", {
    email,
    password,
  });
}

export async function loginWithGoogle(idToken) {
  return apiClient.post("/api/auth/google", { idToken });
}

export async function sendRegisterOtp(email) {
  return apiClient.post("/api/auth/register/send-otp", { email });
}

export async function register(username, email, password, otp) {
  return apiClient.post("/api/auth/register", {
    username,
    email,
    password,
    otp,
  });
}

export async function sendForgotPasswordOtp(email) {
  return apiClient.post("/api/auth/forgot-password/send-otp", { email });
}

export async function resetPassword(email, otp, newPassword) {
  return apiClient.post("/api/auth/forgot-password/reset", {
    email,
    otp,
    newPassword,
  });
}

export function me() {
  return apiClient.get("/api/auth/me");
}

export function logout() {
  return apiClient.post("/api/auth/logout");
}

export function refresh() {
  return apiClient.post("/api/auth/refresh");
}

export async function sendChangePasswordOtp(oldPassword, newPassword) {
  return apiClient.post("/api/auth/change-password/send-otp", {
    oldPassword,
    newPassword,
  });
}

export async function confirmChangePassword(otp) {
  return apiClient.post("/api/auth/change-password/confirm", {
    otp,
  });
}

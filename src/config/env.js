const rawBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

export const API_BASE_URL = rawBaseUrl.replace(/\/$/, "");

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";

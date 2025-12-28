// src/api/api.js
import axios from "axios";

/**
 * BASE URL BACKEND (PRODUCTION)
 * ⛔ JANGAN pakai /api
 */
export const API_BASE_URL = "https://panenmania-sigma.vercel.app";

/**
 * Axios instance utama
 */
const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Helper: ambil token (admin > user)
 */
const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token")
  );
};

/**
 * Cek apakah JWT token masih valid
 */
export const isTokenValid = () => {
  try {
    const raw = getAuthToken();
    if (!raw) return false;

    const token = raw.startsWith("Bearer ")
      ? raw.split(" ")[1]
      : raw;

    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return true;

    return Date.now() < payload.exp * 1000;
  } catch {
    return false;
  }
};

/**
 * REQUEST INTERCEPTOR
 * → pasang Authorization Bearer token otomatis
 */
API.interceptors.request.use(
  (config) => {
    const raw = getAuthToken();
    if (raw) {
      const token = raw.startsWith("Bearer ")
        ? raw.split(" ")[1]
        : raw;
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Helper logout global
 */
const signOut = () => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("user");
    localStorage.removeItem("adminUser");
    window.location.replace("/signin");
  } catch {}
};

/**
 * RESPONSE INTERCEPTOR
 * → auto logout jika token invalid / expired
 */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || "";
    const url = error?.config?.url || "";

    const isLoginRequest =
      url.includes("/login") || url.includes("/admin/login");

    if (
      status === 401 ||
      (status === 400 && message.toLowerCase().includes("token expired"))
    ) {
      if (!isLoginRequest) {
        signOut();
      }
    }

    return Promise.reject(error);
  }
);

export default API;
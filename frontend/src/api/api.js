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
 * Cek apakah JWT token masih valid (berdasarkan exp)
 */
export const isTokenValid = () => {
  try {
    if (typeof window === "undefined") return false;

    const raw = localStorage.getItem("token");
    if (!raw) return false;

    const token = raw.startsWith("Bearer ") ? raw.split(" ")[1] : raw;
    const payload = JSON.parse(atob(token.split(".")[1]));

    // Jika tidak ada exp → anggap valid
    if (!payload.exp) return true;

    return Date.now() < payload.exp * 1000;
  } catch {
    return false;
  }
};

/**
 * REQUEST INTERCEPTOR
 * → otomatis pasang Authorization Bearer token
 */
API.interceptors.request.use(
  (config) => {
    try {
      const raw = localStorage.getItem("token");
      if (raw) {
        const token = raw.startsWith("Bearer ") ? raw.split(" ")[1] : raw;
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {}
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
    localStorage.removeItem("user");
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
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (!isLoginRequest) {
        signOut();
      }
    }

    return Promise.reject(error);
  }
);

export default API;
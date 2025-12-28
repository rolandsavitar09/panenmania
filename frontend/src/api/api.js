// src/api/api.js
import axios from "axios";

export const API_BASE_URL = "https://panenmania-sigma.vercel.app";

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Helper: cek apakah JWT token di localStorage masih valid (berdasarkan exp)
 */
export const isTokenValid = () => {
  try {
    if (typeof window === "undefined") return false;
    const tokenRaw = localStorage.getItem("token");
    if (!tokenRaw) return false;

    // handle if stored as "Bearer <token>"
    const token = tokenRaw.startsWith("Bearer ") ? tokenRaw.split(" ")[1] : tokenRaw;
    if (!token) return false;

    const parts = token.split(".");
    if (parts.length < 2) return false;

    // decode payload (base64url) — atob works with base64, replace base64url -> base64
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    try {
      const json = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      const payload = JSON.parse(json);

      if (!payload) return false;
      // if no exp present, treat token as valid (per original intent)
      if (!payload.exp) return true;
      return Date.now() < payload.exp * 1000;
    } catch (e) {
      // jika gagal decode/parse, anggap token tidak valid
      return false;
    }
  } catch (e) {
    return false;
  }
};

/**
 * Interceptor Request
 * Menambahkan token Authorization ke setiap permintaan bila tersedia.
 */
API.interceptors.request.use(
  (config) => {
    try {
      const tokenRaw = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (tokenRaw) {
        const token = tokenRaw.startsWith("Bearer ") ? tokenRaw.split(" ")[1] : tokenRaw;
        config = config || {};
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
        // OPTIONAL debug: uncomment saat butuh log
        // console.debug("API request - Authorization set");
      }
    } catch (error) {
      // Abaikan error localStorage
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Helper: sign out (bersihkan storage dan redirect ke signin)
 */
const doSignOut = () => {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.replace("/signin");
    }
  } catch (e) {
    // ignore
  }
};

/**
 * Interceptor Response
 * Menangani error global seperti 401 Unauthenticated dan pesan token expired
 */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const resp = error?.response;
    const status = resp?.status;
    const message = resp?.data?.message ?? "";

    if (
      status === 401 ||
      (status === 400 && typeof message === "string" && message.toLowerCase().includes("token expired"))
    ) {
      // Jangan redirect jika request itu ke login endpoint
      const reqUrl = error?.config?.url || "";
      const isLoginEndpoint = reqUrl.includes("/admin/login") || reqUrl.includes("/login");

      // Hapus token & user
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } catch (e) {}

      // Redirect kecuali sedang di login endpoint
      if (!isLoginEndpoint && typeof window !== "undefined") {
        // gunakan doSignOut untuk konsistensi
        doSignOut();
      }

      // Kembalikan error asli agar caller bisa baca resp.body dll.
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default API;
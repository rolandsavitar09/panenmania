// src/pages/admin/AdminLogin.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 🔁 REVISI API: pakai axios instance (PRODUCTION)
import API from "../../../api/api";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // CEK STATUS LOGIN SAAT HALAMAN DIBUKA
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      // 🔁 REVISI API (INTI PERUBAHAN)
      const response = await API.post("/api/admin/login", {
        email,
        password,
      });

      const data = response.data;

      // SIMPAN TOKEN & USER ADMIN
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.user));

      // LANGSUNG KE DASHBOARD (replace history)
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
          "Gagal login. Cek email dan kata sandi."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#FFFEF6", fontFamily: '"Inter", sans-serif' }}
    >
      {/* CARD FIXED HEIGHT */}
      <div
        className="w-full max-w-[500px] h-[600px] bg-white border-[3px] border-[#3A5B40] rounded-[15px]
                   shadow-[0_4px_6px_rgba(0,0,0,0.1)] flex flex-col items-center px-10 py-12"
      >
        {/* LOGO */}
        <div className="w-24 h-24 mb-8 rounded-full bg-[#3A5B40]/10 border border-[#3A5B40] flex items-center justify-center">
          <span className="text-xs text-[#3A5B40]">LOGO</span>
        </div>

        {/* TITLE */}
        <h1 className="text-[22px] font-bold text-[#3A5B40] mb-6 text-center">
          Login Admin
        </h1>

        {/* FORM */}
        <form className="w-full space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#3A5B40]">
              Email Admin
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage("");
              }}
              className="w-full h-[50px] border border-[#3A5B40] rounded-md px-4 text-sm text-[#3A5B40]
                         outline-none focus:ring-1 focus:ring-[#3A5B40]"
              placeholder="Masukkan email"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#3A5B40]">
              Kata Sandi
            </label>
            <div className="w-full h-[50px] border border-[#3A5B40] rounded-md flex items-center px-4">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage("");
                }}
                className="flex-1 text-sm text-[#3A5B40] outline-none bg-transparent"
                placeholder="Masukkan Kata Sandi"
              />

              {/* Toggle Password */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-[#3A5B40]"
                aria-label={
                  showPassword
                    ? "Sembunyikan kata sandi"
                    : "Tampilkan kata sandi"
                }
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.5a10.523 10.523 0 01-4.293 5.774"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[50px] rounded-md bg-[#3A5B40] text-white text-sm font-medium
                       flex items-center justify-center hover:bg-[#324c36] transition disabled:opacity-60"
          >
            {isLoading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        {/* ERROR (reserved space biar card tidak goyang) */}
        <div className="h-6 mt-4 flex items-center justify-center text-center px-2">
          {errorMessage && (
            <p className="text-sm text-red-600 font-semibold">
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
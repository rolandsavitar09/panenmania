// src/pages/admin/AdminLogin.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

// ✅ LOGO IMAGE
import LogoImg from "../../../assets/images/icons/logo panenmaniaa.svg";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Cek status login admin saat mount
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
      const { data } = await API.post("/api/admin/login", {
        email,
        password,
      });

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.user));

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      console.error("[AdminLogin] Error:", err);
      setErrorMessage(
        err?.response?.data?.message ||
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
      <div
        className="w-full max-w-[500px] h-[600px] bg-white border-[3px] border-[#3A5B40] rounded-[15px]
                   shadow-[0_4px_6px_rgba(0,0,0,0.1)] flex flex-col items-center px-10 py-12"
      >
        {/* LOGO */}
        <div className="w-24 h-24 mb-8 rounded-full bg-[#3A5B40]/10 border border-[#3A5B40] flex items-center justify-center">
          <img
            src={LogoImg}
            alt="PanenMania Logo"
            className="w-14 h-14 object-contain"
          />
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

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-[#3A5B40]"
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
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5"
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
                      d="M2.458 12C3.732 7.943 7.523 5 12 5"
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

        {/* ERROR */}
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
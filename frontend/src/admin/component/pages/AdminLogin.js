import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";

// Logo
import LogoImg from "../../../assets/images/icons/logo panenmaniaa.svg";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Jika admin sudah login → langsung ke dashboard
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const user = localStorage.getItem("adminUser");

    if (token && user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed?.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        }
      } catch {
        // abaikan
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await API.post("/api/auth/admin-login", {
        email,
        password,
      });

      // Simpan token & user admin
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminUser", JSON.stringify(res.data.user));

      // Redirect ke dashboard admin
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      console.error("[AdminLogin] Error:", err);

      // ⛔ PENTING: TIDAK redirect ke signin/signup
      setErrorMessage(
        err?.response?.data?.message ||
          "Login admin gagal. Periksa email dan kata sandi."
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
      <div className="w-full max-w-[500px] h-[600px] bg-white border-[3px] border-[#3A5B40] rounded-[15px] shadow flex flex-col items-center px-10 py-12">
        {/* Logo */}
        <div className="w-24 h-24 mb-8 rounded-full bg-[#3A5B40]/10 border border-[#3A5B40] flex items-center justify-center">
          <img src={LogoImg} alt="PanenMania Logo" className="w-14 h-14" />
        </div>

        {/* Title */}
        <h1 className="text-[22px] font-bold text-[#3A5B40] mb-6">
          Login Admin
        </h1>

        {/* Form */}
        <form className="w-full space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
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
              required
              className="w-full h-[50px] border border-[#3A5B40] rounded-md px-4 text-sm outline-none"
              placeholder="adminpanenmania@gmail.com"
            />
          </div>

          {/* Password */}
          <div>
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
                required
                className="flex-1 text-sm outline-none bg-transparent"
                placeholder="Masukkan kata sandi"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-[#3A5B40] text-sm"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[50px] rounded-md bg-[#3A5B40] text-white font-medium hover:bg-[#324c36] transition disabled:opacity-60"
          >
            {isLoading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        {/* Error */}
        {errorMessage && (
          <p className="mt-4 text-sm text-red-600 font-semibold text-center">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
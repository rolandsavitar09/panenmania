// src/pages/auth/SignIn.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// ✅ PERUBAHAN: pakai axios instance global (bukan localhost + fetch)
import API from "../../api/api";

// Gambar ilustrasi dan ikon
import FarmerSignup from "../../assets/images/banners/petani signup.svg";
import GoogleIcon from "../../assets/images/icons/google.svg";

// ❌ DIHAPUS: localhost tidak dipakai lagi
// const API_BASE_URL = "http://localhost:5000/api/auth";

const SignIn = () => {
  const navigate = useNavigate();

  // State input dan pesan kesalahan
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handler kirim formulir
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      // ✅ PERUBAHAN: fetch → API.post (endpoint TETAP SAMA)
      const response = await API.post("/api/auth/login", {
        email,
        password,
      });

      const data = response.data;

      // Login berhasil (TIDAK DIUBAH)
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login berhasil!");
      navigate("/home");
    } catch (error) {
      console.error("API error:", error);

      // Pesan error (TIDAK DIUBAH)
      setErrorMessage(
        error?.response?.data?.message ||
          "Gagal login. Silakan periksa kredensial Anda."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Kelas dasar input (TIDAK DIUBAH)
  const inputClass =
    "w-full py-1 px-4 rounded-lg bg-[#3A5A40] border border-white text-[11px] sm:text-xs md:text-sm text-white focus:outline-none mt-1";

  return (
    <div className="bg-[#F8F8ED] min-h-screen flex justify-center items-center font-poppins px-4">
      <div className="max-w-4xl w-full bg-white rounded-[32px] border-2 border-[#588157] overflow-hidden h-auto lg:h-[580px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* ============ BAGIAN KIRI ============ */}
          <div className="p-8 lg:p-10 flex flex-col items-center">
            <div className="flex flex-col items-center mt-2 lg:mt-4">
              <img
                src={FarmerSignup}
                alt="Petani"
                className="rounded-[28px] mb-8 w-full max-w-[360px] h-[220px] lg:h-[240px] object-cover"
              />

              <h2 className="text-[20px] lg:text-[22px] font-bold text-[#3A5A40] text-center">
                Selamat Datang Kembali di PaMan!
              </h2>

              <p className="text-xs sm:text-sm text-[#3A5A40] text-center mt-3 max-w-xs leading-relaxed">
                <span className="font-semibold">Hai, Mitra PaMan!</span> Senang
                Anda kembali. Masuk dan temukan lagi kualitas terbaik dari
                produk kami.
              </p>

              <div className="w-[70%] border-t border-[#3A5B40] mt-6" />
            </div>
          </div>

          {/* ============ BAGIAN KANAN (FORM) ============ */}
          <div className="bg-[#3A5A40] text-white p-8 lg:p-10 relative flex flex-col">
            <div className="absolute top-6 right-8 flex gap-4 text-xs sm:text-sm font-semibold">
              <span className="bg-white text-[#3A5A40] px-4 py-1 rounded-lg shadow-md">
                Masuk
              </span>
              <Link className="opacity-80 hover:opacity-100" to="/signup">
                Daftar
              </Link>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold mb-3 mt-32">
              Masuk Akun
            </h2>

            <div className="flex-1 overflow-y-auto pr-1">
              <form
                onSubmit={handleSubmit}
                className="space-y-2.5 text-[11px] sm:text-xs md:text-sm"
              >
                <div>
                  <label className="block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    className={inputClass}
                    placeholder="Masukkan email"
                  />
                </div>

                <div>
                  <label className="block mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    className={inputClass}
                    placeholder="Masukkan kata sandi"
                  />
                </div>

                {errorMessage && (
                  <p className="text-[10px] text-red-300 leading-snug font-semibold mt-2">
                    🚨 {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-[#3A5A40] py-2 rounded-lg font-semibold mt-1 text-[11px] sm:text-xs md:text-sm hover:bg-[#F1F1F1] transition disabled:bg-gray-400 disabled:text-gray-700"
                >
                  {isLoading ? "Memverifikasi..." : "Masuk Akun"}
                </button>

                <div className="mt-4 flex flex-col items-center gap-2">
                  <span className="text-sm opacity-80">atau masuk dengan</span>
                  <button type="button">
                    <img
                      src={GoogleIcon}
                      className="w-7 h-7 object-contain"
                      alt="google"
                    />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
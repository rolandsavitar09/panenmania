// src/pages/auth/SignIn.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import FarmerSignup from "../../assets/images/banners/petani signup.svg";
import GoogleIcon from "../../assets/images/icons/google.svg";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const savedUserRaw = localStorage.getItem("userData");

    // ✅ 1. Belum pernah daftar / tidak ada userData sama sekali
    if (!savedUserRaw) {
      setErrorMessage(
        'Maaf, saat ini anda belum terdaftar sebagai pengguna. Silakan "Daftar" terlebih dahulu.'
      );
      return;
    }

    let user;
    try {
      user = JSON.parse(savedUserRaw);
    } catch (err) {
      // ✅ 2. userData ada tapi rusak / bukan JSON valid
      setErrorMessage(
        'Maaf, saat ini anda belum terdaftar sebagai pengguna. Silakan "Daftar" terlebih dahulu.'
      );
      return;
    }

    // ✅ 3. userData tidak punya email / password yang valid
    if (!user || !user.email || !user.password) {
      setErrorMessage(
        'Maaf, saat ini anda belum terdaftar sebagai pengguna. Silakan "Daftar" terlebih dahulu.'
      );
      return;
    }

    // ✅ 4. Email / password salah → tetap dianggap belum terdaftar (sesuai permintaanmu)
    if (email !== user.email || password !== user.password) {
      setErrorMessage(
        'Maaf, saat ini anda belum terdaftar sebagai pengguna. Silakan "Daftar" terlebih dahulu.'
      );
      return;
    }

    // ✅ 5. Berhasil login
    localStorage.setItem("token", "login-success");
    setErrorMessage("");
    navigate("/home");
  };

  return (
    <div className="bg-[#F8F8ED] min-h-screen flex justify-center items-center font-poppins px-4">
      {/* CARD UTAMA – fixed height */}
      <div className="max-w-4xl w-full bg-white rounded-[32px] border-2 border-[#588157] overflow-hidden h-auto lg:h-[580px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* ============ LEFT (fixed position, tidak auto center) ============ */}
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
                <span className="font-semibold">Hai, Mitra PaMan!</span>{" "}
                Senang Anda kembali. Masuk dan temukan lagi kualitas terbaik
                dari produk kami.
              </p>

              {/* GARIS – supaya tinggi kiri-kanan seimbang (posisi fix, bukan auto) */}
              <div className="w-[70%] border-t border-[#3A5B40] mt-6" />
            </div>
          </div>

          {/* ============ RIGHT ============ */}
          <div className="bg-[#3A5A40] text-white p-8 lg:p-10 relative flex flex-col">
            {/* TAB ATAS */}
            <div className="absolute top-6 right-8 flex gap-4 text-sm font-semibold">
              <span className="bg-white text-[#3A5A40] px-4 py-1 rounded-lg shadow-md">
                Masuk
              </span>
              <Link className="opacity-80 hover:opacity-100" to="/signup">
                Daftar
              </Link>
            </div>

            <h2 className="text-2xl font-bold mb-6 mt-10">Masuk Akun</h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              {/* EMAIL */}
              <div>
                <label className="text-sm">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                  className="w-full py-3 px-4 rounded-lg bg-[#3A5A40] border border-white text-white placeholder-white/80 focus:outline-none mt-1"
                  placeholder="Masukkan email"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-sm">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                  className="w-full py-3 px-4 rounded-lg bg-[#3A5A40] border border-white text-white placeholder-white/80 focus:outline-none mt-1"
                  placeholder="Masukkan password"
                />
              </div>

              {/* ERROR MESSAGE – sekarang teks putih */}
              {errorMessage && (
                <p className="text-white text-xs leading-snug">
                  {errorMessage}
                </p>
              )}

              {/* TOMBOL SUBMIT */}
              <button
                type="submit"
                className="w-full bg-white text-[#3A5A40] py-3 rounded-lg font-semibold hover:bg-[#F1F1F1] transition"
              >
                Masuk Akun
              </button>

              {/* GOOGLE LOGIN (dummy) */}
              <div className="mt-4 flex flex-col items-center gap-2">
                <span className="text-sm opacity-80">or continue with</span>
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
  );
};

export default SignIn;
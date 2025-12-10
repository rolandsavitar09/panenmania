// src/pages/auth/SignIn.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Gambar ilustrasi dan ikon
import FarmerSignup from "../../assets/images/banners/petani signup.svg";
import GoogleIcon from "../../assets/images/icons/google.svg";

const SignIn = () => {
  const navigate = useNavigate();

  // State input dan pesan kesalahan
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Handler kirim formulir
  const handleSubmit = (e) => {
    e.preventDefault();

    const savedUserRaw = localStorage.getItem("userData");

    // Validasi jika data pengguna belum tersimpan
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
      setErrorMessage(
        'Maaf, saat ini anda belum terdaftar sebagai pengguna. Silakan "Daftar" terlebih dahulu.'
      );
      return;
    }

    // Validasi struktur data pengguna
    if (!user || !user.email || !user.password) {
      setErrorMessage(
        'Maaf, saat ini anda belum terdaftar sebagai pengguna. Silakan "Daftar" terlebih dahulu.'
      );
      return;
    }

    // Validasi kecocokan email dan kata sandi
    if (email !== user.email || password !== user.password) {
      setErrorMessage(
        'Maaf, saat ini anda belum terdaftar sebagai pengguna. Silakan "Daftar" terlebih dahulu.'
      );
      return;
    }

    // Login berhasil
    localStorage.setItem("token", "login-success");
    setErrorMessage("");
    navigate("/home");
  };

  // Kelas dasar input – disamakan ukurannya dengan SignUp
  const inputClass =
    "w-full py-1 px-4 rounded-lg bg-[#3A5A40] border border-white text-[11px] sm:text-xs md:text-sm text-white focus:outline-none mt-1";

  return (
    <div className="bg-[#F8F8ED] min-h-screen flex justify-center items-center font-poppins px-4">
      {/* Kartu utama: tinggi tetap di desktop, responsif di perangkat kecil */}
      <div className="max-w-4xl w-full bg-white rounded-[32px] border-2 border-[#588157] overflow-hidden h-auto lg:h-[580px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* ============ BAGIAN KIRI ============ */}
          <div className="p-8 lg:p-10 flex flex-col items-center">
            <div className="flex flex-col items-center mt-2 lg:mt-4">
              {/* Gambar ilustrasi petani */}
              <img
                src={FarmerSignup}
                alt="Petani"
                className="rounded-[28px] mb-8 w-full max-w-[360px] h-[220px] lg:h-[240px] object-cover"
              />

              {/* Judul sambutan */}
              <h2 className="text-[20px] lg:text-[22px] font-bold text-[#3A5A40] text-center">
                Selamat Datang Kembali di PaMan!
              </h2>

              {/* Uraian singkat */}
              <p className="text-xs sm:text-sm text-[#3A5A40] text-center mt-3 max-w-xs leading-relaxed">
                <span className="font-semibold">Hai, Mitra PaMan!</span> Senang
                Anda kembali. Masuk dan temukan lagi kualitas terbaik dari
                produk kami.
              </p>

              {/* Garis pemisah dekoratif */}
              <div className="w-[70%] border-t border-[#3A5B40] mt-6" />
            </div>
          </div>

          {/* ============ BAGIAN KANAN (FORM) ============ */}
          <div className="bg-[#3A5A40] text-white p-8 lg:p-10 relative flex flex-col">
            {/* Tab Masuk / Daftar di kanan atas */}
            <div className="absolute top-6 right-8 flex gap-4 text-xs sm:text-sm font-semibold">
              <span className="bg-white text-[#3A5A40] px-4 py-1 rounded-lg shadow-md">
                Masuk
              </span>
              <Link className="opacity-80 hover:opacity-100" to="/signup">
                Daftar
              </Link>
            </div>

            {/* Judul form – ukuran disamakan dengan "Daftar Akun" di SignUp */}
            <h2 className="text-xl sm:text-2xl font-bold mb-3 mt-32">
              Masuk Akun
            </h2>

            {/* Pembungkus form: dapat discroll bila konten penuh, ukuran teks disamakan SignUp */}
            <div className="flex-1 overflow-y-auto pr-1">
              <form
                onSubmit={handleSubmit}
                className="space-y-2.5 text-[11px] sm:text-xs md:text-sm"
              >
                {/* Email */}
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
                    placeholder=""
                  />
                </div>

                {/* Password */}
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
                    placeholder=""
                  />
                </div>

                {/* Pesan kesalahan */}
                {errorMessage && (
                  <p className="text-[10px] text-white leading-snug">
                    {errorMessage}
                  </p>
                )}

                {/* Tombol masuk – ukuran teks & padding disamakan dengan tombol Daftar */}
                <button
                  type="submit"
                  className="w-full bg-white text-[#3A5A40] py-2 rounded-lg font-semibold mt-1 text-[11px] sm:text-xs md:text-sm hover:bg-[#F1F1F1] transition"
                >
                  Masuk Akun
                </button>

                {/* Login Google (dummy) – dibiarkan sama seperti sebelumnya */}
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
    </div>
  );
};

export default SignIn;
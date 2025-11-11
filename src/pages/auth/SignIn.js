import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const savedUser = localStorage.getItem("userData");

    if (!savedUser) {
      setErrorMessage(
        "Maaf, saat ini anda belum terdaftar sebagai pengguna. Silakan “Daftar” terlebih dahulu."
      );
      return;
    }

    const user = JSON.parse(savedUser);

    if (email !== user.email || password !== user.password) {
      setErrorMessage("Email atau Password salah!");
      return;
    }

    localStorage.setItem("token", "login-success");
    navigate("/home"); // ✅ Berhasil Login → Ke HomePageAfterLogin
  };

  return (
    <div className="bg-[#F8F8ED] min-h-screen flex justify-center items-center font-poppins px-4">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-md overflow-hidden border border-[#DCE5D4]">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          
          {/* LEFT */}
          <div className="p-10 flex flex-col items-center justify-center">
            <img
              src="https://via.placeholder.com/330x230"
              alt="petani"
              className="rounded-2xl mb-6 w-[330px] h-[230px] object-cover"
            />

            <h2 className="text-[22px] font-bold text-[#3A5A40] text-center">
              Selamat Datang Kembali di PaMan!
            </h2>

            <p className="text-sm text-gray-600 text-center mt-3">
              <span className="font-semibold text-[#3A5A40]">
                Hai, Mitra PaMan!
              </span>{" "}
              Senang Anda kembali. Masuk dan temukan lagi kualitas terbaik dari produk kami.
            </p>

            {/* ✅ TOMBOL KEMBALI */}
            <div className="mt-4">
              <Link to="/">
                <button className="bg-[#3A5A40] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2d3e36] transition">
                  ← Kembali
                </button>
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-[#3A5A40] text-white rounded-l-2xl p-10 relative">
            
            {/* Toggle Masuk / Daftar */}
            <div className="absolute top-6 right-8 flex gap-4 text-sm font-semibold">
              <span className="bg-white text-[#3A5A40] px-4 py-1 rounded-lg shadow-md">
                Masuk
              </span>
              <Link className="opacity-80 hover:opacity-100" to="/signup">
                Daftar
              </Link>
            </div>

            <h2 className="text-2xl font-bold mb-6 mt-10">Masuk Akun</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-3 px-4 rounded-lg bg-[#3A5A40] border border-white text-white placeholder-white/80 focus:outline-none mt-1"
                  placeholder="Masukkan email"
                />
              </div>

              <div>
                <label className="text-sm">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-3 px-4 rounded-lg bg-[#3A5A40] border border-white text-white placeholder-white/80 focus:outline-none mt-1"
                  placeholder="Masukkan password"
                />
              </div>

              {/* ERROR MESSAGE */}
              {errorMessage && (
                <p className="text-red-300 text-xs leading-snug">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-gray-300 text-black py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Masuk Akun
              </button>

              <div className="text-center text-sm opacity-80 mt-2">
                or continue with
              </div>

              <button type="button" className="flex justify-center mt-1">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
                  className="w-7"
                  alt="google"
                />
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
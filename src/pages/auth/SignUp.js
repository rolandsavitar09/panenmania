// src/pages/auth/SignUp.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Gambar
import FarmerSignup from "../../assets/images/banners/petani signup.svg";
import GoogleIcon from "../../assets/images/icons/google.svg";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama: "",
    phone: "",
    email: "",
    password: "",
    address: "",
    gender: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("userData", JSON.stringify(formData));
    navigate("/signin");
  };

  return (
    <div className="bg-[#F8F8ED] min-h-screen flex justify-center items-center font-poppins px-4">
      {/* CARD: fixed height di desktop, auto di layar kecil */}
      <div className="max-w-4xl w-full bg-white rounded-[32px] border-2 border-[#588157] overflow-hidden h-auto lg:h-[580px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* ============ LEFT (disamakan layout-nya dengan SignIn) ============ */}
          <div className="p-8 lg:p-10 flex flex-col items-center">
            <div className="flex flex-col items-center mt-2 lg:mt-4">
              {/* FOTO PETANI */}
              <img
                src={FarmerSignup}
                alt="Petani membawa hasil panen"
                className="rounded-[28px] mb-8 w-full max-w-[360px] h-[220px] lg:h-[240px] object-cover"
              />

              <h2 className="text-[20px] lg:text-[22px] font-bold text-[#3A5A40] text-center">
                Selamat Datang di PaMan!
              </h2>

              <p className="text-xs sm:text-sm text-[#3A5A40] text-center mt-3 max-w-xs leading-relaxed">
                Temukan produk pertanian segar pilihan langsung dari petani
                terbaik.
              </p>

              {/* GARIS – posisi & ukuran sama dengan SignIn */}
              <div className="w-[70%] border-t border-[#3A5B40] mt-6" />

              {/* IKON GOOGLE di bawah garis */}
              <button className="mt-6">
                <img
                  src={GoogleIcon}
                  className="w-7 h-7 object-contain"
                  alt="Google"
                />
              </button>
            </div>
          </div>

          {/* ============ RIGHT ============ */}
          <div className="bg-[#3A5A40] text-white p-8 lg:p-10 relative flex flex-col">
            {/* Toggle Masuk / Daftar */}
            <div className="absolute top-6 right-8 flex gap-4 text-sm font-semibold">
              <Link to="/signin" className="opacity-80 hover:opacity-100">
                Masuk
              </Link>
              <span className="bg-white text-[#3A5A40] px-4 py-1 rounded-lg shadow-md">
                Daftar
              </span>
            </div>

            <h2 className="text-2xl font-bold mb-6 mt-10">Daftar Akun</h2>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-3 text-sm">
              <input
                name="nama"
                type="text"
                placeholder="Nama Lengkap"
                onChange={handleChange}
                required
                className="w-full py-3 px-4 rounded-lg bg-[#3A5A40] border border-white text-white placeholder-white/80 focus:outline-none"
              />
              <input
                name="phone"
                type="text"
                placeholder="No. Telepon"
                onChange={handleChange}
                required
                className="w-full py-3 px-4 rounded-lg bg-[#3A5A40] border border-white text-white placeholder-white/80 focus:outline-none"
              />
              <input
                name="email"
                type="email"
                placeholder="E-mail"
                onChange={handleChange}
                required
                className="w-full py-3 px-4 rounded-lg bg-[#3A5A40] border border-white text-white placeholder-white/80 focus:outline-none"
              />
              <input
                name="password"
                type="password"
                placeholder="Kata Sandi"
                onChange={handleChange}
                required
                className="w-full py-3 px-4 rounded-lg bg-[#3A5A40] border border-white text-white placeholder-white/80 focus:outline-none"
              />
              <input
                name="address"
                type="text"
                placeholder="Alamat"
                onChange={handleChange}
                required
                className="w-full py-3 px-4 rounded-lg bg-[#3A5A40] border border-white text-white placeholder-white/80 focus:outline-none"
              />
              <input
                name="gender"
                type="text"
                placeholder="Jenis Kelamin"
                onChange={handleChange}
                required
                className="w-full py-3 px-4 rounded-lg bg-[#3A5A40] border border-white text-white placeholder-white/80 focus:outline-none"
              />

              <label className="flex items-center gap-2 text-[12px] mt-1">
                <input type="checkbox" required />
                <span>Saya menyetujui ketentuan yang berlaku.</span>
              </label>

              <button
                type="submit"
                className="w-full bg-white text-[#3A5A40] py-3 rounded-lg font-semibold mt-1 hover:bg-[#F1F1F1] transition"
              >
                Daftar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
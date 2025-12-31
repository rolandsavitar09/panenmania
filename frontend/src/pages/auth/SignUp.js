// src/pages/auth/SignUp.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Axios instance global
import API from "../../api/api";

// Gambar ilustrasi dan ikon
import FarmerSignup from "../../assets/images/banners/petani signup.svg";
import GoogleIcon from "../../assets/images/icons/google.svg";

const SignUp = () => {
  const navigate = useNavigate();

  // State data formulir
  const [formData, setFormData] = useState({
    nama: "",
    phone: "",
    email: "",
    password: "",
    gender: "",
  });

  // State pesan kesalahan
  const [genderError, setGenderError] = useState("");
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Perubahan nilai input teks
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setApiError("");
  };

  // Pilih jenis kelamin
  const handleGenderSelect = (value) => {
    setFormData((prev) => ({ ...prev, gender: value }));
    setGenderError("");
    setApiError("");
  };

  // Submit formulir
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    // Validasi sisi klien
    if (!formData.gender) {
      setGenderError("Silakan pilih salah satu jenis kelamin.");
      return;
    }

    setIsLoading(true);

    try {
      // 🔥 MAPPING FE → BACKEND (WAJIB)
      const payload = {
        full_name: formData.nama,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone,
        gender: formData.gender,
      };

      const response = await API.post("/api/auth/register", payload);

      if (response.status === 201 || response.status === 200) {
        alert("Pendaftaran berhasil! Silakan masuk.");
        navigate("/signin");
      }
    } catch (error) {
      console.error("API error:", error);

      const message =
        error?.response?.data?.message ||
        "Gagal mendaftar. Silakan coba lagi.";

      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Kelas dasar input
  const inputClass =
    "w-full py-1 px-4 rounded-lg bg-[#3A5A40] border border-white text-[11px] sm:text-xs md:text-sm text-white placeholder-white/60 focus:outline-none";

  // Kelas tombol jenis kelamin
  const genderOptionClass = () =>
    "flex items-center gap-2 cursor-pointer text-[11px] sm:text-xs md:text-sm";

  const genderPillClass = (value) =>
    `px-5 py-1 rounded-[10px] border border-white font-semibold ${
      formData.gender === value
        ? "bg-white text-[#3A5A40]"
        : "bg-transparent text-white"
    }`;

  const genderCircleClass = (value) =>
    `w-4 h-4 rounded-full border border-white flex items-center justify-center ${
      formData.gender === value ? "bg-white" : "bg-transparent"
    }`;

  return (
    <div className="bg-[#F8F8ED] min-h-screen flex justify-center items-center font-poppins px-4">
      <div className="max-w-4xl w-full bg-white rounded-[32px] border-2 border-[#588157] overflow-hidden h-auto lg:h-[580px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* BAGIAN KIRI */}
          <div className="p-8 lg:p-10 flex flex-col items-center">
            <div className="flex flex-col items-center mt-2 lg:mt-4">
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
              <div className="w-[70%] border-t border-[#3A5B40] mt-6" />
              <button className="mt-6">
                <img
                  src={GoogleIcon}
                  className="w-7 h-7 object-contain"
                  alt="Google"
                />
              </button>
            </div>
          </div>

          {/* BAGIAN KANAN */}
          <div className="bg-[#3A5A40] text-white p-8 lg:p-10 relative flex flex-col h-full">
            <div className="absolute top-6 right-8 flex gap-4 text-xs sm:text-sm font-semibold">
              <Link to="/signin" className="opacity-80 hover:opacity-100">
                Masuk
              </Link>
              <span className="bg-white text-[#3A5A40] px-4 py-1 rounded-lg shadow-md">
                Daftar
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold mb-3 mt-6">
              Daftar Akun
            </h2>

            <div className="flex-1 overflow-y-auto pr-1">
              <form
                onSubmit={handleSubmit}
                className="space-y-2.5 text-[11px] sm:text-xs md:text-sm"
              >
                <div>
                  <label className="block mb-1">Nama Lengkap</label>
                  <input
                    name="nama"
                    type="text"
                    value={formData.nama}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block mb-2">Jenis Kelamin</label>
                  <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                    <button
                      type="button"
                      onClick={() => handleGenderSelect("Perempuan")}
                      className={genderOptionClass()}
                    >
                      <span className={genderCircleClass("Perempuan")} />
                      <span className={genderPillClass("Perempuan")}>
                        Perempuan
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleGenderSelect("Laki-laki")}
                      className={genderOptionClass()}
                    >
                      <span className={genderCircleClass("Laki-laki")} />
                      <span className={genderPillClass("Laki-laki")}>
                        Laki-laki
                      </span>
                    </button>
                  </div>
                  {genderError && (
                    <p className="text-[10px] text-red-300 mt-1">
                      {genderError}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-1">No. Telepon</label>
                  <input
                    name="phone"
                    type="text"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block mb-1">E-mail</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block mb-1">Kata Sandi</label>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>

                {apiError && (
                  <p className="text-[10px] text-red-300 mt-1 font-semibold">
                    🚨 {apiError}
                  </p>
                )}

                <label className="flex items-center gap-2 text-[10px] leading-tight mt-0.5">
                  <input type="checkbox" required className="w-3 h-3" />
                  <span>Saya menyetujui ketentuan yang berlaku.</span>
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-[#3A5A40] py-2 rounded-lg font-semibold mt-1 text-[11px] sm:text-xs md:text-sm hover:bg-[#F1F1F1] transition disabled:bg-gray-400 disabled:text-gray-700"
                >
                  {isLoading ? "Memproses..." : "Daftar"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
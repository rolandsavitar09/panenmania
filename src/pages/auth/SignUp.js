import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
              Selamat Datang di PaMan!
            </h2>

            <p className="text-sm text-gray-600 text-center mt-3">
              Selamat Datang di <span className="font-semibold">PaMan!</span> 
              Temukan produk pertanian segar pilihan langsung dari petani terbaik.
            </p>

            <div className="mt-6">
              <button className="text-lg">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
                  className="w-7"
                  alt="Google"
                />
              </button>
            </div>

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
              <Link className="opacity-80 hover:opacity-100" to="/signin">
                Masuk
              </Link>
              <span className="bg-white text-[#3A5A40] px-4 py-1 rounded-lg shadow-md">
                Daftar
              </span>
            </div>

            <h2 className="text-2xl font-bold mb-6 mt-10">Daftar Akun</h2>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="nama" type="text" placeholder="Nama Lengkap" onChange={handleChange} required className="w-full py-3 px-4 rounded-lg bg-[#3A5A40] border border-white text-white placeholder-white/80 focus:outline-none" />
              <input name="phone" type="text" placeholder="No. Telepon" onChange={handleChange} required className="w-full py-3 px-4 rounded-lg bg-[#3A5A40] border border-white text-white placeholder-white/80 focus:outline-none" />
              <input name="email" type="email" placeholder="E-mail" onChange={handleChange} required className="w-full py-3 px-4 rounded-lg bg-[#3A5A40] border border-white text-white placeholder-white/80 focus:outline-none" />
              <input name="password" type="password" placeholder="Kata Sandi" onChange={handleChange} required className="w-full py-3 px-4 rounded-lg bg-[#3A5A40] border border-white text-white placeholder-white/80 focus:outline-none" />
              <input name="address" type="text" placeholder="Alamat" onChange={handleChange} required className="w-full py-3 px-4 rounded-lg bg-[#3A5A40] border border-white text-white placeholder-white/80 focus:outline-none" />
              <input name="gender" type="text" placeholder="Jenis Kelamin" onChange={handleChange} required className="w-full py-3 px-4 rounded-lg bg-[#3A5A40] border border-white text-white placeholder-white/80 focus:outline-none" />

              <label className="flex items-center gap-2 text-[12px]">
                <input type="checkbox" required />
                Saya menyetujui ketentuan yang berlaku.
              </label>

              <button
                type="submit"
                className="w-full bg-gray-300 text-black py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
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
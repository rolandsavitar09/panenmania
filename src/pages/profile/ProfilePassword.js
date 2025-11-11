import React, { useState } from "react";
import NavbarAfterLogin from "../../components/layout/NavbarAfterLogin";
import Footer from "../../components/layout/Footer";
import Popup from "../../components/common/Popup";
import { Link, useLocation } from "react-router-dom";
import {
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/solid";

const ProfilePassword = () => {
  const location = useLocation();

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  const handleUploadPic = (e) => {
    const f = e.target.files[0];
    if (f) setProfilePic(URL.createObjectURL(f));
  };

  const validate = () => {
    let temp = {};
    if (!oldPass) temp.old = "Kata sandi lama tidak boleh kosong!";
    if (!newPass) temp.new = "Kata sandi baru tidak boleh kosong!";
    if (newPass !== confirm) temp.conf = "Konfirmasi kata sandi tidak cocok!";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setShowSuccess(true);
  };

  const confirmLogout = () => {
    window.location.href = "/signin";
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-white text-[#344E41] font-poppins flex flex-col">
      <NavbarAfterLogin />

      <div className="flex w-full pt-24 pb-12 px-10 gap-8">
        {/* Sidebar */}
        <div className="w-72 bg-[#C3C3C3] p-6 rounded-lg flex-shrink-0">
          <div className="flex flex-col items-center text-center">
            <label className="relative cursor-pointer">
              <input type="file" className="hidden" onChange={handleUploadPic} />
              <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center overflow-hidden">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="w-36 h-36 text-gray-300" />
                )}
              </div>
              <span className="absolute bottom-4 right-4 bg-white p-1 rounded-full shadow text-black text-xs">
                ✏️
              </span>
            </label>
            <p className="mt-3 font-semibold text-lg">Lorem Ipsum</p>
          </div>

          {/* Menu */}
          <div className="mt-10 space-y-6 text-left w-full">
            {/* Akun Saya */}
            <div>
              <p className="font-bold text-black text-base mb-1">Akun Saya</p>

              <Link to="/profile">
                <p
                  className={`text-sm cursor-pointer ${
                    isActive("/profile")
                      ? "font-bold text-black"
                      : "text-gray-700 hover:text-black"
                  }`}
                >
                  Profile
                </p>
              </Link>

              <Link to="/profile/address">
                <p
                  className={`text-sm cursor-pointer ${
                    isActive("/profile/address")
                      ? "font-bold text-black"
                      : "text-gray-700 hover:text-black"
                  }`}
                >
                  Alamat
                </p>
              </Link>

              <Link to="/profile/password">
                <p
                  className={`text-sm cursor-pointer ${
                    isActive("/profile/password")
                      ? "font-bold text-black"
                      : "text-gray-700 hover:text-black"
                  }`}
                >
                  Kata Sandi
                </p>
              </Link>
            </div>

            {/* Pesanan Saya */}
            <div>
              <p className="font-bold text-black text-base mb-1">Pesanan Saya</p>
              <Link to="/orders-status">
                <p
                  className={`text-sm cursor-pointer ${
                    isActive("/orders-status")
                      ? "font-bold text-black"
                      : "text-gray-700 hover:text-black"
                  }`}
                >
                  Status Pesanan
                </p>
              </Link>
              <Link to="/orders-history">
                <p
                  className={`text-sm cursor-pointer ${
                    isActive("/orders-history")
                      ? "font-bold text-black"
                      : "text-gray-700 hover:text-black"
                  }`}
                >
                  Riwayat Pesanan
                </p>
              </Link>
            </div>
          </div>

          {/* Tombol Keluar */}
          <button
            onClick={() => setShowLogout(true)}
            className="mt-12 w-full flex items-center justify-center gap-3 bg-white py-2 rounded-lg font-semibold shadow text-[#344E41] hover:bg-gray-100 transition"
          >
            <ArrowLeftOnRectangleIcon className="w-5" /> Keluar
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 bg-[#C3C3C3] p-10 rounded-lg">
          <h2 className="text-xl font-bold mb-6">Ubah Kata Sandi</h2>
          <hr className="border-black mb-8" />

          {/* Form Password */}
          <div className="space-y-6 max-w-xl">
            <div>
              <label className="text-sm">Kata Sandi Lama</label>
              <input
                type="password"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                className={`w-full bg-[#E3E3E3] py-3 px-5 rounded-lg mt-1 outline-none ${
                  errors.old && "border border-red-500"
                }`}
              />
              {errors.old && <p className="text-red-500 text-xs">{errors.old}</p>}
            </div>

            <div>
              <label className="text-sm">Kata Sandi Baru</label>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className={`w-full bg-[#E3E3E3] py-3 px-5 rounded-lg mt-1 outline-none ${
                  errors.new && "border border-red-500"
                }`}
              />
              {errors.new && <p className="text-red-500 text-xs">{errors.new}</p>}
            </div>

            <div>
              <label className="text-sm">Konfirmasi Kata Sandi Baru</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={`w-full bg-[#E3E3E3] py-3 px-5 rounded-lg mt-1 outline-none ${
                  errors.conf && "border border-red-500"
                }`}
              />
              {errors.conf && <p className="text-red-500 text-xs">{errors.conf}</p>}
            </div>

            <button
              onClick={handleSave}
              className="bg-[#E0E0E0] px-6 py-2 text-sm font-semibold rounded-lg hover:bg-gray-300 transition float-right"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>

      <Footer />

      {/* Popup Berhasil */}
      {showSuccess && (
        <Popup onClose={() => setShowSuccess(false)}>
          <div className="text-center px-6 py-8 bg-white rounded-xl shadow-lg max-w-md mx-auto relative">
            <button
              onClick={() => setShowSuccess(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              ✕
            </button>

            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h3 className="text-lg font-semibold text-black">
              Berhasil Mengubah Kata Sandi!
            </h3>
          </div>
        </Popup>
      )}

      {/* Popup Keluar */}
      {showLogout && (
        <Popup onClose={() => setShowLogout(false)}>
          <div className="text-center px-6 py-8 bg-white rounded-xl shadow-lg max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-5 text-[#344E41]">
              Anda Yakin Ingin Keluar?
            </h3>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowLogout(false)}
                className="bg-gray-300 text-[#344E41] px-6 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Kembali
              </button>
              <button
                onClick={confirmLogout}
                className="bg-[#344E41] text-white px-6 py-2 rounded-lg hover:bg-[#2a3e33] transition"
              >
                Yakin
              </button>
            </div>
          </div>
        </Popup>
      )}
    </div>
  );
};

export default ProfilePassword;
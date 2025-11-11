import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import NavbarAfterLogin from "../../components/layout/NavbarAfterLogin";
import Footer from "../../components/layout/Footer";
import Popup from "../../components/common/Popup";
import {
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/solid";

const ProfileMain = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    setShowSuccessPopup(true);
  };

  const handleLogout = () => setShowLogoutPopup(true);
  const closeLogoutPopup = () => setShowLogoutPopup(false);

  const confirmLogout = () => {
    localStorage.removeItem("token");
    setShowLogoutPopup(false);
    navigate("/", { replace: true });
  };

  const handleUploadPic = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  // Helper untuk aktif menu
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-white text-[#344E41] font-poppins flex flex-col">
      <NavbarAfterLogin />

      {/* MAIN CONTENT */}
      <div className="flex w-full pt-24 pb-12 px-10 gap-8">
        {/* Sidebar */}
        <div className="w-72 bg-[#C3C3C3] p-6 rounded-lg flex-shrink-0">
          <div className="flex flex-col items-center text-center">
            {/* Profile Pic */}
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
            onClick={handleLogout}
            className="mt-12 w-full flex items-center justify-center gap-3 bg-white py-2 rounded-lg font-semibold shadow text-[#344E41] hover:bg-gray-100 transition"
          >
            <ArrowLeftOnRectangleIcon className="w-5" />
            Keluar
          </button>
        </div>

        {/* Profile Form */}
        <div className="flex-1 bg-[#C3C3C3] p-10 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Profile</h2>
          <p className="text-sm mb-4">
            Lorem ipsum dolor sit amet consectetur. Scelerisque cursus nunc mus
            vivamus venenatis enim.
          </p>
          <hr className="border-black mb-6" />

          <form onSubmit={handleSave} className="space-y-6">
            {[
              "Username",
              "Nama",
              "E-mail",
              "Nomor Telepon",
              "Jenis Kelamin",
              "Tanggal Lahir",
            ].map((field, index) => (
              <div key={index}>
                <label className="text-sm font-medium">{field}</label>
                <input
                  type="text"
                  className="w-full bg-white py-3 px-4 rounded-md mt-1 outline-none text-sm"
                />
              </div>
            ))}

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#E0E0E0] text-[#222] font-semibold px-6 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />

      {/* ✅ POPUP SIMPAN */}
      {showSuccessPopup && (
        <Popup onClose={() => setShowSuccessPopup(false)}>
          <div className="text-center px-6 py-8 bg-white rounded-xl shadow-lg max-w-md mx-auto relative">
            {/* Tombol Close (X) */}
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              ✕
            </button>

            {/* Icon Centang */}
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
              Data Berhasil Diperbaharui!
            </h3>
          </div>
        </Popup>
      )}

      {/* ✅ POPUP LOGOUT */}
      {showLogoutPopup && (
        <Popup onClose={closeLogoutPopup}>
          <div className="text-center px-6 py-8 bg-white rounded-xl shadow-lg max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-5 text-[#344E41]">
              Anda Yakin Ingin Keluar?
            </h3>
            <div className="flex gap-4 justify-center mt-4">
              <button
                onClick={closeLogoutPopup}
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

export default ProfileMain;
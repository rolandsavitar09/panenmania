// src/pages/afterLogin/ProfileMain.js
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import NavbarAfterLogin from "../../components/layout/NavbarAfterLogin";
import Popup from "../../components/common/Popup";

// ICONS & IMAGES
import EditIcon from "../../assets/images/icons/edit.svg";
import ProfileIcon from "../../assets/images/icons/profile.svg";
import CheckIcon from "../../assets/images/icons/ceklis.svg";
import OutIcon from "../../assets/images/icons/out.svg";
import ProfilePhoto from "../../assets/images/icons/pp.svg";

const ProfileMain = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [gender, setGender] = useState("");

  // Menyimpan perubahan profil
  const handleSave = (e) => {
    e.preventDefault();
    setShowSuccessPopup(true);
  };

  // Menampilkan popup logout
  const handleLogout = () => setShowLogoutPopup(true);
  const closeLogoutPopup = () => setShowLogoutPopup(false);

  // Konfirmasi logout
  const confirmLogout = () => {
    localStorage.removeItem("token");
    setShowLogoutPopup(false);
    navigate("/", { replace: true });
  };

  // Upload foto profil
  const handleUploadPic = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  // Cek menu aktif
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#FFFEF6] text-[#344E41] font-poppins flex flex-col">
      <NavbarAfterLogin />

      {/* Konten utama: stack di mobile, dua kolom di desktop */}
      <div className="flex flex-col lg:flex-row w-full mt-14 gap-4 lg:gap-8 px-4 lg:px-0">
        {/* SIDEBAR – full width di mobile, lebar tetap di desktop */}
        <div className="w-full lg:w-72 bg-white px-4 py-6 lg:px-6 lg:py-8 rounded-[10px] shadow flex flex-col overflow-y-auto lg:min-h-[calc(100vh-56px)]">
          <div className="flex flex-col items-center text-center">
            {/* Foto profil + tombol edit */}
            <label className="relative cursor-pointer inline-block">
              <input type="file" className="hidden" onChange={handleUploadPic} />
              <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-[#F2F2F2] rounded-full flex items-center justify-center overflow-hidden">
                <img
                  src={profilePic || ProfilePhoto}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-8 h-8 rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.12)] flex items-center justify-center">
                <img src={EditIcon} alt="Edit" className="w-4 h-4" />
              </div>
            </label>

            <p className="mt-3 font-semibold text-base sm:text-lg">
              Dearni Lambardo
            </p>
          </div>

          {/* Menu samping */}
          <div className="mt-6 lg:mt-8 space-y-6 text-left w-full">
            {/* Bagian profil */}
            <div>
              <div className="flex items-center gap-2">
                <img src={ProfileIcon} alt="Profile icon" className="w-5 h-5" />
                <Link to="/profile">
                  <p
                    className={`text-sm cursor-pointer ${
                      isActive("/profile")
                        ? "font-semibold text-[#344E41]"
                        : "text-gray-600 hover:text-[#344E41]"
                    }`}
                  >
                    Profile
                  </p>
                </Link>
              </div>

              <div className="ml-7 mt-1 space-y-1">
                <Link to="/profile/address">
                  <p
                    className={`text-sm cursor-pointer ${
                      isActive("/profile/address")
                        ? "font-semibold text-[#344E41]"
                        : "text-gray-600 hover:text-[#344E41]"
                    }`}
                  >
                    Alamat
                  </p>
                </Link>

                <Link to="/profile/password">
                  <p
                    className={`text-sm cursor-pointer ${
                      isActive("/profile/password")
                        ? "font-semibold text-[#344E41]"
                        : "text-gray-600 hover:text-[#344E41]"
                    }`}
                  >
                    Kata Sandi
                  </p>
                </Link>
              </div>
            </div>

            {/* Bagian pesanan */}
            <div>
              <div className="flex items-center gap-2">
                <img src={CheckIcon} alt="Orders icon" className="w-5 h-5" />
                <Link to="/orders-status">
                  <p
                    className={`text-sm cursor-pointer ${
                      isActive("/orders-status")
                        ? "font-semibold text-[#344E41]"
                        : "text-gray-600 hover:text-[#344E41]"
                    }`}
                  >
                    Status Pesanan
                  </p>
                </Link>
              </div>

              <div className="ml-7 mt-1 space-y-1">
                <Link to="/orders-history">
                  <p
                    className={`text-sm cursor-pointer ${
                      isActive("/orders-history")
                        ? "font-semibold text-[#344E41]"
                        : "text-gray-600 hover:text-[#344E41]"
                    }`}
                  >
                    Riwayat Pesanan
                  </p>
                </Link>
              </div>
            </div>
          </div>

          {/* Tombol keluar – jarak lebih pendek di mobile */}
          <button
            onClick={handleLogout}
            className="mt-8 lg:mt-20 self-center flex items-center justify-center gap-2 bg-[#3A5B40] px-6 sm:px-8 py-2 rounded-[10px] text-sm font-semibold text-white hover:bg-[#314c35] transition"
          >
            <img src={OutIcon} alt="Keluar" className="w-4 h-4" />
            Keluar
          </button>
        </div>

        {/* Kartu form profil – full width di mobile, tetap di kanan pada desktop */}
        <div className="flex-1 mr-0 lg:mr-20 mt-4 lg:mt-10 mb-6 lg:mb-10 flex">
          <div className="w-full bg-[#B8D68F40] p-4 sm:p-6 lg:p-10 rounded-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
            <h2 className="text-lg sm:text-xl font-bold mb-2">Profile</h2>
            <p className="text-xs sm:text-sm mb-4">
              Perbarui informasi akun Anda untuk pengalaman belanja yang lebih
              nyaman dan personal.
            </p>
            {/* Garis pembatas */}
            <hr className="border-t-2 border-[#3A5B40] mb-4 sm:mb-6" />

            <form
              onSubmit={handleSave}
              className="space-y-4 sm:space-y-5 lg:space-y-6"
            >
              {/* Nama Lengkap */}
              <div>
                <label className="text-sm font-medium">Nama Lengkap</label>
                <input
                  type="text"
                  className="w-full bg-white py-2.5 px-3 sm:py-3 sm:px-4 rounded-[10px] mt-1 outline-none text-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="w-full bg-white py-2.5 px-3 sm:py-3 sm:px-4 rounded-[10px] mt-1 outline-none text-sm"
                />
              </div>

              {/* No. Telepon */}
              <div>
                <label className="text-sm font-medium">No. Telepon</label>
                <input
                  type="text"
                  className="w-full bg-white py-2.5 px-3 sm:py-3 sm:px-4 rounded-[10px] mt-1 outline-none text-sm"
                />
              </div>

              {/* Jenis Kelamin */}
              <div>
                <label className="text-sm font-medium block mb-2">
                  Jenis Kelamin
                </label>

                <div className="flex flex-wrap gap-4 sm:gap-6">
                  {/* Perempuan */}
                  <div
                    onClick={() => setGender("Perempuan")}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <span
                      className={`w-5 h-5 rounded-full border-2 border-[#3A5B40] flex items-center justify-center ${
                        gender === "Perempuan"
                          ? "bg-[#3A5B40]/10"
                          : "bg-transparent"
                      }`}
                    >
                      {gender === "Perempuan" && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#3A5B40]" />
                      )}
                    </span>

                    <div className="bg-white rounded-[10px] px-6 sm:px-8 lg:px-10 py-2 min-w-[130px] sm:min-w-[150px] text-center text-sm">
                      Perempuan
                    </div>
                  </div>

                  {/* Laki-Laki */}
                  <div
                    onClick={() => setGender("Laki-Laki")}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <span
                      className={`w-5 h-5 rounded-full border-2 border-[#3A5B40] flex items-center justify-center ${
                        gender === "Laki-Laki"
                          ? "bg-[#3A5B40]/10"
                          : "bg-transparent"
                      }`}
                    >
                      {gender === "Laki-Laki" && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#3A5B40]" />
                      )}
                    </span>

                    <div className="bg-white rounded-[10px] px-6 sm:px-8 lg:px-10 py-2 min-w-[130px] sm:min-w-[150px] text-center text-sm">
                      Laki-Laki
                    </div>
                  </div>
                </div>
              </div>

              {/* Tanggal Lahir */}
              <div>
                <label className="text-sm font-medium">Tanggal Lahir</label>
                <input
                  type="date"
                  className="w-full bg-white py-2.5 px-3 sm:py-3 sm:px-4 rounded-[10px] mt-1 outline-none text-sm"
                />
              </div>

              {/* Tombol simpan */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-[#344E41] text-white font-semibold px-6 sm:px-8 py-2 rounded-[10px] hover:bg-[#2a3e33] transition text-sm"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Popup simpan */}
      {showSuccessPopup && (
        <Popup
          variant="success"
          onClose={() => setShowSuccessPopup(false)}
          onConfirm={() => setShowSuccessPopup(false)}
        />
      )}

      {/* Popup logout */}
      {showLogoutPopup && (
        <Popup
          variant="logout"
          onClose={closeLogoutPopup}
          onCancel={closeLogoutPopup}
          onConfirm={confirmLogout}
        />
      )}
    </div>
  );
};

export default ProfileMain;
// src/pages/afterLogin/ProfilePassword.js
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NavbarAfterLogin from "../../components/layout/NavbarAfterLogin";
import Popup from "../../components/common/Popup";

// ICONS & IMAGES (sama seperti ProfileMain)
import EditIcon from "../../assets/images/icons/edit.svg";
import ProfileIcon from "../../assets/images/icons/profile.svg";
import CheckIcon from "../../assets/images/icons/ceklis.svg";
import OutIcon from "../../assets/images/icons/out.svg";
import ProfilePhoto from "../../assets/images/icons/pp.svg";

const ProfilePassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // State input kata sandi dan pesan kesalahan
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});

  // State kontrol popup
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  // State foto profil sementara
  const [profilePic, setProfilePic] = useState(null);

  // Unggah foto profil (preview saja)
  const handleUploadPic = (e) => {
    const f = e.target.files[0];
    if (f) setProfilePic(URL.createObjectURL(f));
  };

  // Validasi sederhana form ubah kata sandi
  const validate = () => {
    let temp = {};
    if (!oldPass) temp.old = "Kata sandi lama tidak boleh kosong!";
    if (!newPass) temp.new = "Kata sandi baru tidak boleh kosong!";
    if (newPass !== confirm)
      temp.conf = "Konfirmasi kata sandi tidak cocok!";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // Simpan perubahan kata sandi
  const handleSave = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setShowSuccess(true);
  };

  // Konfirmasi logout dan hapus token
  const confirmLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  // Cek menu aktif pada sidebar
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#FFFEF6] text-[#344E41] font-poppins flex flex-col">
      <NavbarAfterLogin />

      {/* Konten utama: stack di mobile, dua kolom di desktop */}
      <div className="flex w-full mt-14 gap-4 lg:gap-8 flex-col lg:flex-row px-4 sm:px-6 lg:px-0">
        {/* Sidebar profil (layout desktop dipertahankan) */}
        <div className="w-full lg:w-72 bg-white px-4 sm:px-6 py-6 lg:py-8 rounded-[10px] shadow flex flex-col overflow-y-auto lg:min-h-[calc(100vh-56px)]">
          <div className="flex flex-col items-center text-center">
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

          {/* Menu sidebar */}
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

          {/* Tombol keluar */}
          <button
            onClick={() => setShowLogout(true)}
            className="mt-8 lg:mt-20 self-center flex items-center justify-center gap-2 bg-[#3A5B40] px-6 sm:px-8 py-2 rounded-[10px] text-sm font-semibold text-white hover:bg-[#314c35] transition"
          >
            <img src={OutIcon} alt="Keluar" className="w-4 h-4" />
            Keluar
          </button>
        </div>

        {/* Kartu ubah kata sandi (layout desktop tetap di kanan) */}
        <div className="flex-1 mr-0 md:mr-6 lg:mr-20 flex mt-4 lg:mt-10 mb-6 lg:mb-10">
          <div className="w-full bg-[#B8D68F40] p-4 sm:p-6 md:p-8 lg:p-10 rounded-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
            <h2 className="text-lg sm:text-xl font-bold mb-2">
              Ubah Kata Sandi
            </h2>
            {/* Garis pemisah hijau */}
            <hr className="border-t-2 border-[#3A5B40] mb-4 sm:mb-6" />

            <form
              onSubmit={handleSave}
              className="space-y-4 sm:space-y-5 lg:space-y-6 max-w-xl"
            >
              <div>
                <label className="text-sm">Kata Sandi Lama</label>
                <input
                  type="password"
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  className={`w-full bg-white py-2.5 px-3 sm:py-3 sm:px-4 lg:py-3 lg:px-4 rounded-[10px] mt-1 outline-none text-sm ${
                    errors.old && "border border-red-500"
                  }`}
                />
                {errors.old && (
                  <p className="text-red-500 text-xs mt-1">{errors.old}</p>
                )}
              </div>

              <div>
                <label className="text-sm">Kata Sandi Baru</label>
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className={`w-full bg-white py-2.5 px-3 sm:py-3 sm:px-4 lg:py-3 lg:px-4 rounded-[10px] mt-1 outline-none text-sm ${
                    errors.new && "border border-red-500"
                  }`}
                />
                {errors.new && (
                  <p className="text-red-500 text-xs mt-1">{errors.new}</p>
                )}
              </div>

              <div>
                <label className="text-sm">Konfirmasi Kata Sandi Baru</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={`w-full bg-white py-2.5 px-3 sm:py-3 sm:px-4 lg:py-3 lg:px-4 rounded-[10px] mt-1 outline-none text-sm ${
                    errors.conf && "border border-red-500"
                  }`}
                />
                {errors.conf && (
                  <p className="text-red-500 text-xs mt-1">{errors.conf}</p>
                )}
              </div>

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

      {/* Popup berhasil ubah kata sandi */}
      {showSuccess && (
        <Popup
          variant="success"
          title="Berhasil Mengubah Kata Sandi!"
          message="Kata sandi akun Anda telah diperbarui."
          onClose={() => setShowSuccess(false)}
          onConfirm={() => setShowSuccess(false)}
        />
      )}

      {/* Popup konfirmasi logout */}
      {showLogout && (
        <Popup
          variant="logout"
          title="Anda Yakin Ingin Keluar?"
          message="Anda akan keluar dari akun ini. Apakah Anda yakin?"
          onClose={() => setShowLogout(false)}
          onCancel={() => setShowLogout(false)}
          onConfirm={confirmLogout}
        />
      )}
    </div>
  );
};

export default ProfilePassword;
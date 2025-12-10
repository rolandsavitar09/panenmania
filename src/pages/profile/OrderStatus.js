// src/pages/afterLogin/OrderStatus.js
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import NavbarAfterLogin from "../../components/layout/NavbarAfterLogin";
import Popup from "../../components/common/Popup";

// ICON dan gambar sidebar
import EditIcon from "../../assets/images/icons/edit.svg";
import ProfileIcon from "../../assets/images/icons/profile.svg";
import CheckIcon from "../../assets/images/icons/ceklis.svg";
import OutIcon from "../../assets/images/icons/out.svg";
import ProfilePhoto from "../../assets/images/icons/pp.svg";

// ICON tab status pesanan
import IconBelumBayar from "../../assets/images/icons/belum bayar.svg";
import IconDikemas from "../../assets/images/icons/dikemas.svg";
import IconDikirim from "../../assets/images/icons/dikirim.svg";
import IconSelesai from "../../assets/images/icons/selesai.svg";

const OrderStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Kontrol popup logout
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  // Foto profil sementara (preview lokal)
  const [profilePic, setProfilePic] = useState(null);

  // Tab status aktif (null = semua)
  const [activeTab, setActiveTab] = useState(null);

  // Buka popup logout
  const handleLogout = () => setShowLogoutPopup(true);

  // Tutup popup logout
  const closeLogoutPopup = () => setShowLogoutPopup(false);

  // Konfirmasi logout
  const confirmLogout = () => {
    localStorage.removeItem("token");
    setShowLogoutPopup(false);
    navigate("/", { replace: true });
  };

  // Unggah foto profil (preview)
  const handleUploadPic = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  // Penanda menu aktif sidebar
  const isActiveMenu = (path) => location.pathname === path;

  // Data pesanan dummy
  const orders = [
    {
      id: "ORD20251015-001",
      status: "belum",
      title: "Pembelian",
      product: "Bawang Merah Lokal kering besar 500g (x1)",
      date: "15-10-2025 | 07:25",
    },
    {
      id: "ORD20251015-002",
      status: "selesai",
      title: "Pembelian",
      product: "Beras Pulen Berkualitas Cap Dero 5Kg (x1)",
      date: "15-10-2025 | 07:25",
    },
    {
      id: "ORD20251015-003",
      status: "selesai",
      title: "Pembelian",
      product: "Tomat Merah Segar Hasil Petik Dadakan (x1)",
      date: "15-10-2025 | 07:25",
    },
    {
      id: "ORD20251015-004",
      status: "dikirim",
      title: "Pembelian",
      product: "Beras Pulen Berkualitas Cap Dero 5Kg (x1)",
      date: "15-10-2025 | 07:25",
    },
  ];

  // Filter pesanan sesuai tab aktif
  const filteredOrders = activeTab
    ? orders.filter((o) => o.status === activeTab)
    : orders;

  // Data tab status
  const tabs = [
    { key: "belum", label: "Belum Bayar", icon: IconBelumBayar },
    { key: "dikemas", label: "Dikemas", icon: IconDikemas },
    { key: "dikirim", label: "Dikirim", icon: IconDikirim },
    { key: "selesai", label: "Selesai", icon: IconSelesai },
  ];

  // Klik tab status
  const handleTabClick = (key) => {
    if (activeTab === key) {
      setActiveTab(null);
    } else {
      setActiveTab(key);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFEF6] text-[#344E41] font-poppins flex flex-col">
      <NavbarAfterLogin />

      {/* Konten utama: stack di mobile, dua kolom di desktop */}
      <div className="flex w-full mt-14 gap-4 lg:gap-8 flex-col lg:flex-row px-4 sm:px-6 lg:px-0">
        {/* Sidebar profil */}
        <div className="w-full lg:w-72 bg-white px-4 sm:px-6 py-6 lg:py-8 rounded-[10px] shadow flex flex-col overflow-y-auto lg:min-h-[calc(100vh-56px)]">
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

          {/* Menu sidebar */}
          <div className="mt-6 lg:mt-8 space-y-6 text-left w-full">
            {/* Menu profil */}
            <div>
              <div className="flex items-center gap-2">
                <img src={ProfileIcon} alt="Profile icon" className="w-5 h-5" />
                <Link to="/profile">
                  <p
                    className={`text-sm cursor-pointer ${
                      isActiveMenu("/profile")
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
                      isActiveMenu("/profile/address")
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
                      isActiveMenu("/profile/password")
                        ? "font-semibold text-[#344E41]"
                        : "text-gray-600 hover:text-[#344E41]"
                    }`}
                  >
                    Kata Sandi
                  </p>
                </Link>
              </div>
            </div>

            {/* Menu pesanan */}
            <div>
              <div className="flex items-center gap-2">
                <img src={CheckIcon} alt="Orders icon" className="w-5 h-5" />
                <Link to="/orders-status">
                  <p
                    className={`text-sm cursor-pointer ${
                      isActiveMenu("/orders-status")
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
                      isActiveMenu("/orders-history")
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
            onClick={handleLogout}
            className="mt-8 lg:mt-20 self-center flex items-center justify-center gap-2 bg-[#3A5B40] px-6 sm:px-8 py-2 rounded-[10px] text-sm font-semibold text-white hover:bg-[#314c35] transition"
          >
            <img src={OutIcon} alt="Keluar" className="w-4 h-4" />
            Keluar
          </button>
        </div>

        {/* Konten status pesanan */}
        <div className="flex-1 mr-0 md:mr-6 lg:mr-20 flex flex-col mt-4 lg:mt-10 mb-6 lg:mb-10 gap-4 lg:gap-6">
          {/* Kartu tab status – 1 baris tanpa scroll di mobile */}
          <div className="w-full bg-white rounded-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.06)] px-4 sm:px-6 lg:px-10 py-3 sm:py-4 lg:py-6">
            <div className="flex flex-row justify-between items-stretch gap-2 sm:gap-3 lg:gap-6">
              {tabs.map((tab) => {
                const isTabActive = !activeTab || activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => handleTabClick(tab.key)}
                    className="
                      flex-1
                      flex flex-col items-center justify-between
                      gap-1 sm:gap-1.5
                      focus:outline-none
                      min-w-0
                    "
                  >
                    <img
                      src={tab.icon}
                      alt={tab.label}
                      className={`transition ${
                        isTabActive ? "opacity-100" : "opacity-40"
                      } w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10`}
                    />
                    <span
                      className={`font-semibold text-center truncate ${
                        isTabActive ? "text-[#344E41]" : "text-gray-500"
                      } text-[10px] sm:text-[11px] md:text-sm`}
                    >
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Daftar pesanan */}
          <div className="space-y-3 sm:space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col md:flex-row md:justify-between md:items-center bg-white rounded-[10px] px-4 sm:px-6 py-3 sm:py-4 shadow-[0_6px_20px_rgba(0,0,0,0.04)] gap-3 sm:gap-4"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Thumbnail produk */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-[#F2F2F2] rounded-[10px] overflow-hidden flex items-center justify-center">
                    {/* Gambar produk jika tersedia */}
                  </div>

                  <div className="flex flex-col text-xs sm:text-sm">
                    <p className="font-semibold">{order.title}</p>
                    <p>{order.product}</p>
                    <p className="mt-1 text-[11px] sm:text-xs text-gray-700">
                      {order.date}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/orders-history/${order.id}`)}
                  className="bg-[#3A5B40] text-white px-4 sm:px-5 py-2 rounded-[10px] text-xs md:text-sm font-semibold hover:bg-[#2a3e33] transition self-start md:self-auto"
                >
                  Tampilkan Detail Pesanan
                </button>
              </div>
            ))}

            {/* Pesan jika tidak ada pesanan */}
            {filteredOrders.length === 0 && (
              <p className="text-sm text-gray-600">
                Belum ada pesanan untuk status ini.
                <button
                  type="button"
                  onClick={() => setActiveTab(null)}
                  className="ml-1 underline text-[#344E41]"
                >
                  Lihat semua pesanan
                </button>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Popup konfirmasi logout */}
      {showLogoutPopup && (
        <Popup
          variant="logout"
          title="Anda Yakin Ingin Keluar?"
          message="Anda akan keluar dari akun ini. Apakah Anda yakin?"
          onClose={closeLogoutPopup}
          onCancel={closeLogoutPopup}
          onConfirm={confirmLogout}
        />
      )}
    </div>
  );
};

export default OrderStatus;
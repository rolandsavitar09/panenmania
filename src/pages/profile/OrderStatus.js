// src/pages/afterLogin/OrderStatus.js
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import NavbarAfterLogin from "../../components/layout/NavbarAfterLogin";
import Popup from "../../components/common/Popup";

// ICONS & IMAGES (sidebar & status)
import EditIcon from "../../assets/images/icons/edit.svg";
import ProfileIcon from "../../assets/images/icons/profile.svg";
import CheckIcon from "../../assets/images/icons/ceklis.svg";
import OutIcon from "../../assets/images/icons/out.svg";
import ProfilePhoto from "../../assets/images/icons/pp.svg";

// STATUS TABS ICONS
import IconBelumBayar from "../../assets/images/icons/belum bayar.svg";
import IconDikemas from "../../assets/images/icons/dikemas.svg";
import IconDikirim from "../../assets/images/icons/dikirim.svg";
import IconSelesai from "../../assets/images/icons/selesai.svg";

const OrderStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  // null = semua status aktif (default)
  const [activeTab, setActiveTab] = useState(null);

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

  const isActiveMenu = (path) => location.pathname === path;

  // DATA PESANAN (status: belum, dikemas, dikirim, selesai)
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

  // FILTER BERDASARKAN TAB
  const filteredOrders = activeTab
    ? orders.filter((o) => o.status === activeTab)
    : orders;

  const tabs = [
    { key: "belum", label: "Belum Bayar", icon: IconBelumBayar },
    { key: "dikemas", label: "Dikemas", icon: IconDikemas },
    { key: "dikirim", label: "Dikirim", icon: IconDikirim },
    { key: "selesai", label: "Selesai", icon: IconSelesai },
  ];

  const handleTabClick = (key) => {
    // kalau klik tab yang sama → reset filter (lihat semua status)
    if (activeTab === key) {
      setActiveTab(null);
    } else {
      setActiveTab(key);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFEF6] text-[#344E41] font-poppins flex flex-col">
      <NavbarAfterLogin />

      {/* MAIN CONTENT (di bawah navbar) */}
      <div className="flex w-full mt-14 gap-8">
        {/* SIDEBAR – sama tema dengan ProfileMain */}
        <div className="w-72 bg-white px-6 py-8 rounded-[10px] shadow flex flex-col overflow-y-auto min-h-[calc(100vh-56px)]">
          <div className="flex flex-col items-center text-center">
            {/* Profile Pic + Edit */}
            <label className="relative cursor-pointer inline-block">
              <input type="file" className="hidden" onChange={handleUploadPic} />
              <div className="w-40 h-40 bg-[#F2F2F2] rounded-full flex items-center justify-center overflow-hidden">
                <img
                  src={profilePic || ProfilePhoto}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.12)] flex items-center justify-center">
                <img src={EditIcon} alt="Edit" className="w-4 h-4" />
              </div>
            </label>

            <p className="mt-3 font-semibold text-lg">Dearni Lambardo</p>
          </div>

          {/* MENU SIDEBAR */}
          <div className="mt-8 space-y-6 text-left w-full">
            {/* PROFILE SECTION */}
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

            {/* ORDERS SECTION */}
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

          {/* BUTTON KELUAR */}
          <button
            onClick={handleLogout}
            className="mt-20 self-center flex items-center justify-center gap-2 bg-[#3A5B40] px-8 py-2 rounded-[10px] text-sm font-semibold text-white hover:bg-[#314c35] transition"
          >
            <img src={OutIcon} alt="Keluar" className="w-4 h-4" />
            Keluar
          </button>
        </div>

        {/* KONTEN STATUS PESANAN */}
        <div className="flex-1 mr-6 lg:mr-20 flex flex-col mt-10 mb-10 gap-6">
          {/* CARD TAB STATUS */}
          <div className="w-full bg-white rounded-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.06)] px-10 py-6 flex justify-between">
            {tabs.map((tab) => {
              const isTabActive = !activeTab || activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleTabClick(tab.key)}
                  className="flex flex-col items-center gap-2 focus:outline-none"
                >
                  <img
                    src={tab.icon}
                    alt={tab.label}
                    className={`w-10 h-10 transition ${
                      isTabActive ? "opacity-100" : "opacity-40"
                    }`}
                  />
                  <span
                    className={`text-sm font-semibold ${
                      isTabActive ? "text-[#344E41]" : "text-gray-500"
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* LIST PESANAN */}
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="flex justify-between items-center bg-white rounded-[10px] px-6 py-4 shadow-[0_6px_20px_rgba(0,0,0,0.04)]"
              >
                <div className="flex items-center gap-4">
                  {/* Thumbnail produk */}
                  <div className="w-24 h-24 bg-[#F2F2F2] rounded-[10px] overflow-hidden flex items-center justify-center">
                    {/* ganti dengan gambar produk asli jika sudah ada */}
                    {/* <img src={BawangMerahImg} alt="Bawang Merah" className="w-full h-full object-cover" /> */}
                  </div>

                  <div className="flex flex-col text-sm">
                    <p className="font-semibold">{order.title}</p>
                    <p>{order.product}</p>
                    <p className="mt-1 text-xs text-gray-700">{order.date}</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/orders-history/${order.id}`)}
                  className="bg-[#3A5B40] text-white px-5 py-2 rounded-[10px] text-xs md:text-sm font-semibold hover:bg-[#2a3e33] transition"
                >
                  Tampilkan Detail Pesanan
                </button>
              </div>
            ))}

            {/* Kalau setelah filter tidak ada pesanan */}
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

      {/* POPUP LOGOUT */}
      {showLogoutPopup && (
        <Popup onClose={closeLogoutPopup}>
          <div className="text-center px-6 py-8 bg-white rounded-xl shadow-lg max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-5 text-[#344E41]">
              Anda Yakin Ingin Keluar?
            </h3>
            <div className="flex gap-4 justify-center mt-4">
              <button
                onClick={closeLogoutPopup}
                className="bg-gray-300 text-[#344E41] px-6 py-2 rounded-[10px] hover:bg-gray-400 transition"
              >
                Kembali
              </button>
              <button
                onClick={confirmLogout}
                className="bg-[#344E41] text-white px-6 py-2 rounded-[10px] hover:bg-[#2a3e33] transition"
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

export default OrderStatus;
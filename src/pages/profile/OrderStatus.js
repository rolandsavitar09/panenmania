import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import NavbarAfterLogin from "../../components/layout/NavbarAfterLogin";
import Footer from "../../components/layout/Footer";
import Popup from "../../components/common/Popup";
import {
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  WalletIcon,
  ArchiveBoxIcon,
  TruckIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/solid";

const OrderStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [activeTab, setActiveTab] = useState("selesai"); // default tab

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

  const isActive = (path) => location.pathname === path;

  // contoh orders — jika di app kamu id memakai string seperti "PNM-20230101-001"
  // ganti id di data ini agar konsisten dengan route detail yang kamu punya
  const orders = [
    {
      id: "ORD20241015-001",
      title: "Pembelian",
      item: "Judul",
      price: "Rp. 150.000",
      date: "15-10-2025 | 07:25",
    },
    {
      id: "ORD20241015-002",
      title: "Pembelian",
      item: "Judul",
      price: "Rp. 150.000",
      date: "15-10-2025 | 07:25",
    },
    {
      id: "ORD20241015-003",
      title: "Pembelian",
      item: "Judul",
      price: "Rp. 150.000",
      date: "15-10-2025 | 07:25",
    },
    {
      id: "ORD20241015-004",
      title: "Pembelian",
      item: "Judul",
      price: "Rp. 150.000",
      date: "15-10-2025 | 07:25",
    },
  ];

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

        {/* MAIN CONTENT - ORDER STATUS */}
        <div className="flex-1 bg-[#C3C3C3] p-10 rounded-lg">
          <h2 className="text-xl font-bold mb-6">Status Pesanan</h2>

          {/* Tabs */}
          <div className="flex justify-around bg-[#E0E0E0] rounded-lg py-4 mb-8">
            {[
              { name: "Belum Bayar", icon: WalletIcon, key: "belum" },
              { name: "Dikemas", icon: ArchiveBoxIcon, key: "dikemas" },
              { name: "Dikirim", icon: TruckIcon, key: "dikirim" },
              { name: "Selesai", icon: CheckBadgeIcon, key: "selesai" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex flex-col items-center px-4 py-2 rounded-lg transition ${
                  activeTab === tab.key ? "bg-[#C3C3C3] text-[#344E41]" : "text-gray-500"
                }`}
              >
                <tab.icon className="w-8 h-8 mb-1" />
                <span className="text-sm font-semibold">{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Order List */}
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex justify-between items-center bg-[#E0E0E0] rounded-lg p-4 shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-white rounded-md border" />
                  <div className="flex flex-col text-sm">
                    <p className="font-semibold">{order.title}</p>
                    <p>{order.item}</p>
                    <p>{order.price}</p>
                    <p className="font-semibold mt-1">{order.date}</p>
                  </div>
                </div>

                {/* NAVIGATE TO DETAIL: gunakan route /orders-history/:id */}
                <button
                  onClick={() => navigate(`/orders-history/${order.id}`)}
                  className="bg-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-200 transition"
                >
                  Tampilkan Detail Pesanan
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />

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

export default OrderStatus;
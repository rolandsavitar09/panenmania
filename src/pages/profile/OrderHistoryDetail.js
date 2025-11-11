import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NavbarAfterLogin from "../../components/layout/NavbarAfterLogin";
import Footer from "../../components/layout/Footer";
import Popup from "../../components/common/Popup";
import {
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  ClipboardDocumentCheckIcon,
  BanknotesIcon,
  TruckIcon,
  HandThumbUpIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/solid";

const OrderHistoryDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  const handleLogout = () => setShowLogoutPopup(true);
  const closeLogoutPopup = () => setShowLogoutPopup(false);

  const confirmLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  const handleUploadPic = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  const isActive = (path) => location.pathname === path;

  const order = {
    id: "PNM-20230101-001",
    status: "Diterima",
    product: "Beras cap desa 5kg",
    qty: 1,
    subtotal: "Rpxx.xxx",
    packaging: "Rpxx.xxx",
    shipping: "Rpxx.xxx",
    total: "Rpxx.xxx",
    userName: "Full Name",
    phone: "(+62)",
    desc: "Premium 5 kg merupakan beras yang diproses dengan baik sehingga menghasilkan beras premium yang sangat pulen dan sehat.",
  };

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

        {/* MAIN CONTENT - ORDER DETAIL */}
        <div className="flex-1 bg-[#C3C3C3] p-10 rounded-lg">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="text-sm font-semibold hover:underline"
            >
              &lt; Kembali
            </button>

            <div className="flex items-center gap-3">
              <p className="text-sm font-semibold">ID Pesanan: {order.id}</p>
              <span className="bg-[#E0E0E0] px-4 py-1 rounded-lg text-xs font-semibold">
                {order.status}
              </span>
            </div>
          </div>

          {/* Tracking Progress */}
          <div className="bg-[#D9D9D9] p-6 rounded-lg flex justify-between text-center text-sm">
            {[
              { icon: ClipboardDocumentListIcon, label: "Pesanan Dibuat" },
              { icon: BanknotesIcon, label: "Pembayaran Dikonfirmasi" },
              { icon: TruckIcon, label: "Pesanan Dikirim" },
              { icon: ClipboardDocumentCheckIcon, label: "Pesanan Diterima" },
              { icon: HandThumbUpIcon, label: "Selesai" },
            ].map((step, index) => (
              <div key={index} className="flex flex-col items-center w-full">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-2">
                  <step.icon className="w-8 h-8 text-[#344E41]" />
                </div>
                <p className="text-xs font-medium">{step.label}</p>
              </div>
            ))}
          </div>

          {/* Detail Section */}
          <div className="mt-8 bg-[#E0E0E0] p-6 rounded-lg space-y-6">
            {/* Info Pengguna & Produk */}
            <div className="flex gap-6">
              {/* Kiri - Info Pengguna */}
              <div className="flex-1 pr-6 border-r border-gray-400">
                <p className="font-semibold text-sm">{order.userName}</p>
                <p className="text-xs text-gray-700">{order.phone}</p>
                <p className="text-sm mt-3 leading-relaxed">{order.desc}</p>
              </div>

              {/* Kanan - Produk */}
              <div className="flex-1 flex items-center gap-4">
                <div className="w-24 h-24 bg-white rounded-md border" />
                <div className="text-sm">
                  <p className="font-semibold">{order.product}</p>
                  <p>x{order.qty}</p>
                </div>
                <p className="ml-auto font-medium text-sm">{order.subtotal}</p>
              </div>
            </div>

            {/* Ringkasan Harga */}
            <div className="pt-4 border-t border-black text-sm space-y-1">
              <div className="flex justify-between">
                <span>Subtotal Produk</span>
                <span>{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Pengemasan</span>
                <span>{order.packaging}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal Pengiriman</span>
                <span>{order.shipping}</span>
              </div>
              <hr className="border-black" />
              <div className="flex justify-between font-semibold">
                <span>Total Pemesanan</span>
                <span>{order.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

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

export default OrderHistoryDetail;
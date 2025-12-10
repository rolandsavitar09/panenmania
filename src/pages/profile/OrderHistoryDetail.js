// src/pages/afterLogin/OrderHistoryDetail.js
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NavbarAfterLogin from "../../components/layout/NavbarAfterLogin";
import Popup from "../../components/common/Popup";

// ICONS & IMAGES (sidebar)
import EditIcon from "../../assets/images/icons/edit.svg";
import ProfileIcon from "../../assets/images/icons/profile.svg";
import CheckIcon from "../../assets/images/icons/ceklis.svg";
import OutIcon from "../../assets/images/icons/out.svg";
import ProfilePhoto from "../../assets/images/icons/pp.svg";

// ICONS STEP PESANAN
import deliveryIcon from "../../assets/images/icons/delivery.png";
import dollarIcon from "../../assets/images/icons/dollar.png";
import likeIcon from "../../assets/images/icons/like.png";
import orderIcon from "../../assets/images/icons/order.png";
import packageIcon from "../../assets/images/icons/package.png";
// ICON PANAH
import ArrowIcon from "../../assets/images/icons/panah.svg";

const OrderHistoryDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Kontrol popup logout
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  // Foto profil sementara
  const [profilePic, setProfilePic] = useState(null);

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

  // Unggah foto profil (preview lokal)
  const handleUploadPic = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  // Penanda menu sidebar aktif
  const isActive = (path) => location.pathname === path;

  // Data pesanan contoh
  const order = {
    id: "PNM-20230101-001",
    status: "Selesai",
    customerName: "Full Name",
    phone: "(+62)",
    addressDescription:
      "Jl. Melati No. 25, RT 04/RW 03, Kelurahan Sukamaju, Kecamatan Sukasari, Jakarta Selatan, DKI Jakarta, Kode Pos 12345",
    productName: "Belimbing fresh 500g",
    quantity: 1,
    price: 19000,
    shipping: 2500,
    packing: 1000,
  };

  // Format rupiah
  const formatRupiah = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);

  const subtotalProduk = order.price;
  const subtotalPengiriman = order.shipping;
  const subtotalPengemasan = order.packing;
  const total = subtotalProduk + subtotalPengemasan + subtotalPengiriman;

  // Tahapan proses pesanan
  const steps = [
    { icon: dollarIcon, label: "Pembayaran Dikonfirmasi" },
    { icon: orderIcon, label: "Pesanan Dikemas" },
    { icon: deliveryIcon, label: "Pesanan Dikirim" },
    { icon: packageIcon, label: "Pesanan Diterima" },
    { icon: likeIcon, label: "Selesai" },
  ];

  // Ikon panah antar langkah
  const StepArrow = () => (
    <img
      src={ArrowIcon}
      alt="Arrow"
      className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 object-contain"
    />
  );

  // Kelas label desktop (index 0 boleh 2 baris, lainnya 1 baris)
  const getDesktopLabelClass = (index) =>
    `text-[10px] md:text-xs text-[#3A5B40] leading-tight text-center ${
      index === 0 ? "" : "whitespace-nowrap"
    }`;

  return (
    <div className="min-h-screen bg-[#FFFEF6] text-[#344E41] font-poppins flex flex-col">
      <NavbarAfterLogin />

      {/* Konten utama */}
      <div className="flex w-full mt-14 gap-4 lg:gap-8 flex-col lg:flex-row px-4 sm:px-6 lg:px-0">
        {/* Sidebar */}
        <div className="w-full lg:w-72 bg-white px-4 sm:px-6 py-6 lg:py-8 rounded-[10px] shadow flex flex-col overflow-y-auto lg:min-h-[calc(100vh-56px)]">
          <div className="flex flex-col items-center text-center">
            {/* Foto profil + edit */}
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

            {/* Menu pesanan */}
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
            onClick={handleLogout}
            className="mt-8 lg:mt-20 self-center flex items-center justify-center gap-2 bg-[#3A5B40] px-6 sm:px-8 py-2 rounded-[10px] text-sm font-semibold text-white hover:bg-[#314c35] transition"
          >
            <img src={OutIcon} alt="Keluar" className="w-4 h-4" />
            Keluar
          </button>
        </div>

        {/* Konten utama detail pesanan */}
        <div className="flex-1 mr-0 md:mr-6 lg:mr-20 flex flex-col mt-6 lg:mt-10 mb-6 lg:mb-10">
          {/* Bar kembali + ID pesanan */}
          <div
            className="w-full bg-white rounded-[15px] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 flex-nowrap mb-4"
            style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.08)" }}
          >
            <button
              type="button"
              className="flex items-center gap-2 text-[#3A5B40] text-[11px] sm:text-sm font-semibold flex-none"
              onClick={() => navigate(-1)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="#3A5B40"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span>Kembali</span>
            </button>

            <div className="flex items-center justify-end gap-2 sm:gap-4 text-[10px] sm:text-xs md:text-sm text-[#3A5B40] flex-1 min-w-0">
              <span className="leading-tight text-right">
                ID Pesanan : {order.id}
              </span>
              <span className="font-semibold whitespace-nowrap">
                {order.status}
              </span>
            </div>
          </div>

          {/* Card detail pesanan */}
          <div
            className="w-full rounded-[15px] border border-[#3A5B40] px-3 sm:px-4 md:px-8 py-4 sm:py-5 md:py-7 space-y-4 sm:space-y-5 md:space-y-7"
            style={{
              boxShadow: "0 4px 6px rgba(0,0,0,0.10)",
              backgroundColor: "#FFFEF6",
            }}
          >
            {/* STEP ICONS */}
            <div className="-mx-3 sm:-mx-4 md:-mx-8 -mt-4 md:-mt-7 px-3 sm:px-4 md:px-8 pt-4 md:pt-7 pb-0 bg-white rounded-t-[15px]">
              {/* Desktop / tablet: jarak antar step seragam, lebar icon-block tetap */}
              <div className="hidden md:flex items-center justify-center">
                {steps.map((step, idx) => (
                  <React.Fragment key={idx}>
                    {/* Blok icon + label (vertikal) dengan lebar tetap */}
                    <div className="flex flex-col items-center w-28 lg:w-32 mx-2">
                      <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full border-[3px] border-[#3A5B40] flex items-center justify-center bg-white mb-1.5">
                        <img
                          src={step.icon}
                          alt={step.label}
                          className="w-8 h-8 lg:w-10 lg:h-10 object-contain"
                        />
                      </div>
                      <p className={getDesktopLabelClass(idx)}>{step.label}</p>
                    </div>

                    {/* Panah antar blok */}
                    {idx < steps.length - 1 && (
                      <div className="flex items-center justify-center mx-1">
                        <StepArrow />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Mobile: icon + panah sejajar tengah */}
              <div className="flex md:hidden items-center justify-between gap-1">
                {steps.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <div className="flex flex-col items-center min-w-[50px]">
                      <div className="w-8 h-8 rounded-full border-[2px] border-[#3A5B40] flex items-center justify-center bg-white">
                        <img
                          src={step.icon}
                          alt={step.label}
                          className="w-4 h-4 object-contain"
                        />
                      </div>
                      <p className="mt-1 text-[8.5px] text-[#3A5B40] leading-tight text-center max-w-[60px] break-words">
                        {step.label}
                      </p>
                    </div>
                    {idx < steps.length - 1 && (
                      <div className="flex items-center justify-center flex-none px-[2px]">
                        <StepArrow />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

            {/* Garis pemisah bawah step */}
            <div className="border-t border-[#3A5B40] mt-4 md:mt-5 -mx-3 sm:-mx-4 md:-mx-8" />
          </div>

          {/* Info customer + produk */}
          <div className="flex flex-col md:flex-row gap-5 md:gap-8">
            {/* Info customer */}
            <div className="flex-1 space-y-2 text-xs md:text-sm text-[#3A5B40]">
              <div className="font-semibold">{order.customerName}</div>
              <div className="text-xs">{order.phone}</div>
              <p className="mt-2 leading-relaxed">
                {order.addressDescription}
              </p>
            </div>

            {/* Garis vertikal desktop */}
            <div className="hidden md:block w-px bg-[#3A5B40]" />

            {/* Ringkasan produk */}
            <div className="flex-[1.2]">
              <div
                className="flex items-center gap-3 sm:gap-4 rounded-[10px] px-3 sm:px-4 py-3"
                style={{
                  boxShadow: "0 4px 6px rgba(0,0,0,0.06)",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-md bg-white flex items-center justify-center border border-[#E5E7EB]">
                  <span className="text-[10px] text-[#3A5B40]">IMG</span>
                </div>
                <div className="flex-1 text-xs md:text-sm text-[#3A5B40] space-y-1">
                  <div className="font-semibold">{order.productName}</div>
                  <div className="text-xs">x{order.quantity}</div>
                </div>
                <div className="text-xs md:text-sm text-[#3A5B40] font-medium">
                  {formatRupiah(order.price)}
                </div>
              </div>
            </div>
          </div>

          {/* Rincian harga */}
          <div className="border-t border-[#3A5B40]" />

          <div className="space-y-2 text-xs md:text-sm text-[#3A5B40]">
            <div className="flex justify-between">
              <span>Subtotal Produk</span>
              <span>{formatRupiah(subtotalProduk)}</span>
            </div>
            <div className="flex justify-between">
              <span>Biaya Pengemasan</span>
              <span>{formatRupiah(subtotalPengemasan)}</span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal Pengiriman</span>
              <span>{formatRupiah(subtotalPengiriman)}</span>
            </div>

            <div className="border-t border-[#3A5B40] mt-3 pt-3 flex justify-between font-semibold">
              <span>Total Pemesanan</span>
              <span>{formatRupiah(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Popup logout */}
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

export default OrderHistoryDetail;
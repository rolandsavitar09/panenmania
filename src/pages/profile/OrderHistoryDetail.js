// src/pages/profile/OrderHistoryDetail.js
import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import NavbarAfterLogin from "../../components/layout/NavbarAfterLogin";
import Popup from "../../components/common/Popup";

// ICONS & IMAGES (sidebar)
import EditIcon from "../../assets/images/icons/edit.svg";
import ProfileIcon from "../../assets/images/icons/profile.svg";
import CheckIcon from "../../assets/images/icons/ceklis.svg";
import OutIcon from "../../assets/images/icons/out.svg";
// HILANGKAN fallback pp.svg supaya sidebar mengikuti logika ProfileMain
// import ProfilePhoto from "../../assets/images/icons/pp.svg"; // Placeholder

// ICONS STEP PESANAN
import dollarIcon from "../../assets/images/icons/dollar.png";
import orderIcon from "../../assets/images/icons/order.png";
import deliveryIcon from "../../assets/images/icons/delivery.png";
import packageIcon from "../../assets/images/icons/package.png";
import likeIcon from "../../assets/images/icons/like.png";
// ICON PANAH
import ArrowIcon from "../../assets/images/icons/panah.svg";

// URL API
const API_ORDER_DETAILS_URL = "http://localhost:5000/api/orders";
const getCustomerToken = () => localStorage.getItem("token");

/* ======================== HELPER & FORMATTING ======================== */

// Helper untuk format Rupiah
const formatRupiah = (num) =>
  num == null || isNaN(Number(num))
    ? "Rp 0"
    : new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(Number(num));

// Format status untuk menentukan langkah aktif
const normalizeStatus = (status) =>
  (status || "").toString().toUpperCase().replace(/[^A-Z]/g, "");

// Parse orderId: prefer suffix after dash (e.g. ORD20251015-001 -> 1).
// If no dash, take last contiguous digit group. Return integer or null.
const parseOrderId = (param) => {
  if (!param || typeof param !== "string") return null;

  // ambil semua grup digit
  const groups = param.match(/\d+/g) || [];

  // jika ada dash '-' gunakan grup digit terakhir (suffix) kalau ada
  if (param.includes("-") && groups.length > 0) {
    const last = groups[groups.length - 1];
    const n = parseInt(last, 10);
    return isNaN(n) || n <= 0 ? null : n;
  }

  // jika hanya satu grup digit, gunakan itu
  if (groups.length === 1) {
    const n = parseInt(groups[0], 10);
    return isNaN(n) || n <= 0 ? null : n;
  }

  // multiple groups tanpa dash -> pilih grup terakhir (paling aman)
  if (groups.length > 0) {
    const last = groups[groups.length - 1];
    const n = parseInt(last, 10);
    return isNaN(n) || n <= 0 ? null : n;
  }

  return null;
};

// Ambil data profil user dari localStorage (sama seperti ProfileMain)
const getUserProfileData = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return {
      fullName: user.name || user.full_name || "Customer",
      email: user.email || "email@example.com",
    };
  } catch (e) {
    return { fullName: "Customer", email: "email@example.com" };
  }
};

/* ======================== KOMPONEN UTAMA DETAIL ======================== */

const OrderHistoryDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = useParams(); // Expect numeric-ish id in URL

  // State data API
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Kontrol popup logout
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  // Foto profil sementara (preview lokal)
  const [profilePic, setProfilePic] = useState(null);

  // profile data (nama + email) untuk sidebar — diambil sama seperti ProfileMain
  const [profileData] = useState(getUserProfileData());

  // Resolve numeric id — wajib numeric for backend
  const numericOrderId = parseOrderId(orderId);

  // --- FUNGSI FETCH DETAIL PESANAN ---
  const fetchOrderDetails = useCallback(async () => {
    const token = getCustomerToken();

    // 1) Pastikan user login
    if (!token) {
      setLoading(false);
      setError("User belum login.");
      return;
    }

    // 2) Validasi param orderId harus numeric (ambil digit). Jika tidak valid, jangan panggil API.
    if (!numericOrderId) {
      setLoading(false);
      setError("ID Pesanan tidak valid. Harap buka detail dari halaman Riwayat Pesanan.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `${API_ORDER_DETAILS_URL}/${numericOrderId}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Read response as text then parse safely
      const text = await response.text().catch(() => null);
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }

      if (response.ok) {
        const fetchedOrder = data?.order ?? data;
        // Jika backend mengembalikan items, pastikan image url absolute bila perlu
        if (fetchedOrder && Array.isArray(fetchedOrder.items)) {
          fetchedOrder.items = fetchedOrder.items.map((it) => ({
            ...it,
            imageUrl: it.image_url
              ? it.image_url.startsWith("http")
                ? it.image_url
                : `http://localhost:5000${it.image_url}`
              : it.imageUrl || null,
          }));
        }
        setOrder(fetchedOrder);
      } else {
        // tampilkan pesan yang jelas dari backend atau fallback
        const msg =
          (data && data.message) ||
          text ||
          `Pesanan ID ${numericOrderId} tidak ditemukan atau bukan milik Anda.`;
        setError(msg);
      }
    } catch (err) {
      console.error("[OrderHistoryDetail] fetch failed:", err);
      setError("Gagal terhubung ke server saat memuat detail pesanan.");
    } finally {
      setLoading(false);
    }
  }, [numericOrderId, orderId]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  // Buka popup logout
  const handleLogout = () => setShowLogoutPopup(true);

  // Tutup popup logout
  const closeLogoutPopup = () => setShowLogoutPopup(false);

  // Konfirmasi logout (sama seperti ProfileMain: hapus token & user)
  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowLogoutPopup(false);
    navigate("/", { replace: true });
  };

  // Unggah foto profil (preview lokal)
  const handleUploadPic = (e) => {
    const file = e?.target?.files?.[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  // Penanda menu sidebar aktif
  const isActive = (path) => location.pathname === path;

  // Nilai fallback jika data belum terload atau error
  const currentOrder = order || {
    order_id: numericOrderId || orderId || "-",
    order_status: "LOADING",
    shipping_address: "Memuat alamat...",
    items: [],
    total_amount: 0,
    payment_method: null,
    customerName: profileData.fullName,
    shipping_cost: 0,
    phone: null,
  };

  // Hitungan subtotal produk (aman walau items kosong)
  const subtotalProduk = Array.isArray(currentOrder.items)
    ? currentOrder.items.reduce(
        (sum, item) =>
          sum + (Number(item.price_at_order || item.price || 0) * Number(item.quantity || 0)),
        0
      )
    : 0;

  const subtotalPengiriman = Number(currentOrder.shipping_cost || 0);
  const subtotalPengemasan = 1000; // Biaya packing dummy/default
  const total =
    Number(currentOrder.total_amount || 0) || subtotalProduk + subtotalPengemasan + subtotalPengiriman;

  // Logic Status Pesanan
  const orderStatus = normalizeStatus(currentOrder.order_status);

  // Tahapan proses pesanan (mapping status DB ke tampilan)
  const steps = [
    { icon: orderIcon, label: "Pesanan Diterima", status: "PENDING" },
    { icon: dollarIcon, label: "Pembayaran Dikonfirmasi", status: "PROCESSING" },
    { icon: deliveryIcon, label: "Pesanan Dikirim", status: "SHIPPED" },
    { icon: packageIcon, label: "Pesanan Diterima", status: "DELIVERED" },
    { icon: likeIcon, label: "Selesai", status: "SETTLED" },
  ];

  // Tentukan langkah aktif. Jika tidak ketemu, index = -1
  const currentStepIndex = steps.findIndex((step) => step.status === orderStatus);
  const isOrderFinished = currentStepIndex >= steps.length - 1;

  // Ikon panah antar langkah
  const StepArrow = () => (
    <img
      src={ArrowIcon}
      alt="Arrow"
      className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 object-contain"
    />
  );

  // Kelas label desktop
  const getDesktopLabelClass = (index) =>
    `text-[10px] md:text-xs text-[#3A5B40] leading-tight text-center ${
      index === 0 ? "" : "whitespace-nowrap"
    }`;

  // RENDER: Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFEF6] font-poppins">
        <p className="text-[#3A5B40] text-lg">Memuat detail pesanan...</p>
      </div>
    );
  }

  // RENDER: Error (termasuk: invalid orderId)
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFEF6] font-poppins px-4">
        <div className="max-w-xl text-center">
          <p className="text-red-600 text-lg mb-4">Error: {error}</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-md bg-[#3A5B40] text-white"
            >
              Kembali
            </button>
            <Link to="/orders-history" className="px-4 py-2 rounded-md border border-[#3A5B40] text-[#3A5B40]">
              Buka Riwayat Pesanan
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // RENDER: Sukses (tampilkan detail)
  return (
    <div className="min-h-screen bg-[#FFFEF6] text-[#344E41] font-poppins flex flex-col">
      <NavbarAfterLogin />

      {/* Konten utama */}
      <div className="flex w-full mt-14 gap-4 lg:gap-8 flex-col lg:flex-row px-4 sm:px-6 lg:px-0">
        {/* Sidebar (logika disamakan dengan ProfileMain) */}
        <div className="w-full lg:w-72 bg-white px-4 sm:px-6 py-6 lg:py-8 rounded-[10px] shadow flex flex-col overflow-y-auto lg:min-h-[calc(100vh-56px)]">
          <div className="flex flex-col items-center text-center">
            {/* Foto profil + edit */}
            <label className="relative cursor-pointer inline-block">
              <input type="file" className="hidden" onChange={handleUploadPic} />
              <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-[#F2F2F2] rounded-full flex items-center justify-center overflow-hidden">
                {/* Tampilkan gambar hanya jika ada upload, sesuai logika ProfileMain */}
                {profilePic && <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />}
              </div>
              <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-8 h-8 rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.12)] flex items-center justify-center">
                <img src={EditIcon} alt="Edit" className="w-4 h-4" />
              </div>
            </label>

            <p className="mt-3 font-semibold text-base sm:text-lg">{profileData.fullName}</p>
            <p className="text-xs text-gray-500 mb-4">{profileData.email}</p>
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
                      isActive("/profile") ? "font-semibold text-[#344E41]" : "text-gray-600 hover:text-[#344E41]"
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
              <span className="leading-tight text-right">ID Pesanan : {currentOrder.order_id}</span>
              <span className="font-semibold whitespace-nowrap">{currentOrder.order_status}</span>
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
                        <img src={step.icon} alt={step.label} className="w-8 h-8 lg:w-10 lg:h-10 object-contain" />
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
                        <img src={step.icon} alt={step.label} className="w-4 h-4 object-contain" />
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
                <div className="font-semibold">{currentOrder.customerName || profileData.fullName}</div>
                <div className="text-xs">{currentOrder.phone || "(Nomor tidak tersedia)"}</div>
                <p className="mt-2 leading-relaxed">{currentOrder.shipping_address}</p>
              </div>

              {/* Garis vertikal desktop */}
              <div className="hidden md:block w-px bg-[#3A5B40]" />

              {/* Ringkasan produk */}
              <div className="flex-[1.2]">
                {Array.isArray(currentOrder.items) && currentOrder.items.length > 0 ? (
                  currentOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 sm:gap-4 rounded-[10px] px-3 sm:px-4 py-3 mb-2"
                      style={{
                        boxShadow: "0 4px 6px rgba(0,0,0,0.06)",
                        backgroundColor: "#FFFFFF",
                      }}
                    >
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-md bg-white flex items-center justify-center border border-[#E5E7EB]">
                        <img
                          src={item.imageUrl || item.photo_url || ""}
                          alt={item.name || "Produk"}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 text-xs md:text-sm text-[#3A5B40] space-y-1">
                        <div className="font-semibold">{item.name}</div>
                        <div className="text-xs">x{item.quantity || 0} ({item.unit || "-"})</div>
                      </div>
                      <div className="text-xs md:text-sm text-[#3A5B40] font-medium">
                        {formatRupiah(Number(item.price_at_order || item.price || 0) * Number(item.quantity || 0))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-center text-gray-500 py-4">Tidak ada item dalam pesanan ini.</div>
                )}
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
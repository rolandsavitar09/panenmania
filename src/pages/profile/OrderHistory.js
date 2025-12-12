// src/pages/profile/OrderHistory.js
import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NavbarAfterLogin from "../../components/layout/NavbarAfterLogin";
import Popup from "../../components/common/Popup";

// ICONS & IMAGES
import EditIcon from "../../assets/images/icons/edit.svg";
import ProfileIcon from "../../assets/images/icons/profile.svg";
import CheckIcon from "../../assets/images/icons/ceklis.svg";
import OutIcon from "../../assets/images/icons/out.svg";
// HILANGKAN fallback pp.svg supaya sidebar mengikuti logika ProfileMain
// import ProfilePhoto from "../../assets/images/icons/pp.svg";

// API
const API_ORDER_HISTORY_URL = "http://localhost:5000/api/orders/history";
const getCustomerToken = () => localStorage.getItem("token");

// Format Rupiah
const formatRupiah = (num) => {
  if (num == null || isNaN(Number(num))) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(num));
};

// Format Tanggal (contoh: 15 Oktober 2025)
const formatDate = (date) => {
  if (!date) return "-";
  try {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return date;
  }
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

const OrderHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // DATA
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // LOGOUT POPUP
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  // PROFILE PIC (only show if user uploads, same logic as ProfileMain)
  const [profilePic, setProfilePic] = useState(null);

  // profile data (nama + email) untuk sidebar — diambil sama seperti ProfileMain
  const [profileData, setProfileData] = useState(getUserProfileData());

  // Fetch API
  const fetchOrderHistory = useCallback(async () => {
    const token = getCustomerToken();
    if (!token) {
      setLoading(false);
      // if not logged in, redirect to signin
      return navigate("/signin");
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(API_ORDER_HISTORY_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const body = await res.json().catch(() => null);

      if (res.ok) {
        // Normalisasi data: pastikan setiap item punya order_id (integer)
        const normalized = (body.orders || []).map((o) => {
          // ensure order_id exists and is integer
          let id = null;
          if (Number.isInteger(o.order_id)) {
            id = o.order_id;
          } else if (o.order_id !== undefined && o.order_id !== null) {
            const parsed = parseInt(o.order_id, 10);
            id = !isNaN(parsed) && parsed > 0 ? parsed : null;
          }

          // fallback display id (purely visual)
          const created = o.created_at ? new Date(o.created_at) : null;
          const datePart = created
            ? `${created.getFullYear()}${String(created.getMonth() + 1).padStart(2, "0")}${String(created.getDate()).padStart(2, "0")}`
            : "";
          const seq = id ? String(id).padStart(3, "0") : "";
          const displayId = o.display_id || (datePart && seq ? `ORD${datePart}-${seq}` : `ORD-${id || "0"}`);

          return {
            id: id, // integer (or null)
            displayId,
            date: o.created_at,
            total: parseFloat(o.total_amount || 0),
            status: o.order_status || "-",
            firstItemImage: o.first_item_image_url || null,
          };
        });

        setOrders(normalized);
      } else {
        setError(body?.message || "Gagal memuat riwayat pesanan.");
      }
    } catch (e) {
      console.error("Fetch error:", e);
      setError("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchOrderHistory();
  }, [fetchOrderHistory]);

  // Handle logout
  const handleLogout = () => setShowLogoutPopup(true);
  const closeLogoutPopup = () => setShowLogoutPopup(false);
  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowLogoutPopup(false);
    navigate("/", { replace: true });
  };

  // Upload Foto Profile (preview only)
  const handleUploadPic = (e) => {
    const file = e?.target?.files?.[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  const isActive = (path) => location.pathname === path;

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFEF6] font-poppins">
        <p className="text-[#3A5B40] text-lg">Memuat riwayat pesanan...</p>
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFEF6] font-poppins">
        <p className="text-red-600 text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFEF6] text-[#344E41] font-poppins flex flex-col">
      <NavbarAfterLogin />

      {/* MAIN LAYOUT */}
      <div className="flex w-full mt-14 gap-4 lg:gap-8 flex-col lg:flex-row px-4 sm:px-6 lg:px-0">
        {/* SIDEBAR */}
        <div className="w-full lg:w-72 bg-white px-4 sm:px-6 py-6 lg:py-8 rounded-[10px] shadow flex flex-col overflow-y-auto lg:min-h-[calc(100vh-56px)]">
          <div className="flex flex-col items-center text-center">
            <label className="relative cursor-pointer inline-block">
              <input type="file" className="hidden" onChange={handleUploadPic} />

              <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-[#F2F2F2] rounded-full flex items-center justify-center overflow-hidden">
                {/* Tampilkan gambar hanya jika ada upload, sesuai logika ProfileMain */}
                {profilePic && <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />}
              </div>

              <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center">
                <img src={EditIcon} alt="Edit" className="w-4 h-4" />
              </div>
            </label>

            <p className="mt-3 font-semibold text-base sm:text-lg">{profileData.fullName}</p>
            <p className="text-xs text-gray-500 mb-4">{profileData.email}</p>
          </div>

          {/* MENU */}
          <div className="mt-6 lg:mt-8 space-y-6">
            {/* Profile */}
            <div>
              <div className="flex items-center gap-2">
                <img src={ProfileIcon} alt="Profile icon" className="w-5 h-5" />
                <Link to="/profile">
                  <p className={`text-sm cursor-pointer ${isActive("/profile") ? "font-semibold text-[#344E41]" : "text-gray-600 hover:text-[#344E41]"}`}>
                    Profile
                  </p>
                </Link>
              </div>

              <div className="ml-7 mt-1 space-y-1">
                <Link to="/profile/address">
                  <p className={`text-sm cursor-pointer ${isActive("/profile/address") ? "font-semibold text-[#344E41]" : "text-gray-600 hover:text-[#344E41]"}`}>
                    Alamat
                  </p>
                </Link>

                <Link to="/profile/password">
                  <p className={`text-sm cursor-pointer ${isActive("/profile/password") ? "font-semibold text-[#344E41]" : "text-gray-600 hover:text-[#344E41]"}`}>
                    Kata Sandi
                  </p>
                </Link>
              </div>
            </div>

            {/* Orders */}
            <div>
              <div className="flex items-center gap-2">
                <img src={CheckIcon} alt="Orders icon" className="w-5 h-5" />
                <Link to="/orders-status">
                  <p className={`text-sm cursor-pointer ${isActive("/orders-status") ? "font-semibold text-[#344E41]" : "text-gray-600 hover:text-[#344E41]"}`}>
                    Status Pesanan
                  </p>
                </Link>
              </div>

              <div className="ml-7 mt-1 space-y-1">
                <Link to="/orders-history">
                  <p className={`text-sm cursor-pointer ${isActive("/orders-history") ? "font-semibold text-[#344E41]" : "text-gray-600 hover:text-[#344E41]"}`}>
                    Riwayat Pesanan
                  </p>
                </Link>
              </div>
            </div>
          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="mt-8 lg:mt-20 self-center flex items-center justify-center gap-2 bg-[#3A5B40] px-6 sm:px-8 py-2 rounded-[10px] text-sm font-semibold text-white hover:bg-[#314c35] transition"
          >
            <img src={OutIcon} alt="Keluar" className="w-4 h-4" />
            Keluar
          </button>
        </div>

        {/* ORDER LIST */}
        <div className="flex-1 mr-0 md:mr-6 lg:mr-20 flex">
          <div className="w-full bg-[#B8D68F40] p-4 sm:p-6 md:p-8 lg:p-10 rounded-[10px] shadow mt-6 lg:mt-10 mb-6 lg:mb-10">
            <h2 className="text-lg sm:text-xl font-bold mb-2">Riwayat Pesanan</h2>
            <hr className="border-t-2 border-[#3A5B40] mb-4 sm:mb-6" />

            <div className="space-y-4 sm:space-y-5">
              {orders.length === 0 && (
                <div className="text-center text-sm text-gray-600 mt-6">Belum ada riwayat pesanan.</div>
              )}

              {orders.map((order) => (
                <div key={order.id ?? Math.random()} className="bg-white rounded-[10px] shadow px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                  {/* Header */}
                  <p className="text-xs sm:text-sm font-semibold">
                    ID Pesanan: ORD-{order.id}
                  </p>
                  <p className="text-[11px] sm:text-xs text-gray-700 mb-2">
                    Tanggal: {formatDate(order.date)}
                  </p>

                  <hr className="border-[#3A5B40] mb-3 sm:mb-4" />

                  {/* PRODUCT SUMMARY */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-[10px] bg-[#F2F2F2] flex items-center justify-center overflow-hidden">
                      {order.firstItemImage ? (
                        <img src={order.firstItemImage} alt="item" className="w-full h-full object-contain" />
                      ) : (
                        // Jika tidak ada gambar, jangan tampilkan pp.svg — konsisten dengan ProfileMain behavior
                        <div className="w-full h-full bg-[#E5E5E5]" />
                      )}
                    </div>

                    <div className="flex-1 text-xs sm:text-sm">
                      <p className="font-semibold mb-1">Pesanan Beberapa Item</p>
                      <p className="font-medium">{formatRupiah(order.total)}</p>

                      <div className="flex items-center gap-2 mt-3 text-[11px] sm:text-xs">
                        <span className="text-[#344E41] font-medium">Status Pesanan:</span>
                        <span className="px-3 py-1 rounded-full bg-[#3A5B40] text-white text-[10px] sm:text-[11px]">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <hr className="border-[#3A5B40] mt-3 sm:mt-4 mb-2 sm:mb-3" />

                  {/* BUTTON */}
                  <div className="flex gap-2">
                    {/* PENTING: selalu gunakan order.id (integer dari DB) untuk navigasi */}
                    <Link
                      to={order.id ? `/orders-history/${order.id}` : "#"}
                      className={`flex-1 text-center text-xs sm:text-sm font-semibold py-2 rounded-[10px] transition ${order.id ? "bg-[#3A5B40] text-white hover:bg-[#2a3e33]" : "bg-gray-200 text-gray-600 cursor-not-allowed"}`}
                      onClick={(e) => {
                        if (!order.id) e.preventDefault();
                      }}
                    >
                      Detail Pesanan
                    </Link>

                    {/* Optional: quick action, mis. ulangi order */}
                    <button
                      type="button"
                      onClick={() => order.id && navigate(`/orders-history/${order.id}`)}
                      className="hidden sm:inline-block px-3 py-2 rounded-[10px] border border-[#3A5B40] text-sm text-[#3A5B40] hover:bg-[#f1f7ec] transition"
                    >
                      Lihat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* LOGOUT POPUP */}
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

export default OrderHistory;

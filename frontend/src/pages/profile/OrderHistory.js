// src/pages/profile/OrderHistory.js
import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NavbarAfterLogin from "../../components/layout/NavbarAfterLogin";
import Popup from "../../components/common/Popup";
import API from "../../api/api";

// ICONS & IMAGES
import EditIcon from "../../assets/images/icons/edit.svg";
import ProfileIcon from "../../assets/images/icons/profile.svg";
import CheckIcon from "../../assets/images/icons/ceklis.svg";
import OutIcon from "../../assets/images/icons/out.svg";

// =======================
// FORMAT & HELPER
// =======================

const formatRupiah = (num) => {
  if (num == null || isNaN(Number(num))) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(num));
};

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

const getUserProfileData = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return {
      fullName: user.name || user.full_name || "Customer",
      email: user.email || "email@example.com",
    };
  } catch {
    return { fullName: "Customer", email: "email@example.com" };
  }
};

// =======================
// COMPONENT
// =======================

const OrderHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [profileData] = useState(getUserProfileData());

  // =======================
  // FETCH ORDER HISTORY
  // =======================

  const fetchOrderHistory = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      navigate("/signin");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await API.get("/api/orders/history");

      // 🔑 FIX UTAMA (ANTI BACKEND FORMAT BEDA-BEDA)
      const rawOrders = Array.isArray(data)
        ? data
        : Array.isArray(data.orders)
        ? data.orders
        : Array.isArray(data.data)
        ? data.data
        : [];

      const normalized = rawOrders.map((o) => {
        let id = null;
        if (Number.isInteger(o.order_id)) {
          id = o.order_id;
        } else if (o.order_id !== undefined && o.order_id !== null) {
          const parsed = parseInt(o.order_id, 10);
          id = !isNaN(parsed) && parsed > 0 ? parsed : null;
        }

        const created = o.created_at ? new Date(o.created_at) : null;
        const datePart = created
          ? `${created.getFullYear()}${String(created.getMonth() + 1).padStart(2, "0")}${String(created.getDate()).padStart(2, "0")}`
          : "";
        const seq = id ? String(id).padStart(3, "0") : "";
        const displayId =
          o.display_id ||
          (datePart && seq ? `ORD${datePart}-${seq}` : `ORD-${id || "0"}`);

        return {
          id,
          displayId,
          date: o.created_at,
          total: parseFloat(o.total_amount || 0),
          status: o.order_status || "-",
          firstItemImage: o.first_item_image_url || null,
        };
      });

      setOrders(normalized);
    } catch (err) {
      console.error("[OrderHistory] Error:", err);
      setError(
        err?.response?.data?.message || "Gagal memuat riwayat pesanan."
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchOrderHistory();
  }, [fetchOrderHistory]);

  // =======================
  // LOGOUT
  // =======================

  const handleLogout = () => setShowLogoutPopup(true);
  const closeLogoutPopup = () => setShowLogoutPopup(false);
  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowLogoutPopup(false);
    navigate("/", { replace: true });
  };

  const handleUploadPic = (e) => {
    const file = e?.target?.files?.[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  const isActive = (path) => location.pathname === path;

  // =======================
  // RENDER STATES
  // =======================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFEF6] font-poppins">
        <p className="text-[#3A5B40] text-lg">Memuat riwayat pesanan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFEF6] font-poppins">
        <p className="text-red-600 text-lg">Error: {error}</p>
      </div>
    );
  }

  // =======================
  // UI
  // =======================

  return (
    <div className="min-h-screen bg-[#FFFEF6] text-[#344E41] font-poppins flex flex-col">
      <NavbarAfterLogin />

      <div className="flex w-full mt-14 gap-4 lg:gap-8 flex-col lg:flex-row px-4 sm:px-6 lg:px-0">
        {/* SIDEBAR */}
        <div className="w-full lg:w-72 bg-white px-4 sm:px-6 py-6 lg:py-8 rounded-[10px] shadow flex flex-col">
          <div className="flex flex-col items-center text-center">
            <label className="relative cursor-pointer inline-block">
              <input type="file" className="hidden" onChange={handleUploadPic} />
              <div className="w-28 h-28 lg:w-40 lg:h-40 bg-[#F2F2F2] rounded-full overflow-hidden">
                {profilePic && (
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center">
                <img src={EditIcon} alt="Edit" className="w-4 h-4" />
              </div>
            </label>

            <p className="mt-3 font-semibold">{profileData.fullName}</p>
            <p className="text-xs text-gray-500">{profileData.email}</p>
          </div>

          <button
            onClick={handleLogout}
            className="mt-10 self-center flex items-center gap-2 bg-[#3A5B40] px-6 py-2 rounded-[10px] text-white"
          >
            <img src={OutIcon} alt="Keluar" className="w-4 h-4" />
            Keluar
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 bg-[#B8D68F40] p-6 rounded-[10px] shadow mt-6 lg:mt-10 mb-6 lg:mb-10">
          <h2 className="text-xl font-bold mb-4">Riwayat Pesanan</h2>

          {orders.length === 0 && (
            <p className="text-center text-sm text-gray-600">
              Belum ada riwayat pesanan.
            </p>
          )}

          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-4 rounded-[10px] shadow">
                <p className="text-sm font-semibold">
                  ID Pesanan: {order.displayId}
                </p>
                <p className="text-xs text-gray-600">
                  Tanggal: {formatDate(order.date)}
                </p>

                <div className="mt-2 font-semibold">
                  {formatRupiah(order.total)}
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <span className="px-3 py-1 rounded-full bg-[#3A5B40] text-white text-xs">
                    {order.status}
                  </span>

                  <Link
                    to={`/orders-history/${order.id}`}
                    className="text-sm font-semibold text-[#3A5B40] underline"
                  >
                    Detail Pesanan
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
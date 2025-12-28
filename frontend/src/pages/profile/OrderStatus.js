// src/pages/afterLogin/OrderStatus.js
import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import NavbarAfterLogin from "../../components/layout/NavbarAfterLogin";
import Popup from "../../components/common/Popup";

// ICON dan gambar sidebar
import EditIcon from "../../assets/images/icons/edit.svg";
import ProfileIcon from "../../assets/images/icons/profile.svg";
import CheckIcon from "../../assets/images/icons/ceklis.svg";
import OutIcon from "../../assets/images/icons/out.svg";
// HILANGKAN penggunaan pp.svg supaya sidebar mengikuti logika ProfileMain
// import ProfilePhoto from "../../assets/images/icons/pp.svg";

// ICON tab status pesanan
import IconBelumBayar from "../../assets/images/icons/belum bayar.svg";
import IconDikemas from "../../assets/images/icons/dikemas.svg";
import IconDikirim from "../../assets/images/icons/dikirim.svg";
import IconSelesai from "../../assets/images/icons/selesai.svg";

/*
  OrderStatus.js (final)
  - Baca dari localStorage orderStatus & orderHistory
  - Normalisasi fields, build thumbnail (prefix http://localhost:5000 jika path relatif)
  - Listen storage & visibilitychange agar auto-refresh
  - Sidebar disamakan logikanya dengan ProfileMain:
    * nama & email diambil dari localStorage user
    * hanya tampilkan foto jika user mengupload (profilePic)
    * saat logout hapus token + user dari localStorage
  - Tidak merubah layout / ukuran (className tetap)
*/

// helper: safe JSON parse
const safeParse = (s) => {
  try {
    return JSON.parse(s);
  } catch (e) {
    return null;
  }
};

// ambil data profil user dari localStorage (sama seperti di ProfileMain)
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

// helper: ambil ringkasan produk dari orderHistory jika tersedia
const firstProductTextFromHistory = (orderId, orderHistoryArr) => {
  try {
    if (!Array.isArray(orderHistoryArr)) return "";
    const found = orderHistoryArr.find((o) => {
      const idA = o.orderId ?? o.order_id ?? null;
      if (idA == null) return false;
      return String(idA) === String(orderId);
    });
    if (!found) return "";
    const items = found.items || [];
    if (!Array.isArray(items) || items.length === 0) return "";
    const first = items[0];
    const name = first.name ?? first.product_name ?? `Product ${first.product_id ?? first.productId ?? ""}`;
    const qty = first.qty ?? first.quantity ?? 1;
    return `${name} (x${qty})`;
  } catch (e) {
    return "";
  }
};

// build orders array dari localStorage
const buildOrdersFromStorage = () => {
  const rawStatus = safeParse(localStorage.getItem("orderStatus"));
  const rawHistory = safeParse(localStorage.getItem("orderHistory"));

  if (!Array.isArray(rawStatus)) return [];

  const mapped = rawStatus.map((s) => {
    try {
      const id = s.orderId ?? s.order_id ?? s.id ?? null;
      const status = (s.status ?? s.orderStatus ?? s.order_status ?? "").toString().toLowerCase();
      const createdAt = s.createdAt ?? s.created_at ?? s.created ?? null;

      // 1) Cari url/gambar dari ringkasan status
      let thumb = s.firstItemImageUrl ?? s.first_item_image_url ?? s.thumbnail ?? s.imageUrl ?? s.image_url ?? null;

      // 2) Jika tidak ada, coba ambil dari orderHistory (first item)
      if (!thumb && Array.isArray(rawHistory)) {
        const found = rawHistory.find((o) => {
          const idA = o.orderId ?? o.order_id ?? null;
          if (idA == null) return false;
          return String(idA) === String(id);
        });
        if (found && Array.isArray(found.items) && found.items.length > 0) {
          const first = found.items[0];
          thumb = first.imageUrl ?? first.image_url ?? first.img ?? null;
        }
      }

      // 3) Normalisasi thumb: jika relative path, prefix server base
      if (thumb && typeof thumb === "string") {
        const t = thumb.trim();
        if (t && !/^https?:\/\//i.test(t)) {
          const clean = t.replace(/^\/+/, "");
          thumb = `http://localhost:5000/${clean}`;
        } else {
          thumb = t;
        }
      } else {
        thumb = null;
      }

      const productSummary = firstProductTextFromHistory(id, rawHistory) || (s.firstItemName ?? s.first_item_name ?? s.productSummary ?? "");
      const dateText = createdAt ? new Date(createdAt).toLocaleString() : (s.date ?? "");
      const title = s.title ?? s.display_name ?? "Pembelian";

      return {
        id: id ?? `local-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
        status: status || "pending",
        title,
        product: productSummary || (s.shippingAddress ? s.shippingAddress : "-"),
        date: dateText,
        thumbnail: thumb,
        raw: s,
      };
    } catch (err) {
      return {
        id: `local-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
        status: "pending",
        title: "Pembelian",
        product: "-",
        date: "",
        thumbnail: null,
        raw: s,
      };
    }
  });

  // Urutkan berdasarkan createdAt (terbaru di atas)
  mapped.sort((a, b) => {
    const at = (a.raw?.createdAt ?? a.raw?.created_at ?? a.raw?.created) ? new Date(a.raw.createdAt ?? a.raw.created_at ?? a.raw.created) : null;
    const bt = (b.raw?.createdAt ?? b.raw?.created_at ?? b.raw?.created) ? new Date(b.raw.createdAt ?? b.raw.created_at ?? b.raw.created) : null;
    if (at && bt) return bt - at;
    if (at) return -1;
    if (bt) return 1;
    return 0;
  });

  return mapped;
};

const OrderStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Popup logout & profile pic
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  // profile data (nama + email) untuk sidebar — diambil sama seperti ProfileMain
  const [profileData] = useState(getUserProfileData());

  // Tab status aktif
  const [activeTab, setActiveTab] = useState(null);

  // orders — dibaca dari localStorage
  const [orders, setOrders] = useState(() => buildOrdersFromStorage());

  // refresh data dari localStorage
  const refreshOrders = useCallback(() => {
    setOrders(buildOrdersFromStorage());
  }, []);

  useEffect(() => {
    // listen storage event supaya auto-update jika localStorage diubah di tab lain
    const onStorage = (ev) => {
      if (!ev) return;
      if (ev.key === "orderStatus" || ev.key === "orderHistory") {
        refreshOrders();
      }
    };
    window.addEventListener("storage", onStorage);

    // juga attach visibilitychange untuk refresh saat kembali ke tab
    const onVisible = () => {
      if (!document.hidden) refreshOrders();
    };
    document.addEventListener("visibilitychange", onVisible);

    // initial refresh (in case localStorage changed before mount)
    refreshOrders();

    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refreshOrders]);

  // handlers popup / profile / logout
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
  const isActiveMenu = (path) => location.pathname === path;

  // tabs (tetap sama agar layout identik)
  const tabs = [
    { key: "belum", label: "Belum Bayar", icon: IconBelumBayar },
    { key: "dikemas", label: "Dikemas", icon: IconDikemas },
    { key: "dikirim", label: "Dikirim", icon: IconDikirim },
    { key: "selesai", label: "Selesai", icon: IconSelesai },
  ];

  // filter sesuai tab — agar tidak mengubah layout, kita masih gunakan status key yg ada di data
  const filteredOrders = activeTab ? orders.filter((o) => (o.status || "").toLowerCase() === activeTab) : orders;

  const handleTabClick = (key) => {
    if (activeTab === key) setActiveTab(null);
    else setActiveTab(key);
  };

  return (
    <div className="min-h-screen bg-[#FFFEF6] text-[#344E41] font-poppins flex flex-col">
      <NavbarAfterLogin />

      {/* Konten utama: stack di mobile, dua kolom di desktop */}
      <div className="flex w-full mt-14 gap-4 lg:gap-8 flex-col lg:flex-row px-4 sm:px-6 lg:px-0">
        {/* Sidebar profil */}
        <div className="w-full lg:w-72 bg-white px-4 sm:px-6 py-6 lg:py-8 rounded-[10px] shadow flex flex-col overflow-y-auto lg:min-h-[calc(100vh-56px)]">
          <div className="flex flex-col items-center text-center">
            <label className="relative cursor-pointer inline-block">
              <input type="file" className="hidden" onChange={handleUploadPic} />
              <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-[#F2F2F2] rounded-full flex items-center justify-center overflow-hidden">
                {/* Tampilkan gambar hanya jika ada upload, sesuai logika ProfileMain */}
                {profilePic && (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                )}
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
                  <p className={`text-sm cursor-pointer ${isActiveMenu("/profile") ? "font-semibold text-[#344E41]" : "text-gray-600 hover:text-[#344E41]"}`}>
                    Profile
                  </p>
                </Link>
              </div>

              <div className="ml-7 mt-1 space-y-1">
                <Link to="/profile/address">
                  <p className={`text-sm cursor-pointer ${isActiveMenu("/profile/address") ? "font-semibold text-[#344E41]" : "text-gray-600 hover:text-[#344E41]"}`}>
                    Alamat
                  </p>
                </Link>

                <Link to="/profile/password">
                  <p className={`text-sm cursor-pointer ${isActiveMenu("/profile/password") ? "font-semibold text-[#344E41]" : "text-gray-600 hover:text-[#344E41]"}`}>
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
                  <p className={`text-sm cursor-pointer ${isActiveMenu("/orders-status") ? "font-semibold text-[#344E41]" : "text-gray-600 hover:text-[#344E41]"}`}>
                    Status Pesanan
                  </p>
                </Link>
              </div>

              <div className="ml-7 mt-1 space-y-1">
                <Link to="/orders-history">
                  <p className={`text-sm cursor-pointer ${isActiveMenu("/orders-history") ? "font-semibold text-[#344E41]" : "text-gray-600 hover:text-[#344E41]"}`}>
                    Riwayat Pesanan
                  </p>
                </Link>
              </div>
            </div>
          </div>

          {/* Tombol keluar */}
          <button onClick={handleLogout} className="mt-8 lg:mt-20 self-center flex items-center justify-center gap-2 bg-[#3A5B40] px-6 sm:px-8 py-2 rounded-[10px] text-sm font-semibold text-white hover:bg-[#314c35] transition">
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
                    <img src={tab.icon} alt={tab.label} className={`transition ${isTabActive ? "opacity-100" : "opacity-40"} w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10`} />
                    <span className={`font-semibold text-center truncate ${isTabActive ? "text-[#344E41]" : "text-gray-500"} text-[10px] sm:text-[11px] md:text-sm`}>
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
                    {order.thumbnail ? (
                      // gambar ada -> tampilkan
                      // eslint-disable-next-line jsx-a11y/img-redundant-alt
                      <img
                        src={order.thumbnail}
                        alt="Produk"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // fallback: kalau gagal load, ganti ke placeholder abu
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "";
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      // placeholder ketika tidak ada gambar
                      <div className="w-full h-full bg-[#E5E5E5]" />
                    )}
                  </div>

                  <div className="flex flex-col text-xs sm:text-sm">
                    <p className="font-semibold">{order.title}</p>
                    <p>{order.product}</p>
                    <p className="mt-1 text-[11px] sm:text-xs text-gray-700">{order.date}</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/orders-history/${encodeURIComponent(String(order.id))}`)}
                  className="bg-[#3A5B40] text-white px-4 sm:px-5 py-2 rounded-[10px] text-xs md:text-sm font-semibold hover:bg-[#2a3e33] transition self-start md:self-auto"
                >
                  Tampilkan Detail Pesanan
                </button>
              </div>
            ))}

            {filteredOrders.length === 0 && (
              <p className="text-sm text-gray-600">
                Belum ada pesanan untuk status ini.
                <button type="button" onClick={() => setActiveTab(null)} className="ml-1 underline text-[#344E41]">
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
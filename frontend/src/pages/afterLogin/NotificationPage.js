// src/pages/afterLogin/NotificationPage.js
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import NavbarAfterLogin from "../../components/layout/NavbarAfterLogin";

const safeParse = (s) => {
  try {
    return JSON.parse(s);
  } catch (e) {
    return null;
  }
};

const formatRupiah = (number) => {
  if (number == null || isNaN(Number(number))) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(number));
};

const buildNotificationsFromOrderHistory = () => {
  const raw = safeParse(localStorage.getItem("orderHistory")) || [];
  if (!Array.isArray(raw) || raw.length === 0) return [];

  // ambil hanya entri yang statusnya menunjukkan pesanan berhasil dibuat
  // (nilai status bisa 'created' atau variasi lain — kita cek includes 'creat' utk toleran)
  const successOrders = raw.filter((o) => {
    const s = (o.status ?? "").toString().toLowerCase();
    return s.includes("creat") || s === "created" || s === "done" || s === "success";
  });

  // map ke bentuk notifikasi
  return successOrders.map((o) => {
    const orderId = o.orderId ?? o.order_id ?? null;
    const createdAt = o.createdAt ?? o.created_at ?? o.created ?? null;
    const createdText = createdAt ? new Date(createdAt).toLocaleString() : "";
    const total = o.total ?? o.total_amount ?? null;

    // ringkasan item: ambil nama item pertama atau jumlah item
    const firstItem = Array.isArray(o.items) && o.items.length > 0 ? o.items[0] : null;
    const productName = firstItem?.name ?? firstItem?.product_name ?? (firstItem ? `Product ${firstItem.product_id ?? ""}` : "");
    const qty = firstItem?.qty ?? firstItem?.quantity ?? null;
    const productSummary = productName ? `${productName}${qty ? ` (x${qty})` : ""}` : "Pesanan";

    const title = `Pesanan ${orderId ? String(orderId) : ""} Berhasil`;
    const desc = `Pesanan ${productSummary} telah berhasil dibuat.${total ? ` Total: ${formatRupiah(total)}.` : ""} Silakan cek detail pada riwayat pesanan.`;
    const link = orderId ? `/orders-history/${encodeURIComponent(String(orderId))}` : "/orders-history";

    return {
      id: orderId ?? `local-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
      title,
      desc,
      date: createdText,
      link,
    };
  });
};

const NotificationPage = () => {
  const [notifications, setNotifications] = useState(() => {
    const built = buildNotificationsFromOrderHistory();
    // jika tidak ada notifikasi sukses, tampilkan pesan default kosong nanti
    return built;
  });

  // refresh helper
  const refresh = useCallback(() => {
    setNotifications(buildNotificationsFromOrderHistory());
  }, []);

  useEffect(() => {
    // listen storage event agar auto update dari tab lain
    const onStorage = (ev) => {
      if (!ev) return;
      if (ev.key === "orderHistory" || ev.key === "orderStatus") {
        refresh();
      }
    };
    window.addEventListener("storage", onStorage);

    // refresh saat kembali ke tab
    const onVisible = () => {
      if (!document.hidden) refresh();
    };
    document.addEventListener("visibilitychange", onVisible);

    // initial refresh (keamanan)
    refresh();

    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  return (
    <div className="min-h-screen bg-[#FFFEF6] font-poppins text-[#344E41] flex flex-col">
      {/* Navbar tetap di atas */}
      <NavbarAfterLogin />

      {/* Wrapper konten utama – padding responsif agar tidak terlalu panjang di mobile */}
      <div className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-10 max-w-6xl mx-auto w-full">
        {/* Judul halaman */}
        <h1 className="text-lg sm:text-2xl font-semibold mb-5 sm:mb-8">
          Pemberitahuan Notifikasi
        </h1>

        {/* List notifikasi */}
        <div className="flex flex-col gap-4 sm:gap-5">
          {notifications.length === 0 ? (
            <div className="bg-[#B8D68F40] rounded-[10px] px-4 py-6 shadow-[0_6px_20px_rgba(0,0,0,0.04)]">
              <p className="text-sm text-gray-700">Belum ada notifikasi pesanan berhasil.</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 md:gap-6 bg-[#B8D68F40] rounded-[10px] px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-5 shadow-[0_6px_20px_rgba(0,0,0,0.04)]"
              >
                {/* Gambar / placeholder */}
                <div className="w-20 h-16 sm:w-24 sm:h-18 md:w-28 md:h-20 bg-white rounded-[10px] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.06)] flex-none">
                  <span className="text-[10px] text-[#344E41]">IMG</span>
                </div>

                {/* Teks notifikasi */}
                <div className="flex-1">
                  <h2 className="font-semibold text-sm sm:text-base mb-1">
                    {item.title}
                  </h2>
                  <p className="text-xs sm:text-sm leading-relaxed">
                    {item.desc}
                  </p>
                  <p className="text-[11px] sm:text-xs mt-2 sm:mt-3">
                    {item.date}
                  </p>
                </div>

                {/* Tombol detail */}
                <div className="w-full sm:w-auto mt-2 sm:mt-0 flex justify-end">
                  <Link to={item.link} className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto bg-[#344E41] text-white text-xs sm:text-sm font-semibold px-4 sm:px-6 py-2 rounded-[10px] hover:bg-[#2a3e33] transition">
                      Tampilkan Detail Pesanan
                    </button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
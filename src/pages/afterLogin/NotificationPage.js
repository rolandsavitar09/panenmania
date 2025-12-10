// src/pages/afterLogin/NotificationPage.js
import React from "react";
import { Link } from "react-router-dom";
import NavbarAfterLogin from "../../components/layout/NavbarAfterLogin";

const NotificationPage = () => {
  // Data dummy notifikasi
  const notifications = [
    {
      id: 1,
      title: "Konfirmasi Pesanan Berhasil",
      desc: "Terima kasih telah melakukan pemesanan. Pesanan Anda sedang diproses dan akan segera kami siapkan. Silakan cek detail pesanan di halaman riwayat transaksi Anda.",
      date: "15-10-2025 | 07:25",
    },
    {
      id: 2,
      title: "Konfirmasi Pesanan Berhasil",
      desc: "Terima kasih telah melakukan pemesanan. Pesanan Anda sedang diproses dan akan segera kami siapkan. Silakan cek detail pesanan di halaman riwayat transaksi Anda.",
      date: "15-10-2025 | 07:25",
    },
    {
      id: 3,
      title: "Konfirmasi Pesanan Berhasil",
      desc: "Terima kasih telah melakukan pemesanan. Pesanan Anda sedang diproses dan akan segera kami siapkan. Silakan cek detail pesanan di halaman riwayat transaksi Anda.",
      date: "15-10-2025 | 07:25",
    },
    {
      id: 4,
      title: "Konfirmasi Pesanan Berhasil",
      desc: "Terima kasih telah melakukan pemesanan. Pesanan Anda sedang diproses dan akan segera kami siapkan. Silakan cek detail pesanan di halaman riwayat transaksi Anda.",
      date: "15-10-2025 | 07:25",
    },
  ];

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

        {/* List notifikasi – jarak antar card sedikit dipadatkan agar tidak terlalu panjang */}
        <div className="flex flex-col gap-4 sm:gap-5">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 md:gap-6 bg-[#B8D68F40] rounded-[10px] px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-5 shadow-[0_6px_20px_rgba(0,0,0,0.04)]"
            >
              {/* Gambar produk (placeholder) – ukuran responsif */}
              <div className="w-20 h-16 sm:w-24 sm:h-18 md:w-28 md:h-20 bg-white rounded-[10px] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.06)] flex-none">
                {/* Nanti dapat diganti dengan <img src={...} alt="Produk" /> */}
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

              {/* Tombol detail – full width di mobile, kecil di desktop */}
              <div className="w-full sm:w-auto mt-2 sm:mt-0 flex justify-end">
                <Link
                  to="/orders-history/PNM-20230101-001"
                  className="w-full sm:w-auto"
                >
                  <button className="w-full sm:w-auto bg-[#344E41] text-white text-xs sm:text-sm font-semibold px-4 sm:px-6 py-2 rounded-[10px] hover:bg-[#2a3e33] transition">
                    Tampilkan Detail Pesanan
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
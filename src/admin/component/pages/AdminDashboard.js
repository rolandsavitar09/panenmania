// src/admin/component/pages/AdminDashboard.js
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import LogoImg from "../../../assets/images/icons/logo panenmaniaa.svg";
import FarmerIcon from "../../../assets/images/icons/farmer.svg";
import DesaIcon from "../../../assets/images/icons/desa.svg";
import PenggunaIcon from "../../../assets/images/icons/pengguna.svg";

const API_DASHBOARD_STATS = "http://localhost:5000/api/users/dashboard/stats";
const getAdminToken = () => localStorage.getItem("adminToken");

// Helper untuk format Rupiah (jika ingin menampilkan nilai rupiah)
const formatRupiah = (num) => {
  if (num == null || isNaN(Number(num))) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(num));
};

const AdminDashboard = () => {
  const bgPage = "#FFFEF6";
  const primary = "#3A5B40";
  const navigate = useNavigate();

  // State untuk data dari API
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State untuk menampilkan menu profile (hanya tombol KELUAR)
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Sapaan tetap "Admin"
  const adminName = "Admin";

  // --- FETCH DASHBOARD DATA ---
  const fetchStats = useCallback(async () => {
    const token = getAdminToken();
    // tidak otomatis redirect agar UI lama tetap terasa; kalau mau redirect uncomment:
    // if (!token) return navigate("/admin/login");

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_DASHBOARD_STATS, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await response.json().catch(() => null);

      if (response.ok && data) {
        setStats(data.stats || data || {});
      } else {
        setError((data && data.message) || "Gagal memuat data dashboard.");
      }
    } catch (e) {
      console.error("Fetch Dashboard Error:", e);
      setError("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Logout handler sederhana (bersihkan token & arahkan ke login admin)
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setShowProfileMenu(false);
    navigate("/admin/login");
  };

  // Data fallback (preserve UI lama look & feel)
  const fallbackSummary = [
    { label: "Petani Terdaftar", value: "7000 +" },
    { label: "Desa Terdaftar", value: "7000 +" },
    { label: "Pengguna Terdaftar", value: "7000 +" },
    { label: "Total Pesanan", value: "7000 +" },
  ];

  // Jika stats tersedia, gunakan angka nyata, kalau tidak gunakan fallback
  const summaryCards = (() => {
    if (!stats) return fallbackSummary;

    const totalUsers = stats.totalUsers ?? null;
    // Total Pesanan: pakai stats.totalOrders jika ada, jika tidak coba ambil panjang array orders jika tersedia
    const totalOrdersComputed =
      stats.totalOrders ??
      (Array.isArray(stats.orders) ? stats.orders.length : null);

    return [
      {
        label: "Petani Terdaftar",
        value:
          stats.totalFarmers?.toLocaleString?.("id-ID") ??
          "7000 +",
        icon: FarmerIcon,
      },
      {
        label: "Desa Terdaftar",
        value:
          stats.totalVillages?.toLocaleString?.("id-ID") ??
          "7000 +",
        icon: DesaIcon,
      },
      {
        label: "Pengguna Terdaftar",
        value:
          totalUsers != null
            ? totalUsers.toLocaleString("id-ID")
            : "7000 +",
        icon: PenggunaIcon,
      },
      {
        label: "Total Pesanan",
        value:
          totalOrdersComputed != null
            ? totalOrdersComputed.toLocaleString("id-ID")
            : "7000 +",
        icon: null, // kita akan buat badge otomatis, bisa reuse icon jika perlu
      },
    ];
  })();

  // Untuk Produk & Kategori terlaris - jika tidak ada, tetap tampilkan data statis seperti UI lama
  const topProducts = (stats && stats.topProducts && stats.topProducts.length > 0)
    ? stats.topProducts
    : [
        { name: "Beras Rojo Lele 5kg", value: "100 Produk", width: "90%", sold: 100 },
        { name: "Beras Pandan Wangi 5kg", value: "60 Produk", width: "70%", sold: 60 },
        { name: "Bayam Hijau Segar 250g", value: "30 Produk", width: "40%", sold: 30 },
      ];

  const topCategories = (stats && stats.topCategories && stats.topCategories.length > 0)
    ? stats.topCategories
    : [
        { name: "Buah", value: "100 Produk", width: "90%", sold: 100 },
        { name: "Beras", value: "60 Produk", width: "70%", sold: 60 },
        { name: "Sayur", value: "30 Produk", width: "40%", sold: 30 },
      ];

  // === LOGIKA BULAN DINAMIS untuk grafik ===
  // Buat nama bulan (singkatan) dan nama bulan penuh (Indonesia)
  const MONTHS_SHORT = ["JAN", "FEB", "MAR", "APR", "MEI", "JUN", "JUL", "AUG", "SEP", "OKT", "NOV", "DES"];
  const MONTHS_FULL_ID = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

  const now = new Date();
  const currentMonthIndex = now.getMonth(); // 0..11

  // Ambil 6 bulan terakhir termasuk bulan sekarang, urut dari yang lebih lama ke sekarang
  const lastSixMonths = [];
  for (let i = 5; i >= 0; i--) {
    const idx = (currentMonthIndex - i + 12) % 12;
    lastSixMonths.push({ short: MONTHS_SHORT[idx], full: MONTHS_FULL_ID[idx] });
  }

  // Judul grafik menyesuaikan ke bulan sekarang (full)
  const salesTitleMonth = MONTHS_FULL_ID[currentMonthIndex];

  // Jika Anda ingin menampilkan data penjualan dinamis untuk tiap bulan dari API,
  // server harus mengembalikan array/series; untuk sekarang kami tetap gunakan path dummy,
  // hanya label bulan yang dinamis sehingga tidak muncul "NOV" statis.

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: bgPage, fontFamily: '"Inter", sans-serif' }}
    >
      {/* SIDEBAR KIRI */}
      <aside
        className="
          w-[240px]
          bg-white
          flex flex-col
          border-r border-[#E5E7EB]
        "
        style={{
          boxShadow: "0 4px 6px rgba(0,0,0,0.10)", // Soft/10
        }}
      >
        {/* Logo + nama */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-[#E5E7EB]">
          <div className="w-10 h-10 rounded-full bg-[#3A5B40]/10 border border-[#3A5B40] flex items-center justify-center overflow-hidden">
            <img src={LogoImg} alt="Panen Mania" className="w-full h-full object-contain" />
          </div>
          <span className="font-semibold text-[#3A5B40]">Panen Mania</span>
        </div>

        {/* Menu (sementara, pakai navigate) */}
        <nav className="flex-1 px-4 py-6 space-y-3 text-sm text-[#3A5B40]">
          <button
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md bg-[#FFFEF6] font-semibold"
            onClick={() => navigate("/admin/dashboard")}
          >
            <span>Beranda</span>
          </button>
          <button
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#FFFEF6]"
            onClick={() => navigate("/admin/products")}
          >
            <span>Produk</span>
          </button>
          <button
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#FFFEF6]"
            onClick={() => navigate("/admin/orders")}
          >
            <span>Pesanan</span>
          </button>
          <button
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#FFFEF6]"
            onClick={() => navigate("/admin/users")}
          >
            <span>Pengguna</span>
          </button>
        </nav>
      </aside>

      {/* BAGIAN KANAN */}
      <div className="flex-1 flex flex-col">
        {/* TOP BAR PUTIH DENGAN SHADOW */}
        <header
          className="w-full px-8 py-4 flex items-center justify-between bg-white"
          style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.10)" }} // Soft/10
        >
          {/* Teks BERANDA di top bar */}
          <div className="text-base font-semibold text-[#3A5B40]">
            Beranda
          </div>

          {/* Search + profile placeholder */}
          <div className="flex items-center gap-3 max-w-xl w-full">
            {/* Kolom Cari */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Cari sesuatu ..."
                className="
                  w-full h-10
                  rounded-[10px]
                  px-4
                  text-sm
                  placeholder-[#3A5B40]
                  outline-none
                  border border-transparent
                "
                style={{
                  backgroundColor: "rgba(88,129,87,0.15)", // #588157 15%
                  color: "#3A5B40",
                }}
              />
            </div>

            {/* Tombol search: icon saja warna #3A5B40 */}
            <button
              type="button"
              className="h-10 w-10 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3A5B40"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="16.5" y1="16.5" x2="21" y2="21" />
              </svg>
            </button>

            {/* Profile placeholder (nanti dari backend) */}
            <div className="relative">
              <div
                className="w-9 h-9 rounded-full bg-[#3A5B40]/10 border border-[#3A5B40]/40 flex items-center justify-center cursor-pointer overflow-hidden"
                onClick={() => setShowProfileMenu((s) => !s)}
                aria-label="Profile menu"
                title="Klik untuk keluar"
              >
                {/* bisa ganti ke img jika ada avatar admin */}
                <span className="text-xs text-[#3A5B40] font-semibold">PP</span>
              </div>

              {/* Menu popover kecil hanya menampilkan tombol KELUAR */}
              {showProfileMenu && (
                <div
                  className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-50"
                  style={{ boxShadow: "0 8px 20px rgba(0,0,0,0.08)" }}
                >
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-[#FFFEF6] rounded-md"
                  >
                    KELUAR
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 px-10 py-8 space-y-8">
          {/* Tampilkan error jika ada */}
          {error && (
            <div className="text-center p-4 rounded-lg text-red-600 border border-red-300">
              {error}
            </div>
          )}

          {/* Greeting + cards */}
          <div>
            <h2 className="text-lg font-semibold text-[#3A5B40] mb-6">
              Selamat Pagi, {adminName}!
            </h2>

            {/* Row kartu 7000+ (tetap sama UI) */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {summaryCards.map((item, idx) => (
                <div
                  key={idx}
                  className="
                    rounded-[10px]
                    flex flex-col items-center justify-center
                    h-32
                    text-[#3A5B40]
                    px-4
                  "
                  style={{
                    backgroundColor: "rgba(88,129,87,0.25)", // #588157 25%
                  }}
                >
                  {/* Icon placeholder: jika ada icon import, tampilkan */}
                  <div className="mb-2 w-7 h-7 rounded-md bg-white/40 flex items-center justify-center overflow-hidden">
                    {item.icon ? (
                      <img src={item.icon} alt={item.label} className="w-full h-full object-contain" />
                    ) : (
                      <div className="text-xs text-white/90">{/* kosong kalau tidak ada icon */}</div>
                    )}
                  </div>
                  <div className="text-lg font-bold">{item.value}</div>
                  <div className="text-[11px] mt-1">{item.label}</div>
                </div>
              ))}
            </section>
          </div>

          {/* GRAFIK PENJUALAN */}
          <section>
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-[#3A5B40]">
                Penjualan Bulan {salesTitleMonth}
              </h3>
              <div className="h-[1px] w-full bg-[#3A5B40] mt-2" />
            </div>

            <div className="w-full h-64">
              <svg viewBox="0 0 650 260" className="w-full h-full">
                {/* Label harga di kiri (Rp ...) */}
                {[
                  { label: "Rp 15.000.000", y: 40 },
                  { label: "Rp 10.000.000", y: 90 },
                  { label: "Rp 5.000.000", y: 140 },
                  { label: "Rp 1.000.000", y: 190 },
                ].map((tick, i) => (
                  <text
                    key={i}
                    x={20}
                    y={tick.y + 3}
                    fontSize="10"
                    fill={primary}
                  >
                    {tick.label}
                  </text>
                ))}

                {/* Grid horizontal (geser ke kanan, mulai x=110) */}
                {[40, 90, 140, 190].map((y, i) => (
                  <line
                    key={i}
                    x1="110"
                    x2="620"
                    y1={y}
                    y2={y}
                    stroke="#B8D68F"
                    strokeWidth="1"
                  />
                ))}

                {/* Axis horizontal & vertical (juga mulai x=110) */}
                <line
                  x1="110"
                  y1="210"
                  x2="620"
                  y2="210"
                  stroke="#B8D68F"
                  strokeWidth="1.5"
                />
                <line
                  x1="110"
                  y1="30"
                  x2="110"
                  y2="210"
                  stroke="#B8D68F"
                  strokeWidth="1"
                />

                {/* Area + line chart (tetap dummy path seperti UI lama) */}
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3A5B40" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#B8D68F" stopOpacity="0.5" />
                  </linearGradient>
                </defs>

                <path
                  d="
                    M 110 205
                    C 170 204, 230 203, 280 202
                    C 320 200, 360 198, 390 195
                    C 420 193, 450 195, 480 190
                    C 510 185, 550 150, 610 90
                    L 610 210
                    L 110 210 Z
                  "
                  fill="url(#salesGradient)"
                  stroke="none"
                />

                <path
                  d="
                    M 110 205
                    C 170 204, 230 203, 280 202
                    C 320 200, 360 198, 390 195
                    C 420 193, 450 195, 480 190
                    C 510 185, 550 150, 610 90
                  "
                  fill="none"
                  stroke="#B8D68F"
                  strokeWidth="2"
                />

                {/* Label bulan dinamis: gunakan lastSixMonths */}
                {lastSixMonths.map((m, idx) => (
                  <text
                    key={m.short + idx}
                    x={140 + idx * 80} // sama pengaturan spacing dengan versi lama
                    y={230}
                    fontSize="10"
                    fill="#B8D68F"
                  >
                    {m.short}
                  </text>
                ))}
              </svg>
            </div>
          </section>

          {/* PRODUK TERLARIS & KATEGORI TERLARIS */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Produk Terlaris */}
            <div
              className="bg-white rounded-[10px] p-6"
              style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.10)" }} // Soft/10
            >
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-[#3A5B40]">
                  Produk Terlaris
                </h3>
                <div className="h-[1px] w-full bg-[#3A5B40] mt-2" />
              </div>

              <div className="space-y-4 text-xs text-[#3A5B40]">
                {topProducts.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    {/* teks kiri */}
                    <div className="w-1/3">{item.name}{item.unit ? ` (${item.unit})` : ""}</div>

                    {/* bar tengah */}
                    <div className="flex-1">
                      <div className="w-full h-2 rounded-full bg-[#E5E7EB]">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: item.width ?? (item.sold ? `${Math.min(100, (item.sold / (stats?.topProductsMax ?? 100)) * 100)}%` : "70%"),
                            background: "linear-gradient(90deg,#B8D68F 0%,#5A9F68 100%)",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                          }}
                        />
                      </div>
                    </div>

                    {/* teks kanan */}
                    <div className="w-[80px] text-right">{item.value ?? (item.sold ? `${item.sold} Produk` : "")}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kategori Terlaris */}
            <div
              className="bg-white rounded-[10px] p-6"
              style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.10)" }} // Soft/10
            >
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-[#3A5B40]">
                  Kategori Terlaris
                </h3>
                <div className="h-[1px] w-full bg-[#3A5B40] mt-2" />
              </div>

              <div className="space-y-4 text-xs text-[#3A5B40]">
                {topCategories.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    {/* teks kiri */}
                    <div className="w-1/3">{item.name}</div>

                    {/* bar tengah */}
                    <div className="flex-1">
                      <div className="w-full h-2 rounded-full bg-[#E5E7EB]">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: item.width ?? (item.sold ? `${Math.min(100, (item.sold / (stats?.topCategoriesMax ?? 100)) * 100)}%` : "70%"),
                            background: "linear-gradient(90deg,#B8D68F 0%,#5A9F68 100%)",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                          }}
                        />
                      </div>
                    </div>

                    {/* teks kanan */}
                    <div className="w-[80px] text-right">{item.value ?? (item.sold ? `${item.sold} Produk` : "")}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Simple loading overlay (non-intrusive) */}
      {loading && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
        >
          <div className="px-4 py-2 rounded-md" style={{ background: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            Memuat data...
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

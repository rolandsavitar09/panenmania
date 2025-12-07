// src/components/home/HomeContent.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// === IMPORT GAMBAR ===
// Banners
import HeroFarmer from "../../assets/images/banners/petani.svg";
import PromoVeg from "../../assets/images/banners/sayuran promo.svg";
import Petani2Banner from "../../assets/images/banners/petani 2.svg";

// Products
import BawangMerah from "../../assets/images/products/bawang merah.svg";

// Icons statistik
import IconFarmer from "../../assets/images/icons/farmer.svg";
import IconDesa from "../../assets/images/icons/desa.svg";
import IconPengguna from "../../assets/images/icons/pengguna.svg";

// Icons Kenapa Kami
import IconSegar from "../../assets/images/icons/segar.svg";
import IconJujur from "../../assets/images/icons/jujur.svg";
import IconPengiriman from "../../assets/images/icons/pengiriman.svg";

// Icon kategori
import IconKategori from "../../assets/images/icons/kategori.svg";

// Icons langkah belanja
import IconPilihProduk from "../../assets/images/icons/pilih produk.svg";
import IconMasukkanKeranjang from "../../assets/images/icons/masukkan keranjang.svg";
import IconMelakukanPembayaran from "../../assets/images/icons/melakukan pembayaran.svg";
import IconMenungguPesanan from "../../assets/images/icons/menunggu pesanan.svg";

// Icon search
import IconSearch from "../../assets/images/icons/pencarian.svg";

const HomeContent = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const catalogBase = isLoggedIn ? "/catalog/login" : "/catalog";

  const [searchQuery, setSearchQuery] = useState("");

  // LOGIKA SEARCH BAR
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const raw = searchQuery.trim();

    // kalau kosong → buka semua
    if (!raw) {
      navigate(`${catalogBase}?category=all`);
      return;
    }

    const q = raw.toLowerCase();

    if (q.includes("buah")) {
      navigate(`${catalogBase}?category=buah`);
      return;
    }

    if (q.includes("sayur") || q.includes("sayuran")) {
      navigate(`${catalogBase}?category=sayur`);
      return;
    }

    if (q.includes("beras")) {
      navigate(`${catalogBase}?category=beras`);
      return;
    }

    // selain itu → search bebas
    navigate(`${catalogBase}?search=${encodeURIComponent(raw)}`);
  };

  return (
    <div className="bg-[#FFFEF6]">
      {/* Search Section – STYLE TETAP, cuma ditambah icon & form */}
      <div className="flex justify-center items-center py-10">
        <form
          onSubmit={handleSearchSubmit}
          className="w-full flex justify-center"
        >
          <div className="relative w-1/2 min-w-[260px]">
            <input
              type="text"
              placeholder="Cari produk segar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-2 border-[#588157] rounded-full px-6 py-3 pr-12 focus:outline-none bg-transparent"
            />

            {/* ikon di kanan dalam input */}
            <button
              type="submit"
              className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center justify-center"
              aria-label="Cari produk"
            >
              <img
                src={IconSearch}
                alt="Cari"
                className="w-5 h-5 object-contain"
              />
            </button>
          </div>
        </form>
      </div>

      {/* ================= HERO SECTION (SUDAH DISESUAIKAN DENGAN DESAIN) ================= */}
      <section className="w-full bg-[#B8D68F]/25">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row">
          {/* LEFT: BLOK TEKS */}
          <div className="w-full md:w-[55%] flex items-center">
            <div className="px-8 md:px-20 py-12 md:py-0 max-w-xl">
              <h2 className="text-[28px] md:text-[25px] font-extrabold text-[#344E41] leading-snug mb-6">
                Dari Ladang ke Tempat Anda,
                <br />
                Segarnya Tetap Terjaga.
              </h2>

              <p className="text-[#3A5A40] text-[16px] leading-relaxed mb-10">
                Belanja hasil panen kini lebih mudah dan menyenangkan! Temukan
                sayur, buah, dan bahan segar langsung dari petani Indonesia.
                Dijamin segar, sehat, dan sampai di rumah Anda dengan cepat.
              </p>

              <Link to={`${catalogBase}?category=all`}>
                <button className="inline-flex items-center gap-3 border-2 border-[#344E41] text-[#344E41] font-semibold px-6 py-3 rounded-full hover:bg-[#344E41] hover:text-white transition-all">
                  <span>Belanja Sekarang</span>
                  <span className="text-xl">→</span>
                </button>
              </Link>
            </div>
          </div>

          {/* RIGHT: FOTO PETANI FULL HEIGHT */}
          <div className="w-full md:w-[45%] h-[260px] md:h-[430px]">
            <img
              src={HeroFarmer}
              alt="hero-farmer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
      {/* ================= END HERO SECTION ================= */}

      {/* ✅ Statistik Section */}
      <section className="w-full bg-[#FFFEF6] py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-center">
          {[
            { label: "Petani Terdaftar", icon: IconFarmer },
            { label: "Desa Terdaftar", icon: IconDesa },
            { label: "Pengguna Terdaftar", icon: IconPengguna },
          ].map((item, index) => (
            <div
              key={index}
              className="rounded-[32px] px-6 py-10 bg-[#588157]/25 flex flex-col justify-center items-center shadow-[0px_6px_12px_rgba(0,0,0,0.2)]"
            >
              <img
                src={item.icon}
                alt={item.label}
                className="w-12 h-12 mb-4 object-contain"
              />
              <h3 className="text-[40px] font-extrabold text-[#3A5B40] leading-tight">
                7000+
              </h3>
              <p className="text-[#3A5B40] mt-2 font-semibold">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ PROMO Section (DISESUAIKAN DENGAN DESAIN) */}
      <section className="w-full bg-[#EEF2E6] py-0">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2">
          {/* LEFT - FULL IMAGE PROMO */}
          <div className="flex-1 min-h-[260px] md:min-h-[350px] lg:min-h-[420px] overflow-hidden">
            <img
              src={PromoVeg}
              alt="Sayuran Promo"
              className="w-full h-full object-cover block md:scale-[1.02]"
            />
          </div>

          {/* RIGHT - BLOK TEKS */}
          <div className="bg-[#6E8C6B] text-white flex items-center">
            <div className="px-10 md:px-16 py-12 md:py-0 max-w-xl">
              <h3 className="text-2xl md:text-3xl font-extrabold leading-snug mb-6">
                Kesegaran Alami, Harga Terbaik.
              </h3>
              <p className="text-sm md:text-base leading-relaxed font-medium opacity-95">
                Manfaatkan promo eksklusif hingga 90% untuk produk hasil panen
                pilihan. Kami hadirkan kualitas terbaik langsung dari petani ke
                meja Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ PRODUK TERBARU SESUAI FIGMA */}
      <section className="w-full bg-[#FFFEF6] py-16">
        <div className="max-w-[1380px] mx-auto px-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-[28px] font-bold text-[#344E41]">
              Produk Terbaru
            </h2>

            <Link
              to={`${catalogBase}?category=all`}
              className="text-[#3A5A40] font-semibold text-[15px] hover:underline flex items-center gap-1"
            >
              Lihat Semuanya &gt;
            </Link>
          </div>

          {/* GRID PRODUK */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-12 gap-x-8">
            {Array.from({ length: 8 }).map((_, i) => {
              const productId = i + 1;
              return (
                <Link
                  key={i}
                  to={
                    isLoggedIn
                      ? `/product/${productId}`
                      : `/product-before/${productId}`
                  }
                >
                  <div className="bg-white rounded-3xl shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E0E6D8] hover:shadow-xl transition-all duration-200 cursor-pointer w-full max-w-[310px] mx-auto">
                    {/* IMAGE */}
                    <div className="w-full bg-[#F4F8F1] rounded-t-3xl p-6 h-[200px] flex items-center justify-center">
                      <img
                        src={BawangMerah}
                        alt="product bawang merah"
                        className="h-full object-contain"
                      />
                    </div>

                    {/* TEXT */}
                    <div className="p-6">
                      <h3 className="text-[#344E41] font-bold text-[17px] mb-2">
                        Beras Lele 5kg
                      </h3>

                      <p className="text-[#3A5A40] text-[13px] mb-4 leading-relaxed">
                        LAHAP LELE BERAS PUNEL & PUTIH ALAMI PREMIUM 5kg
                      </p>

                      <p className="text-[#344E41] font-bold text-[16px]">
                        Rp70.000.00
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ✅ KENAPA KAMI */}
      <section className="w-full bg-[#DDEACD] py-20">
        <div className="max-w-[1350px] mx-auto px-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* LEFT CONTENT */}
          <div>
            <h2 className="text-[#344E41] font-extrabold text-[32px] mb-4">
              Kenapa Kami?
            </h2>
            <p className="text-[#3A5A40] text-[15px] mb-10 leading-relaxed">
              Karena kami percaya, hasil terbaik datang langsung dari tangan
              petani.
            </p>

            <div className="space-y-10">
              {/* 1 Langsung dari Petani */}
              <div className="flex items-start gap-4">
                <img
                  src={IconFarmer}
                  alt="Langsung dari Petani"
                  className="w-[48px]"
                />
                <div>
                  <h3 className="font-bold text-[#344E41] text-[18px] mb-1">
                    Langsung dari Petani
                  </h3>
                  <p className="text-[#3A5A40] text-[15px] leading-relaxed">
                    Kami bekerja sama langsung dengan petani lokal. Setiap
                    produk datang segar tanpa melalui rantai distribusi panjang.
                  </p>
                </div>
              </div>

              {/* 2 Segar dan Alami */}
              <div className="flex items-start gap-4">
                <img
                  src={IconSegar}
                  alt="Segar dan Alami"
                  className="w-[48px]"
                />
                <div>
                  <h3 className="font-bold text-[#344E41] text-[18px] mb-1">
                    Segar dan Alami
                  </h3>
                  <p className="text-[#3A5A40] text-[15px] leading-relaxed">
                    Hasil panen dikirim segera setelah dipetik. Tanpa bahan
                    pengawet atau proses pematangan buatan.
                  </p>
                </div>
              </div>

              {/* 3 Harga Jujur */}
              <div className="flex items-start gap-4">
                <img
                  src={IconJujur}
                  alt="Harga Jujur"
                  className="w-[48px]"
                />
                <div>
                  <h3 className="font-bold text-[#344E41] text-[18px] mb-1">
                    Harga Jujur
                  </h3>
                  <p className="text-[#3A5A40] text-[15px] leading-relaxed">
                    Petani mendapatkan harga yang layak. Pembeli pun menikmati
                    harga hemat tanpa biaya tambahan.
                  </p>
                </div>
              </div>

              {/* 4 Pengiriman Cepat */}
              <div className="flex items-start gap-4">
                <img
                  src={IconPengiriman}
                  alt="Pengiriman Cepat"
                  className="w-[48px]"
                />
                <div>
                  <h3 className="font-bold text-[#344E41] text-[18px] mb-1">
                    Pengiriman Cepat
                  </h3>
                  <p className="text-[#3A5A40] text-[15px] leading-relaxed">
                    Produk dikemas dengan aman dan rapi. Kami pastikan
                    kesegaran tetap terjaga hingga sampai ke tangan Anda.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex justify-center">
            <img
              src={Petani2Banner}
              alt="petani"
              className="rounded-2xl shadow-md w-full max-w-[550px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* ✅ SECTION KATEGORI */}
      <section className="bg-[#FFFEF6] w-full py-20">
        <div className="max-w-[1350px] mx-auto px-10 text-center">
          <h2 className="text-[#344E41] font-extrabold text-[32px] mb-16">
            Kategori
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: "Buah",
                desc: "Manis alami, penuh vitamin, dan langsung dipetik dari kebun petani lokal kami.",
              },
              {
                title: "Sayur",
                desc: "Ditanam tanpa bahan kimia berbahaya, menjaga kesegaran hingga ke dapur Anda.",
              },
              {
                title: "Beras",
                desc: "Dipanen dari padi unggulan, menghasilkan nasi pulen dan harum yang menggugah selera.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[#7BA66A]/40 shadow-sm px-6 py-8 flex justify-between items-center"
              >
                <div className="text-left max-w-[70%]">
                  <h3 className="text-[#344E41] font-bold text-[18px] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[#3A5A40] text-[14px] leading-snug mb-6">
                    {item.desc}
                  </p>

                  <button className="border-2 border-[#3A5A40] text-[#3A5A40] px-4 py-1 rounded-lg text-[14px] font-semibold flex items-center gap-2 hover:bg-[#3A5A40] hover:text-white transition">
                    Belanja
                    <span className="text-xl -mb-[2px]">→</span>
                  </button>
                </div>

                <img
                  src={IconKategori}
                  alt={item.title}
                  className="w-[90px] object-contain mt-28"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ SECTION LANGKAH BELANJA */}
      <section className="bg-[#FFFEF6] w-full pb-24 pt-10">
        <div className="max-w-[1350px] mx-auto px-10 text-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 mt-10">
            {[
              { label: "Pilih Produk", icon: IconPilihProduk },
              { label: "Masukkan Keranjang", icon: IconMasukkanKeranjang },
              { label: "Melakukan Pembayaran", icon: IconMelakukanPembayaran },
              { label: "Menunggu Pesanan", icon: IconMenungguPesanan },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-[90px] h-[90px] rounded-xl flex items-center justify-center bg-[#588157]/45">
                  <img
                    src={step.icon}
                    alt={step.label}
                    className="object-contain w-[70px]"
                  />
                </div>
                <p className="text-[#344E41] font-semibold text-[15px] leading-tight mt-4">
                  {step.label.split(" ")[0]} <br />
                  {step.label.split(" ").slice(1).join(" ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ TENTANG KAMI */}
      <section className="bg-[#FFFEF6] py-24">
        <div className="max-w-[1350px] mx-auto text-center px-10">
          <h2 className="text-[#344E41] text-[28px] md:text-[32px] font-extrabold mb-12">
            Tentang Kami
          </h2>

          <div className="bg-gradient-to-r from-[#D2E4BE] to-[#9DBD84] rounded-3xl p-6 md:p-10 max-w-4xl mx-auto">
            <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-inner p-10 text-center">
              <p className="text-[#344E41] text-[15px] md:text-[17px] leading-relaxed">
                <span className="font-bold">PanenMania</span> hadir sebagai
                <span className="font-bold">
                  {" "}
                  jembatan antara petani lokal dan konsumen
                </span>{" "}
                yang menginginkan produk segar berkualitas dengan harga terbaik.
                Kami berkomitmen menjadi penyalur hasil panen langsung dari
                tangan petani ke tempat pelanggan, tanpa perantara yang
                merugikan pihak mana pun.
                <span className="font-bold"> PanenMania</span> memastikan para
                petani mendapatkan harga jual yang layak, sementara pelanggan
                menikmati produk segar, sehat, dan terjamin mutunya setiap hari.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeContent;
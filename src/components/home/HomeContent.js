import React from "react";
import { Link } from "react-router-dom";

const HomeContent = ({ isLoggedIn }) => {
  const catalogBase = isLoggedIn ? "/catalog/login" : "/catalog";
  const categories = ["Buah", "Sayur", "Beras"];

  return (
    <div className="bg-[#FFFEF6]">

      {/* Search Section */}
      <div className="flex justify-center items-center py-10">
        <input
          type="text"
          placeholder="Cari produk segar..."
          className="w-1/2 border-2 border-[#588157] rounded-full px-6 py-3 focus:outline-none"
        />
      </div>

      {/* ✅ Hero Section */}
<section className="w-full bg-[#BBD58E] flex flex-col md:flex-row items-center justify-between px-10 lg:px-24 py-16">

  {/* Left Text */}
  <div className="max-w-xl">
    <h2 className="text-[28px] md:text-[32px] font-extrabold text-[#344E41] leading-snug mb-4">
      Dari Ladang ke Tempat Anda,<br />Segarnya Tetap Terjaga.
    </h2>

    <p className="text-[#3A5A40] text-[15px] leading-relaxed mb-6">
      Belanja hasil panen kini lebih mudah dan menyenangkan!
      Temukan sayur, buah, dan bahan segar langsung dari
      petani Indonesia. Dijamin segar, sehat, dan sampai di
      rumah Anda dengan cepat.
    </p>

    {/* ✅ Button with Arrow Icon */}
    <Link to={`${catalogBase}?category=all`}>
      <button className="flex items-center gap-2 border border-[#344E41] text-[#344E41] font-medium px-5 py-2 rounded-lg hover:bg-[#344E41] hover:text-white transition-all">
        Belanja
        <span className="text-lg font-bold">→</span>
      </button>
    </Link>
  </div>

  {/* Right Image */}
  <img
    src="https://via.placeholder.com/540x380"
    alt="hero-farmer"
    className="w-full md:w-1/2 object-cover mt-10 md:mt-0 rounded-xl"
  />
</section>


      {/* ✅ Statistik Section */}
<section className="w-full bg-[#FFFEF6] py-16">
  <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-center">
    {[
      { label: "Petani Terdaftar" },
      { label: "Desa Terdaftar" },
      { label: "Pengguna Terdaftar" },
    ].map((item, index) => (
      <div
        key={index}
        className="rounded-3xl px-6 py-10 
        bg-gradient-to-b from-[#D1E3A8] to-[#A1B992]
        shadow-[0px_6px_12px_rgba(0,0,0,0.15)]
        flex flex-col justify-center items-center
        transition hover:scale-105"
      >
        <h3 className="text-[40px] font-extrabold text-[#344E41] leading-tight">
          7000+
        </h3>
        <p className="text-[#3A5A40] mt-2 font-semibold">
          {item.label}
        </p>
      </div>
    ))}
  </div>
</section>


      {/* ✅ PROMO Section */}
<section className="w-full bg-[#EEF2E6] py-0">
  <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2">

    {/* LEFT - PROMO VISUAL */}
    <div className="bg-[#3A5A40] text-white px-10 py-14 flex flex-col justify-center items-start">
      <h3 className="text-2xl font-extrabold tracking-wide mb-2">PROMO</h3>
      <p className="text-[70px] font-black leading-none mb-2">90<span className="text-[45px] align-top">%</span></p>
      <p className="text-lg font-semibold">OFF</p>

      {/* Placeholder Sayuran */}
      <img
        src="https://via.placeholder.com/450x180?text=Sayur+Promo"
        alt="Sayuran Promo"
        className="mt-10 w-full object-contain"
      />
    </div>

    {/* RIGHT - TEXT */}
    <div className="bg-[#6E8C6B] text-white px-12 py-16 flex flex-col justify-center">
      <h3 className="text-2xl md:text-3xl font-extrabold leading-snug mb-4">
        Kesegaran Alami, Harga Terbaik.
      </h3>
      <p className="text-sm md:text-base leading-relaxed font-medium opacity-95 max-w-lg">
        Manfaatkan promo eksklusif hingga 90% untuk produk hasil panen pilihan. 
        Kami hadirkan kualitas terbaik langsung dari petani ke meja Anda.
      </p>
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
                  src="https://via.placeholder.com/260x160?text=Produk"
                  alt="product"
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


     {/* ✅ KENAPA KAMI - SESUAI FIGMA */}
<section className="w-full bg-[#DDEACD] py-20">
  <div className="max-w-[1350px] mx-auto px-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

    {/* LEFT CONTENT */}
    <div>
      <h2 className="text-[#344E41] font-extrabold text-[32px] mb-4">
        Kenapa Kami?
      </h2>
      <p className="text-[#3A5A40] text-[15px] mb-10 leading-relaxed">
        Karena kami percaya, hasil terbaik datang langsung dari tangan petani.
      </p>

      {/* List Keunggulan */}
      <div className="space-y-10">

        {/* 1 */}
        <div className="flex items-start gap-4">
          <img src="https://via.placeholder.com/40" alt="icon" className="w-[48px]" />
          <div>
            <h3 className="font-bold text-[#344E41] text-[18px] mb-1">Langsung dari Petani</h3>
            <p className="text-[#3A5A40] text-[15px] leading-relaxed">
              Kami bekerja sama langsung dengan petani lokal. Setiap produk datang segar tanpa melalui rantai distribusi panjang.
            </p>
          </div>
        </div>

        {/* 2 */}
        <div className="flex items-start gap-4">
          <img src="https://via.placeholder.com/40" alt="icon" className="w-[48px]" />
          <div>
            <h3 className="font-bold text-[#344E41] text-[18px] mb-1">Segar dan Alami</h3>
            <p className="text-[#3A5A40] text-[15px] leading-relaxed">
              Hasil panen dikirim segera setelah dipetik. Tanpa bahan pengawet atau proses pematangan buatan.
            </p>
          </div>
        </div>

        {/* 3 */}
        <div className="flex items-start gap-4">
          <img src="https://via.placeholder.com/40" alt="icon" className="w-[48px]" />
          <div>
            <h3 className="font-bold text-[#344E41] text-[18px] mb-1">Harga Jujur</h3>
            <p className="text-[#3A5A40] text-[15px] leading-relaxed">
              Petani mendapatkan harga yang layak. Pembeli pun menikmati harga hemat tanpa biaya tambahan.
            </p>
          </div>
        </div>

        {/* 4 */}
        <div className="flex items-start gap-4">
          <img src="https://via.placeholder.com/40" alt="icon" className="w-[48px]" />
          <div>
            <h3 className="font-bold text-[#344E41] text-[18px] mb-1">Pengiriman Cepat</h3>
            <p className="text-[#3A5A40] text-[15px] leading-relaxed">
              Produk dikemas dengan aman dan rapi. Kami pastikan kesegaran tetap terjaga hingga sampai ke tangan Anda.
            </p>
          </div>
        </div>

      </div>

    </div>

    {/* RIGHT IMAGE */}
    <div className="flex justify-center">
      <img
        src="https://via.placeholder.com/560x400?text=Petani"
        alt="petani"
        className="rounded-2xl shadow-md w-full max-w-[550px] object-cover"
      />
    </div>

  </div>
</section>


      {/* ✅ SECTION KATEGORI */}
<section className="bg-[#FFFEF6] w-full py-20">
  <div className="max-w-[1350px] mx-auto px-10 text-center">

    <h2 className="text-[#344E41] font-extrabold text-[32px] mb-16">Kategori</h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

      {[
        {
          title: "Buah",
          desc: "Manis alami, penuh vitamin, dan langsung dipetik dari kebun petani lokal kami.",
          img: "https://via.placeholder.com/100x80"
        },
        {
          title: "Sayur",
          desc: "Ditanam tanpa bahan kimia berbahaya, menjaga kesegaran hingga ke dapur Anda.",
          img: "https://via.placeholder.com/100x80"
        },
        {
          title: "Beras",
          desc: "Dipanen dari padi unggulan, menghasilkan nasi pulen dan harum yang menggugah selera.",
          img: "https://via.placeholder.com/100x80"
        }
      ].map((item, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-[#7BA66A]/40 shadow-sm px-6 py-8 flex justify-between items-center"
        >
          <div className="text-left max-w-[70%]">
            <h3 className="text-[#344E41] font-bold text-[18px] mb-2">{item.title}</h3>
            <p className="text-[#3A5A40] text-[14px] leading-snug mb-6">{item.desc}</p>

            <button className="border-2 border-[#3A5A40] text-[#3A5A40] px-4 py-1 rounded-lg text-[14px] font-semibold flex items-center gap-2 hover:bg-[#3A5A40] hover:text-white transition">
              Belanja
              <span className="text-xl -mb-[2px]">→</span>
            </button>
          </div>

          <img src={item.img} alt={item.title} className="w-[90px] object-contain" />
        </div>
      ))}

    </div>
  </div>
</section>

{/* ✅ SECTION LANGKAH BELANJA — MIRIP FIGMA */}
<section className="bg-[#FFFEF6] w-full pb-24 pt-10">
  <div className="max-w-[1350px] mx-auto px-10 text-center">

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 mt-10">

      {[
        { label: "Pilih Produk" },
        { label: "Masukkan Keranjang" },
        { label: "Melakukan Pembayaran" },
        { label: "Menunggu Pesanan" }
      ].map((step, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-[90px] h-[90px] rounded-xl" style={{ background: "linear-gradient(180deg, #B8D68F 14%, #61704B 100%)" }}>
            <img
              src="https://via.placeholder.com/50"
              alt="icon"
              className="object-contain w-[45px] mx-auto my-5"
            />
          </div>
          <p className="text-[#344E41] font-semibold text-[15px] leading-tight mt-4">
            {step.label.split(" ")[0]} <br /> {step.label.split(" ")[1] ?? ""}
          </p>
        </div>
      ))}

    </div>

  </div>
</section>


       {/* ✅ TENTANG KAMI - versi gradient sesuai desain */}
      <section className="bg-[#FFFEF6] py-24">
        <div className="max-w-[1350px] mx-auto text-center px-10">
          <h2 className="text-[#344E41] text-[28px] md:text-[32px] font-extrabold mb-12">
            Tentang Kami
          </h2>

          <div className="bg-gradient-to-r from-[#D2E4BE] to-[#9DBD84] rounded-3xl p-6 md:p-10 max-w-4xl mx-auto">
            <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-inner p-10 text-center">
              <p className="text-[#344E41] text-[15px] md:text-[17px] leading-relaxed">
                <span className="font-bold">PanenMania</span> hadir sebagai
                <span className="font-bold"> jembatan antara petani lokal dan konsumen</span> yang
                menginginkan produk segar berkualitas dengan harga terbaik. Kami berkomitmen
                menjadi penyalur hasil panen langsung dari tangan petani ke tempat pelanggan,
                tanpa perantara yang merugikan pihak mana pun.
                <span className="font-bold"> PanenMania</span> memastikan para petani
                mendapatkan harga jual yang layak, sementara pelanggan menikmati produk segar,
                sehat, dan terjamin mutunya setiap hari.
              </p>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <button className="border-2 border-[#344E41] text-[#344E41] font-semibold px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-[#344E41] hover:text-white transition text-sm">
              Selengkapnya
              <span className="text-base mt-[1px]">→</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeContent;
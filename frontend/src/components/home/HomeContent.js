// src/components/home/HomeContent.js
import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/api";

// Banner
import HeroFarmer from "../../assets/images/banners/petani.svg";
import PromoVeg from "../../assets/images/banners/sayuran promo.svg";
import Petani2Banner from "../../assets/images/banners/petani 2.svg";

// Ikon statistik
import IconFarmer from "../../assets/images/icons/farmer.svg";
import IconDesa from "../../assets/images/icons/desa.svg";
import IconPengguna from "../../assets/images/icons/pengguna.svg";

// Ikon Kenapa Kami
import IconSegar from "../../assets/images/icons/segar.svg";
import IconJujur from "../../assets/images/icons/jujur.svg";
import IconPengiriman from "../../assets/images/icons/pengiriman.svg";

// Ikon kategori
import IconKategori from "../../assets/images/icons/kategori.svg";

// Ikon langkah belanja
import IconPilihProduk from "../../assets/images/icons/pilih produk.svg";
import IconMasukkanKeranjang from "../../assets/images/icons/masukkan keranjang.svg";
import IconMelakukanPembayaran from "../../assets/images/icons/melakukan pembayaran.svg";
import IconMenungguPesanan from "../../assets/images/icons/menunggu pesanan.svg";

// Ikon search
import IconSearch from "../../assets/images/icons/pencarian.svg";

/* =======================
   Helper
======================= */
const formatRupiah = (num) => {
  if (num == null || isNaN(Number(num))) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(num));
};

const HomeContent = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const catalogBase = isLoggedIn ? "/catalog/login" : "/catalog";

  const [searchQuery, setSearchQuery] = useState("");

  const [latestProducts, setLatestProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState(null);

  const statistikItems = [
    { label: "Petani Terdaftar", icon: IconFarmer },
    { label: "Desa Terdaftar", icon: IconDesa },
    { label: "Pengguna Terdaftar", icon: IconPengguna },
  ];

  const kategoriItems = [
    {
      key: "buah",
      title: "Buah",
      desc: "Manis alami, penuh vitamin, dan langsung dipetik dari kebun petani lokal kami.",
    },
    {
      key: "sayur",
      title: "Sayur",
      desc: "Ditanam tanpa bahan kimia berbahaya, menjaga kesegaran hingga ke dapur Anda.",
    },
    {
      key: "beras",
      title: "Beras",
      desc: "Dipanen dari padi unggulan, menghasilkan nasi pulen dan harum.",
    },
  ];

  const langkahBelanja = [
    { label: "Pilih Produk", icon: IconPilihProduk },
    { label: "Masukkan Keranjang", icon: IconMasukkanKeranjang },
    { label: "Melakukan Pembayaran", icon: IconMelakukanPembayaran },
    { label: "Menunggu Pesanan", icon: IconMenungguPesanan },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const raw = searchQuery.trim();

    if (!raw) {
      navigate(`${catalogBase}?category=all`);
      return;
    }

    navigate(`${catalogBase}?search=${encodeURIComponent(raw)}`);
  };

  const handleGoToCategory = (key) => {
    navigate(`${catalogBase}?category=${key}`);
  };

  /* =======================
     FETCH PRODUK
  ======================= */
  useEffect(() => {
    let mounted = true;

    const fetchLatestProducts = async () => {
      try {
        setLoadingProducts(true);
        setErrorProducts(null);

        const response = await API.get("/products");
        const data = response.data;

        const products = Array.isArray(data?.products)
          ? data.products
          : Array.isArray(data)
          ? data
          : [];

        const normalized = products
          .filter((p) => p.is_active === true)
          .map((p) => ({
            product_id: p.product_id,
            name: p.name,
            description: p.description,
            price: Number(p.price),
            unit: p.unit,
            image_url: p.image_url,
            category: p.category,
          }));

        if (mounted) setLatestProducts(normalized.slice(0, 8));
      } catch (err) {
        console.error("Fetch product error:", err);
        if (mounted) setErrorProducts("Gagal memuat produk.");
      } finally {
        if (mounted) setLoadingProducts(false);
      }
    };

    fetchLatestProducts();
    return () => (mounted = false);
  }, []);

  const displayedProducts = useMemo(() => latestProducts, [latestProducts]);

  return (
    <div className="bg-[#FFFEF6]">
      {/* ================= SEARCH ================= */}
      <div className="flex justify-center pb-10">
        <form onSubmit={handleSearchSubmit} className="w-full max-w-[520px] relative">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari produk segar..."
            className="w-full border-2 border-[#588157] rounded-full px-6 py-3"
          />
          <button className="absolute right-5 top-1/2 -translate-y-1/2">
            <img src={IconSearch} alt="Cari" className="w-5" />
          </button>
        </form>
      </div>

      {/* ================= HERO ================= */}
      <section className="w-full bg-[#B8D68F]/25">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row">
          <div className="md:w-[55%] px-6 py-10">
            <h2 className="text-3xl font-extrabold text-[#344E41]">
              Dari Ladang ke Tempat Anda,
              <br />
              Segarnya Tetap Terjaga.
            </h2>
            <p className="mt-4 text-[#3A5A40]">
              Belanja hasil panen langsung dari petani Indonesia.
            </p>
          </div>
          <div className="md:w-[45%]">
            <img src={HeroFarmer} alt="hero" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* ================= PRODUK TERBARU ================= */}
      <section className="py-14 max-w-[1400px] mx-auto px-6">
        <h2 className="text-2xl font-bold mb-8">Produk Terbaru</h2>

        {loadingProducts && <p>Memuat produk...</p>}
        {errorProducts && <p className="text-red-500">{errorProducts}</p>}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {displayedProducts.map((p) => (
            <Link
              key={p.product_id}
              to={isLoggedIn ? `/product/${p.product_id}` : `/product-before/${p.product_id}`}
            >
              <div className="bg-white rounded-3xl border shadow hover:shadow-lg transition">
                <div className="h-40 bg-[#F4F8F1] flex items-center justify-center">
                  <img
                    src={p.image_url || "/images/placeholder-product.png"}
                    alt={p.name}
                    className="h-full object-contain"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold line-clamp-2">
                    {p.name} {p.unit && `(${p.unit})`}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {p.description}
                  </p>
                  <p className="mt-2 font-bold text-[#344E41]">
                    {formatRupiah(p.price)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* KENAPA KAMI */}
      <section className="w-full bg-[#DDEACD] py-14 md:py-20">
        <div className="max-w-[1350px] mx-auto px-4 sm:px-8 lg:px-10 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <h2 className="text-[#344E41] font-extrabold text-[26px] sm:text-[30px] md:text-[32px] mb-3 sm:mb-4">Kenapa Kami?</h2>
            <p className="text-[#3A5A40] text-[14px] sm:text-[15px] mb-8 sm:mb-10 leading-relaxed">Karena kami percaya, hasil terbaik datang langsung dari tangan petani.</p>

            <div className="space-y-8 sm:space-y-10">
              <div className="flex items-start gap-4">
                <img src={IconFarmer} alt="Langsung dari Petani" className="w-[42px] sm:w-[48px]" />
                <div>
                  <h3 className="font-bold text-[#344E41] text-[16px] sm:text-[18px] mb-1">Langsung dari Petani</h3>
                  <p className="text-[#3A5A40] text-[14px] sm:text-[15px] leading-relaxed">Kami bekerja sama langsung dengan petani lokal. Setiap produk datang segar tanpa melalui rantai distribusi panjang.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <img src={IconSegar} alt="Segar dan Alami" className="w-[42px] sm:w-[48px]" />
                <div>
                  <h3 className="font-bold text-[#344E41] text-[16px] sm:text-[18px] mb-1">Segar dan Alami</h3>
                  <p className="text-[#3A5A40] text-[14px] sm:text-[15px] leading-relaxed">Hasil panen dikirim segera setelah dipetik. Tanpa bahan pengawet atau proses pematangan buatan.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <img src={IconJujur} alt="Harga Jujur" className="w-[42px] sm:w-[48px]" />
                <div>
                  <h3 className="font-bold text-[#344E41] text-[16px] sm:text-[18px] mb-1">Harga Jujur</h3>
                  <p className="text-[#3A5A40] text-[14px] sm:text-[15px] leading-relaxed">Petani mendapatkan harga yang layak. Pembeli pun menikmati harga hemat tanpa biaya tambahan.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <img src={IconPengiriman} alt="Pengiriman Cepat" className="w-[42px] sm:w-[48px]" />
                <div>
                  <h3 className="font-bold text-[#344E41] text-[16px] sm:text-[18px] mb-1">Pengiriman Cepat</h3>
                  <p className="text-[#3A5A40] text-[14px] sm:text-[15px] leading-relaxed">Produk dikemas dengan aman dan rapi. Kami pastikan kesegaran tetap terjaga hingga sampai ke tangan Anda.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <img src={Petani2Banner} alt="petani" className="rounded-2xl shadow-md w-full max-w-[520px] md:max-w-[550px] object-cover" />
          </div>
        </div>
      </section>

      {/* KATEGORI */}
      <section className="bg-[#FFFEF6] w-full py-14 md:py-20">
        <div className="max-w-[1350px] mx-auto px-4 sm:px-8 lg:px-10 text-center">
          <h2 className="text-[#344E41] font-extrabold text-[26px] sm:text-[30px] md:text-[32px] mb-10 sm:mb-16">Kategori</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {kategoriItems.map((item) => (
              <div key={item.key} className="bg-white rounded-2xl border border-[#7BA66A]/40 shadow-sm px-6 py-7 sm:px-6 sm:py-8 flex justify-between items-center">
                <div className="text-left max-w-[70%]">
                  <h3 className="text-[#344E41] font-bold text-[17px] sm:text-[18px] mb-2">{item.title}</h3>
                  <p className="text-[#3A5A40] text-[13px] sm:text-[14px] leading-snug mb-5 sm:mb-6">{item.desc}</p>

                  <button
                    type="button"
                    onClick={() => handleGoToCategory(item.key)}
                    className="border-2 border-[#3A5A40] text-[#3A5A40] px-4 py-1.5 rounded-lg text-[13px] sm:text-[14px] font-semibold flex items-center gap-2 hover:bg-[#3A5A40] hover:text-white transition"
                  >
                    Belanja
                    <span className="text-lg sm:text-xl -mb-[2px]">→</span>
                  </button>
                </div>

                <img src={IconKategori} alt={item.title} className="w-[70px] sm:w-[90px] object-contain mt-8 sm:mt-16 lg:mt-24" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LANGKAH BELANJA */}
      <section className="bg-[#FFFEF6] w-full pt-8 pb-16 md:pb-24">
        <div className="max-w-[1350px] mx-auto px-4 sm:px-8 lg:px-10 text-center">
          <div className="grid grid-cols-4 gap-3 sm:gap-8 lg:gap-16 mt-6 sm:mt-10">
            {langkahBelanja.map((step, i) => {
              const parts = step.label.split(" ");
              return (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-[55px] h-[55px] sm:w-[80px] sm:h-[80px] rounded-xl flex items-center justify-center bg-[#588157]/45">
                    <img src={step.icon} alt={step.label} className="object-contain w-[38px] sm:w-[60px]" />
                  </div>
                  <p className="text-[#344E41] font-semibold text-[10px] sm:text-[15px] leading-tight mt-2 sm:mt-4">
                    {parts[0]} <br />
                    {parts.slice(1).join(" ")}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TENTANG KAMI */}
      <section className="bg-[#FFFEF6] py-16 md:py-24">
        <div className="max-w-[1350px] mx-auto text-center px-4 sm:px-8 lg:px-10">
          <h2 className="text-[#344E41] text-[24px] sm:text-[28px] md:text-[32px] font-extrabold mb-10 sm:mb-12">Tentang Kami</h2>

          <div className="bg-gradient-to-r from-[#D2E4BE] to-[#9DBD84] rounded-3xl p-5 sm:p-6 md:p-8 lg:p-10 max-w-4xl mx-auto">
            <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-inner p-7 sm:p-8 md:p-10 text-center">
              <p className="text-[#344E41] text-[14px] sm:text-[15px] md:text-[17px] leading-relaxed">
                <span className="font-bold">PanenMania</span> hadir sebagai
                <span className="font-bold"> jembatan antara petani lokal dan konsumen</span> yang menginginkan produk segar berkualitas dengan harga terbaik. Kami berkomitmen menjadi penyalur hasil panen langsung dari tangan petani ke tempat pelanggan, tanpa perantara yang merugikan pihak mana pun. <span className="font-bold">PanenMania</span> memastikan para petani mendapatkan harga jual yang layak, sementara pelanggan menikmati produk segar, sehat, dan terjamin mutunya setiap hari.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeContent;
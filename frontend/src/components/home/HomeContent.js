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

/* =====================
   Helper
===================== */
const formatRupiah = (num) =>
  num == null || isNaN(num)
    ? "-"
    : new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(num);

/* =====================
   Component
===================== */
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
    { key: "buah", title: "Buah", desc: "Manis alami dan penuh vitamin." },
    { key: "sayur", title: "Sayur", desc: "Segar dan bebas bahan berbahaya." },
    { key: "beras", title: "Beras", desc: "Pulen dan harum berkualitas." },
  ];

  const langkahBelanja = [
    { label: "Pilih Produk", icon: IconPilihProduk },
    { label: "Masukkan Keranjang", icon: IconMasukkanKeranjang },
    { label: "Melakukan Pembayaran", icon: IconMelakukanPembayaran },
    { label: "Menunggu Pesanan", icon: IconMenungguPesanan },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      navigate(`${catalogBase}?category=all`);
      return;
    }
    navigate(`${catalogBase}?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleGoToCategory = (categoryKey) => {
    navigate(`${catalogBase}?category=${categoryKey}`);
  };

  /* =====================
     Fetch Products
  ===================== */
  useEffect(() => {
  let mounted = true;

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      setErrorProducts(null);

      const res = await API.get("/api/products");
      const data = res.data;

      const products = Array.isArray(data?.products)
        ? data.products
        : Array.isArray(data)
        ? data
        : [];

      const normalized = products
        .filter((p) => Boolean(p.is_active))
        .map((p) => ({
          product_id: p.product_id,
          name: p.name,
          description: p.description,
          price: p.price !== null ? Number(p.price) : null,
          stock: p.stock,
          unit: p.unit,
          image_url: p.image_url,
          category: p.category,
        }));

      if (mounted) setLatestProducts(normalized.slice(0, 8));
    } catch (err) {
      console.error(err);
      if (mounted) {
        setErrorProducts(
          err?.response?.data?.message || "Gagal memuat produk."
        );
      }
    } finally {
      if (mounted) setLoadingProducts(false);
    }
  };

  fetchProducts();
  return () => (mounted = false);
}, []);

  const displayedProducts = useMemo(() => latestProducts, [latestProducts]);

  return (
    <div className="bg-[#FFFEF6]">
      {/* SECTION SEARCH */}
      <div className="flex justify-center items-center -mt-4 sm:-mt-6 pb-8 sm:pb-10">
        <form onSubmit={handleSearchSubmit} className="w-full flex justify-center">
          <div className="relative w-full max-w-[520px] min-w-[260px]">
            <input
              type="text"
              placeholder="Cari produk segar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-2 border-[#588157] rounded-full px-6 py-2.5 sm:py-3 pr-11 focus:outline-none bg-transparent text-sm sm:text-base"
            />
            <button
              type="submit"
              className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 flex items-center justify-center"
              aria-label="Cari produk"
            >
              <img src={IconSearch} alt="Cari" className="w-5 h-5 object-contain" />
            </button>
          </div>
        </form>
      </div>

      {/* HERO SECTION */}
      <section className="w-full bg-[#B8D68F]/25">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row">
          {/* Kiri: teks hero */}
          <div className="w-full md:w-[55%] flex items-center">
            <div className="px-4 sm:px-8 md:px-16 lg:px-20 py-10 md:py-12 max-w-xl">
              <h2 className="text-[21px] sm:text-[26px] md:text-[25px] font-extrabold text-[#344E41] leading-snug mb-5 sm:mb-6">
                Dari Ladang ke Tempat Anda,
                <br />
                Segarnya Tetap Terjaga.
              </h2>

              <p className="text-[#3A5A40] text-[13px] sm:text-[15px] leading-relaxed mb-8 sm:mb-10">
                Belanja hasil panen kini lebih mudah dan menyenangkan! Temukan
                sayur, buah, dan bahan segar langsung dari petani Indonesia.
                Dijamin segar, sehat, dan sampai di rumah Anda dengan cepat.
              </p>

              <Link to={`${catalogBase}?category=all`}>
                <button className="inline-flex items-center gap-3 border-2 border-[#344E41] text-[#344E41] font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-[#344E41] hover:text-white transition-all text-sm sm:text-base">
                  <span>Belanja Sekarang</span>
                  <span className="text-lg sm:text-xl">→</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Kanan: gambar hero */}
          <div className="w-full md:w-[45%] h-[220px] sm:h-[260px] md:h-[400px] lg:h-[430px]">
            <img src={HeroFarmer} alt="hero-farmer" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* STATISTIK */}
      <section className="w-full bg-[#FFFEF6] py-10 md:py-16">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-0 grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8 text-center">
          {statistikItems.map((item, index) => (
            <div
              key={index}
              className="rounded-[18px] sm:rounded-[28px] px-3 py-5 sm:px-6 sm:py-8 bg-[#588157]/25 flex flex-col justify-center items-center shadow-[0px_6px_12px_rgba(0,0,0,0.2)]"
            >
              <img src={item.icon} alt={item.label} className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-2 sm:mb-3 md:mb-4 object-contain" />
              <h3 className="text-[20px] sm:text-[28px] md:text-[32px] lg:text-[40px] font-extrabold text-[#3A5B40] leading-tight">7000+</h3>
              <p className="text-[#3A5B40] mt-1 sm:mt-2 font-semibold text-[11px] sm:text-sm md:text-base">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROMO SECTION */}
      <section className="w-full bg-[#EEF2E6]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-2">
          {/* Gambar promo */}
          <div className="flex-1 min-h-[160px] sm:min-h-[220px] md:min-h-[350px] lg:min-h-[420px] overflow-hidden">
            <img src={PromoVeg} alt="Sayuran Promo" className="w-full h-full object-cover block md:scale-[1.02]" />
          </div>

          {/* Teks promo */}
          <div className="bg-[#6E8C6B] text-white flex items-center">
            <div className="px-4 sm:px-8 md:px-12 lg:px-16 py-6 sm:py-8 md:py-0 max-w-xl">
              <h3 className="text-base sm:text-xl md:text-3xl font-extrabold leading-snug mb-3 sm:mb-4 md:mb-6">Kesegaran Alami, Harga Terbaik.</h3>
              <p className="text-[12px] sm:text-sm md:text-base leading-relaxed font-medium opacity-95">
                Manfaatkan promo eksklusif hingga 90% untuk produk hasil panen
                pilihan. Kami hadirkan kualitas terbaik langsung dari petani ke
                meja Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUK TERBARU */}
      <section className="w-full bg-[#FFFEF6] py-12 md:py-16">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-10">
          {/* Header produk */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8 sm:mb-10">
            <h2 className="text-[22px] sm:text-[26px] md:text-[28px] font-bold text-[#344E41]">Produk Terbaru</h2>

            <Link to={`${catalogBase}?category=all`} className="text-[#3A5A40] font-semibold text-[14px] sm:text-[15px] hover:underline flex items-center gap-1">
              Lihat Semuanya &gt;
            </Link>
          </div>

          {/* Loading dan Error State */}
          {loadingProducts && (
            <div className="text-center text-sm text-[#3A5A40] py-10">Memuat produk terbaru...</div>
          )}

          {errorProducts && (
            <div className="text-center text-sm text-red-600 py-10">Error memuat produk: {errorProducts}</div>
          )}

          {/* Grid produk: mobile 2 produk per baris */}
          {!loadingProducts && !errorProducts && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-8 gap-x-4 md:gap-y-12 md:gap-x-8">
              {displayedProducts.map((product, i) => {
                const productId = product.product_id ?? i + 1;
                return (
                  <Link key={productId} to={isLoggedIn ? `/product/${productId}` : `/product-before/${productId}`}>
                    {/* Card produk: dibuat flex + tinggi terkendali */}
                    <div className="bg-white rounded-3xl shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E0E6D8] hover:shadow-xl transition-all duration-200 cursor-pointer w-full max-w-[310px] mx-auto h-full flex flex-col">
                      {/* Gambar produk */}
                      <div className="w-full bg-[#F4F8F1] rounded-t-3xl p-4 sm:p-6 h-[150px] sm:h-[190px] flex items-center justify-center">
                        <img
                          src={product.image || product.imageUrl || "/images/placeholder-product.png"}
                          alt={product.name}
                          className="h-full object-contain"
                        />
                      </div>

                      {/* Detail produk: flex agar harga di bawah, teks tidak bikin card tinggi berlebihan */}
                      <div className="p-4 sm:p-6 flex flex-col flex-1">
                        <h3 className="text-[#344E41] font-bold text-[14px] sm:text-[16px] mb-1 line-clamp-2">
                          {product.name} {product.unit ? `(${product.unit})` : ""}
                        </h3>

                        <p className="text-[#3A5A40] text-[11px] sm:text-[13px] mb-3 sm:mb-4 leading-relaxed line-clamp-2">
                          {product.description}
                        </p>

                        <p className="mt-auto text-[#344E41] font-bold text-[14px] sm:text-[16px]">
                          {product.price !== null && product.price !== undefined
                            ? formatRupiah(product.price)
                            : product.rawPrice
                            ? product.rawPrice
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}

              {/* Tampilkan pesan jika tidak ada produk */}
              {displayedProducts.length === 0 && !loadingProducts && (
                <div className="col-span-full text-center text-sm text-[#3A5A40]/70 py-6">Saat ini belum ada produk terbaru yang tersedia.</div>
              )}
            </div>
          )}
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
// src/pages/afterLogin/ProductDetailAfterLogin.js
import React, { useState } from "react";
import NavbarAfterLogin from "../../components/layout/NavbarAfterLogin";
import Footer from "../../components/layout/Footer";
import { useNavigate } from "react-router-dom";

// ICONS
import IconTruk from "../../assets/images/icons/truk.svg";
import IconLike from "../../assets/images/icons/like.svg";
import IconDislike from "../../assets/images/icons/dislike.svg";
import IconPilihProduk from "../../assets/images/icons/pilih produk.svg";
import IconMasukkanKeranjang from "../../assets/images/icons/masukkan keranjang.svg";
import IconMelakukanPembayaran from "../../assets/images/icons/melakukan pembayaran.svg";
import IconMenungguPesanan from "../../assets/images/icons/menunggu pesanan.svg";

import IconCart from "../../assets/images/icons/cart.svg";
import BerasImage from "../../assets/images/products/beras.svg";

/* ---------- Reusable components ---------- */

// QtyControl: angka benar-benar di tengah, border 2px, radius 8 (tinggi sedikit dipendekkan)
const QtyControl = ({ quantity, setQuantity }) => (
  <div className="flex h-[32px]">
    <button
      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
      className="px-3 flex items-center justify-center bg-white text-black font-semibold text-lg border-2 border-[#3A5B40] rounded-l-[8px]"
      aria-label="kurangi"
    >
      −
    </button>

    <span className="px-4 flex items-center justify-center text-black font-semibold border-y-2 border-[#3A5B40] min-w-[40px] h-full bg-white">
      {quantity}
    </span>

    <button
      onClick={() => setQuantity((q) => q + 1)}
      className="px-3 flex items-center justify-center bg-white text-black font-semibold text-lg border-2 border-[#3A5B40] rounded-r-[8px] -ml-[2px]"
      aria-label="tambah"
    >
      +
    </button>
  </div>
);

const StepCard = ({ icon, label }) => (
  <div className="flex flex-col items-center">
    <div className="w-[90px] h-[90px] rounded-xl flex items-center justify-center bg-[#588157]/45">
      <img src={icon} alt={label} className="object-contain w-[70px]" />
    </div>
    <p className="text-[#344E41] font-semibold text-[15px] leading-tight mt-4 text-center">
      {label.split(" ")[0]} <br />
      {label.split(" ").slice(1).join(" ")}
    </p>
  </div>
);

// ReviewItem
const ReviewItem = ({ name, rating, text }) => (
  <div className="flex flex-col border-b-2 border-[#3A5B40] pb-6 mb-6">
    <div className="flex justify-between items-start">
      <div className="flex gap-5">
        <div className="w-14 h-14 rounded-full bg-gray-300 shrink-0" />
        <div className="flex-1">
          <p className="font-bold text-[#3A5B40] text-[15px]">{name}</p>
          <div className="flex items-center gap-1 mb-2 text-[#3A5B40]">
            <span className="text-sm leading-none">
              {"★".repeat(rating)}
            </span>
          </div>
          <p className="text-[#3A3A3A] text-[14px] leading-relaxed">{text}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 ml-4">
        <button className="p-1" aria-label="like">
          <img src={IconLike} alt="like" className="w-6 h-6" />
        </button>
        <button className="p-1" aria-label="dislike">
          <img src={IconDislike} alt="dislike" className="w-6 h-6" />
        </button>
      </div>
    </div>
  </div>
);

/* ---------- Main component ---------- */

const ProductDetailAfterLogin = () => {
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false); // ⬅️ DITAMBAH
  const navigate = useNavigate();

  // Data produk (sementara hardcode, bisa diganti dari props / API)
  const product = {
    id: 1,
    name: "Beras Pulen Berkualitas Cap Dero 5kg",
    price: 79500,
    image: BerasImage,
  };

  // === LOGIKA BACKEND / CART ===
  const handleAddToCart = async () => {
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity,
        }),
      });

      // ⬇️ TIDAK NAVIGATE KE CART LAGI
      // navigate("/cart");

      // TAMPILKAN NOTIF SUKSES
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err) {
      console.error("Gagal menambahkan ke keranjang:", err);
      // Di sini bisa tambahkan notif error kalau mau
    }
  };

  const handleBuyNow = () => {
    // Bawa data ke halaman checkout
    navigate("/checkout", {
      state: {
        productId: product.id,
        quantity,
      },
    });
  };

  return (
    <div className="bg-[#FFFEF6] min-h-screen font-poppins flex flex-col">
      {/* NAVBAR AFTER LOGIN */}
      <NavbarAfterLogin />

      {/* Spacer supaya tidak nempel navbar */}
      <div className="pt-24" />

      {/* ========== DETAIL PRODUK ========== */}
      <section className="w-full mt-0">
        <div className="max-w-[1350px] mx-auto">
          {/* Card product */}
          <div className="bg-[#B8D68F]/25 rounded-[10px] py-10 sm:py-16 mx-4 sm:mx-10 lg:mx-16 px-4 sm:px-10">
            {/* Grid isi card diratakan tengah */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start max-w-[1050px] mx-auto">
              {/* LEFT - IMAGE */}
              <div className="flex flex-col items-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full max-w-[340px] h-[360px] object-contain rounded-xl border border-[#E0E6D8] bg-white"
                />

                {/* 3 thumbnail sejajar dengan lebar gambar besar */}
                <div className="flex justify-between gap-4 mt-6 w-full max-w-[340px]">
                  {[1, 2, 3].map((_, i) => (
                    <div
                      key={i}
                      className="w-[90px] h-[90px] bg-white rounded-md flex items-center justify-center border border-[#B8D68F]"
                    >
                      <img
                        src={product.image}
                        alt={`Thumbnail ${i + 1}`}
                        className="w-[70px] h-[70px] object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT - INFO */}
              <div className="text-left text-[#3A5B40] md:-ml-4 lg:-ml-16">
                <h2 className="text-[24px] sm:text-[26px] font-extrabold text-[#3A5B40] mb-3 whitespace-nowrap">
                  {product.name}
                </h2>

                {/* Rating + bintang */}
                <div className="flex flex-wrap items-center gap-3 text-[#3A5B40] text-[14px] font-medium mb-4">
                  <span>5.0</span>
                  <span className="text-[16px] leading-none text-[#3A5B40]">
                    ★★★★★
                  </span>
                  <span>|</span>
                  <span>4 Ulasan</span>
                  <span>|</span>
                  <span>50 Terjual</span>
                </div>

                {/* Button harga */}
                <div className="inline-block mb-6">
                  <div className="bg-[#3A5B40] rounded-[10px] px-5 py-3">
                    <p className="text-[20px] sm:text-[22px] font-extrabold text-white">
                      Rp {product.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                {/* Deskripsi */}
                <p className="text-[#3A5B40] text-[14px] sm:text-[13px] leading-relaxed mb-6 max-w-[515px]">
                  Beras yang diproses dengan baik sehingga menghasilkan beras
                  premium yang sangat pulen dan sehat.
                  <br />
                  Beras ini sangat bersih dan tidak menggunakan bahan kimia
                  berbahaya
                  <br />
                  sehingga aman digunakan untuk kebutuhan pokok keluarga Anda.
                </p>

                {/* Pengiriman + stok + qty */}
                <div className="flex flex-wrap items-center gap-4 text-[#3A5B40] text-[14px] sm:text-[15px] font-medium mb-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <span>Pengiriman</span>
                    <div className="flex items-center gap-2">
                      <img
                        src={IconTruk}
                        alt="pengiriman"
                        className="w-5 h-5"
                      />
                      <span>5–7 Hari</span>
                    </div>
                    <span>|</span>
                    <span>Tersisa: 20 barang</span>
                  </div>

                  {/* Qty */}
                  <div className="lg:-ml-0">
                    <QtyControl
                      quantity={quantity}
                      setQuantity={setQuantity}
                    />
                  </div>
                </div>

                {/* === NOTIFIKASI SUKSES (BARU) === */}
                {showSuccess && (
                  <div className="mb-4 w-full bg-green-600 text-white px-4 py-2 rounded-md text-center text-sm sm:text-base font-semibold">
                    Produk berhasil ditambahkan ke keranjang ✔
                  </div>
                )}

                {/* Tombol aksi */}
                <div className="flex flex-wrap gap-4 mt-2">
                  <button
                    onClick={handleAddToCart}
                    className="flex items-center justify-center gap-2 bg-[#3A5B40] text-white text-[15px] font-semibold px-8 py-3 rounded-[10px] min-w-[230px] hover:bg-[#2c3d33] transition"
                  >
                    <img src={IconCart} alt="keranjang" className="w-5 h-5" />
                    <span>Masukkan Keranjang</span>
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex items-center justify-center bg-[#3A5B40] text-white text-[15px] font-semibold px-8 py-3 rounded-[10px] min-w-[230px] hover:bg-[#486947] transition"
                  >
                    Pesan Sekarang
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== PENILAIAN & ULASAN ========== */}
      <section className="w-full mt-10">
        <div className="max-w-[1350px] mx-auto px-4 sm:px-10 lg:px-16">
          <div className="bg-[#3A5B40] text-white py-3 px-6 sm:px-8 font-semibold text-[17px] rounded-[10px]">
            Penilaian & Ulasan
          </div>
        </div>

        <div className="max-w-[1150px] mx-auto px-4 sm:px-10 lg:px-16 bg-[#FFFEF6] pt-6 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-[210px_auto] gap-4 md:gap-4">
            <div>
              <p className="text-[32px] sm:text-[36px] font-extrabold text-[#3A5B40] mb-1">
                5.0/
                <span className="text-[22px] sm:text-[24px] font-semibold">
                  5
                </span>
              </p>
              <p className="text-[16px] sm:text-[18px] text-[#3A5A40] mb-1 font-medium">
                <span className="text-[#3A5B40]">★★★★★</span>{" "}
                <span className="text-sm text-[#555]">(4 ulasan)</span>
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {[5, 4, 3, 2, 1].map((star, index) => (
                <div key={star} className="flex items-center gap-3 text-sm">
                  <span className="text-[#3A5B40]">
                    {"★".repeat(star)}
                    {"☆".repeat(5 - star)}
                  </span>
                  <div className="w-[230px] h-3 bg-[#588157]/25">
                    <div
                      className={`h-full bg-[#3A5A40] ${
                        index === 0 ? "w-full" : "w-0"
                      }`}
                    />
                  </div>
                  <span className="text-[#3A5B40]">
                    {index === 0 ? "5" : "0"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Header "Ulasan Produk" */}
        <div className="max-w-[1350px] mx-auto px-4 sm:px-10 lg:px-16 mt-6">
          <div className="bg-[#3A5B40] text-white py-3 px-6 sm:px-8 font-semibold text-[17px] rounded-[10px]">
            Ulasan Produk
          </div>
        </div>

        {/* Isi ulasan */}
        <div className="max-w-[1350px] mx-auto bg-[#FFFEF6] pt-6 pb-6">
          <div className="max-w-[1150px] mx-auto px-4 sm:px-8 lg:px-10">
            <ReviewItem
              name="Dearni Lombardo Saragih"
              rating={5}
              text="Berasnya bersih, pulen saat dimasak, dan aromanya enak. Tidak banyak patahan atau kotoran, kualitasnya bagus dan konsisten."
            />
            <ReviewItem
              name="A. Customer"
              rating={4}
              text="Produk bagus, pengiriman sesuai estimasi."
            />
          </div>
        </div>
      </section>

      {/* ========== LANGKAH BELANJA ========== */}
      <section className="bg-[#FFFEF6] w-full pb-24 pt-10">
        <div className="max-w-[1350px] mx-auto px-6 sm:px-10 text-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 mt-10">
            {[
              { label: "Pilih Produk", icon: IconPilihProduk },
              { label: "Masukkan Keranjang", icon: IconMasukkanKeranjang },
              { label: "Melakukan Pembayaran", icon: IconMelakukanPembayaran },
              { label: "Menunggu Pesanan", icon: IconMenungguPesanan },
            ].map((step, i) => (
              <StepCard key={i} icon={step.icon} label={step.label} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetailAfterLogin;
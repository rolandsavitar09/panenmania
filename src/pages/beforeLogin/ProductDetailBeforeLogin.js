// src/pages/beforeLogin/ProductDetailBeforeLogin.js
import React, { useState, useEffect } from "react";
import NavbarBeforeLogin from "../../components/layout/NavbarBeforeLogin";
import Footer from "../../components/layout/Footer";
import Popup from "../../components/common/Popup";
import { useNavigate, useParams } from "react-router-dom";

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

/**
 * Keterangan singkat:
 * - Versi BEFORE LOGIN yang diperbarui mengikuti logika AFTER LOGIN:
 *   -> Mencoba fetch detail produk berdasar ID route (fallback ke mock jika gagal)
 *   -> Tombol "Masukkan Keranjang" dan "Pesan Sekarang" membuka popup akses (belum login)
 *   -> Layout, ukuran tombol, kontrol qty, dan bar rating dibuat fixed/rapi
 * - Komentar singkat menggunakan bahasa Indonesia formal.
 */

// Endpoint (sesuaikan bila backend berjalan di host/port berbeda)
const API_PRODUCT_URL = "http://localhost:5000/api/products";

// Format rupiah
const formatRupiah = (number) => {
  if (typeof number !== "number") return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

/* ---------- Reusable components (UI konsisten dengan after-login) ---------- */

// Kontrol jumlah produk — ukuran & layout fixed
const QtyControl = ({ quantity, setQuantity, maxStock = 999 }) => (
  <div className="flex items-center h-[36px]">
    <button
      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
      className="w-[44px] h-full flex items-center justify-center bg-white text-black font-semibold text-lg border-2 border-[#3A5B40] rounded-l-[8px]"
      aria-label="kurangi"
    >
      −
    </button>

    <span className="w-[56px] h-full flex items-center justify-center text-black font-semibold border-y-2 border-[#3A5B40] bg-white">
      {quantity}
    </span>

    <button
      onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
      className="w-[44px] h-full flex items-center justify-center bg-white text-black font-semibold text-lg border-2 border-[#3A5B40] rounded-r-[8px] -ml-[2px]"
      aria-label="tambah"
      disabled={quantity >= maxStock}
    >
      +
    </button>
  </div>
);

// Item ulasan (sama gaya)
const ReviewItem = ({ name, rating, text }) => (
  <div className="flex flex-col border-b-2 border-[#3A5B40] pb-6 mb-6">
    <div className="flex justify-between items-start gap-4">
      <div className="flex gap-5">
        <div className="w-14 h-14 rounded-full bg-gray-300 shrink-0" />
        <div className="flex-1">
          <p className="font-bold text-[#3A5B40] text-[15px]">{name}</p>
          <div className="flex items-center gap-1 mb-2 text-[#3A5B40]">
            <span className="text-sm leading-none">{"★".repeat(rating)}</span>
          </div>
          <p className="text-[#3A3A3A] text-[14px] leading-relaxed">{text}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 ml-0 sm:ml-4">
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

/* ---------- Main component (Before Login, updated) ---------- */

const ProductDetailBeforeLogin = () => {
  const { id } = useParams(); // id produk dari route (boleh undefined)
  const navigate = useNavigate();

  // UI state
  const [quantity, setQuantity] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Mock product (fallback jika fetch gagal atau tidak ada id)
  const mockProduct = {
    product_id: 1,
    name: "Beras Pulen Berkualitas Cap Dero 5kg",
    price: 79500,
    imageUrl: BerasImage,
    description:
      "Beras yang diproses dengan baik sehingga menghasilkan beras premium yang sangat pulen dan sehat. Beras ini sangat bersih dan tidak menggunakan bahan kimia berbahaya sehingga aman digunakan untuk kebutuhan pokok keluarga Anda.",
    unit: "pack",
    stock: 20,
  };

  // Static reviews (UI sama seperti sebelum integrasi)
  const staticReviews = [
    {
      name: "Dearni Lombardo Saragih",
      rating: 5,
      text:
        "Berasnya bersih, pulen saat dimasak, dan aromanya enak. Tidak banyak patahan atau kotoran, kualitasnya bagus dan konsisten.",
    },
    {
      name: "A. Customer",
      rating: 4,
      text: "Produk bagus, pengiriman sesuai estimasi.",
    },
  ];

  // Langkah belanja (UI konsisten)
  const langkahBelanja = [
    { label: "Pilih Produk", icon: IconPilihProduk },
    { label: "Masukkan Keranjang", icon: IconMasukkanKeranjang },
    { label: "Melakukan Pembayaran", icon: IconMelakukanPembayaran },
    { label: "Menunggu Pesanan", icon: IconMenungguPesanan },
  ];

  // Fetch product dari backend jika ada id; kalau gagal pakai mock
  useEffect(() => {
    // Bila tidak ada id di route, langsung gunakan mockProduct
    if (!id) {
      setProduct(mockProduct);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const res = await fetch(`${API_PRODUCT_URL}/${id}`);
        const data = await res.json().catch(() => null);

        if (res.ok && data && data.product) {
          setProduct({
            product_id: data.product.product_id ?? data.product.id ?? mockProduct.product_id,
            name: data.product.name ?? mockProduct.name,
            price:
              typeof data.product.price === "number"
                ? data.product.price
                : parseFloat(data.product.price) || mockProduct.price,
            imageUrl: data.product.imageUrl ?? data.product.image_url ?? mockProduct.imageUrl,
            description: data.product.description ?? mockProduct.description,
            unit: data.product.unit ?? mockProduct.unit,
            stock:
              typeof data.product.stock === "number"
                ? data.product.stock
                : parseInt(data.product.stock, 10) || mockProduct.stock,
          });
          setQuantity((q) => Math.min(q, data.product.stock ?? mockProduct.stock));
        } else {
          console.warn("API tidak mengembalikan product:", res.status, data);
          setFetchError("Gagal mengambil data produk dari server. Menampilkan data lokal.");
          setProduct(mockProduct);
        }
      } catch (err) {
        console.error("Fetch product error:", err);
        setFetchError("Gagal terhubung ke server backend. Menampilkan data lokal.");
        setProduct(mockProduct);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Ketika user belum login: action tombol membuka popup (akses terkunci)
  const handleAction = () => setShowPopup(true);
  const closePopup = () => setShowPopup(false);

  // Jika ingin, bisa arahkan ke signin/signup saat konfirmasi popup
  const handleConfirmPopup = () => {
    setShowPopup(false);
    navigate("/signin");
  };

  // Loading state
  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFEF6] font-poppins">
        <p className="text-[#3A5B40] text-lg">Memuat detail produk...</p>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="bg-[#FFFEF6] min-h-screen font-poppins flex flex-col">
      <NavbarBeforeLogin />

      {/* Spacer agar konten tidak tertutup navbar */}
      <div className="pt-24" />

      {/* Pesan singkat bila fetch error */}
      {fetchError && (
        <div className="max-w-[1150px] mx-auto px-4 sm:px-10 lg:px-16">
          <div className="text-sm text-yellow-700 bg-yellow-100 px-3 py-2 rounded mt-2 mb-2">
            {fetchError}
          </div>
        </div>
      )}

      {/* DETAIL PRODUK */}
      <section className="w-full mt-0">
        <div className="max-w-[1350px] mx-auto">
          <div className="bg-[#B8D68F]/25 rounded-[10px] py-10 sm:py-16 mx-4 sm:mx-10 lg:mx-16 px-4 sm:px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start max-w-[1050px] mx-auto">
              {/* Kiri: gambar */}
              <div className="flex flex-col items-center">
                <img
                  src={product.imageUrl || BerasImage}
                  alt={product.name}
                  className="w-full max-w-[340px] h-[360px] object-contain rounded-xl border border-[#E0E6D8] bg-white"
                />

                {/* Thumbnail kecil */}
                <div className="flex justify-between gap-4 mt-6 w-full max-w-[340px]">
                  {[1, 2, 3].map((_, i) => (
                    <div
                      key={i}
                      className="w-[90px] h-[90px] bg-white rounded-md flex items-center justify-center border border-[#B8D68F]"
                    >
                      <img
                        src={product.imageUrl || BerasImage}
                        alt={`Thumbnail ${i + 1}`}
                        className="w-[70px] h-[70px] object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Kanan: informasi */}
              <div className="text-left text-[#3A5B40] md:-ml-4 lg:-ml-16">
                <h2 className="text-[22px] sm:text-[24px] md:text-[26px] font-extrabold text-[#3A5B40] mb-3">
                  {product.name} ({product.unit})
                </h2>

                {/* Rating & ringkasan */}
                <div className="flex items-center gap-3 text-[#3A5B40] text-[14px] font-medium mb-4 flex-wrap">
                  <span>5.0</span>
                  <span className="text-[16px] leading-none text-[#3A5B40]">★★★★★</span>
                  <span>|</span>
                  <span>{staticReviews.length} Ulasan</span>
                  <span>|</span>
                  <span>50 Terjual</span>
                </div>

                {/* Harga */}
                <div className="inline-block mb-6">
                  <div className="bg-[#3A5B40] rounded-[10px] px-5 py-3">
                    <p className="text-[20px] sm:text-[22px] font-extrabold text-white">
                      {formatRupiah(product.price)}
                    </p>
                  </div>
                </div>

                {isOutOfStock && <p className="text-red-600 font-semibold mb-3">STOK HABIS</p>}

                {/* Deskripsi */}
                <p className="text-[#3A5B40] text-[14px] sm:text-[13px] leading-relaxed mb-6 max-w-[515px]">
                  {product.description}
                </p>

                {/* Info pengiriman, stok, qty — posisi tetap */}
                <div className="flex items-center gap-4 text-[#3A5B40] text-[14px] sm:text-[15px] font-medium mb-8">
                  <div className="flex items-center gap-3 whitespace-nowrap min-w-[260px]">
                    <span className="whitespace-nowrap">Pengiriman</span>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <img src={IconTruk} alt="pengiriman" className="w-5 h-5" />
                      <span className="whitespace-nowrap">5–7 Hari</span>
                    </div>
                    <span className="whitespace-nowrap">|</span>
                    <span className="whitespace-nowrap">Tersisa: {product.stock} barang</span>
                  </div>

                  <div className="flex-shrink-0">
                    <QtyControl quantity={quantity} setQuantity={setQuantity} maxStock={product.stock} />
                  </div>
                </div>

                {/* Tombol aksi — membuka popup karena sebelum login */}
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={handleAction}
                    disabled={isOutOfStock || quantity <= 0}
                    className="flex items-center justify-center gap-2 bg-[#3A5B40] text-white text-[13px] font-semibold px-6 py-3 rounded-[10px] min-w-[230px] hover:bg-[#2c3d33] transition disabled:opacity-50"
                  >
                    <img src={IconCart} alt="keranjang" className="w-5 h-5" />
                    <span>Masukkan Keranjang</span>
                  </button>

                  <button
                    onClick={handleAction}
                    disabled={isOutOfStock || quantity <= 0}
                    className="flex items-center justify-center gap-2 bg-[#3A5B40] text-white text-[13px] font-semibold px-6 py-3 rounded-[10px] min-w-[230px] hover:bg-[#2c3d33] transition disabled:opacity-50"
                  >
                    <span>Pesan Sekarang</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PENILAIAN & ULASAN — bar rating rapi (fixed width) */}
      <section className="w-full mt-10">
        <div className="max-w-[1350px] mx-auto px-4 sm:px-10 lg:px-16">
          <div className="bg-[#3A5B40] text-white py-3 px-6 sm:px-8 font-semibold text-[17px] rounded-[10px]">
            Penilaian & Ulasan
          </div>
        </div>

        <div className="max-w-[1150px] mx-auto px-4 sm:px-10 lg:px-16 bg-[#FFFEF6] pt-6 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-[210px_auto] gap-4 items-start">
            <div>
              <p className="text-[32px] sm:text-[36px] font-extrabold text-[#3A5B40] mb-1">
                5.0/
                <span className="text-[22px] sm:text-[24px] font-semibold">5</span>
              </p>
              <p className="text-[16px] sm:text-[18px] text-[#3A5A40] mb-1 font-medium">
                <span className="text-[#3A5B40]">★★★★★</span>{" "}
                <span className="text-sm text-[#555]">({staticReviews.length} ulasan)</span>
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {[5, 4, 3, 2, 1].map((star, index) => {
                const filled = index === 0 ? 100 : 0; // contoh: 5★ penuh, lainnya 0
                return (
                  <div key={star} className="flex items-center gap-3 text-sm">
                    <div className="w-[60px] text-[#3A5B40] whitespace-nowrap">{"★".repeat(star)}</div>
                    <div className="w-[230px] h-3 bg-[#588157]/25 rounded overflow-hidden">
                      <div className="h-full bg-[#3A5A40]" style={{ width: `${filled}%` }} />
                    </div>
                    <div className="w-8 text-[#3A5B40] text-right">{filled === 100 ? "5" : "0"}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Header Ulasan Produk */}
        <div className="max-w-[1350px] mx-auto px-4 sm:px-10 lg:px-16 mt-6">
          <div className="bg-[#3A5B40] text-white py-3 px-6 sm:px-8 font-semibold text-[17px] rounded-[10px]">
            Ulasan Produk
          </div>
        </div>

        {/* Daftar ulasan */}
        <div className="max-w-[1350px] mx-auto bg-[#FFFEF6] pt-6 pb-6">
          <div className="max-w-[1150px] mx-auto px-4 sm:px-8 lg:px-10">
            {staticReviews.length === 0 ? (
              <div className="text-center text-[#3A5A40] text-sm py-4">Belum ada ulasan untuk produk ini.</div>
            ) : (
              staticReviews.map((r, i) => <ReviewItem key={i} name={r.name} rating={r.rating} text={r.text} />)
            )}
          </div>
        </div>
      </section>

      {/* LANGKAH BELANJA (tidak diubah) */}
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
                  <p className="text-[#344E41] font-semibold text-[10px] sm:text-[15px] leading-tight mt-2 sm:mt-4 text-center">
                    {parts[0]} <br />
                    {parts.slice(1).join(" ")}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />

      {/* Popup akses terkunci (belum login) */}
      {showPopup && (
        <Popup
          variant="locked"
          onClose={closePopup}
          onCancel={closePopup}
          onConfirm={handleConfirmPopup}
        />
      )}
    </div>
  );
};

export default ProductDetailBeforeLogin;
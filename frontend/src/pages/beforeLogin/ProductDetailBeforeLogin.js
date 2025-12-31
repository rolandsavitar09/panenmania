import React, { useState, useEffect } from "react";
import NavbarBeforeLogin from "../../components/layout/NavbarBeforeLogin";
import Footer from "../../components/layout/Footer";
import Popup from "../../components/common/Popup";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/api";

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

// Format rupiah
const formatRupiah = (number) => {
  if (typeof number !== "number") return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

// Kontrol jumlah produk
const QtyControl = ({ quantity, setQuantity, maxStock = 999 }) => (
  <div className="flex items-center h-[36px]">
    <button
      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
      className="w-[44px] h-full flex items-center justify-center bg-white text-black font-semibold text-lg border-2 border-[#3A5B40] rounded-l-[8px]"
    >
      −
    </button>

    <span className="w-[56px] h-full flex items-center justify-center text-black font-semibold border-y-2 border-[#3A5B40] bg-white">
      {quantity}
    </span>

    <button
      onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
      className="w-[44px] h-full flex items-center justify-center bg-white text-black font-semibold text-lg border-2 border-[#3A5B40] rounded-r-[8px] -ml-[2px]"
      disabled={quantity >= maxStock}
    >
      +
    </button>
  </div>
);

// Item ulasan
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

      <div className="flex items-center gap-4">
        <img src={IconLike} alt="like" className="w-6 h-6" />
        <img src={IconDislike} alt="dislike" className="w-6 h-6" />
      </div>
    </div>
  </div>
);

const ProductDetailBeforeLogin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const mockProduct = {
    product_id: 1,
    name: "Beras Pulen Berkualitas Cap Dero 5kg",
    price: 79500,
    imageUrl: BerasImage,
    description: "Produk contoh",
    unit: "pack",
    stock: 20,
  };

  const staticReviews = [
    { name: "Customer A", rating: 5, text: "Produk bagus" },
    { name: "Customer B", rating: 4, text: "Sesuai deskripsi" },
  ];

  const langkahBelanja = [
    { label: "Pilih Produk", icon: IconPilihProduk },
    { label: "Masukkan Keranjang", icon: IconMasukkanKeranjang },
    { label: "Melakukan Pembayaran", icon: IconMelakukanPembayaran },
    { label: "Menunggu Pesanan", icon: IconMenungguPesanan },
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        const p = res.data.product || res.data;

        setProduct({
          product_id: p.product_id,
          name: p.name,
          price: Number(p.price),
          imageUrl: p.image_url,
          description: p.description,
          unit: p.unit,
          stock: p.stock,
        });
      } catch (err) {
        setFetchError("Gagal mengambil data produk. Menampilkan data lokal.");
        setProduct(mockProduct);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
    else {
      setProduct(mockProduct);
      setLoading(false);
    }
  }, [id]);

  if (loading || !product) {
    return <div className="min-h-screen flex items-center justify-center">Memuat...</div>;
  }

  return (
    <div className="bg-[#FFFEF6] min-h-screen font-poppins flex flex-col">
      <NavbarBeforeLogin />

      <div className="pt-24 max-w-[1200px] mx-auto px-4">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-xl font-bold">{formatRupiah(product.price)}</p>

        <QtyControl
          quantity={quantity}
          setQuantity={setQuantity}
          maxStock={product.stock}
        />

        <div className="flex gap-4 mt-6">
          <button
            onClick={() => setShowPopup(true)}
            className="bg-[#3A5B40] text-white px-6 py-3 rounded-lg"
          >
            Masukkan Keranjang
          </button>

          <button
            onClick={() => setShowPopup(true)}
            className="bg-[#3A5B40] text-white px-6 py-3 rounded-lg"
          >
            Pesan Sekarang
          </button>
        </div>

        <div className="mt-10">
          {staticReviews.map((r, i) => (
            <ReviewItem key={i} {...r} />
          ))}
        </div>
      </div>

      <Footer />

      {showPopup && (
        <Popup
          variant="locked"
          onClose={() => setShowPopup(false)}
          onCancel={() => setShowPopup(false)}
          onConfirm={() => navigate("/signin")}
        />
      )}
    </div>
  );
};

export default ProductDetailBeforeLogin;
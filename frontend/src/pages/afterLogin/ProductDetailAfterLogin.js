import React, { useState, useEffect } from "react";
import NavbarAfterLogin from "../../components/layout/NavbarAfterLogin";
import Footer from "../../components/layout/Footer";
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

// Format Rupiah
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
    <p className="font-bold text-[#3A5B40]">{name}</p>
    <p className="text-sm text-[#3A5B40]">{"★".repeat(rating)}</p>
    <p className="text-[#3A3A3A]">{text}</p>
  </div>
);

const ProductDetailAfterLogin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
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

  const [product, setProduct] = useState(mockProduct);

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
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
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
        setFetchError("Gagal mengambil data produk.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await API.post("/api/cart", {
        productId: product.product_id,
        quantity,
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch {
      alert("Gagal menambahkan ke keranjang");
    }
  };

  const handleBuyNow = () => {
    navigate("/checkout", {
      state: { productId: product.product_id, quantity },
    });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Memuat...</div>;
  }

  return (
    <div className="bg-[#FFFEF6] min-h-screen font-poppins flex flex-col">
      <NavbarAfterLogin />

      <div className="pt-24 max-w-[1200px] mx-auto px-4">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-xl font-bold mt-2">{formatRupiah(product.price)}</p>

        <QtyControl
          quantity={quantity}
          setQuantity={setQuantity}
          maxStock={product.stock}
        />

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleAddToCart}
            className="bg-[#3A5B40] text-white px-6 py-3 rounded-lg"
          >
            Masukkan Keranjang
          </button>

          <button
            onClick={handleBuyNow}
            className="bg-[#3A5B40] text-white px-6 py-3 rounded-lg"
          >
            Pesan Sekarang
          </button>
        </div>

        {showSuccess && (
          <div className="mt-4 text-green-600 font-semibold">
            Berhasil ditambahkan ke keranjang
          </div>
        )}

        <div className="mt-10">
          {staticReviews.map((r, i) => (
            <ReviewItem key={i} {...r} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetailAfterLogin;
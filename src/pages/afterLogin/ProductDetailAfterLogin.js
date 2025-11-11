import React, { useState } from "react";
import NavbarAfterLogin from "../../components/layout/NavbarAfterLogin";
import Footer from "../../components/layout/Footer";
import { useNavigate } from "react-router-dom";

const ProductDetailAfterLogin = () => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    alert("✅ Berhasil menambahkan ke keranjang");
  };

  const handleBuyNow = () => {
    navigate("/checkout");
  };

  return (
    <div className="bg-[#FFFEF6] min-h-screen font-poppins flex flex-col">
      <NavbarAfterLogin />

      {/* Tombol Kembali */}
      <div className="pt-24 px-8 md:px-12 lg:px-16">
        <button
          onClick={() => navigate(-1)}
          className="text-[#344E41] font-semibold hover:underline"
        >
          ← Kembali
        </button>
      </div>

      {/* DETAIL PRODUK */}
      <section className="max-w-[1350px] mx-auto bg-white rounded-xl mt-6 px-10 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-start shadow-sm">
        {/* LEFT - IMAGE */}
        <div className="flex flex-col items-center">
          <img
            src="https://via.placeholder.com/340x360?text=Beras+Rojo+Lele"
            alt="Produk"
            className="w-[340px] h-[360px] object-contain rounded-xl border border-[#E0E6D8] shadow-sm"
          />

          {/* Thumbnail */}
          <div className="flex justify-center gap-4 mt-6">
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="w-[85px] h-[85px] bg-[#B8B8B8] rounded-md flex items-center justify-center"
              >
                <div className="w-[70%] h-[2px] bg-[#999] rotate-45"></div>
                <div className="w-[70%] h-[2px] bg-[#999] -rotate-45"></div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT - INFO */}
        <div className="text-left">
          <h2 className="text-[28px] font-extrabold text-[#6D6E70] mb-3">
            BERAS ROJO LELE 5kg
          </h2>

          <div className="flex items-center gap-4 text-[#344E41] text-[14px] font-medium mb-4">
            <span>4.8 ⭐⭐⭐⭐⭐</span>
            <span>|</span>
            <span>88 Ulasan</span>
            <span>|</span>
            <span>120 Terjual</span>
          </div>

          <div className="border-2 border-[#344E41] rounded-md px-5 py-3 inline-block mb-6">
            <p className="text-[24px] font-extrabold text-[#1E1E1E]">
              Rp. 70.000
            </p>
          </div>

          <p className="text-[#5B5B5B] text-[15px] leading-relaxed mb-6 max-w-[550px]">
            Merupakan beras yang diproses dengan baik sehingga menghasilkan
            beras premium yang sangat pulen dan sehat. Beras ini sangat bersih
            dan tidak menggunakan bahan kimia berbahaya sehingga aman digunakan
            untuk kebutuhan pokok keluarga Anda.
          </p>

          <div className="flex items-center gap-3 text-[#344E41] text-[15px] font-semibold mb-8">
            <p>
              Pengiriman{" "}
              <span className="inline-flex items-center ml-1">
                🚚{" "}
                <span className="ml-1 font-medium text-[#3A5A40]">5–7 Hari</span>
              </span>
            </p>
            <div className="ml-6 flex items-center border border-[#A3C489] rounded overflow-hidden">
              <button
                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                className="px-3 py-[6px] bg-[#B8D68F] text-[#344E41] font-bold text-lg"
              >
                −
              </button>
              <span className="px-4 py-[6px] bg-white text-[#344E41] font-semibold">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-[6px] bg-[#B8D68F] text-[#344E41] font-bold text-lg"
              >
                +
              </button>
            </div>
            <p className="text-[#5B5B5B] text-sm ml-3">
              Barang Tersisa: <span className="font-semibold">20</span>
            </p>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 bg-[#3A5B40] text-white text-[15px] font-semibold px-6 py-3 rounded-md hover:bg-[#2c3d33] transition"
            >
              🛒 Masukkan Keranjang
            </button>
            <button
              onClick={handleBuyNow}
              className="flex items-center justify-center bg-[#3A5B40] text-white text-[15px] font-semibold px-6 py-3 rounded-md hover:bg-[#486947] transition"
            >
              Beli Sekarang
            </button>
          </div>
        </div>
      </section>

      {/* ✅ PENILAIAN & ULASAN */}
      <section className="max-w-[1350px] mx-auto mt-10 px-10 py-16">
        {/* Header */}
        <div className="bg-[#D9D9D9] py-3 px-8 font-semibold text-[#1E1E1E] text-[17px]">
          Penilaian & Ulasan
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 pb-12 bg-transparent">
          {/* Kiri */}
          <div>
            <p className="text-[36px] font-extrabold text-[#1E1E1E] mb-2">
              X.X/<span className="text-[24px] font-semibold">x</span>
            </p>
            <p className="text-[18px] text-[#3A5A40] mb-4 font-medium">
              ★★★★★ <span className="text-sm text-[#555]">(xx ulasan)</span>
            </p>
          </div>

          {/* Kanan */}
          <div className="flex flex-col gap-3">
            {[5, 4, 3, 2, 1].map((star) => (
              <div
                key={star}
                className="flex items-center gap-3 text-[#1E1E1E] text-sm"
              >
                <span>{"★".repeat(star)}{"☆".repeat(5 - star)}</span>
                <div className="w-full bg-gray-200 h-3 rounded-md overflow-hidden">
                  <div className="bg-[#3A5A40] h-3 rounded-md w-[60%]"></div>
                </div>
                <span>xx</span>
              </div>
            ))}
          </div>
        </div>

        {/* Header Ulasan */}
        <div className="bg-[#D9D9D9] py-3 px-8 font-semibold text-[#1E1E1E] text-[17px]">
          Ulasan Produk
        </div>

        {/* Daftar Ulasan */}
        <div className="pt-10 space-y-10">
          {[1, 2, 3].map((_, i) => (
            <div
              key={i}
              className="flex flex-col border-b border-gray-300 pb-8 last:border-b-0"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-5">
                  <div className="w-14 h-14 rounded-full bg-gray-300 shrink-0"></div>

                  <div className="flex-1">
                    <p className="font-bold text-[#1E1E1E] text-[15px]">
                      Lorem Ipsum
                    </p>
                    <p className="text-[#F5A623] text-sm mb-2">★★★★★</p>
                    <p className="text-[#3A3A3A] text-[14px] leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[#4B4B4B] text-xl ml-4">
                  <button>👍</button>
                  <button>👎</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Garis Pembatas */}
        <div className="border-t border-[#CFCFCF] mt-12"></div>
      </section>

      {/* ✅ LANGKAH BELANJA - gradient update */}
      <section className="bg-transparent w-full pb-24 pt-10">
        <div className="max-w-[1350px] mx-auto px-10 text-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 mt-10">
            {[
              { label: "Pilih Produk" },
              { label: "Masukkan Keranjang" },
              { label: "Melakukan Pembayaran" },
              { label: "Menunggu Pesanan" },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className="w-[90px] h-[90px] rounded-xl flex items-center justify-center shadow"
                  style={{
                    background:
                      "linear-gradient(180deg, #B8D68F 14%, #61704B 100%)",
                  }}
                >
                  <img
                    src="https://via.placeholder.com/50"
                    alt="icon"
                    className="object-contain w-[45px]"
                  />
                </div>
                <p className="text-[#344E41] font-semibold text-[15px] leading-tight mt-4">
                  {step.label.split(" ")[0]} <br />{" "}
                  {step.label.split(" ")[1] ?? ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetailAfterLogin;
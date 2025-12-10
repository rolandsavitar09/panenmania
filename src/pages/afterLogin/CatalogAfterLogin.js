// src/pages/afterLogin/CatalogAfterLogin.js
import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import NavbarAfterLogin from "../../components/layout/NavbarAfterLogin";
import Footer from "../../components/layout/Footer";

// Banner katalog
import CatalogBanner from "../../assets/images/banners/petani katalog.svg";
// Ikon pencarian
import IconSearch from "../../assets/images/icons/pencarian.svg";

// Opsi kategori (sinkron dengan query string)
const CATEGORY_OPTIONS = [
  { label: "Semua Kategori", value: "all" },
  { label: "Buah", value: "buah" },
  { label: "Sayur", value: "sayur" },
  { label: "Beras", value: "beras" },
];

// Data dummy produk
const PRODUCTS = [
  {
    name: "Semangka Merah Manis",
    description: "Buah segar langsung dari kebun petani lokal.",
    price: "Rp 25.000",
    image: "https://via.placeholder.com/260x160?text=Buah",
    category: "Buah",
  },
  {
    name: "Pisang Cavendish 1kg",
    description: "Pisang berkualitas, matang merata dan manis.",
    price: "Rp 22.000",
    image: "https://via.placeholder.com/260x160?text=Buah",
    category: "Buah",
  },
  {
    name: "Apel Malang 1kg",
    description: "Apel renyah dengan rasa manis sedikit asam.",
    price: "Rp 30.000",
    image: "https://via.placeholder.com/260x160?text=Buah",
    category: "Buah",
  },
  {
    name: "Bayam Hijau 250g",
    description: "Sayur hijau segar kaya akan zat besi.",
    price: "Rp 6.000",
    image: "https://via.placeholder.com/260x160?text=Sayur",
    category: "Sayur",
  },
  {
    name: "Wortel Fresh 500g",
    description: "Wortel oranye cerah dengan tekstur renyah.",
    price: "Rp 9.000",
    image: "https://via.placeholder.com/260x160?text=Sayur",
    category: "Sayur",
  },
  {
    name: "Brokoli Organik 300g",
    description: "Brokoli segar ditanam tanpa pestisida berbahaya.",
    price: "Rp 15.000",
    image: "https://via.placeholder.com/260x160?text=Sayur",
    category: "Sayur",
  },
  {
    name: "Beras Lele 5kg",
    description: "Beras pulen untuk kebutuhan keluarga sehari-hari.",
    price: "Rp 70.000",
    image: "https://via.placeholder.com/260x160?text=Beras",
    category: "Beras",
  },
  {
    name: "Beras Pandan Wangi 5kg",
    description: "Aroma wangi, tekstur pulen dan lembut.",
    price: "Rp 80.000",
    image: "https://via.placeholder.com/260x160?text=Beras",
    category: "Beras",
  },
  {
    name: "Beras Merah 2kg",
    description: "Pilihan lebih sehat dengan serat lebih tinggi.",
    price: "Rp 45.000",
    image: "https://via.placeholder.com/260x160?text=Beras",
    category: "Beras",
  },
  {
    name: "Tomat Merah 500g",
    description: "Tomat segar cocok untuk sambal dan masakan.",
    price: "Rp 8.000",
    image: "https://via.placeholder.com/260x160?text=Sayur",
    category: "Sayur",
  },
  {
    name: "Jeruk Manis 1kg",
    description: "Jeruk segar dengan rasa manis dan banyak air.",
    price: "Rp 24.000",
    image: "https://via.placeholder.com/260x160?text=Buah",
    category: "Buah",
  },
  {
    name: "Beras Hitam 1kg",
    description: "Beras tinggi antioksidan, cocok untuk diet sehat.",
    price: "Rp 35.000",
    image: "https://via.placeholder.com/260x160?text=Beras",
    category: "Beras",
  },
];

function CatalogAfterLogin() {
  const location = useLocation();

  // State kategori dan kata kunci pencarian
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Handler submit pencarian (tanpa reload halaman)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  // Membaca query string dari URL setiap kali berubah
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    const searchParam = params.get("search");

    const allowed = ["all", "buah", "sayur", "beras"];

    // Normalisasi kategori dari query string
    if (categoryParam) {
      const normalized = categoryParam.toLowerCase();
      if (allowed.includes(normalized)) {
        setSelectedCategory(normalized);
      }
    } else {
      setSelectedCategory("all");
    }

    // Set nilai pencarian dari query string
    if (searchParam && searchParam.trim().length > 0) {
      setSearchQuery(searchParam);
    } else {
      setSearchQuery("");
    }
  }, [location.search]);

  // Filter produk berdasarkan kategori dan teks pencarian
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      const productCategory = item.category.toLowerCase();
      const matchCategory =
        selectedCategory === "all" || productCategory === selectedCategory;

      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchCategory;

      const matchText =
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);

      return matchCategory && matchText;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="font-poppins bg-[#F8FAF7] min-h-screen flex flex-col pt-14 sm:pt-16">
      {/* Navbar setelah login */}
      <NavbarAfterLogin />

      {/* Banner katalog */}
      <section className="w-full relative">
        <img
          src={CatalogBanner}
          alt="Banner katalog"
          className="w-full h-[220px] sm:h-[260px] md:h-[320px] lg:h-[380px] object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full h-20 sm:h-24 bg-gradient-to-b from-transparent to-[#F8FAF7]" />
      </section>

      {/* Input pencarian */}
      <section className="flex justify-center items-center py-6 md:py-8">
        <form
          onSubmit={handleSearchSubmit}
          className="w-full flex justify-center"
        >
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
              <img
                src={IconSearch}
                alt="Cari"
                className="w-5 h-5 object-contain"
              />
            </button>
          </div>
        </form>
      </section>

      {/* Judul + Dropdown kategori (sejajar horizontal) */}
      <section className="w-full px-6 lg:px-16 mb-4 flex items-center justify-between gap-3">
        {/* Judul katalog */}
        <h2 className="text-[#344E41] text-[18px] sm:text-[20px] font-semibold flex-1">
          Semua Produk
        </h2>

        {/* Dropdown kategori */}
        <div className="w-auto min-w-[160px] sm:min-w-[190px]">
          <label htmlFor="kategori" className="sr-only">
            Kategori
          </label>
          <div className="relative inline-block w-full max-w-[210px]">
            <select
              id="kategori"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none bg-[#588157]/75 text-white text-sm font-medium rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#588157]"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className="bg-white text-[#3A5A40]"
                >
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Ikon panah dropdown */}
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white/90">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
        </div>
      </section>

      {/* Grid produk (2 kolom di mobile, layout card sama dengan HomeContent) */}
      <section className="w-full bg-[#F8FAF7] pb-14 md:pb-16">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-8 gap-x-4 md:gap-y-12 md:gap-x-8 items-stretch">
            {filteredProducts.map((product, index) => (
              <Link key={index} to={`/product/${index}`}>
                {/* Card produk: pola sama dengan HomeContent (flex, h-full, clamp) */}
                <div className="bg-white rounded-3xl shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E0E6D8] hover:shadow-xl transition-all duration-200 cursor-pointer w-full max-w-[310px] mx-auto h-full flex flex-col">
                  {/* Gambar produk */}
                  <div className="w-full bg-[#F4F8F1] rounded-t-3xl p-4 sm:p-6 h-[150px] sm:h-[190px] flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full object-contain"
                    />
                  </div>

                  {/* Detail produk */}
                  <div className="p-4 sm:p-6 flex flex-col flex-1">
                    <h3 className="text-[#344E41] font-bold text-[14px] sm:text-[16px] mb-1 line-clamp-2">
                      {product.name}
                    </h3>

                    <p className="text-[#3A5A40] text-[11px] sm:text-[13px] mb-3 sm:mb-4 leading-relaxed line-clamp-2">
                      {product.description}
                    </p>

                    <p className="mt-auto text-[#344E41] font-bold text-[14px] sm:text-[16px]">
                      {product.price}
                    </p>
                  </div>
                </div>
              </Link>
            ))}

            {/* Pesan jika produk kosong */}
            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center text-sm text-[#3A5A40]/70 mt-6">
                Belum ada produk yang cocok dengan pencarian atau kategori ini.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default CatalogAfterLogin;
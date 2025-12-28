// src/pages/afterLogin/CatalogAfterLogin.js
import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import NavbarAfterLogin from "../../components/layout/NavbarAfterLogin";
import Footer from "../../components/layout/Footer";

// Banner katalog
import CatalogBanner from "../../assets/images/banners/petani katalog.svg";
// Ikon pencarian
import IconSearch from "../../assets/images/icons/pencarian.svg";

// URL API Produk (Sama dengan before login)
const API_PRODUCT_URL = "http://localhost:5000/api/products";

// Opsi kategori (sinkron dengan query string)
const CATEGORY_OPTIONS = [
  { label: "Semua Kategori", value: "all" },
  { label: "Buah", value: "buah" },
  { label: "Sayur", value: "sayur" },
  { label: "Beras", value: "beras" },
];

// Helper untuk format harga (Rupiah)
const formatRupiah = (number) => {
  if (number === null || number === undefined || Number.isNaN(Number(number))) {
    return "-";
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(number));
};

// Utility: ekstrak / normalisasi nilai price dari API
const parsePrice = (price) => {
  if (price === null || price === undefined) return null;
  if (typeof price === "number") return price;
  if (typeof price === "string") {
    // Hapus semua kecuali digit dan titik/koma
    const cleaned = price.replace(/[^0-9.,]/g, "");
    // Ganti koma dengan titik bila ada (asumsi decimal)
    const normalized = cleaned.replace(/,/g, ".");
    const parsed = parseFloat(normalized);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
};

function CatalogAfterLogin() {
  const location = useLocation();

  // State untuk data produk dari API
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State kategori dan kata kunci pencarian
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Effect untuk Fetch Data Produk saat mount
  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_PRODUCT_URL);
        const data = await response.json();

        if (!response.ok) {
          const msg = data?.message || `Gagal memuat produk (status ${response.status})`;
          throw new Error(msg);
        }

        // Normalisasi struktur response menjadi array produk
        const rawItems = Array.isArray(data?.products)
          ? data.products
          : Array.isArray(data)
          ? data
          : data?.data || [];

        const items = rawItems.map((p, idx) => {
          const image =
            p.image ||
            p.imageUrl ||
            p.photo_url ||
            p.photoUrl ||
            p.img ||
            p.image_url ||
            p.thumbnail ||
            p.picture ||
            "";
          const id = p.product_id || p.id || p.productId || idx;
          const name = p.name || p.title || p.product_name || "Produk";
          const description = p.description || p.desc || "";
          const priceParsed = parsePrice(p.price ?? p.harga ?? p.price_in_rupiah);
          const category = (p.category || p.kategori || p.type || "").toString() || "lainnya";
          const unit = p.unit || p.satuan || "";

          return {
            product_id: id,
            name,
            description,
            price: priceParsed,
            rawPrice: p.price,
            image,
            category,
            unit,
          };
        });

        if (mounted) setProducts(items);
      } catch (err) {
        console.error("Fetch Error:", err);
        if (mounted) setError(err.message || "Gagal terhubung ke server backend.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      mounted = false;
    };
  }, []); // Hanya saat mount

  // Handler submit pencarian (tanpa reload)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  // Membaca query string dari URL setiap kali berubah
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    const searchParam = params.get("search");

    const allowed = ["all", "buah", "sayur", "beras"];

    if (categoryParam) {
      const normalized = categoryParam.toLowerCase();
      if (allowed.includes(normalized)) {
        setSelectedCategory(normalized);
      }
    } else {
      setSelectedCategory("all");
    }

    if (searchParam && searchParam.trim().length > 0) {
      setSearchQuery(searchParam);
    } else {
      setSearchQuery("");
    }
  }, [location.search]);

  // Filter produk berdasarkan kategori dan teks pencarian
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const productCategory = (item.category || "").toString().toLowerCase();
      const matchCategory = selectedCategory === "all" || productCategory === selectedCategory;

      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchCategory;

      const matchText =
        (item.name || "").toLowerCase().includes(q) || (item.description || "").toLowerCase().includes(q);

      return matchCategory && matchText;
    });
  }, [selectedCategory, searchQuery, products]);

  return (
    <div className="font-poppins bg-[#F8FAF7] min-h-screen flex flex-col pt-14 sm:pt-16">
      {/* Navbar setelah login */}
      <NavbarAfterLogin />

      {/* Banner katalog */}
      <section className="w-full relative -mt-6">
        <img src={CatalogBanner} alt="Banner katalog" className="w-full h-[220px] sm:h-[260px] md:h-[320px] lg:h-[380px] object-cover" />
        <div className="absolute bottom-0 left-0 w-full h-20 sm:h-24 bg-gradient-to-b from-transparent to-[#F8FAF7]" />
      </section>

      {/* Input pencarian */}
      <section className="flex justify-center items-center py-6 md:py-8">
        <form onSubmit={handleSearchSubmit} className="w-full flex justify-center">
          <div className="relative w-full max-w-[520px] min-w-[260px]">
            <input
              type="text"
              placeholder="Cari produk segar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-2 border-[#588157] rounded-full px-6 py-2.5 sm:py-3 pr-11 focus:outline-none bg-transparent text-sm sm:text-base"
            />
            <button type="submit" className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 flex items-center justify-center" aria-label="Cari produk">
              <img src={IconSearch} alt="Cari" className="w-5 h-5 object-contain" />
            </button>
          </div>
        </form>
      </section>

      {/* Judul + Dropdown kategori (sejajar horizontal) */}
      <section className="w-full px-6 lg:px-16 mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[#344E41] text-[18px] sm:text-[20px] font-semibold flex-1">Semua Produk</h2>

        <div className="w-auto min-w-[160px] sm:min-w-[190px]">
          <label htmlFor="kategori" className="sr-only">Kategori</label>
          <div className="relative inline-block w-full max-w-[210px]">
            <select
              id="kategori"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none bg-[#588157]/75 text-white text-sm font-medium rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#588157]"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-white text-[#3A5A40]">
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Ikon panah dropdown */}
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white/90">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
        </div>
      </section>

      {/* Grid produk (2 kolom di mobile, layout card sama dengan HomeContent) */}
      <section className="w-full bg-[#F8FAF7] pb-14 md:pb-16">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-10">
          {/* Loading dan Error State */}
          {loading && <div className="col-span-full text-center text-sm text-[#3A5A40] py-10">Memuat produk...</div>}

          {error && <div className="col-span-full text-center text-sm text-red-600 py-10">Error: {error}</div>}

          {/* Tampilkan Grid hanya jika tidak loading dan tidak error */}
          {!loading && !error && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-8 gap-x-4 md:gap-y-12 md:gap-x-8 items-stretch">
              {filteredProducts.map((product, index) => (
                <Link key={product.product_id ?? index} to={`/product/${product.product_id ?? index}`}>
                  {/* Card produk: pola sama dengan HomeContent (flex, h-full, clamp) */}
                  <div className="bg-white rounded-3xl shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E0E6D8] hover:shadow-xl transition-all duration-200 cursor-pointer w-full max-w-[310px] mx-auto h-full flex flex-col">
                    {/* Gambar produk */}
                    <div className="w-full bg-[#F4F8F1] rounded-t-3xl p-4 sm:p-6 h-[150px] sm:h-[190px] flex items-center justify-center">
                      <img src={product.image || "/images/placeholder-product.png"} alt={product.name} className="h-full object-contain" />
                    </div>

                    {/* Detail produk */}
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
              ))}

              {/* Pesan jika produk kosong */}
              {filteredProducts.length === 0 && (
                <div className="col-span-full text-center text-sm text-[#3A5A40]/70 mt-6">Belum ada produk yang cocok dengan pencarian atau kategori ini.</div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default CatalogAfterLogin;
// src/pages/beforeLogin/CatalogBeforeLogin.js
import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import NavbarBeforeLogin from "../../components/layout/NavbarBeforeLogin";
import Footer from "../../components/layout/Footer";
import API from "../../api/api";

// Banner gambar katalog
import CatalogBanner from "../../assets/images/banners/petani katalog.svg";
// Ikon search
import IconSearch from "../../assets/images/icons/pencarian.svg";

// Opsi kategori
const CATEGORY_OPTIONS = [
  { label: "Semua Kategori", value: "all" },
  { label: "Buah", value: "buah" },
  { label: "Sayur", value: "sayur" },
  { label: "Beras", value: "beras" },
];

// Helper format Rupiah
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

function CatalogBeforeLogin() {
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // ======================
  // FETCH PRODUCTS (FIXED)
  // ======================
  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await API.get("/api/products");
        const data = res.data;

        const rawItems = Array.isArray(data?.products)
          ? data.products
          : Array.isArray(data)
          ? data
          : data?.data || [];

        const items = rawItems.map((p) => ({
          product_id: p.product_id,
          name: p.name,
          description: p.description,
          price: Number(p.price),
          rawPrice: p.price,
          image: p.image_url,
          category: p.category,
          unit: p.unit,
        }));

        if (mounted) setProducts(items);
      } catch (err) {
        console.error("Fetch Error:", err);
        if (mounted) {
          setError(err.response?.data?.message || "Gagal memuat produk.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      mounted = false;
    };
  }, []);

  // Submit search (tanpa reload)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  // Sync query string
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    const searchParam = params.get("search");

    const allowed = ["all", "buah", "sayur", "beras"];

    if (categoryParam && allowed.includes(categoryParam.toLowerCase())) {
      setSelectedCategory(categoryParam.toLowerCase());
    } else {
      setSelectedCategory("all");
    }

    if (searchParam && searchParam.trim()) {
      setSearchQuery(searchParam);
    } else {
      setSearchQuery("");
    }
  }, [location.search]);

  // Filter produk
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const cat = (item.category || "").toLowerCase();
      const matchCategory = selectedCategory === "all" || cat === selectedCategory;

      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchCategory;

      const matchText =
        (item.name || "").toLowerCase().includes(q) ||
        (item.description || "").toLowerCase().includes(q);

      return matchCategory && matchText;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="font-poppins bg-[#F8FAF7] min-h-screen flex flex-col pt-14 sm:pt-16">
      <NavbarBeforeLogin />

      <section className="w-full relative -mt-6">
        <img src={CatalogBanner} alt="Banner katalog" className="w-full h-[220px] sm:h-[260px] md:h-[320px] lg:h-[380px] object-cover" />
        <div className="absolute bottom-0 left-0 w-full h-20 sm:h-24 bg-gradient-to-b from-transparent to-[#F8FAF7]" />
      </section>

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
            <button type="submit" className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2">
              <img src={IconSearch} alt="Cari" className="w-5 h-5" />
            </button>
          </div>
        </form>
      </section>

      <section className="w-full bg-[#F8FAF7] pb-14 md:pb-16">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-10">
          {loading && <div className="text-center py-10">Memuat produk...</div>}
          {error && <div className="text-center text-red-600 py-10">Error: {error}</div>}

          {!loading && !error && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product, idx) => (
                <Link key={product.product_id ?? idx} to={`/product-before/${product.product_id ?? idx}`}>
                  <div className="bg-white rounded-3xl shadow border flex flex-col h-full">
                    <div className="bg-[#F4F8F1] p-6 h-[180px] flex justify-center">
                      <img src={product.image || "/images/placeholder-product.png"} alt={product.name} className="h-full object-contain" />
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-bold">{product.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                      <p className="mt-auto font-bold">
                        {product.price ? formatRupiah(product.price) : "-"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}

              {filteredProducts.length === 0 && (
                <div className="col-span-full text-center text-sm text-gray-500">
                  Belum ada produk yang cocok.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default CatalogBeforeLogin;
import React from "react";
import { Link } from "react-router-dom";
import NavbarBeforeLogin from "../../components/layout/NavbarBeforeLogin";
import Footer from "../../components/layout/Footer";

function CatalogBeforeLogin() {
  const products = Array(12).fill({
    name: "Beras Lele 5kg",
    description: "LAHAP LELE BERAS PUNEL & PUTIH ALAMI PREMIUM 5kg",
    price: "Rp70.000.00",
    image: "https://via.placeholder.com/260x160?text=Produk",
  });

  return (
    <div className="font-poppins bg-[#F8FAF7] min-h-screen flex flex-col">
      <NavbarBeforeLogin />

      {/* ✅ Banner Placeholder */}
      <section className="w-full h-64 bg-gray-200 flex items-center justify-center mt-20">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
        </div>
      </section>

      {/* ✅ Search Bar */}
      <section className="flex justify-center my-10">
        <div className="flex items-center w-[600px] bg-white shadow-md rounded-full px-4 py-2">
          <input
            type="text"
            placeholder="Cari produk segar..."
            className="w-full focus:outline-none text-gray-700"
          />
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.82 4.82a1 1 0 01-1.42 1.42l-4.82-4.82A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </section>

      {/* ✅ Kategori Title */}
      <section className="w-full px-16 mb-8 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-[#344E41] text-[17px] font-semibold tracking-wide">
            ▶ <span className="ml-1">Kategori</span>
          </span>
        </div>
        <a
          href="#"
          className="text-[#3A5A40] text-sm font-medium hover:underline"
        >
          Semua Produk
        </a>
      </section>

      {/* ✅ GRID PRODUK — Sama persis HomeContent */}
      <section className="w-full bg-[#F8FAF7] py-16">
        <div className="max-w-[1380px] mx-auto px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-12 gap-x-8">
            {products.map((product, index) => (
              <Link key={index} to={`/product-before/${index}`}>
                <div className="bg-white rounded-3xl shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E0E6D8] hover:shadow-xl transition-all duration-200 cursor-pointer w-full max-w-[310px] mx-auto">
                  
                  {/* IMAGE */}
                  <div className="w-full bg-[#F4F8F1] rounded-t-3xl p-6 h-[200px] flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full object-contain"
                    />
                  </div>

                  {/* TEXT */}
                  <div className="p-6">
                    <h3 className="text-[#344E41] font-bold text-[17px] mb-2">
                      {product.name}
                    </h3>

                    <p className="text-[#3A5A40] text-[13px] mb-4 leading-relaxed">
                      {product.description}
                    </p>

                    <p className="text-[#344E41] font-bold text-[16px]">
                      {product.price}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default CatalogBeforeLogin;
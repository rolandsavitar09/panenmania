// src/components/layout/NavbarBeforeLogin.js
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import LogoPanen from "../../assets/images/icons/logo panenmania.svg";
import RegisterIcon from "../../assets/images/icons/register.svg";

const NavbarBeforeLogin = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) =>
    location.pathname === path
      ? "font-semibold text-white"
      : "text-white/80 hover:text-white";

  return (
    <>
      {/* Inline CSS kecil biar langsung kebaca tanpa edit global */}
      <style>{`
        /* transisi halus untuk ikon dan teks */
        .register-btn img.register-icon {
          transition: filter .12s ease, transform .12s ease, opacity .12s ease;
          -webkit-transition: filter .12s ease, transform .12s ease, opacity .12s ease;
          filter: none; /* default: tampil normal */
        }

        /* Saat hover / focus tombol: bg putih, teks hijau, icon diubah jadi gelap */
        .register-btn:hover,
        .register-btn:focus {
          background: white !important;
          color: #344E41 !important;
        }

        .register-btn:hover img.register-icon,
        .register-btn:focus img.register-icon {
          /* ubah ikon jadi gelap ketika tombol putih */
          filter: invert(1) brightness(0);
          -webkit-filter: invert(1) brightness(0);
        }

        /* Pastikan ikon tidak tersembunyi karena opacity default */
        .register-btn img.register-icon {
          opacity: 1;
        }
      `}</style>

      <nav className="w-full bg-[#344E41] fixed top-0 left-0 z-50 font-poppins shadow-md">
        <div className="max-w-[1400px] mx-auto px-4 md:px-10 h-14 grid grid-cols-3 items-center">
          {/* LEFT logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={LogoPanen}
              alt="PanenMania"
              className="w-8 h-8 object-contain"
            />
            <span className="text-white font-semibold text-lg leading-none">
              PanenMania
            </span>
          </Link>

          {/* CENTER menu desktop */}
          <div className="hidden md:flex gap-8 text-sm items-center justify-center">
            <Link to="/" className={isActive("/")}>
              Beranda
            </Link>
            <Link to="/catalog" className={isActive("/catalog")}>
              Katalog
            </Link>
            <Link to="/about" className={isActive("/about")}>
              Tentang Kami
            </Link>
            <Link to="/contact" className={isActive("/contact")}>
              Kontak
            </Link>
          </div>

          {/* RIGHT register button + mobile toggle */}
          <div className="flex items-center justify-end gap-3">
            <Link
              to="/signup"
              className="register-btn hidden md:inline-flex items-center gap-2 border border-white text-white px-4 h-9 rounded-[10px] font-medium hover:bg-white hover:text-[#344E41] transition"
              aria-label="Daftar Akun"
            >
              <img
                src={RegisterIcon}
                alt="register"
                className="w-5 h-5 object-contain register-icon"
              />
              <span className="leading-none">Daftar Akun</span>
            </Link>

            <button
              onClick={() => setMobileOpen((s) => !s)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white/90 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor">
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* mobile menu */}
        <div
          className={`md:hidden bg-[#344E41] transition-maxh duration-200 overflow-hidden ${
            mobileOpen ? "max-h-[240px]" : "max-h-0"
          }`}
        >
          <div className="px-4 pb-4 pt-2 flex flex-col gap-2">
            <Link to="/" className={`${isActive("/")} block py-2`} onClick={() => setMobileOpen(false)}>Beranda</Link>
            <Link to="/catalog" className={`${isActive("/catalog")} block py-2`} onClick={() => setMobileOpen(false)}>Katalog</Link>
            <Link to="/about" className={`${isActive("/about")} block py-2`} onClick={() => setMobileOpen(false)}>Tentang Kami</Link>
            <Link to="/contact" className={`${isActive("/contact")} block py-2`} onClick={() => setMobileOpen(false)}>Kontak</Link>

            {/* tombol daftar di mobile */}
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 border border-white text-white px-4 py-2 rounded-[10px] font-medium mt-2"
              onClick={() => setMobileOpen(false)}
            >
              <img src={RegisterIcon} alt="register" className="w-5 h-5 object-contain" />
              <span>Daftar Akun</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavbarBeforeLogin;
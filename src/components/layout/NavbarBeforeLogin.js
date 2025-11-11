import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavbarBeforeLogin = () => {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "font-semibold text-white"
      : "text-white/80 hover:text-white";

  return (
    <nav className="w-full bg-[#344E41] px-10 py-3 flex justify-between items-center fixed top-0 left-0 z-50 shadow-md font-poppins">
      
      {/* ✅ LOGO - redirect ke Beranda sebelum login */}
      <Link to="/" className="flex items-center gap-2">
        <img
          src="https://via.placeholder.com/30x30"
          alt="logo"
          className="w-8 h-8"
        />
        <span className="text-white font-semibold text-lg">PanenMania</span>
      </Link>

      {/* ✅ NAV MENU sebelum login */}
      <div className="flex gap-8 text-sm">
        <Link to="/" className={isActive("/")}>Beranda</Link>
        <Link to="/catalog" className={isActive("/catalog")}>Katalog</Link>
        <Link to="/about" className={isActive("/about")}>Tentang Kami</Link>
        <Link to="/contact" className={isActive("/contact")}>Kontak</Link>
      </div>

      {/* ✅ Button ke halaman SignIn */}
      <Link
        to="/signin"
        className="bg-white text-[#344E41] px-4 py-2 rounded-lg font-medium hover:bg-[#BBD58E] transition"
      >
        Daftar/Masuk
      </Link>
    </nav>
  );
};

export default NavbarBeforeLogin;
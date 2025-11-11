import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingCartIcon,
  BellIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const NavbarAfterLogin = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // ✅ Jika tidak ada token → gunakan versi sebelum login
  const homePath = token ? "/home" : "/";
  const catalogPath = token ? "/catalog/login" : "/catalog";
  const aboutPath = token ? "/about/login" : "/about";
  const contactPath = token ? "/contact/login" : "/contact";

  const isActive = (path) =>
    location.pathname === path
      ? "font-semibold text-white"
      : "text-white/80 hover:text-white";

  return (
    <nav className="w-full bg-[#344E41] px-10 py-3 flex justify-between items-center fixed top-0 left-0 z-50 shadow-md font-poppins">
      
      {/* ✅ Logo ikut status login */}
      <Link to={homePath} className="flex items-center gap-2">
        <img
          src="https://via.placeholder.com/30x30"
          alt="logo"
          className="w-8 h-8"
        />
        <span className="text-white font-semibold text-lg">PanenMania</span>
      </Link>

      <div className="flex gap-8 text-sm">
        <Link to={homePath} className={isActive(homePath)}>Beranda</Link>
        <Link to={catalogPath} className={isActive(catalogPath)}>Katalog</Link>
        <Link to={aboutPath} className={isActive(aboutPath)}>Tentang Kami</Link>
        <Link to={contactPath} className={isActive(contactPath)}>Kontak</Link>
      </div>

      {/* ✅ IKON HANYA MUNCUL JIKA LOGIN */}
      {token && (
        <div className="flex gap-4 items-center">
          <Link to="/cart">
            <ShoppingCartIcon className="w-6 h-6 text-white hover:opacity-80 cursor-pointer" />
          </Link>
          <Link to="/notifications">
            <BellIcon className="w-6 h-6 text-white hover:opacity-80 cursor-pointer" />
          </Link>
          <Link to="/profile">
            <UserCircleIcon className="w-7 h-7 text-white hover:opacity-80 cursor-pointer" />
          </Link>
        </div>
      )}
    </nav>
  );
};

export default NavbarAfterLogin;
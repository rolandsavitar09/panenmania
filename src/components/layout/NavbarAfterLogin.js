// src/components/layout/NavbarAfterLogin.js
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import LogoPanen from "../../assets/images/icons/logo panenmania.svg";
import IconAkun from "../../assets/images/icons/akun.svg";
import IconCart from "../../assets/images/icons/cart.svg";
import IconNotif from "../../assets/images/icons/notifikasi.svg";

const NavbarAfterLogin = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const homePath = token ? "/home" : "/";
  const catalogPath = token ? "/catalog/login" : "/catalog";
  const aboutPath = token ? "/about/login" : "/about";
  const contactPath = token ? "/contact/login" : "/contact";

  const isActive = (path) =>
    location.pathname === path
      ? "font-semibold text-white"
      : "text-white/80 hover:text-white";

  return (
    <nav className="w-full bg-[#344E41] fixed top-0 left-0 z-50 font-poppins shadow-md">
      {/* WRAPPER GRID 3 KOLOM */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-10 h-14 grid grid-cols-3 items-center">
        
        {/* LEFT: LOGO */}
        <Link to={homePath} className="flex items-center gap-2">
          <img src={LogoPanen} alt="PanenMania" className="w-8 h-8" />
          <span className="text-white font-semibold text-lg leading-none">
            PanenMania
          </span>
        </Link>

        {/* CENTER: MENU (DESKTOP) */}
        <div className="hidden md:flex justify-center gap-8 text-sm items-center">
          <Link to={homePath} className={isActive(homePath)}>Beranda</Link>
          <Link to={catalogPath} className={isActive(catalogPath)}>Katalog</Link>
          <Link to={aboutPath} className={isActive(aboutPath)}>Tentang Kami</Link>
          <Link to={contactPath} className={isActive(contactPath)}>Kontak</Link>
        </div>

        {/* RIGHT: ICONS + TOGGLE */}
        <div className="flex justify-end items-center gap-4">
          {token && (
            <div className="hidden md:flex gap-4 items-center">
              <Link to="/cart" aria-label="Cart"><img src={IconCart} alt="cart" className="w-6 h-6" /></Link>
              <Link to="/notifications" aria-label="Notifikasi"><img src={IconNotif} alt="notifikasi" className="w-6 h-6" /></Link>
              <Link to="/profile" aria-label="Akun"><img src={IconAkun} alt="akun" className="w-7 h-7" /></Link>
            </div>
          )}

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-white/90 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div className={`md:hidden bg-[#344E41] overflow-hidden transition-all duration-200 ${mobileOpen ? "max-h-[340px]" : "max-h-0"}`}>
        <div className="px-4 pb-4 pt-2 flex flex-col gap-2">
          <Link to={homePath} className={`${isActive(homePath)} py-2`} onClick={() => setMobileOpen(false)}>Beranda</Link>
          <Link to={catalogPath} className={`${isActive(catalogPath)} py-2`} onClick={() => setMobileOpen(false)}>Katalog</Link>
          <Link to={aboutPath} className={`${isActive(aboutPath)} py-2`} onClick={() => setMobileOpen(false)}>Tentang Kami</Link>
          <Link to={contactPath} className={`${isActive(contactPath)} py-2`} onClick={() => setMobileOpen(false)}>Kontak</Link>

          {token && (
            <div className="flex gap-4 pt-2 mt-2 border-t border-white/10">
              <Link to="/cart"><img src={IconCart} alt="cart" className="w-6 h-6" /></Link>
              <Link to="/notifications"><img src={IconNotif} alt="notifikasi" className="w-6 h-6" /></Link>
              <Link to="/profile"><img src={IconAkun} alt="akun" className="w-7 h-7" /></Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavbarAfterLogin;

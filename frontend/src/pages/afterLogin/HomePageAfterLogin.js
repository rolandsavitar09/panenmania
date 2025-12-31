// src/pages/afterLogin/HomePageAfterLogin.js
import React from "react";
import NavbarAfterLogin from "../../components/layout/NavbarAfterLogin";
import Footer from "../../components/layout/Footer";
import HomeContent from "../../components/home/HomeContent";

const HomePageAfterLogin = () => {
  return (
    // padding-top disesuaikan dengan navbar fixed
    <div className="bg-[#FFFEF6] min-h-screen font-poppins flex flex-col pt-16 md:pt-20">
      
      {/* Navbar */}
      <NavbarAfterLogin />

      {/* Konten Home (versi login) */}
      <HomeContent isLoggedIn={true} />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePageAfterLogin;
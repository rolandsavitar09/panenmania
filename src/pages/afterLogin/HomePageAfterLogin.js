import React from "react";
import NavbarAfterLogin from "../../components/layout/NavbarAfterLogin";
import Footer from "../../components/layout/Footer";
import HomeContent from "../../components/home/HomeContent";

const HomePageAfterLogin = () => {
  return (
    <div className="font-poppins">
      <NavbarAfterLogin />
      <div className="pt-20">
        <HomeContent isLoggedIn={true} /> {/* ✅ Tambahan penting */}
      </div>
      <Footer />
    </div>
  );
};

export default HomePageAfterLogin;
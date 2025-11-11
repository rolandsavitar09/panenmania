import React from "react";
import NavbarBeforeLogin from "../../components/layout/NavbarBeforeLogin";
import Footer from "../../components/layout/Footer";
import HomeContent from "../../components/home/HomeContent";

const HomePageBeforeLogin = () => {
  return (
    <div className="font-poppins">
      <NavbarBeforeLogin />
      <div className="pt-20">
        <HomeContent />
      </div>
      <Footer />
    </div>
  );
};

export default HomePageBeforeLogin;
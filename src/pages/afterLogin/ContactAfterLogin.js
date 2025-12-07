// src/pages/afterLogin/ContactAfterLogin.js
import React, { useState } from "react";
import NavbarAfterLogin from "../../components/layout/NavbarAfterLogin";
import Footer from "../../components/layout/Footer";
import Popup from "../../components/common/Popup";

// IMAGE
import PetaniKontakBanner from "../../assets/images/banners/petani kontak.svg";

const ContactAfterLogin = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // logika after login: langsung kirim & tampilkan popup sukses
    setShowPopup(true);
  };

  const closePopup = () => setShowPopup(false);

  return (
    <div className="bg-[#F6F7F0] min-h-screen flex flex-col font-poppins text-[#344E41]">
      <NavbarAfterLogin />

      <section className="flex-1 w-full px-6 sm:px-10 lg:px-24 pt-16 pb-10 lg:pt-36 lg:pb-16">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-10">
          Hubungi Kami!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Form (sama persis dengan before login) */}
          <form onSubmit={handleSubmit} className="w-full space-y-5">
            <div>
              <label className="text-sm mb-1 block">Nama Lengkap</label>
              <input
                type="text"
                className="w-full bg-white py-3 px-4 rounded-[10px] mt-1 outline-none shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
                required
              />
            </div>

            <div>
              <label className="text-sm mb-1 block">Email</label>
              <input
                type="email"
                className="w-full bg-white py-3 px-4 rounded-[10px] mt-1 outline-none shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
                required
              />
            </div>

            <div>
              <label className="text-sm mb-1 block">Pesan</label>
              <textarea
                rows="5"
                className="w-full bg-white py-3 px-4 rounded-[10px] mt-1 outline-none resize-none shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-[#344E41] text-white font-semibold text-center py-3 rounded-[10px] hover:bg-[#2b3f35] transition"
            >
              Kirim Pesan
            </button>
          </form>

          {/* Image (sama persis dengan before login) */}
          <div className="flex justify-center md:justify-end">
            <img
              src={PetaniKontakBanner}
              alt="Ilustrasi petani PanenMania"
              className="w-full max-w-md lg:max-w-lg object-contain"
            />
          </div>
        </div>
      </section>

      <Footer />

      {showPopup && (
        <Popup onClose={closePopup}>
          <div className="text-center px-4 py-6 font-poppins">
            <h3 className="text-lg font-bold mb-3 text-[#344E41]">
              Terima Kasih Telah Menghubungi Kami!
            </h3>
            <p className="text-sm text-gray-700 mb-6 leading-relaxed">
              Pesan Anda telah kami terima dan akan segera kami balas 🙌
            </p>

            <button
              onClick={closePopup}
              className="bg-[#344E41] text-white px-6 py-2 rounded-lg hover:bg-[#2d3e36] transition"
            >
              Kembali
            </button>
          </div>
        </Popup>
      )}
    </div>
  );
};

export default ContactAfterLogin;
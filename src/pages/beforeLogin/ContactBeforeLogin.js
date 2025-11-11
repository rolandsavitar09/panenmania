import React, { useState } from "react";
import NavbarBeforeLogin from "../../components/layout/NavbarBeforeLogin";
import Footer from "../../components/layout/Footer";
import Popup from "../../components/common/Popup";
import { useNavigate } from "react-router-dom";

const ContactBeforeLogin = () => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPopup(true);
  };

  const closePopup = () => setShowPopup(false);

  const goToSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="bg-white min-h-screen flex flex-col font-poppins text-[#344E41]">
      <NavbarBeforeLogin />

      <div className="pt-10"></div>
      <section className="flex-1 w-full px-10 lg:px-24 py-14">
        <h1 className="text-2xl font-semibold mb-10">Hubungi Kami!</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-5">
            <div>
              <label className="text-sm">Nama</label>
              <input
                type="text"
                className="w-full bg-gray-200 py-3 px-4 rounded-lg mt-1 outline-none"
                required
              />
            </div>

            <div>
              <label className="text-sm">E-mail</label>
              <input
                type="email"
                className="w-full bg-gray-200 py-3 px-4 rounded-lg mt-1 outline-none"
                required
              />
            </div>

            <div>
              <label className="text-sm">Pesan</label>
              <textarea
                rows="5"
                className="w-full bg-gray-200 py-3 px-4 rounded-lg mt-1 outline-none resize-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-gray-300 font-semibold text-center py-3 rounded-lg hover:bg-gray-400 transition"
            >
              Kirim
            </button>
          </form>

          {/* Image Placeholder */}
          <div className="bg-gray-200 h-[350px] w-full rounded-lg"></div>
        </div>
      </section>

      <Footer />

      {showPopup && (
        <Popup onClose={closePopup}>
          <div className="text-center px-4 py-6">
            <h3 className="text-lg font-bold mb-3 text-[#344E41]">
              Yuk, Daftar Dulu!
            </h3>
            <p className="text-sm text-gray-700 mb-6 leading-relaxed">
              Untuk melanjutkan dan mengirim pesan, silakan daftar dulu ya.
              Ini membantu kami mengenali Anda dan menindaklanjuti pesan dengan cepat.
            </p>

            <div className="flex gap-3 justify-center">
              {/* ✅ Redirect ke SignUp */}
              <button
                onClick={goToSignup}
                className="bg-[#344E41] text-white px-5 py-2 rounded-lg hover:bg-[#2d3e36] transition"
              >
                Daftar
              </button>

              <button
                onClick={closePopup}
                className="bg-gray-300 text-[#344E41] px-5 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Kembali
              </button>
            </div>
          </div>
        </Popup>
      )}
    </div>
  );
};

export default ContactBeforeLogin;
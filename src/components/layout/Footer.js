// src/components/...(sesuai lokasimu)/Footer.js
import React from "react";

// IMPORT ICONS FOOTER
import LogoFooter from "../../assets/images/icons/logo footer.svg";
import IconCall from "../../assets/images/icons/call.svg";
import IconGmail from "../../assets/images/icons/gmail.svg";
import IconFacebook from "../../assets/images/icons/facebook.svg";

function Footer() {
  return (
    <footer className="bg-[#344E41] text-white py-14 mt-16">
      <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-0 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* KIRI - LOGO + DESKRIPSI */}
        <div>
          {/* Logo + Judul + Tagline */}
          <div className="flex items-center gap-4">
            <div className="w-[90px] aspect-square rounded-full bg-white flex items-center justify-center">
              <img
                src={LogoFooter}
                alt="Logo PanenMania"
                className="w-[60px] h-auto object-contain mt-2"
              />
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-bold">PanenMania</h2>
              <p className="text-[12px] md:text-xs mt-1 font-semibold">
                “Dari Petani, Oleh Petani, Untuk Negeri.”
              </p>
            </div>
          </div>

          {/* Deskripsi */}
          <p className="text-sm mt-6 leading-relaxed max-w-md">
            Platform digital yang menjembatani petani lokal dan konsumen dalam
            menciptakan ekosistem pertanian yang cerdas dan berdaya saing.
          </p>
        </div>

        {/* TENGAH - ALAMAT */}
        <div>
          <h3 className="font-bold text-lg mb-3">Alamat</h3>
          <p className="text-sm leading-relaxed">
            Jl. Raya Tani Sejahtera No. 45,
            <br />
            Tangerang, Indonesia
          </p>
        </div>

        {/* KANAN - HUBUNGI KAMI */}
        <div>
          <h3 className="font-bold text-lg mb-4">Hubungi Kami</h3>

          <div className="space-y-3 text-sm">
            {/* Telepon */}
            <div className="flex items-center gap-3">
              <img
                src={IconCall}
                alt="Telepon"
                className="w-5 h-5 object-contain"
              />
              <span>081234567890</span>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <img
                src={IconGmail}
                alt="Email"
                className="w-5 h-5 object-contain"
              />
              <span>support@panenmania.id</span>
            </div>

            {/* Facebook */}
            <div className="flex items-center gap-3">
              <img
                src={IconFacebook}
                alt="Facebook"
                className="w-5 h-5 object-contain"
              />
              <span>panenmaniaofc</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
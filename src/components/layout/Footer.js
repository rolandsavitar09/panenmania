import React from "react";

function Footer() {
  return (
    <footer className="bg-[#344E41] text-white py-10 mt-16">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">
        <div>
          <h2 className="text-lg font-semibold">PanenMania</h2>
          <p className="text-sm mt-2 leading-relaxed">
            Platform digital yang mempertemukan petani lokal dan konsumen dalam
            mendapatkan hasil panen segar setiap harinya.
          </p>
          <div className="flex gap-3 mt-4 text-xl">
            <i className="fa-brands fa-facebook"></i>
            <i className="fa-brands fa-instagram"></i>
            <i className="fa-brands fa-twitter"></i>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Alamat</h3>
          <p className="text-sm">
            Jl. Raya Tani Sejahtera No. 45, Tangerang, Indonesia
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Hubungi Kami</h3>
          <p className="text-sm">No. Telephone</p>
          <p className="text-sm">support@panenmania.id</p>
          <p className="text-sm">@panenmaniaofc</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
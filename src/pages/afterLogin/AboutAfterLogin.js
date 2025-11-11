import React from "react";
import NavbarAfterLogin from "../../components/layout/NavbarAfterLogin";
import Footer from "../../components/layout/Footer";

const AboutAfterLogin = () => {
  return (
    <div className="bg-[#FFFEF6] font-poppins text-[#344E41] min-h-screen flex flex-col">
      <NavbarAfterLogin />

      {/* Spacer */}
      <div className="pt-16"></div>

      {/* ✅ HERO SECTION */}
      <section className="w-full grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT TEXT */}
        <div className="bg-[#DDEACB] px-10 lg:px-16 py-14 flex items-center">
          <p className="text-[16px] leading-relaxed font-semibold text-[#344E41]">
            <span className="font-semibold">
              PanenMania hadir sebagai jembatan antara petani lokal
              dan masyarakat luas.
            </span>{" "}
            Kami percaya, hasil panen terbaik adalah yang datang langsung dari
            tangan petani — segar, alami, dan penuh nilai. Dengan sistem jual
            beli langsung tanpa perantara, kami membantu petani mendapatkan
            harga yang layak, sekaligus menghadirkan produk segar dengan harga
            jujur untuk pelanggan. Mulai dari buah-buahan manis, sayuran hijau
            bernutrisi, hingga beras pilihan —{" "}
            <span className="font-extrabold">
              semuanya kami kirim langsung dari ladang ke meja Anda.
            </span>
          </p>
        </div>

        {/* RIGHT IMAGE */}
        <div className="w-full h-full">
          <img
            src="https://via.placeholder.com/600x400?text=Panen+Petani"
            alt="petani"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* ✅ TIM PANENMANIA */}
      <section className="text-center mt-24 px-6">
        <h2 className="text-[20px] md:text-[22px] font-bold text-[#1E1E1E] mb-3 bg-[#EAEAEA] inline-block px-6 py-2 rounded-md">
          Tim PanenMania
        </h2>
        <p className="text-[#8A8A8A] text-[15px] mb-14">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-[1100px] mx-auto">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[#EAEAEA] rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md"
            >
              {/* IMAGE AREA */}
              <div className="w-full h-[200px] bg-[#B8B8B8] rounded-t-2xl"></div>

              {/* TEXT AREA */}
              <div className="p-5 text-left">
                <h3 className="text-[15px] font-semibold text-[#1E1E1E] mb-1">
                  Project Manager
                </h3>
                <p className="text-[14px] text-[#4B4B4B] leading-snug">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ CTA SECTION */}
      <section className="mt-28 bg-[#D0D0D0] w-full px-10 lg:px-20 py-24 flex flex-col md:flex-row items-center justify-between gap-10">
        {/* LEFT TEXT */}
        <div className="flex-1 flex justify-center md:justify-start">
          <h2 className="text-[24px] md:text-[26px] font-extrabold leading-snug text-[#000000] max-w-[500px]">
            Jangan tunda lagi kesehatan dan <br /> kenikmatan keluarga Anda!
          </h2>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex-1 flex justify-center md:justify-end">
          <div className="w-[320px] h-[220px] bg-[#B8B8B8] rounded-2xl"></div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutAfterLogin;
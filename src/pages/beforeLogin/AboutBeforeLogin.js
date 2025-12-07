// src/pages/beforeLogin/AboutBeforeLogin.js
import React from "react";
import NavbarBeforeLogin from "../../components/layout/NavbarBeforeLogin";
import Footer from "../../components/layout/Footer";

// HERO ABOUT
import HeroPetaniAbout from "../../assets/images/banners/petani about.svg";

// Kenapa Kami – path sama seperti HomeContent.js
import Petani2Banner from "../../assets/images/banners/petani 2.svg";
import IconFarmer from "../../assets/images/icons/farmer.svg";
import IconSegar from "../../assets/images/icons/segar.svg";
import IconJujur from "../../assets/images/icons/jujur.svg";
import IconPengiriman from "../../assets/images/icons/pengiriman.svg";

// Tim Kami
import KelinciBanner from "../../assets/images/banners/kelinci.svg";

const AboutBeforeLogin = () => {
  const team = [
    {
      name: "Dearni Lambardo Saragih",
      role: "Project Manager, Design UI/UX",
    },
    {
      name: "Muhammad Ryan Ardiansyah",
      role: "Design UI/UX",
    },
    {
      name: "Muhammad Reyhan Andrianto",
      role: "Design UI/UX",
    },
    {
      name: "Roland Savitar Herdiansyah",
      role: "Front End Developer",
    },
    {
      name: "M Yasir Rahmatullah",
      role: "Front End Developer",
    },
    {
      name: "Dhana Prasetya Nugraha",
      role: "Back End Developer",
    },
  ];

  return (
    <div className="bg-[#FFFEF6] font-poppins text-[#344E41] min-h-screen flex flex-col">
      <NavbarBeforeLogin />

      {/* MAIN CONTENT */}
      <main className="flex-1 pt-24">
        {/* ========== HERO ABOUT (MENEMPEL DENGAN NAVBAR) ========== */}
        <section className="w-full">
          <div className="max-w-[1350px] mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* LEFT TEXT */}
            <div className="space-y-4">
              <h1 className="text-[24px] md:text-[25px] font-extrabold text-[#344E41] leading-snug">
                “Dari Petani, Oleh Petani, Untuk Negeri”
              </h1>
              <p className="text-[16px] md:text-[18px] font-semibold text-[#344E41]">
                Menggerakkan Kesegaran, Menguatkan Negeri.
              </p>
              <p className="text-[14px] md:text-[15px] text-[#3A5A40] leading-relaxed max-w-[540px]">
                Kami percaya bahwa setiap hasil panen punya cerita, dan setiap
                petani punya peran besar bagi masa depan pangan Indonesia.
                Melalui PanenMania, kami menghadirkan cara baru untuk
                mengalirkan produk segar lebih cepat, lebih adil, dan lebih
                transparan. Kami menghubungkan petani langsung dengan pembeli,
                menjaga kualitas sejak lahan hingga meja, dan memastikan nilai
                terbaik kembali kepada mereka yang menanamnya.
              </p>
            </div>

            {/* RIGHT IMAGE – petani + 2 lingkaran sesuai figma */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[430px]">
                {/* gambar petani dengan shape utama */}
                <img
                  src={HeroPetaniAbout}
                  alt="petani panen"
                  className="w-full h-auto object-contain"
                />

                {/* BLOK LINGKARAN – geser kanan/kiri dengan mengubah left-[18%] */}
                <div className="absolute -top-6 left-[50%] w-10 h-10">
                  {/* lingkaran besar – kiri bawah */}
                  <div className="absolute bottom-0 left-0 w-6 h-6 rounded-full bg-[#344E41]" />
                  {/* lingkaran kecil – kanan atas */}
                  <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#344E41]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== KENAPA KAMI (SAMA DENGAN HOMECONTENT) ========== */}
        <section className="w-full bg-[#DDEACD] py-20 mt-20">
          <div className="max-w-[1350px] mx-auto px-6 lg:px-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* LEFT CONTENT */}
            <div>
              <h2 className="text-[#344E41] font-extrabold text-[32px] mb-4">
                Kenapa Kami?
              </h2>
              <p className="text-[#3A5A40] text-[15px] mb-10 leading-relaxed">
                Karena kami percaya, hasil terbaik datang langsung dari tangan
                petani.
              </p>

              <div className="space-y-10">
                {/* 1 Langsung dari Petani */}
                <div className="flex items-start gap-4">
                  <img
                    src={IconFarmer}
                    alt="Langsung dari Petani"
                    className="w-[48px]"
                  />
                  <div>
                    <h3 className="font-bold text-[#344E41] text-[18px] mb-1">
                      Langsung dari Petani
                    </h3>
                    <p className="text-[#3A5A40] text-[15px] leading-relaxed">
                      Kami bekerja sama langsung dengan petani lokal. Setiap
                      produk datang segar tanpa melalui rantai distribusi
                      panjang.
                    </p>
                  </div>
                </div>

                {/* 2 Segar dan Alami */}
                <div className="flex items-start gap-4">
                  <img
                    src={IconSegar}
                    alt="Segar dan Alami"
                    className="w-[48px]"
                  />
                  <div>
                    <h3 className="font-bold text-[#344E41] text-[18px] mb-1">
                      Segar dan Alami
                    </h3>
                    <p className="text-[#3A5A40] text-[15px] leading-relaxed">
                      Hasil panen dikirim segera setelah dipetik. Tanpa bahan
                      pengawet atau proses pematangan buatan.
                    </p>
                  </div>
                </div>

                {/* 3 Harga Jujur */}
                <div className="flex items-start gap-4">
                  <img
                    src={IconJujur}
                    alt="Harga Jujur"
                    className="w-[48px]"
                  />
                  <div>
                    <h3 className="font-bold text-[#344E41] text-[18px] mb-1">
                      Harga Jujur
                    </h3>
                    <p className="text-[#3A5A40] text-[15px] leading-relaxed">
                      Petani mendapatkan harga yang layak. Pembeli pun menikmati
                      harga hemat tanpa biaya tambahan.
                    </p>
                  </div>
                </div>

                {/* 4 Pengiriman Cepat */}
                <div className="flex items-start gap-4">
                  <img
                    src={IconPengiriman}
                    alt="Pengiriman Cepat"
                    className="w-[48px]"
                  />
                  <div>
                    <h3 className="font-bold text-[#344E41] text-[18px] mb-1">
                      Pengiriman Cepat
                    </h3>
                    <p className="text-[#3A5A40] text-[15px] leading-relaxed">
                      Produk dikemas dengan aman dan rapi. Kami pastikan
                      kesegaran tetap terjaga hingga sampai ke tangan Anda.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="flex justify-center">
              <img
                src={Petani2Banner}
                alt="petani"
                className="rounded-2xl shadow-md w-full max-w-[550px] object-cover"
              />
            </div>
          </div>
        </section>

        {/* ========== TIM KAMI ========== */}
        <section className="w-full py-20 bg-[#FFFEF6]">
          <div className="max-w-[1350px] mx-auto px-6 lg:px-16 text-center">
            {/* Title button */}
            <button className="bg-[#3A5B40] text-white font-semibold text-[16px] px-8 py-2 rounded-[10px] mb-3">
              Tim Kami
            </button>
            <p className="text-[#6B6B6B] text-[14px] md:text-[15px] mb-12">
              Orang-orang di balik perjalanan kami dalam menghadirkan produk
              segar terbaik bagi negeri.
            </p>

            {/* Grid cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((person, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="bg-white rounded-[30px] shadow-md overflow-hidden w-full max-w-[320px]">
                    {/* Gambar kelinci */}
                    <div className="w-full h-[200px] overflow-hidden">
                      <img
                        src={KelinciBanner}
                        alt={person.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Text */}
                    <div className="px-5 py-4 text-left">
                      <p className="font-semibold text-[15px] mb-1 text-[#344E41]">
                        {person.name}
                      </p>
                      <p className="text-[13px] text-[#6B6B6B]">
                        {person.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutBeforeLogin;

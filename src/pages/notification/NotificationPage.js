import React from "react";
import NavbarAfterLogin from "../../components/layout/NavbarAfterLogin";
import Footer from "../../components/layout/Footer";
import { Link } from "react-router-dom";

const NotificationPage = () => {
  const notifications = [
    {
      id: 1,
      title: "Konfirmasi Penerimaan",
      desc: "Lorem ipsum dolor sit amet consectetur. Fermentum nunc nam neque facilisi rhoncus.",
      date: "15-10-2025 | 07:25",
    },
    {
      id: 2,
      title: "Konfirmasi Penerimaan",
      desc: "Lorem ipsum dolor sit amet consectetur. Fermentum nunc nam neque facilisi rhoncus.",
      date: "15-10-2025 | 07:25",
    },
    {
      id: 3,
      title: "Konfirmasi Penerimaan",
      desc: "Lorem ipsum dolor sit amet consectetur. Fermentum nunc nam neque facilisi rhoncus.",
      date: "15-10-2025 | 07:25",
    },
    {
      id: 4,
      title: "Konfirmasi Penerimaan",
      desc: "Lorem ipsum dolor sit amet consectetur. Fermentum nunc nam neque facilisi rhoncus.",
      date: "15-10-2025 | 07:25",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-poppins text-[#344E41] flex flex-col">
      <NavbarAfterLogin />

      <div className="px-10 pt-28 pb-20 max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold mb-8">Pemberitahuan Notifikasi</h1>

        <div className="flex flex-col gap-6">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="flex items-center bg-[#D9D9D9] p-5 rounded-lg gap-5"
            >
              <div className="w-32 h-32 bg-gray-300 rounded-lg" />

              <div className="flex-1">
                <h2 className="font-semibold text-lg">{item.title}</h2>
                <p className="text-sm text-[#344E41] opacity-80 leading-relaxed">
                  {item.desc}
                </p>
                <p className="text-sm font-semibold mt-2">{item.date}</p>
              </div>

              <Link to="/orders-history/PNM-20230101-001">
                <button className="bg-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition shadow">
                  Tampilkan Detail Pesanan
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotificationPage;
import React from "react";
import { Link } from "react-router-dom"; // ✅ untuk redirect via Link

const Popup = ({ children, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999]"
      onClick={onClose} // ✅ Klik di luar = close
    >
      <div
        className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center"
        onClick={(e) => e.stopPropagation()} // ✅ Prevent close when clicking popup
      >
        {/* 🧩 Jika children diberikan → tampilkan */}
        {children ? (
          children
        ) : (
          <>
            <h2 className="text-lg font-bold text-[#344E41] mb-2">
              Anda Belum Login
            </h2>
            <p className="text-sm text-gray-700 mb-4">
              Silakan masuk terlebih dahulu untuk melanjutkan.
            </p>

            {/* ✅ Redirect ke halaman Login */}
            <Link
              to="/signin"
              className="bg-[#344E41] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#2a3e33] transition inline-block"
            >
              Login Sekarang
            </Link>

            <button
              onClick={onClose}
              className="block w-full mt-3 text-gray-600 text-sm hover:text-gray-800"
            >
              Tutup
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Popup;
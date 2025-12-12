// src/admin/component/AdminHeader.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const navigate = useNavigate();

  // buka/tutup dropdown profil
  const [open, setOpen] = useState(false);

  // buka/tutup popup logout
  const [openLogout, setOpenLogout] = useState(false);

  // ambil data user dari localStorage (admin)
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login", { replace: true });
  };

  return (
    <>
      {/* Profile button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="
            w-9 h-9 rounded-full
            bg-[#3A5B40]/10
            border border-[#3A5B40]/40
            flex items-center justify-center
          "
        >
          {/* Initial dari username admin */}
          <span className="text-[#3A5B40] font-semibold text-sm">
            {(user.username || "A")[0].toUpperCase()}
          </span>
        </button>

        {/* Dropdown */}
        {open && (
          <div
            className="
              absolute right-0 mt-2 w-40
              bg-white rounded-[10px] shadow-lg z-20
              py-2 border border-[#E5E7EB]
            "
          >
            <button
              onClick={() => setOpenLogout(true)}
              className="
                w-full text-left px-4 py-2 text-sm text-[#3A5B40]
                hover:bg-[#FFFEF6]
              "
            >
              Keluar
            </button>
          </div>
        )}
      </div>

      {/* POPUP LOGOUT */}
      {openLogout && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setOpenLogout(false)}
          />

          {/* modal */}
          <div
            className="
              relative bg-white w-[350px]
              border-[3px] border-[#3A5B40]
              rounded-[15px] shadow-[0_4px_6px_rgba(0,0,0,0.1)]
              px-6 py-8 text-center
            "
          >
            <h2 className="text-lg font-bold text-[#3A5B40] mb-2">
              Konfirmasi Keluar
            </h2>

            <p className="text-sm text-[#3A5B40] mb-6">
              Anda yakin ingin logout dari akun admin?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setOpenLogout(false)}
                className="
                  h-[40px] px-6 rounded-[10px]
                  bg-[#96352C] text-white
                  hover:bg-[#7a2922]
                  text-sm font-medium
                "
              >
                Tidak
              </button>

              <button
                onClick={handleLogout}
                className="
                  h-[40px] px-6 rounded-[10px]
                  bg-[#3A5B40] text-white
                  hover:bg-[#324c36]
                  text-sm font-medium
                "
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminHeader;
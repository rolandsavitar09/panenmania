import React, { useState } from "react";
import NavbarAfterLogin from "../../components/layout/NavbarAfterLogin";
import Footer from "../../components/layout/Footer";
import Popup from "../../components/common/Popup";
import AddressModal from "./AddressModal";
import { UserCircleIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { Link, useLocation } from "react-router-dom";

const ProfileAddress = () => {
  const location = useLocation();
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: "Pin",
      detail:
        "Jl. Kenanga No. 47, RT.03/RW.05, Kompleks Perumahan Sukamaju Indah, Kelurahan Sukamaju, Kecamatan Bogor Barat, Kota Bogor, Jawa Barat 16112. 0812-3456-7890.",
      isPrimary: true,
    },
    {
      id: 2,
      label: "Alamat 1",
      detail:
        "Jl. Melati Indah Blok B2 No. 10, Perumahan Melati Asri, Gang Cempaka, Kelurahan Helvetia, Kecamatan Medan Helvetia, Kota Medan, Sumatera Utara 20234. 0821-9876-5432.",
      isPrimary: false,
    },
    {
      id: 3,
      label: "Alamat 2",
      detail:
        "Jl. Pahlawan II No. 88, Gang Mawar, Perumahan Taman Sari, Kelurahan Tanjung Rejo, Kecamatan Klojen, Kota Malang, Jawa Timur 65112. 0857-1234-6789.",
      isPrimary: false,
    },
    {
      id: 4,
      label: "Alamat 3",
      detail:
        "Jl. Raya Sukamulia KM. 5, Desa Sukajaya, Dusun Melur, RT.02/RW.01, Kecamatan Cikarang Selatan, Kabupaten Bekasi, Jawa Barat 17550. 0896-4567-1122.",
      isPrimary: false,
    },
  ]);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleUploadPic = (e) => {
    const f = e.target.files[0];
    if (f) setProfilePic(URL.createObjectURL(f));
  };

  const openAdd = () => {
    setEditing(null);
    setShowModal(true);
  };

  const openEdit = (addr) => {
    setEditing(addr);
    setShowModal(true);
  };

  const removeAddress = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const setPrimary = (id) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isPrimary: a.id === id }))
    );
  };

  const saveAddress = (payload) => {
    if (editing) {
      setAddresses((prev) =>
        prev.map((a) =>
          a.id === editing.id
            ? { ...a, label: payload.label, detail: payload.detail, isPrimary: payload.isPrimary }
            : payload.isPrimary
            ? { ...a, isPrimary: false }
            : a
        )
      );
    } else {
      const newId = Math.max(0, ...addresses.map((a) => a.id)) + 1;
      const newAddress = {
        id: newId,
        label: payload.label || `Alamat ${newId}`,
        detail: payload.detail,
        isPrimary: payload.isPrimary || false,
      };
      setAddresses((prev) =>
        (payload.isPrimary
          ? prev.map((a) => ({ ...a, isPrimary: false }))
          : prev
        ).concat(newAddress)
      );
    }
    setShowModal(false);
    setShowSuccess(true);
  };

  const confirmLogout = () => {
    window.location.href = "/signin";
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-white text-[#344E41] font-poppins flex flex-col">
      <NavbarAfterLogin />

      <div className="flex w-full pt-24 pb-12 px-10 gap-8">
        {/* Sidebar */}
        <div className="w-72 bg-[#C3C3C3] p-6 rounded-lg flex-shrink-0">
          <div className="flex flex-col items-center text-center">
            <label className="relative cursor-pointer">
              <input type="file" className="hidden" onChange={handleUploadPic} />
              <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center overflow-hidden">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="w-36 h-36 text-gray-300" />
                )}
              </div>
              <span className="absolute bottom-4 right-4 bg-white p-1 rounded-full shadow text-black text-xs">
                ✏️
              </span>
            </label>

            <p className="mt-3 font-semibold text-lg">Lorem Ipsum</p>
          </div>

          {/* Menu */}
          <div className="mt-10 space-y-6 text-left w-full">
            {/* Akun Saya */}
            <div>
              <p className="font-bold text-black text-base mb-1">Akun Saya</p>

              <Link to="/profile">
                <p
                  className={`text-sm cursor-pointer ${
                    isActive("/profile")
                      ? "font-bold text-black"
                      : "text-gray-700 hover:text-black"
                  }`}
                >
                  Profile
                </p>
              </Link>

              <Link to="/profile/address">
                <p
                  className={`text-sm cursor-pointer ${
                    isActive("/profile/address")
                      ? "font-bold text-black"
                      : "text-gray-700 hover:text-black"
                  }`}
                >
                  Alamat
                </p>
              </Link>

              <Link to="/profile/password">
                <p
                  className={`text-sm cursor-pointer ${
                    isActive("/profile/password")
                      ? "font-bold text-black"
                      : "text-gray-700 hover:text-black"
                  }`}
                >
                  Kata Sandi
                </p>
              </Link>
            </div>

            {/* Pesanan Saya */}
            <div>
              <p className="font-bold text-black text-base mb-1">Pesanan Saya</p>
              <Link to="/orders-status">
                <p
                  className={`text-sm cursor-pointer ${
                    isActive("/orders-status")
                      ? "font-bold text-black"
                      : "text-gray-700 hover:text-black"
                  }`}
                >
                  Status Pesanan
                </p>
              </Link>
              <Link to="/orders-history">
                <p
                  className={`text-sm cursor-pointer ${
                    isActive("/orders-history")
                      ? "font-bold text-black"
                      : "text-gray-700 hover:text-black"
                  }`}
                >
                  Riwayat Pesanan
                </p>
              </Link>
            </div>
          </div>

          {/* Tombol Keluar */}
          <button
            onClick={() => setShowLogout(true)}
            className="mt-12 w-full flex items-center justify-center gap-3 bg-white py-2 rounded-lg font-semibold shadow text-[#344E41] hover:bg-gray-100 transition"
          >
            <ArrowLeftOnRectangleIcon className="w-5" /> Keluar
          </button>
        </div>

        {/* Konten Alamat */}
        <div className="flex-1 bg-[#C3C3C3] p-10 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Alamat Saya</h2>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition"
            >
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#344E41] text-white text-sm font-bold">
                +
              </span>
              Tambahkan Alamat Baru
            </button>
          </div>

          <p className="text-sm mb-4">Alamat</p>
          <hr className="border-black mb-6" />

          <div className="space-y-6">
            {addresses.map((addr) => (
              <div key={addr.id}>
                <div className="flex justify-between items-start">
                  {/* Left Section */}
                  <div className="flex-1 pr-6">
                    <p className="font-semibold text-sm">{addr.label}</p>
                    <p className="text-sm text-[#222] mt-1 leading-relaxed">
                      {addr.detail}
                    </p>
                    {addr.isPrimary && (
                      <span className="inline-block mt-2 bg-[#E5E5E5] text-xs font-semibold text-[#222] px-3 py-1 rounded">
                        Alamat Utama
                      </span>
                    )}
                  </div>

                  {/* Right Section */}
                  <div className="flex flex-col items-end justify-between h-full">
                    <div className="flex justify-end gap-3 text-sm font-semibold">
                      <button
                        onClick={() => openEdit(addr)}
                        className="hover:underline"
                      >
                        Ubah
                      </button>
                      <button
                        onClick={() => removeAddress(addr.id)}
                        className="hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                    {!addr.isPrimary && (
                      <button
                        onClick={() => setPrimary(addr.id)}
                        className="bg-[#E5E5E5] px-3 py-1 rounded text-xs font-semibold text-[#222] hover:bg-gray-300 transition mt-2"
                      >
                        Atur sebagai utama
                      </button>
                    )}
                  </div>
                </div>
                <hr className="border-[#AFAFAF] mt-4" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />

      {/* Popup sukses */}
      {showSuccess && (
        <Popup onClose={() => setShowSuccess(false)}>
          <div className="text-center px-6 py-8 bg-white rounded-xl shadow-lg max-w-md mx-auto relative">
            <button
              onClick={() => setShowSuccess(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              ✕
            </button>
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-black">
              Data Berhasil Diperbaharui!
            </h3>
          </div>
        </Popup>
      )}

      {/* Popup logout */}
      {showLogout && (
        <Popup onClose={() => setShowLogout(false)}>
          <div className="text-center px-6 py-8 bg-white rounded-xl shadow-lg max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-5 text-[#344E41]">
              Anda Yakin Ingin Keluar?
            </h3>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowLogout(false)}
                className="bg-gray-300 text-[#344E41] px-6 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Kembali
              </button>
              <button
                onClick={confirmLogout}
                className="bg-[#344E41] text-white px-6 py-2 rounded-lg hover:bg-[#2a3e33] transition"
              >
                Yakin
              </button>
            </div>
          </div>
        </Popup>
      )}

      {/* Modal Tambah/Ubah Alamat */}
      {showModal && (
        <AddressModal
          onClose={() => setShowModal(false)}
          onSave={saveAddress}
          initialData={editing}
        />
      )}
    </div>
  );
};

export default ProfileAddress;
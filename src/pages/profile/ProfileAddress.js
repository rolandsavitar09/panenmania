// src/pages/afterLogin/ProfileAddress.js
import React, { useState, useEffect } from "react"; // useEffect ditambahkan
import { Link, useLocation, useNavigate } from "react-router-dom";
import NavbarAfterLogin from "../../components/layout/NavbarAfterLogin";
import Popup from "../../components/common/Popup";
import AddressModal from "./AddressModal"; // Asumsi AddressModal ada dan menerima props yang sesuai

// ICONS & IMAGES
import EditIcon from "../../assets/images/icons/edit.svg";
import ProfileIcon from "../../assets/images/icons/profile.svg";
import CheckIcon from "../../assets/images/icons/ceklis.svg";
import OutIcon from "../../assets/images/icons/out.svg";
// HILANGKAN penggunaan pp.svg sebagai fallback — agar logika sama dengan ProfileMain
// import ProfilePhoto from "../../assets/images/icons/pp.svg";
import TrashIcon from "../../assets/images/icons/trash.svg";
import PencilIcon from "../../assets/images/icons/pensil.svg";

// ---------------------- Helper ----------------------
// Simpan alamat utama yang diperlukan untuk Checkout ke localStorage
const savePrimaryAddressLocally = (addresses) => {
  const primary = addresses.find((a) => a.isPrimary);
  if (primary) {
    localStorage.setItem(
      "primaryAddress",
      JSON.stringify({
        name: primary.name,
        detail: primary.detail,
        phone: primary.phone || "N/A",
      })
    );
  } else {
    localStorage.removeItem("primaryAddress");
  }
};

// Ambil data profil user dari localStorage (sama seperti ProfileMain)
const getUserProfileData = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return {
      fullName: user.name || user.full_name || "Customer",
      email: user.email || "email@example.com",
    };
  } catch (e) {
    return { fullName: "Customer", email: "email@example.com" };
  }
};

// Dummy data awal (sebelum integrasi backend)
const DUMMY_ADDRESSES = [
  {
    id: 1,
    name: "Dearni Lambardo Saragih",
    detail:
      "Jl. Kenanga No. 47, RT.03/RW.05, Kompleks Perumahan Sukamaju Indah, Kelurahan Sukamaju, Kecamatan Bogor Barat, Kota Bogor, Jawa Barat 16112.",
    isPrimary: true,
    phone: "081234567890",
  },
  {
    id: 2,
    name: "Dearni Lambardo Saragih",
    detail:
      "Jl. Melati Indah Blok B2 No. 10, Perumahan Melati Asri, Kelurahan Helvetia, Kecamatan Medan Helvetia, Kota Medan, Sumatera Utara 20234.",
    isPrimary: false,
    phone: "081234567890",
  },
  {
    id: 3,
    name: "Dearni Lambardo Saragih",
    detail:
      "Jl. Pahlawan II No. 88, Perumahan Taman Sari, Kelurahan Tanjung Rejo, Kecamatan Klojen, Kota Malang, Jawa Timur 65112.",
    isPrimary: false,
    phone: "081234567890",
  },
];

// ---------------------- Component ----------------------
const ProfileAddress = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Ambil initial state: jika ada data di localStorage (termasuk array kosong) gunakan itu.
  const getInitialAddresses = () => {
    try {
      const storedRaw = localStorage.getItem("profileAddresses");
      if (storedRaw !== null) {
        const parsed = JSON.parse(storedRaw);
        if (Array.isArray(parsed)) return parsed; // termasuk [] -> sesuai permintaan
      }
    } catch (e) {
      // ignore parse error
    }
    return DUMMY_ADDRESSES;
  };

  const [addresses, setAddresses] = useState(getInitialAddresses);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  // profile data (nama + email) untuk sidebar — diambil sama seperti ProfileMain
  const [profileData, setProfileData] = useState(getUserProfileData());

  // Simpan alamat ke localStorage setiap kali addresses berubah
  useEffect(() => {
    try {
      // selalu simpan, termasuk [] ketika semua alamat dihapus
      localStorage.setItem("profileAddresses", JSON.stringify(addresses));
    } catch (e) {
      // fallback: do nothing
    }
    // update primary address ke bentuk yang dibutuhkan Checkout
    savePrimaryAddressLocally(addresses);
  }, [addresses]);

  // Saat mount pastikan primary tersimpan (untuk kasus initial dari DUMMY_ADDRESSES)
  useEffect(() => {
    savePrimaryAddressLocally(addresses);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------- Handlers ----------------------

  // Upload foto profil (lokal)
  const handleUploadPic = (e) => {
    const file = e?.target?.files?.[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  // Buka modal tambah alamat
  const openAdd = () => {
    setEditing(null);
    setShowModal(true);
  };

  // Buka modal edit alamat
  const openEdit = (addr) => {
    setEditing(addr);
    setShowModal(true);
  };

  // Hapus alamat dari daftar
  const removeAddress = (id) => {
    setAddresses((prev) => {
      const newAddresses = prev.filter((a) => a.id !== id);
      // jika semua alamat dihapus, newAddresses akan menjadi []
      return newAddresses;
    });
  };

  // Set alamat utama
  const setPrimary = (id) => {
    setAddresses((prev) => {
      const newAddresses = prev.map((a) => ({ ...a, isPrimary: a.id === id }));
      return newAddresses;
    });
  };

  // Simpan alamat baru atau hasil edit
  // payload: { name, detail, isPrimary, phone? }
  const saveAddress = (payload) => {
    setAddresses((prev) => {
      let newAddresses;
      if (editing) {
        // Edit existing
        newAddresses = prev.map((a) =>
          a.id === editing.id
            ? {
                ...a,
                name: payload.name || a.name,
                detail: payload.detail || a.detail,
                isPrimary: !!payload.isPrimary,
                phone: payload.phone || a.phone || "N/A",
              }
            : payload.isPrimary
            ? { ...a, isPrimary: false }
            : a
        );
      } else {
        // Tambah baru
        const newId = Math.max(0, ...prev.map((a) => a.id)) + 1;
        const newAddress = {
          id: newId,
          name: payload.name || "Dearni Lambardo Saragih",
          detail: payload.detail || "",
          isPrimary: !!payload.isPrimary,
          phone: payload.phone || "N/A",
        };
        newAddresses = payload.isPrimary
          ? prev.map((a) => ({ ...a, isPrimary: false })).concat(newAddress)
          : prev.concat(newAddress);
      }
      return newAddresses;
    });

    setShowModal(false);
    setShowSuccess(true);
  };

  // Logout flow (sama seperti ProfileMain: hapus token & user)
  const handleLogout = () => setShowLogout(true);
  const closeLogoutPopup = () => setShowLogout(false);
  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowLogout(false);
    navigate("/", { replace: true });
  };

  // Cek menu aktif
  const isActive = (path) => location.pathname === path;

  // ---------------------- Render ----------------------
  return (
    <div className="min-h-screen bg-[#FFFEF6] text-[#344E41] font-poppins flex flex-col">
      <NavbarAfterLogin />

      {/* Konten utama: stack di mobile, dua kolom di desktop */}
      <div className="flex flex-col lg:flex-row w-full mt-14 gap-4 lg:gap-8 px-4 lg:px-0">
        {/* Sidebar profil: full width di mobile, lebar tetap di desktop */}
        <div className="w-full lg:w-72 bg-white px-4 py-6 lg:px-6 lg:py-8 rounded-[10px] shadow flex flex-col overflow-y-auto lg:min-h-[calc(100vh-56px)]">
          <div className="flex flex-col items-center text-center">
            <label className="relative cursor-pointer inline-block">
              <input type="file" className="hidden" onChange={handleUploadPic} />
              <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-[#F2F2F2] rounded-full flex items-center justify-center overflow-hidden">
                {/* Tampilkan gambar hanya jika ada upload, sesuai logika ProfileMain */}
                {profilePic && (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-8 h-8 rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.12)] flex items-center justify-center">
                <img src={EditIcon} alt="Edit" className="w-4 h-4" />
              </div>
            </label>

            {/* NAMA LENGKAP dan EMAIL dari profileData (dinamis) */}
            <p className="mt-3 font-semibold text-base sm:text-lg">{profileData.fullName}</p>
            <p className="text-xs text-gray-500 mb-4">{profileData.email}</p>
          </div>

          {/* Menu samping */}
          <div className="mt-6 lg:mt-8 space-y-6 text-left w-full">
            {/* Bagian profil */}
            <div>
              <div className="flex items-center gap-2">
                <img src={ProfileIcon} alt="Profile icon" className="w-5 h-5" />
                <Link to="/profile">
                  <p className={`text-sm cursor-pointer ${isActive("/profile") ? "font-semibold text-[#344E41]" : "text-gray-600 hover:text-[#344E41]"}`}>Profile</p>
                </Link>
              </div>

              <div className="ml-7 mt-1 space-y-1">
                <Link to="/profile/address">
                  <p className={`text-sm cursor-pointer ${isActive("/profile/address") ? "font-semibold text-[#344E41]" : "text-gray-600 hover:text-[#344E41]"}`}>Alamat</p>
                </Link>

                <Link to="/profile/password">
                  <p className={`text-sm cursor-pointer ${isActive("/profile/password") ? "font-semibold text-[#344E41]" : "text-gray-600 hover:text-[#344E41]"}`}>Kata Sandi</p>
                </Link>
              </div>
            </div>

            {/* Bagian pesanan */}
            <div>
              <div className="flex items-center gap-2">
                <img src={CheckIcon} alt="Orders icon" className="w-5 h-5" />
                <Link to="/orders-status">
                  <p className={`text-sm cursor-pointer ${isActive("/orders-status") ? "font-semibold text-[#344E41]" : "text-gray-600 hover:text-[#344E41]"}`}>Status Pesanan</p>
                </Link>
              </div>

              <div className="ml-7 mt-1 space-y-1">
                <Link to="/orders-history">
                  <p className={`text-sm cursor-pointer ${isActive("/orders-history") ? "font-semibold text-[#344E41]" : "text-gray-600 hover:text-[#344E41]"}`}>Riwayat Pesanan</p>
                </Link>
              </div>
            </div>
          </div>

          {/* Tombol keluar */}
          <button
            onClick={handleLogout}
            className="mt-8 lg:mt-20 self-center flex items-center justify-center gap-2 bg-[#3A5B40] px-6 sm:px-8 py-2 rounded-[10px] text-sm font-semibold text-white hover:bg-[#314c35] transition"
          >
            <img src={OutIcon} alt="Keluar" className="w-4 h-4" />
            Keluar
          </button>
        </div>

        {/* Kartu daftar alamat: full width di mobile, kanan di desktop */}
        <div className="flex-1 mr-0 lg:mr-20 flex mt-4 lg:mt-10 mb-6 lg:mb-10">
          <div className="w-full bg-[#B8D68F40] p-4 sm:p-6 lg:p-10 rounded-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
            {/* Header kartu: judul dan tombol tambah alamat */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
              <h2 className="text-lg sm:text-xl font-bold">Alamat Saya</h2>
              <button
                onClick={openAdd}
                className="flex items-center gap-2 bg-[#3A5B40] text-white px-4 sm:px-5 py-2 rounded-[10px] text-xs sm:text-sm font-semibold hover:bg-[#2a3e33] transition"
              >
                <span className="w-5 h-5 rounded-full border border-white flex items-center justify-center text-xs">+</span>
                Tambahkan Alamat Baru
              </button>
            </div>

            {/* Garis pembatas hijau */}
            <hr className="border-t-2 border-[#3A5B40] mb-3 sm:mb-4" />

            {/* Label judul list alamat */}
            <p className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4">Alamat</p>

            {/* Jika tidak ada alamat, tampilkan placeholder */}
            {addresses.length === 0 ? (
              <div className="bg-white rounded-[10px] p-6 text-center">
                <p className="text-sm sm:text-base font-semibold text-[#344E41] mb-2">Belum ada alamat</p>
                <p className="text-xs text-gray-600 mb-4">Anda belum menambahkan alamat. Tambahkan alamat baru untuk melanjutkan proses checkout.</p>
                <div className="flex justify-center">
                  <button
                    onClick={openAdd}
                    className="flex items-center gap-2 bg-[#3A5B40] text-white px-4 py-2 rounded-[10px] text-xs sm:text-sm font-semibold hover:bg-[#2a3e33] transition"
                  >
                    <span className="w-5 h-5 rounded-full border border-white flex items-center justify-center text-xs">+</span>
                    Tambah Alamat
                  </button>
                </div>
              </div>
            ) : (
              /* Daftar alamat */
              <div className="space-y-3 sm:space-y-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="bg-white rounded-[10px] px-3 py-3 sm:px-5 sm:py-4 flex justify-between items-start shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
                  >
                    {/* Informasi alamat */}
                    <div className="flex-1 pr-3 sm:pr-6">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-xs sm:text-sm">{addr.name}</span>
                        {addr.isPrimary && <span className="text-[11px] sm:text-xs text-[#344E41]">Alamat Utama</span>}
                      </div>
                      <p className="text-xs sm:text-sm text-[#222] leading-relaxed">{addr.detail}</p>
                      {/* Tampilkan phone jika ada */}
                      {addr.phone && <p className="text-[11px] text-gray-600 mt-2">No. HP: {addr.phone}</p>}
                    </div>

                    {/* Aksi alamat */}
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex gap-1.5 sm:gap-2">
                        <button onClick={() => openEdit(addr)} className="p-1.5 sm:p-2 rounded-full hover:bg-[#F2F2F2] transition" aria-label="Ubah alamat">
                          <img src={PencilIcon} alt="Edit" className="w-4 h-4" />
                        </button>
                        <button onClick={() => removeAddress(addr.id)} className="p-1.5 sm:p-2 rounded-full hover:bg-[#F2F2F2] transition" aria-label="Hapus alamat">
                          <img src={TrashIcon} alt="Hapus" className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Tombol Jadikan Utama jika bukan primary */}
                      {!addr.isPrimary && (
                        <button onClick={() => setPrimary(addr.id)} className="text-[10px] sm:text-xs text-[#3A5B40] font-semibold underline hover:text-[#2a3e33]">
                          Jadikan Utama
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popup sukses simpan alamat */}
      {showSuccess && <Popup variant="success" onClose={() => setShowSuccess(false)} onConfirm={() => setShowSuccess(false)} />}

      {/* Popup konfirmasi logout */}
      {showLogout && <Popup variant="logout" onClose={closeLogoutPopup} onCancel={closeLogoutPopup} onConfirm={confirmLogout} />}

      {/* Modal tambah atau edit alamat */}
      {showModal && <AddressModal onClose={() => setShowModal(false)} onSave={saveAddress} initialData={editing} isEdit={!!editing} />}
    </div>
  );
};

export default ProfileAddress;
// src/pages/afterLogin/AddressModal.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const AddressModal = ({ onClose, onSave, initialData }) => {
  // Input State
  const [label, setLabel] = useState("");
  const [prov, setProv] = useState("");
  const [city, setCity] = useState("");
  const [subdist, setSubdist] = useState("");
  const [postal, setPostal] = useState("");
  const [street, setStreet] = useState("");
  const [extra, setExtra] = useState("");

  // Dropdown Lists
  const [provinsiList, setProvinsiList] = useState([]);
  const [cityList, setCityList] = useState([]);

  // Error
  const [errors, setErrors] = useState({});

  // Fade Animation
  const [fadeIn, setFadeIn] = useState(false);
  useEffect(() => setFadeIn(true), []);

  // Fetch daftar provinsi
  useEffect(() => {
    axios
      .get("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
      .then((res) => setProvinsiList(res.data))
      .catch((err) => console.error("Provinsi load failed", err));
  }, []);

  // Fetch daftar kota setelah pilih prov
  useEffect(() => {
    if (prov) {
      axios
        .get(
          `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${prov}.json`
        )
        .then((res) => setCityList(res.data))
        .catch((err) => console.error("City load failed", err));
    }
  }, [prov]);

  // Load data saat edit
  useEffect(() => {
    if (initialData) {
      setLabel(initialData.label || "");
      setStreet(initialData.detail || "");
      // prov, city, dst tidak di-parse dari detail
    }
  }, [initialData]);

  // Validasi Input
  const validate = () => {
    let temp = {};
    if (!label) temp.label = "Nama alamat wajib diisi!";
    if (!prov) temp.prov = "Pilih provinsi!";
    if (!city) temp.city = "Pilih kota!";
    if (!street) temp.street = "Isi nama jalan!";
    if (!postal) temp.postal = "Kode pos wajib diisi!";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // Save data
  const handleSave = () => {
    if (!validate()) return;

    const provName =
      provinsiList.find((p) => String(p.id) === String(prov))?.name || prov;
    const cityName = city;

    const detail = `${street}, ${cityName}, ${provName}, ${subdist} ${postal}. ${extra}`.trim();

    const isPrimary = initialData?.isPrimary ?? false;

    onSave({
      label,
      detail,
      isPrimary,
    });
  };

  // helper class untuk input/select
  const inputBaseClass =
    "w-full bg-white py-3 px-4 rounded-[10px] mt-1 outline-none text-sm shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-transparent focus:border-[#344E41]/40";

  return (
    <div className="fixed inset-0 bg-black/40 z-[999] flex justify-center items-center transition-opacity">
      <div
        className={`w-full max-w-2xl rounded-[16px] p-8 md:p-10 bg-[#FFFEF6] shadow-[0_16px_40px_rgba(0,0,0,0.18)] overflow-y-auto max-h-[95vh] transform transition-all duration-300 ${
          fadeIn ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <h2 className="text-xl font-bold mb-2 text-[#344E41]">
          {initialData ? "Ubah Alamat" : "Alamat Baru"}
        </h2>
        <hr className="border-t border-[#344E41]/30 mb-6" />

        <div className="space-y-4">
          {/* Label / Nama alamat */}
          <div>
            <label className="text-sm text-[#344E41]">Nama</label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className={`${inputBaseClass} ${
                errors.label ? "border-red-500" : ""
              }`}
            />
            {errors.label && (
              <p className="text-red-500 text-xs mt-1">{errors.label}</p>
            )}
          </div>

          {/* Provinsi */}
          <div>
            <label className="text-sm text-[#344E41]">Provinsi</label>
            <select
              value={prov}
              onChange={(e) => {
                setProv(e.target.value);
                setCity("");
              }}
              className={`${inputBaseClass} ${
                errors.prov ? "border-red-500" : ""
              }`}
            >
              <option value="">Pilih Provinsi</option>
              {provinsiList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {errors.prov && (
              <p className="text-red-500 text-xs mt-1">{errors.prov}</p>
            )}
          </div>

          {/* Kota */}
          <div>
            <label className="text-sm text-[#344E41]">Kota</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={`${inputBaseClass} ${
                errors.city ? "border-red-500" : ""
              }`}
            >
              <option value="">Pilih Kota</option>
              {cityList.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city}</p>
            )}
          </div>

          {/* Kecamatan */}
          <div>
            <label className="text-sm text-[#344E41]">Kecamatan</label>
            <input
              value={subdist}
              onChange={(e) => setSubdist(e.target.value)}
              className={inputBaseClass}
            />
          </div>

          {/* Kode Pos */}
          <div>
            <label className="text-sm text-[#344E41]">Kode Pos</label>
            <input
              value={postal}
              onChange={(e) => setPostal(e.target.value)}
              className={`${inputBaseClass} ${
                errors.postal ? "border-red-500" : ""
              }`}
            />
            {errors.postal && (
              <p className="text-red-500 text-xs mt-1">{errors.postal}</p>
            )}
          </div>

          {/* Jalan */}
          <div>
            <label className="text-sm text-[#344E41]">
              Nama Jalan, Gedung, No. Rumah
            </label>
            <input
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className={`${inputBaseClass} ${
                errors.street ? "border-red-500" : ""
              }`}
            />
            {errors.street && (
              <p className="text-red-500 text-xs mt-1">{errors.street}</p>
            )}
          </div>

          {/* Keterangan tambahan (opsional) */}
          <div>
            <label className="text-sm text-[#344E41]">
              Detail Tambahan (opsional)
            </label>
            <input
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
              className={inputBaseClass}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              onClick={onClose}
              className="bg-gray-300 text-[#344E41] px-5 py-2 rounded-[10px] hover:bg-gray-400 transition text-sm font-semibold"
            >
              Kembali
            </button>
            <button
              onClick={handleSave}
              className="bg-[#344E41] text-white px-6 py-2 rounded-[10px] hover:bg-[#2a3e33] transition text-sm font-semibold"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
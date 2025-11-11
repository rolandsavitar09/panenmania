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
  const [isPrimary, setIsPrimary] = useState(false);

  // Dropdown Lists
  const [provinsiList, setProvinsiList] = useState([]);
  const [cityList, setCityList] = useState([]);

  // Loading & Error
  const [errors, setErrors] = useState({});

  // Fade Animation Class
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
      setLabel(initialData.label);
      setStreet(initialData.detail);
      setIsPrimary(initialData.isPrimary);
    }
  }, [initialData]);

  // ✅ Validasi Input
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

    const detail = `${street}, ${city}, ${prov}, ${subdist} ${postal}. ${extra}`;

    onSave({
      label,
      detail,
      isPrimary,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-[999] flex justify-center items-center transition-opacity">
      <div
        className={`bg-white w-full max-w-2xl rounded-2xl p-10 shadow-lg overflow-y-auto max-h-[95vh] transform transition-all duration-300 ${
          fadeIn ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <h2 className="text-xl font-bold mb-6">Alamat Baru</h2>

        <div className="space-y-4">
          {/* Label */}
          <div>
            <label className="text-sm">Nama</label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className={`w-full bg-[#D9D9D9] py-3 px-4 rounded-lg mt-1 outline-none ${
                errors.label && "border border-red-500"
              }`}
            />
            {errors.label && <p className="text-red-500 text-xs">{errors.label}</p>}
          </div>

          {/* Provinsi */}
          <div>
            <label className="text-sm">Provinsi</label>
            <select
              value={prov}
              onChange={(e) => {
                setProv(e.target.value);
                setCity("");
              }}
              className={`w-full bg-[#D9D9D9] py-3 px-4 rounded-lg mt-1 outline-none ${
                errors.prov && "border border-red-500"
              }`}
            >
              <option value="">Pilih Provinsi</option>
              {provinsiList.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            {errors.prov && <p className="text-red-500 text-xs">{errors.prov}</p>}
          </div>

          {/* Kota */}
          <div>
            <label className="text-sm">Kota</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={`w-full bg-[#D9D9D9] py-3 px-4 rounded-lg mt-1 outline-none ${
                errors.city && "border border-red-500"
              }`}
            >
              <option value="">Pilih Kota</option>
              {cityList.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
            {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
          </div>

          {/* Kecamatan */}
          <div>
            <label className="text-sm">Kecamatan</label>
            <input
              value={subdist}
              onChange={(e) => setSubdist(e.target.value)}
              className="w-full bg-[#D9D9D9] py-3 px-4 rounded-lg mt-1 outline-none"
            />
          </div>

          {/* Kode Pos */}
          <div>
            <label className="text-sm">Kode Pos</label>
            <input
              value={postal}
              onChange={(e) => setPostal(e.target.value)}
              className={`w-full bg-[#D9D9D9] py-3 px-4 rounded-lg mt-1 outline-none ${
                errors.postal && "border border-red-500"
              }`}
            />
            {errors.postal && <p className="text-red-500 text-xs">{errors.postal}</p>}
          </div>

          {/* Jalan */}
          <div>
            <label className="text-sm">Nama Jalan, Gedung, No. Rumah</label>
            <input
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className={`w-full bg-[#D9D9D9] py-3 px-4 rounded-lg mt-1 outline-none ${
                errors.street && "border border-red-500"
              }`}
            />
            {errors.street && <p className="text-red-500 text-xs">{errors.street}</p>}
          </div>

          {/* Checkbox */}
          <label className="flex items-center gap-2 text-sm mt-2">
            <input
              type="checkbox"
              checked={isPrimary}
              onChange={() => setIsPrimary(!isPrimary)}
            />
            Tandai sebagai Alamat Utama
          </label>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              onClick={onClose}
              className="bg-gray-300 text-[#344E41] px-5 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Kembali
            </button>
            <button
              onClick={handleSave}
              className="bg-[#344E41] text-white px-5 py-2 rounded-lg hover:bg-[#2a3e33] transition"
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
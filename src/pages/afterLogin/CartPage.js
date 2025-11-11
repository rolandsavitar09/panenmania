import React, { useState, useEffect } from "react";
import NavbarAfterLogin from "../../components/layout/NavbarAfterLogin";
import Footer from "../../components/layout/Footer";
import { useNavigate } from "react-router-dom";
import {
  TrashIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const CartPage = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Lorem Ipsum", price: 70000, qty: 1, checked: false },
    { id: 2, name: "Lorem Ipsum", price: 70000, qty: 1, checked: false },
    { id: 3, name: "Lorem Ipsum", price: 70000, qty: 1, checked: false },
  ]);

  const [checkAll, setCheckAll] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  // Hitung total harga untuk item yang dicek
  useEffect(() => {
    const total = cartItems
      .filter((item) => item.checked)
      .reduce((sum, item) => sum + item.price * item.qty, 0);
    setTotalPrice(total);
  }, [cartItems]);

  const toggleCheckAll = () => {
    const newValue = !checkAll;
    setCheckAll(newValue);
    setCartItems((prev) =>
      prev.map((item) => ({ ...item, checked: newValue }))
    );
  };

  const toggleCheckItem = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.qty > 1
          ? { ...item, qty: item.qty - 1 }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalCheckedItems = cartItems.filter((item) => item.checked).length;

  return (
    <div className="bg-[#FFFEF6] min-h-screen font-poppins text-[#344E41]">
      <NavbarAfterLogin />

      <div className="pt-24 px-10 lg:px-24 pb-10">
        {/* ✅ Tombol Kembali */}
        <button
          onClick={() => navigate(-1)}
          className="text-[#344E41] font-semibold hover:underline mb-6"
        >
          ← Kembali
        </button>

        <h1 className="text-xl font-bold mb-6">Keranjang Anda</h1>

        {/* Pilih Semua */}
        <div className="flex justify-end items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={checkAll}
            onChange={toggleCheckAll}
            className="w-5 h-5 accent-[#3A5A40]"
          />
          <span className="text-sm font-medium">Pilih Semua</span>
        </div>

        {/* List Item Keranjang */}
        <div className="space-y-5">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="relative bg-[#DADADA] rounded-xl px-4 py-5 flex items-center gap-4"
            >
              {/* Tombol hapus di pojok atas */}
              <button
                onClick={() => removeItem(item.id)}
                className="absolute top-3 right-3 text-red-600 hover:text-red-800 transition"
                aria-label={`Hapus ${item.name}`}
              >
                <TrashIcon className="w-6 h-6" />
              </button>

              {/* Checkbox */}
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleCheckItem(item.id)}
                className="w-5 h-5 accent-[#3A5A40]"
              />

              {/* Gambar */}
              <div className="w-24 h-24 bg-gray-300 rounded-xl shrink-0"></div>

              {/* Info Produk (nama + harga) */}
              <div className="flex-1">
                <p className="font-semibold text-[15px]">{item.name}</p>
                <p className="font-bold text-[16px] mt-1">
                  Rp. {item.price.toLocaleString()}
                </p>
              </div>

              {/* Kanan: Barang Tersisa (di atas) lalu kontrol qty di bawah */}
              <div className="flex flex-col items-end justify-between h-full">
                {/* Barang Tersisa di atas */}
                <p className="text-xs text-[#333] mb-2">Barang Tersisa: xx</p>

                {/* Kontrol Jumlah (di bawah) */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="bg-gray-700 text-white px-2 py-1 rounded-md"
                    aria-label={`Kurangi ${item.name}`}
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>

                  <span className="font-semibold">{item.qty}</span>

                  <button
                    onClick={() => increaseQty(item.id)}
                    className="bg-gray-700 text-white px-2 py-1 rounded-md"
                    aria-label={`Tambah ${item.name}`}
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-10 bg-[#DADADA] p-6 rounded-xl flex justify-between items-center">
          <p className="font-semibold text-md">
            Total Produk ({totalCheckedItems})
          </p>
          <div className="flex items-center gap-5">
            <p className="font-bold text-md">Rp{totalPrice.toLocaleString()}</p>
            <button
              onClick={() => navigate("/checkout")}
              className="bg-gray-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              Pesan
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;
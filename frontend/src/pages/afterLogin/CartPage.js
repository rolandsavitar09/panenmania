// src/pages/afterLogin/CartPage.js
import React, { useState, useEffect, useCallback } from "react";
import NavbarAfterLogin from "../../components/layout/NavbarAfterLogin";
import { useNavigate } from "react-router-dom";
import Popup from "../../components/common/Popup";

import BerasImage from "../../assets/images/products/beras.svg";
import IconTrash from "../../assets/images/icons/trash.svg";

// URL API Cart
const API_CART_URL = "http://localhost:5000/api/cart";

// Helper untuk format harga (Rupiah)
const formatRupiah = (number) => {
  if (number == null || typeof number !== "number") return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(number));
};
const getCustomerToken = () => localStorage.getItem("token");

/* ----- QtyControl: kontrol jumlah produk, pakai handler onIncrease/onDecrease ----- */
const QtyControl = ({ quantity, onIncrease, onDecrease }) => (
  <div className="flex h-[32px]">
    <button
      onClick={onDecrease}
      className="px-3 flex items-center justify-center bg-white text-black font-semibold text-lg border-2 border-[#3A5B40] rounded-l-[8px]"
      aria-label="kurangi"
      type="button"
    >
      −
    </button>

    <span className="px-4 flex items-center justify-center text-black font-semibold border-y-2 border-[#3A5B40] min-w-[40px] h-full bg-white">
      {quantity}
    </span>

    <button
      onClick={onIncrease}
      className="px-3 flex items-center justify-center bg-white text-black font-semibold text-lg border-2 border-[#3A5B40] rounded-r-[8px] -ml-[2px]"
      aria-label="tambah"
      type="button"
    >
      +
    </button>
  </div>
);

const CartPage = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [checkAll, setCheckAll] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // --- FUNGSI UTAMA: FETCH DATA KERANJANG ---
  const fetchCart = useCallback(async () => {
    const token = getCustomerToken();
    if (!token) {
      setLoading(false);
      return navigate("/signin");
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_CART_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        const itemsWithChecked = (data.cart || []).map((item) => ({
          ...item,
          id: item.cart_item_id,
          qty: Number(item.quantity),
          checked: true,
          imageUrl: item.imageUrl || item.image_url || null,
        }));
        setCartItems(itemsWithChecked);
      } else {
        setError(data.message || "Gagal memuat keranjang.");
      }
    } catch (err) {
      setError("Gagal terhubung ke server keranjang.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Hitung total dan sinkron status "Pilih Semua"
  useEffect(() => {
    const total = cartItems
      .filter((item) => item.checked)
      .reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 0), 0);
    setTotalPrice(total);

    const allChecked = cartItems.length > 0 && cartItems.every((item) => item.checked);
    setCheckAll(allChecked);
  }, [cartItems]);

  // Toggle pilih semua
  const toggleCheckAll = () => {
    const newValue = !checkAll;
    setCheckAll(newValue);
    setCartItems((prev) => prev.map((item) => ({ ...item, checked: newValue })));
  };

  // Toggle checkbox per item
  const toggleCheckItem = (id) => {
    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  // --- HANDLER API: UPDATE QTY (+1 atau -1) ---
  const updateQty = async (id, newQty) => {
    if (newQty < 1) return;
    const itemToUpdate = cartItems.find((item) => item.id === id);
    if (!itemToUpdate) return;

    const quantityDelta = newQty - itemToUpdate.qty;
    if (quantityDelta === 0) return;

    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, qty: newQty } : item)));

    const token = getCustomerToken();
    console.log("Kirim ke API cart:", {
      productId: itemToUpdate.product_id,
      quantity: quantityDelta,
    });

    try {
      const response = await fetch(API_CART_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: itemToUpdate.product_id,
          quantity: Number(quantityDelta),
        }),
      });

      const resBody = await response.json();

      if (!response.ok) {
        alert(resBody.message || "Gagal update kuantitas. Silakan coba lagi.");
        fetchCart();
      } else {
        if (resBody.message && /dihapus/i.test(resBody.message)) {
          fetchCart();
        }
      }
    } catch (e) {
      alert("Gagal terhubung saat update kuantitas.");
      fetchCart();
    }
  };

  const increaseQty = (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (item) updateQty(id, Number(item.qty) + 1);
  };

  const decreaseQty = (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (item && item.qty > 1) updateQty(id, Number(item.qty) - 1);
  };

  // --- HANDLER API: REMOVE ITEM ---
  const confirmRemoveItem = async () => {
    if (!deleteTarget) return;

    const token = getCustomerToken();
    const cartItemId = deleteTarget.id;

    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
    setDeleteTarget(null);

    try {
      const response = await fetch(`${API_CART_URL}/${cartItemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        alert("Gagal menghapus item dari keranjang. Memuat ulang data.");
        fetchCart();
      }
    } catch (e) {
      alert("Gagal terhubung saat menghapus item.");
      fetchCart();
    }
  };

  const totalCheckedItems = cartItems.filter((item) => item.checked).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFEF6] font-poppins">
        <p className="text-[#3A5B40] text-lg">Memuat keranjang...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFEF6] font-poppins">
        <p className="text-red-600 text-lg">Error: {error}</p>
      </div>
    );
  }

  // Kumpulkan daftar cart_item_id yang dicentang
  const selectedCartIds = cartItems.filter(i => i.checked).map(i => i.id);

  return (
    <div className="bg-[#FFFEF6] min-h-screen font-poppins text-[#344E41]">
      <NavbarAfterLogin />

      <div className="pt-24 pb-16 max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-16">
        <h1 className="text-[20px] sm:text-[22px] font-bold mb-6 sm:mb-8">Keranjang Anda</h1>

        <div className="flex justify-end items-center gap-2 mb-4">
          <input type="checkbox" checked={checkAll} onChange={toggleCheckAll} className="w-4 h-4 border-2 border-[#3A5B40] rounded-sm accent-[#3A5B40]" />
          <span className="text-xs sm:text-sm font-medium text-[#344E41]">Pilih Semua</span>
        </div>

        <div className="space-y-4 sm:space-y-5">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-[#B8D68F]/25 border-2 border-[#3A5B40] rounded-[10px] px-4 sm:px-6 py-4 flex flex-wrap md:flex-nowrap items-start md:items-center gap-4 sm:gap-5">
              <input type="checkbox" checked={item.checked} onChange={() => toggleCheckItem(item.id)} className="mt-1 w-4 h-4 border-2 border-[#3A5B40] rounded-sm accent-[#3A5B40]" />

              <div className="w-[80px] h-[80px] sm:w-[96px] sm:h-[96px] rounded-[14px] bg-white flex items-center justify-center overflow-hidden shrink-0">
                <img src={item.imageUrl || BerasImage} alt={item.name} className="w-full h-full object-contain" />
              </div>

              <div className="flex-1 min-w-[160px]">
                <p className="font-semibold text-[14px] sm:text-[15px] leading-snug">{item.name} {item.unit ? `(${item.unit})` : ""}</p>
                <p className="font-normal text-[14px] sm:text-[15px] mt-2 text-[#3A5B40]">{formatRupiah(Number(item.price) || 0)}</p>
              </div>

              <div className="flex flex-col justify-between items-end h-[96px] ml-auto mt-2 md:mt-0">
                <button onClick={() => setDeleteTarget(item)} className="mb-2" aria-label={`Hapus ${item.name}`} type="button">
                  <img src={IconTrash} alt="hapus" className="w-6 h-6" />
                </button>

                <div className="flex items-center gap-3 sm:gap-4">
                  <p className="text-[11px] sm:text-xs text-[#3A5B40] whitespace-nowrap">Tersisa: {item.stock || 0} Barang</p>
                  <QtyControl quantity={item.qty} onIncrease={() => increaseQty(item.id)} onDecrease={() => decreaseQty(item.id)} />
                </div>
              </div>
            </div>
          ))}

          {cartItems.length === 0 && !loading && <p className="text-center text-sm text-[#6B6B6B] mt-6">Keranjang Anda masih kosong.</p>}
        </div>

        <div className="mt-8 sm:mt-10 bg-[#3A5B40] rounded-[10px] px-5 sm:px-8 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between text-white gap-3 sm:gap-0">
          <p className="font-semibold text-[14px] sm:text-[15px]">Total Produk ({totalCheckedItems})</p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <p className="font-bold text-[15px] sm:text-[16px]">{formatRupiah(totalPrice)}</p>
            <button
              onClick={() => navigate("/checkout", { state: { selectedCartIds } })}
              disabled={totalCheckedItems === 0}
              className="bg-white text-[#3A5B40] font-semibold text-[14px] sm:text-[15px] px-6 py-2 rounded-[8px] hover:bg-[#F4F4F4] transition text-center disabled:opacity-50"
              type="button"
            >
              Pesan Sekarang
            </button>
          </div>
        </div>
      </div>

      {deleteTarget && (
        <Popup
          variant="delete"
          title={`Hapus ${deleteTarget.name}?`}
          message="Anda yakin ingin menghapus item ini dari keranjang?"
          onClose={() => setDeleteTarget(null)}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmRemoveItem}
        />
      )}
    </div>
  );
};

export default CartPage;
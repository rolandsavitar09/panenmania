// src/pages/afterLogin/CartPage.js
import React, { useState, useEffect, useCallback } from "react";
import NavbarAfterLogin from "../../components/layout/NavbarAfterLogin";
import { useNavigate } from "react-router-dom";
import Popup from "../../components/common/Popup";
import API from "../../api/api";

import BerasImage from "../../assets/images/products/beras.svg";
import IconTrash from "../../assets/images/icons/trash.svg";

// Helper untuk format harga (Rupiah)
const formatRupiah = (number) => {
  if (number == null || typeof number !== "number") return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(number));
};

/* ----- QtyControl ----- */
const QtyControl = ({ quantity, onIncrease, onDecrease }) => (
  <div className="flex h-[32px]">
    <button
      onClick={onDecrease}
      className="px-3 flex items-center justify-center bg-white text-black font-semibold text-lg border-2 border-[#3A5B40] rounded-l-[8px]"
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

  /* =====================
     FETCH CART
  ===================== */
  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/api/cart");
      const itemsWithChecked = (res.data.cart || []).map((item) => ({
        ...item,
        id: item.cart_item_id,
        qty: Number(item.quantity),
        checked: true,
        imageUrl: item.image_url || item.imageUrl || null,
      }));
      setCartItems(itemsWithChecked);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Gagal terhubung ke server keranjang."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  /* =====================
     TOTAL & CHECK ALL
  ===================== */
  useEffect(() => {
    const total = cartItems
      .filter((item) => item.checked)
      .reduce(
        (sum, item) =>
          sum + (Number(item.price) || 0) * (Number(item.qty) || 0),
        0
      );

    setTotalPrice(total);
    setCheckAll(
      cartItems.length > 0 && cartItems.every((item) => item.checked)
    );
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

  /* =====================
     UPDATE QTY
  ===================== */
  const updateQty = async (id, newQty) => {
    if (newQty < 1) return;

    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    const delta = newQty - item.qty;
    if (delta === 0) return;

    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: newQty } : i))
    );

    try {
      await API.post("/api/cart", {
        productId: item.product_id,
        quantity: delta,
      });
    } catch {
      fetchCart();
    }
  };

  const increaseQty = (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (item) updateQty(id, item.qty + 1);
  };

  const decreaseQty = (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (item && item.qty > 1) updateQty(id, item.qty - 1);
  };

  /* =====================
     DELETE ITEM
  ===================== */
  const confirmRemoveItem = async () => {
    if (!deleteTarget) return;

    const cartItemId = deleteTarget.id;
    setDeleteTarget(null);
    setCartItems((prev) => prev.filter((i) => i.id !== cartItemId));

    try {
      await API.delete(`/cart/${cartItemId}`);
    } catch {
      fetchCart();
    }
  };

  const totalCheckedItems = cartItems.filter((i) => i.checked).length;
  const selectedCartIds = cartItems.filter(i => i.checked).map(i => i.id);

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

  return (
    <div className="bg-[#FFFEF6] min-h-screen font-poppins text-[#344E41]">
      <NavbarAfterLogin />

      <div className="pt-24 pb-16 max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-16">
        <h1 className="text-[20px] sm:text-[22px] font-bold mb-6 sm:mb-8">
          Keranjang Anda
        </h1>

        <div className="flex justify-end items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={checkAll}
            onChange={toggleCheckAll}
            className="w-4 h-4 accent-[#3A5B40]"
          />
          <span className="text-xs sm:text-sm font-medium">
            Pilih Semua
          </span>
        </div>

        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#B8D68F]/25 border-2 border-[#3A5B40] rounded-[10px] px-4 py-4 flex gap-4"
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleCheckItem(item.id)}
                className="mt-1 accent-[#3A5B40]"
              />

              <div className="w-[80px] h-[80px] bg-white rounded-lg flex items-center justify-center">
                <img
                  src={item.imageUrl || BerasImage}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex-1">
                <p className="font-semibold text-sm">
                  {item.name} {item.unit ? `(${item.unit})` : ""}
                </p>
                <p className="mt-2">
                  {formatRupiah(Number(item.price) || 0)}
                </p>
              </div>

              <div className="flex flex-col items-end justify-between">
                <button onClick={() => setDeleteTarget(item)}>
                  <img src={IconTrash} alt="hapus" className="w-6 h-6" />
                </button>

                <QtyControl
                  quantity={item.qty}
                  onIncrease={() => increaseQty(item.id)}
                  onDecrease={() => decreaseQty(item.id)}
                />
              </div>
            </div>
          ))}

          {cartItems.length === 0 && (
            <p className="text-center text-sm mt-6">
              Keranjang Anda masih kosong.
            </p>
          )}
        </div>

        <div className="mt-10 bg-[#3A5B40] text-white rounded-lg px-6 py-4 flex justify-between items-center">
          <p>Total Produk ({totalCheckedItems})</p>
          <div className="flex items-center gap-4">
            <p className="font-bold">{formatRupiah(totalPrice)}</p>
            <button
              disabled={totalCheckedItems === 0}
              onClick={() =>
                navigate("/checkout", { state: { selectedCartIds } })
              }
              className="bg-white text-[#3A5B40] px-6 py-2 rounded-md font-semibold disabled:opacity-50"
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
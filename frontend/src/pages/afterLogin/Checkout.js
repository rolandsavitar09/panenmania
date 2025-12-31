// src/pages/afterLogin/Checkout.js
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavbarAfterLogin from "../../components/layout/NavbarAfterLogin";
import { MapPinIcon } from "@heroicons/react/24/solid";
import API from "../../api/api";

import BerasImage from "../../assets/images/products/beras.svg";
import MidtransIcon from "../../assets/images/icons/midtrans.svg";

// Helper format
const formatRupiah = (number) => {
  if (number == null || isNaN(Number(number))) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(number));
};

const hitungTotalHarga = (items) =>
  items.reduce(
    (sum, item) =>
      sum + (Number(item.price) || 0) * (Number(item.qty) || 0),
    0
  );

/* ================= LOCAL STORAGE HELPERS ================= */
const saveOrderHistory = (order) => {
  try {
    const raw = localStorage.getItem("orderHistory");
    const arr = raw ? JSON.parse(raw) : [];
    arr.unshift(order);
    localStorage.setItem("orderHistory", JSON.stringify(arr));
  } catch (e) {
    console.error("Gagal menyimpan orderHistory:", e);
  }
};

const saveOrderStatus = (orderSummary) => {
  try {
    const raw = localStorage.getItem("orderStatus");
    const arr = raw ? JSON.parse(raw) : [];
    const idx = arr.findIndex((o) => o.orderId === orderSummary.orderId);
    if (idx >= 0) arr[idx] = { ...arr[idx], ...orderSummary };
    else arr.unshift(orderSummary);
    localStorage.setItem("orderStatus", JSON.stringify(arr));
  } catch (e) {
    console.error("Gagal menyimpan orderStatus:", e);
  }
};

const saveLatestOrderDetail = (order) => {
  try {
    localStorage.setItem("latestOrderDetail", JSON.stringify(order));
  } catch (e) {
    console.error("Gagal menyimpan latestOrderDetail:", e);
  }
};

const persistOrderLocally = (order) => {
  saveOrderHistory(order);
  saveOrderStatus({
    orderId: order.orderId,
    total: order.total,
    shippingAddress: order.shippingAddress,
    paymentMethod: order.paymentMethod,
    status: order.status,
    createdAt: order.createdAt,
    source: order.source,
  });
  saveLatestOrderDetail(order);
};

/* ================= UI COMPONENTS ================= */
const AddressCard = ({ address, onChangeClick }) => (
  <section className="bg-white rounded-[10px] shadow-md px-3 py-3 sm:px-6 sm:py-5 flex flex-col sm:flex-row sm:justify-between gap-3">
    <div className="flex items-start gap-3">
      <MapPinIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#3A5B40]" />
      <div>
        <p className="font-semibold text-sm sm:text-base">{address.name}</p>
        <p className="text-xs sm:text-sm">
          {address.phone ? `(+62) ${address.phone}` : "No. HP belum tersedia"}
        </p>
        <p className="text-xs sm:text-sm">{address.detail}</p>
      </div>
    </div>
    <button
      type="button"
      onClick={onChangeClick}
      className="text-xs sm:text-sm font-semibold hover:underline"
    >
      Ubah
    </button>
  </section>
);

const ProductRow = ({ item }) => (
  <div className="flex flex-col md:flex-row md:justify-between gap-3">
    <div className="flex items-center gap-4">
      <div className="w-[70px] h-[70px] bg-white rounded-lg flex items-center justify-center">
        <img
          src={item.imageUrl || BerasImage}
          alt={item.name}
          className="w-full h-full object-contain"
        />
      </div>
      <p className="text-sm font-medium">{item.name}</p>
    </div>

    <div className="hidden md:flex w-[360px] justify-between text-sm">
      <span className="w-[110px] text-center">
        {formatRupiah(item.price)}
      </span>
      <span className="w-[80px] text-center">{item.qty}</span>
      <span className="w-[120px] text-right font-semibold">
        {formatRupiah(item.price * item.qty)}
      </span>
    </div>
  </div>
);

const PaymentSection = ({
  paymentMethod,
  setPaymentMethod,
  onOrder,
  canOrder,
  isProcessing,
}) => (
  <section className="bg-[#3A5B40] rounded-lg px-6 py-5 text-white flex flex-col gap-4">
    <div className="flex items-center gap-3">
      <p className="font-semibold text-sm">Pilih Metode Pembayaran:</p>

      <button
        onClick={() => setPaymentMethod("COD")}
        className={`px-4 py-2 rounded-lg text-sm font-semibold border ${
          paymentMethod === "COD"
            ? "bg-white text-[#3A5B40]"
            : "border-white"
        }`}
      >
        COD
      </button>

      <div className="px-4 py-2 rounded-lg bg-gray-400/50 flex items-center gap-2 opacity-70">
        <img src={MidtransIcon} alt="Midtrans" className="h-4" />
        <span className="text-xs">Coming Soon</span>
      </div>
    </div>

    <div className="flex justify-end">
      <button
        disabled={!canOrder}
        onClick={onOrder}
        className="bg-white text-[#3A5B40] px-6 py-2 rounded-md font-semibold disabled:opacity-50"
      >
        {isProcessing ? "Memproses..." : "Pesan Sekarang"}
      </button>
    </div>
  </section>
);

/* ================= CHECKOUT COMPONENT ================= */
const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedCartIds = location.state?.selectedCartIds ?? null;
  const directProductId = location.state?.productId ?? null;
  const directQuantity = Number(location.state?.quantity ?? 1);
  const isDirectBuy = !!directProductId;

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [primaryAddress, setPrimaryAddress] = useState(null);

  const fetchCheckoutData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (isDirectBuy) {
        const res = await API.get(`/products/${directProductId}`);
        const p = res.data?.product ?? res.data;

        const item = {
          id: `direct-${directProductId}`,
          product_id: directProductId,
          name: p.name,
          price: Number(p.price) || 0,
          qty: Math.max(1, directQuantity),
          imageUrl: p.image_url,
          unit: p.unit,
        };
        setCartItems([item]);
      } else {
        const res = await API.get("/cart");
        let items = (res.data.cart || []).map((i) => ({
          id: i.cart_item_id,
          product_id: i.product_id,
          name: i.name,
          price: Number(i.price),
          qty: Number(i.quantity),
          imageUrl: i.image_url,
          unit: i.unit,
        }));

        if (Array.isArray(selectedCartIds)) {
          items = items.filter((i) => selectedCartIds.includes(i.id));
        }

        setCartItems(items);
      }

      const stored = localStorage.getItem("primaryAddress");
      if (stored) setPrimaryAddress(JSON.parse(stored));
    } catch (e) {
      setError("Gagal memuat data checkout.");
    } finally {
      setLoading(false);
    }
  }, [isDirectBuy, directProductId, directQuantity, selectedCartIds]);

  useEffect(() => {
    fetchCheckoutData();
  }, [fetchCheckoutData]);

  const totalPrice = hitungTotalHarga(cartItems);

  const isAddressReady = (addr) =>
    addr && addr.detail && !addr.detail.includes("Mohon atur alamat");

  const canOrder =
    !isProcessing &&
    paymentMethod &&
    isAddressReady(primaryAddress) &&
    cartItems.length > 0;

  const handleOrder = async () => {
    if (!canOrder) return;

    setIsProcessing(true);

    const payload = {
      shippingAddress: primaryAddress.detail,
      paymentMethod,
      ...(isDirectBuy
        ? {
            directBuy: true,
            items: cartItems.map((i) => ({
              product_id: i.product_id,
              qty: i.qty,
            })),
          }
        : {
            selectedCartIds: cartItems.map((i) => i.id),
          }),
    };

    const localOrder = {
      orderId: null,
      items: cartItems,
      total: totalPrice,
      shippingAddress: primaryAddress.detail,
      paymentMethod,
      status: "pending",
      createdAt: new Date().toISOString(),
      source: isDirectBuy ? "direct" : "cart",
    };

    try {
      const res = await API.post("/orders/checkout", payload);
      const orderId =
        res.data?.order?.order_id ?? res.data?.order_id ?? `local-${Date.now()}`;

      localOrder.orderId = orderId;
      localOrder.status = "created";
      persistOrderLocally(localOrder);

      navigate("/checkout-success", { state: { orderId } });
    } catch (e) {
      localOrder.orderId = `local-${Date.now()}`;
      persistOrderLocally(localOrder);
      navigate("/checkout-success", {
        state: { orderId: localOrder.orderId },
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const alamatYangDipakai = primaryAddress || {
    name: "Default User",
    phone: "",
    detail: "Mohon atur alamat utama Anda di halaman Profil.",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Memuat checkout...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-[#FFFEF6] min-h-screen font-poppins">
      <NavbarAfterLogin />

      <div className="pt-24 pb-16 max-w-[1350px] mx-auto px-4 space-y-6">
        <AddressCard
          address={alamatYangDipakai}
          onChangeClick={() => navigate("/profile/address")}
        />

        <section className="space-y-4">
          <div className="bg-[#B8D68F]/25 rounded-lg p-6 space-y-4">
            {cartItems.map((item) => (
              <ProductRow key={item.id} item={item} />
            ))}
          </div>

          <div className="bg-[#3A5B40] text-white flex justify-between px-6 py-4 rounded-lg">
            <span>Total</span>
            <span className="font-bold">{formatRupiah(totalPrice)}</span>
          </div>
        </section>

        <PaymentSection
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          onOrder={handleOrder}
          canOrder={canOrder}
          isProcessing={isProcessing}
        />
      </div>
    </div>
  );
};

export default Checkout;

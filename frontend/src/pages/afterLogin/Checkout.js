// src/pages/afterLogin/Checkout.js
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavbarAfterLogin from "../../components/layout/NavbarAfterLogin";
import { MapPinIcon } from "@heroicons/react/24/solid";

import BerasImage from "../../assets/images/products/beras.svg";
import MidtransIcon from "../../assets/images/icons/midtrans.svg";

// URL API
const API_CART_URL = "http://localhost:5000/api/cart";
const API_CHECKOUT_URL = "http://localhost:5000/api/orders/checkout";
const API_PRODUCT_URL = "http://localhost:5000/api/products";

const getCustomerToken = () => localStorage.getItem("token");

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
  items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 0), 0);

// ---------------------- Penyimpanan lokal pesanan (utility) ----------------------

// Simpan order ke orderHistory (riwayat lengkap)
const saveOrderHistory = (order) => {
  try {
    const raw = localStorage.getItem("orderHistory");
    const arr = raw ? JSON.parse(raw) : [];
    arr.unshift(order); // newest first
    localStorage.setItem("orderHistory", JSON.stringify(arr));
  } catch (e) {
    console.error("Gagal menyimpan orderHistory:", e);
  }
};

// Simpan ringkasan/daftar status pesanan ke orderStatus
// Struktur sederhana: { orderId, total, shippingAddress, paymentMethod, status, createdAt, source }
const saveOrderStatus = (orderSummary) => {
  try {
    const raw = localStorage.getItem("orderStatus");
    const arr = raw ? JSON.parse(raw) : [];
    const idx = arr.findIndex((o) => o.orderId === orderSummary.orderId);
    if (idx >= 0) {
      arr[idx] = { ...arr[idx], ...orderSummary };
    } else {
      arr.unshift(orderSummary);
    }
    localStorage.setItem("orderStatus", JSON.stringify(arr));
  } catch (e) {
    console.error("Gagal menyimpan orderStatus:", e);
  }
};

// Simpan detail pesanan terbaru (untuk OrderHistoryDetail)
const saveLatestOrderDetail = (order) => {
  try {
    localStorage.setItem("latestOrderDetail", JSON.stringify(order));
  } catch (e) {
    console.error("Gagal menyimpan latestOrderDetail:", e);
  }
};

// Satu helper untuk persist semua tempat
const persistOrderLocally = (order) => {
  saveOrderHistory(order);

  const summary = {
    orderId: order.orderId,
    total: order.total,
    shippingAddress: order.shippingAddress,
    paymentMethod: order.paymentMethod,
    status: order.status,
    createdAt: order.createdAt,
    source: order.source,
  };
  saveOrderStatus(summary);

  saveLatestOrderDetail(order);
};

// ---------------------- Reusable UI components (tidak mengubah gaya) ----------------------
const AddressCard = ({ address, onChangeClick }) => (
  <section className="bg-white rounded-[10px] shadow-md px-3 py-3 sm:px-6 sm:py-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
    <div className="flex items-start gap-2 sm:gap-4">
      <MapPinIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#3A5B40] mt-0.5 sm:mt-1 shrink-0" />
      <div>
        <p className="font-semibold text-[13px] sm:text-[16px] mb-0.5">{address.name}</p>
        <p className="text-[11px] sm:text-sm mb-1 font-medium">{address.phone ? `(+62) ${address.phone}` : "No. HP belum tersedia"}</p>
        <p className="text-[11px] sm:text-sm leading-relaxed max-w-3xl">{address.detail}</p>
      </div>
    </div>

    <button type="button" onClick={onChangeClick} className="self-start sm:self-center text-[11px] sm:text-sm font-semibold underline-offset-2 hover:underline">Ubah</button>
  </section>
);

const ProductRow = ({ item }) => (
  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
    <div className="flex items-center gap-3 sm:gap-4 flex-1">
      <div className="w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] bg-white rounded-[14px] flex items-center justify-center overflow-hidden">
        <img src={item.imageUrl || BerasImage} alt={item.name} className="w-full h-full object-contain" />
      </div>
      <p className="text-[13px] sm:text-[14px] font-medium">{item.name}</p>
    </div>

    <div className="hidden md:flex items-center justify-between w-[360px] text-sm">
      <span className="w-[110px] text-center">{formatRupiah(item.price)}</span>
      <span className="w-[80px] text-center">{item.qty}</span>
      <span className="w-[120px] text-right font-semibold">{formatRupiah(item.price * item.qty)}</span>
    </div>

    <div className="flex md:hidden flex-col gap-1 text-[11px]">
      <div className="flex justify-between"><span className="text-[#3A5B40]/80">Harga Satuan</span><span className="font-semibold">{formatRupiah(item.price)}</span></div>
      <div className="flex justify-between"><span className="text-[#3A5B40]/80">Jumlah</span><span className="font-semibold">{item.qty}</span></div>
      <div className="flex justify-between"><span className="text-[#3A5B40]/80">Subtotal</span><span className="font-semibold">{formatRupiah(item.price * item.qty)}</span></div>
    </div>
  </div>
);

const PaymentSection = ({ paymentMethod, setPaymentMethod, onOrder, canOrder, isProcessing }) => (
  <section className="bg-[#3A5B40] rounded-[10px] px-4 py-4 sm:px-6 sm:py-6 text-white flex flex-col gap-4 sm:gap-5">
    <div className="flex items-center gap-2 sm:gap-4 flex-nowrap">
      <p className="font-semibold text-[11px] sm:text-[15px] m-0">Pilih Metode Pembayaran:</p>

      <button type="button" onClick={() => setPaymentMethod("COD")} className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-[10px] text-[11px] sm:text-sm font-semibold border ${paymentMethod === "COD" ? "bg-white text-[#3A5B40] border-white" : "bg-transparent text-white border-white hover:bg-[#588157]/50"} transition`}>COD</button>

      <div className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-[10px] bg-gray-400/50 flex items-center gap-1.5 sm:gap-2 opacity-70 cursor-not-allowed">
        <img src={MidtransIcon} alt="Midtrans" className="h-4 sm:h-5 object-contain" />
        <span className="text-[5px] sm:text-xs font-semibold text-white">Cooming Soon</span>
      </div>
    </div>

    <div className="flex justify-end">
      <button
        type="button"
        onClick={onOrder}
        disabled={!canOrder}
        className="bg-white text-[#3A5B40] font-semibold text-[13px] sm:text-[15px] px-7 sm:px-8 py-2 rounded-[8px] hover:bg-[#F4F4F4] transition disabled:opacity-50"
      >
        {isProcessing ? "Memproses..." : "Pesan Sekarang"}
      </button>
    </div>
  </section>
);

// ---------------------- Component Checkout ----------------------
const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // read selectedCartIds passed from CartPage (if any)
  const selectedCartIds = location.state?.selectedCartIds ?? null;
  // read direct-buy product data (if any)
  const directProductId = location.state?.productId ?? null;
  const directQuantity = Number(location.state?.quantity ?? 1);

  // State untuk data API
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [primaryAddress, setPrimaryAddress] = useState(null);

  // Flag: direct-buy mode (hanya produk tersebut diproses)
  const isDirectBuy = !!directProductId;

  const fetchCheckoutData = useCallback(async () => {
    const token = getCustomerToken();
    if (!token) {
      setLoading(false);
      return navigate("/signin");
    }

    setLoading(true);
    setError(null);

    // 1) Jika direct-buy mode: ambil detail produk
    if (isDirectBuy) {
      try {
        const prodRes = await fetch(`${API_PRODUCT_URL}/${directProductId}`);
        const prodBody = await prodRes.json().catch(() => null);

        if (prodRes.ok && prodBody && (prodBody.product || prodBody.data || prodBody)) {
          const p = prodBody.product ?? prodBody.data ?? prodBody;
          const price = typeof p.price === "number" ? p.price : parseFloat(p.price) || 0;
          const stock = typeof p.stock === "number" ? p.stock : parseInt(p.stock, 10) || 0;

          const item = {
            id: `direct-${directProductId}`, // synthetic id
            product_id: directProductId,
            name: p.name ?? `Product ${directProductId}`,
            price,
            qty: Math.max(1, Math.min(directQuantity, stock || directQuantity)),
            imageUrl: p.imageUrl ?? p.image_url ?? null,
            unit: p.unit ?? "",
            stock,
          };
          setCartItems([item]);
        } else {
          setError("Gagal mengambil detail produk untuk pembelian langsung. Silakan coba lagi.");
          setCartItems([]);
        }
      } catch (err) {
        console.error("Error fetching product for direct buy:", err);
        setError("Gagal terhubung ke server produk saat memproses pembelian langsung.");
        setCartItems([]);
      }

      // baca alamat dari localStorage (simulasi)
      const storedAddressDirect = localStorage.getItem("primaryAddress");
      if (storedAddressDirect) {
        try {
          const parsed = JSON.parse(storedAddressDirect);
          setPrimaryAddress(parsed);
        } catch (err) {
          console.error("Gagal parsing primaryAddress dari localStorage", err);
        }
      }
      setLoading(false);
      return;
    }

    // 2) Normal flow: ambil cart dari API dan (jika ada) filter selectedCartIds
    try {
      const cartResponse = await fetch(API_CART_URL, { headers: { Authorization: `Bearer ${token}` }});
      const cartData = await cartResponse.json();

      if (cartResponse.ok) {
        const checkedItems = (cartData.cart || []).filter(item => item.quantity > 0);

        // Normalisasi
        let items = checkedItems.map(item => ({
          id: item.cart_item_id,
          product_id: item.product_id,
          name: item.name,
          price: parseFloat(item.price),
          qty: Number(item.quantity),
          imageUrl: item.imageUrl || item.image_url,
          unit: item.unit
        }));

        // Jika ada selectedCartIds -> filter
        if (Array.isArray(selectedCartIds)) {
          items = items.filter(i => selectedCartIds.includes(i.id));
          if (items.length === 0) {
            setError("Tidak ada item terpilih untuk checkout. Silakan kembali ke keranjang.");
          }
        } else {
          if (items.length === 0) {
            setError("Keranjang kosong atau tidak ada item yang dipilih.");
          }
        }

        setCartItems(items);
      } else {
        setError(cartData.message || "Gagal memuat item keranjang.");
      }
    } catch (err) {
      console.error(err);
      setError("Gagal terhubung ke server saat memuat keranjang.");
    }

    // baca alamat dari localStorage (simulasi)
    const storedAddress = localStorage.getItem("primaryAddress");
    if (storedAddress) {
      try {
        const parsed = JSON.parse(storedAddress);
        setPrimaryAddress(parsed);
      } catch (err) {
        console.error("Gagal parsing primaryAddress dari localStorage", err);
      }
    } else {
      setPrimaryAddress(null);
    }

    setLoading(false);
  }, [navigate, selectedCartIds, isDirectBuy, directProductId, directQuantity]);

  useEffect(() => {
    fetchCheckoutData();
  }, [fetchCheckoutData]);

  const totalPrice = hitungTotalHarga(cartItems);

  // apakah user boleh memesan? (enable button)
  const canOrder = !isProcessing && paymentMethod && isAddressReady(primaryAddress) && cartItems.length > 0;

  function isAddressReady(addr) {
    return addr && addr.detail && addr.detail !== "Mohon atur alamat utama Anda di halaman Profil.";
  }

  // ---------------------- Robust handleOrder (anti-error) ----------------------
  const handleOrder = async () => {
    const debugToken = getCustomerToken();
    console.info("DEBUG token:", debugToken ? debugToken.slice(0, 15) + "..." : "TOKEN KOSONG");

    if (!canOrder) {
      if (!isAddressReady(primaryAddress)) return alert("Mohon lengkapi alamat pengiriman terlebih dulu.");
      if (cartItems.length === 0) return alert("Keranjang kosong atau tidak ada item untuk dipesan.");
      if (!paymentMethod) return alert("Pilih metode pembayaran.");
      return;
    }

    setIsProcessing(true);
    const token = getCustomerToken();

    // siapkan payload untuk backend
    const payload = {
      shippingAddress: primaryAddress.detail,
      paymentMethod,
    };

    if (isDirectBuy) {
      payload.directBuy = true;
      payload.items = cartItems.map(i => ({ product_id: i.product_id, qty: i.qty }));
    } else {
      payload.selectedCartIds = cartItems.map(i => i.id);
    }

    // buat objek order lokal (untuk orderHistory dan orderStatus)
    const localOrder = {
      orderId: null, // nanti diisi
      items: cartItems.map(i => ({ product_id: i.product_id, name: i.name, price: i.price, qty: i.qty })),
      total: totalPrice,
      shippingAddress: primaryAddress.detail,
      paymentMethod,
      status: "pending",
      createdAt: new Date().toISOString(),
      source: isDirectBuy ? "direct" : "cart",
    };

    try {
      // Debug: tampilkan payload di console agar backend developer bisa mereplikasi
      console.info("Checkout payload:", payload);
      console.log("DEBUG TOKEN FRONTEND =", token);
      const response = await fetch(API_CHECKOUT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      // Baca response body sebagai text dulu (aman jika server mengembalikan HTML/stacktrace)
      const rawText = await response.text().catch(() => null);
      let data = null;
      try {
        data = rawText ? JSON.parse(rawText) : null;
      } catch (e) {
        // response bukan JSON -> tetap simpan rawText untuk debugging
        console.warn("Non-JSON response from checkout:", rawText);
      }

      // Tentukan orderId (prioritaskan dari server jika tersedia)
      const generatedId = data?.order?.order_id ?? data?.order_id ?? `local-${Date.now()}`;
      localOrder.orderId = generatedId;

      if (response.ok) {
        // sukses: gunakan id server jika tersedia, status created
        localOrder.status = "created";
        persistOrderLocally(localOrder);

        navigate("/checkout-success", { state: { orderId: localOrder.orderId } });
      } else {
        // server error atau response not ok -> simpan lokal sebagai pending
        localOrder.status = "pending";
        localOrder.error = (data && (data.message || data.error)) || rawText || `HTTP ${response.status}`;
        persistOrderLocally(localOrder);

        // Tampilkan pesan yang informatif ke user (ringkas)
        alert("Terjadi kesalahan server saat memproses pesanan. Pesanan disimpan lokal sebagai pending.\n\nPesan: " + (localOrder.error || `HTTP ${response.status}`));
        navigate("/checkout-success", { state: { orderId: localOrder.orderId } });
      }
    } catch (e) {
      console.error("Checkout error (network/exception):", e);
      // jaringan/exception -> simpan lokal sebagai pending
      localOrder.orderId = localOrder.orderId || `local-${Date.now()}`;
      localOrder.status = "pending";
      localOrder.error = e?.message || "Network error";
      persistOrderLocally(localOrder);

      alert("Gagal terhubung ke server — pesanan disimpan secara lokal sebagai pending.");
      navigate("/checkout-success", { state: { orderId: localOrder.orderId } });
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
      <div className="min-h-screen flex items-center justify-center bg-[#FFFEF6] font-poppins">
        <p className="text-[#3A5B40] text-lg">Memuat data checkout...</p>
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

  const isCartEmpty = cartItems.length === 0;

  return (
    <div className="bg-[#FFFEF6] min-h-screen font-poppins text-[#3A5B40] flex flex-col">
      <NavbarAfterLogin />

      <div className="pt-24 pb-16 max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-16 space-y-6 sm:space-y-8 w-full">
        {isCartEmpty && (
          <div className="text-center bg-yellow-100 p-4 rounded-lg text-yellow-800 font-semibold mt-8">
            Keranjang Anda kosong! Silakan tambahkan produk sebelum checkout.
          </div>
        )}

        <AddressCard address={alamatYangDipakai} onChangeClick={() => navigate("/profile/address")} />

        <section className="space-y-2">
          <div className="bg-[#B8D68F]/25 px-4 py-5 sm:px-6 sm:py-6 rounded-[10px]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4">
              <h2 className="font-semibold text-[15px] sm:text-[17px]">Produk Dipesan</h2>

              <div className="hidden md:flex text-xs sm:text-sm font-semibold w-[360px] justify-between text-right">
                <span className="w-[110px] text-center">Harga Satuan</span>
                <span className="w-[80px] text-center">Jumlah</span>
                <span className="w-[120px] text-right">Subtotal</span>
              </div>
            </div>

            <div className="border-t border-[#3A5B40] mb-4" />

            <div className="space-y-4">
              {cartItems.map((item) => (
                <ProductRow key={item.id} item={item} />
              ))}
            </div>
          </div>

          <div className="bg-[#3A5B40] text-white flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 rounded-[8px]">
            <span className="font-semibold text-[13px] sm:text-[15px]">Total Produk ({cartItems.length})</span>
            <span className="font-bold text-[15px] sm:text-[16px]">{formatRupiah(totalPrice)}</span>
          </div>
        </section>

        <PaymentSection paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} onOrder={handleOrder} canOrder={canOrder} isProcessing={isProcessing} />
      </div>
    </div>
  );
};

export default Checkout;


///const response = await fetch(API_CHECKOUT_URL, {
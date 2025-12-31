// src/admin/component/pages/AdminOrders.js
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../../api/api";

// ICONS (HARUS DI BAGIAN TERATAS)
import deliveryIcon from "../../../assets/images/icons/delivery.png";
import dollarIcon from "../../../assets/images/icons/dollar.png";
import likeIcon from "../../../assets/images/icons/like.png";
import orderIcon from "../../../assets/images/icons/order.png";
import packageIcon from "../../../assets/images/icons/package.png";

// URL API (PRODUCTION)
const API_ORDERS_ADMIN_URL = "/api/orders/admin/all";
const API_UPDATE_STATUS = "/api/orders/admin/status";
const API_ADMIN_DETAIL = "/api/orders/admin";
const API_DELETE_ORDER = "/api/orders/admin";

const AdminOrders = () => {
  const bgPage = "#FFFEF6";
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const statusOptions = [
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "SETTLED",
    "CANCELLED",
  ];

  const getDisplayStatus = (status) => {
    switch ((status || "").toUpperCase()) {
      case "PENDING":
        return "Pesanan Dibuat";
      case "PROCESSING":
        return "Pembayaran Dikonfirmasi";
      case "SHIPPED":
        return "Pesanan Dikirim";
      case "DELIVERED":
        return "Diterima User";
      case "SETTLED":
        return "Selesai";
      case "CANCELLED":
        return "Dibatalkan";
      default:
        return "Unknown";
    }
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get(API_ORDERS_ADMIN_URL);

      const mapped = (data.orders || []).map((o) => ({
        id: o.order_id,
        email: o.customer_email,
        customerName: o.customer_name,
        status: o.order_status,
        total: Number(o.total_amount || 0),
        dateTime: o.created_at
          ? new Date(o.created_at).toLocaleString("id-ID")
          : "",
        shippingAddress: o.shipping_address,
        phone: o.customer_phone || null,
      }));

      setOrders(mapped);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      } else {
        setError(
          err.response?.data?.message || "Gagal memuat daftar pesanan."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const allChecked = selectedIds.length === orders.length && orders.length > 0;

  const formatRupiah = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);

  const toggleSelectAll = () => {
    if (allChecked) setSelectedIds([]);
    else setSelectedIds(orders.map((o) => o.id));
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const fetchAdminOrderDetails = async (id) => {
    setLoading(true);
    try {
      const { data } = await API.get(`${API_ADMIN_DETAIL}/${id}`);
      const o = data.order;

      const mapped = {
        ...o,
        phone: o.customer_phone || null,
        items: (o.items || []).map((it) => ({
          ...it,
          imageUrl: it.image_url
            ? `${API.defaults.baseURL}${it.image_url}`
            : null,
        })),
      };

      setSelectedOrder(mapped);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      } else {
        setError(
          err.response?.data?.message || "Gagal memuat detail pesanan."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const prevOrders = [...orders];
    setOrders((o) =>
      o.map((x) => (x.id === id ? { ...x, status: newStatus } : x))
    );

    try {
      const { data } = await API.put(`${API_UPDATE_STATUS}/${id}`, {
        status: newStatus,
      });

      setOrders((o) =>
        o.map((x) =>
          x.id === id ? { ...x, status: data.order.order_status } : x
        )
      );

      if (selectedOrder?.id === id) {
        setSelectedOrder((p) => ({
          ...p,
          order_status: data.order.order_status,
        }));
      }
    } catch (err) {
      setOrders(prevOrders);
      setError(
        err.response?.data?.message || "Gagal memperbarui status pesanan."
      );
    }
  };

  const openDeleteModal = (order) => {
    setDeleteTarget(order);
    setIsDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`${API_DELETE_ORDER}/${deleteTarget.id}`);
      setOrders((o) => o.filter((x) => x.id !== deleteTarget.id));
      setSelectedOrder(null);
      closeDeleteModal();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menghapus pesanan.");
    }
  };

  /* ---------- UI / render functions ---------- */

  const Sidebar = () => (
    <aside className="w-[240px] bg-white flex flex-col border-r border-[#E5E7EB]" style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.10)" }}>
      <div className="flex items-center gap-3 px-6 py-6 border-b border-[#E5E7EB]">
        <div className="w-10 h-10 rounded-full bg-[#3A5B40]/10 border border-[#3A5B40] flex items-center justify-center">
          <span className="text-[10px] text-[#3A5B40]">LOGO</span>
        </div>
        <span className="font-semibold text-[#3A5B40]">Panen Mania</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-3 text-sm text-[#3A5B40]">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#FFFEF6]" onClick={() => navigate("/admin/dashboard")}>Beranda</button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#FFFEF6]" onClick={() => navigate("/admin/products")}>Produk</button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md bg-[#FFFEF6] font-semibold" onClick={() => navigate("/admin/orders")}>Pesanan</button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#FFFEF6]" onClick={() => navigate("/admin/users")}>Pengguna</button>
      </nav>
    </aside>
  );

  const TopBar = ({ title }) => (
    <header className="w-full px-8 py-4 flex items-center justify-between bg-white" style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.10)" }}>
      <div className="text-base font-semibold text-[#3A5B40]">{title}</div>
      <div className="flex items-center gap-3 max-w-xl w-full">
        <div className="flex-1">
          <input type="text" placeholder="Cari sesuatu ..." className="w-full h-10 rounded-[10px] px-4 text-sm placeholder-[#3A5B40] outline-none border border-transparent" style={{ backgroundColor: "rgba(88,129,87,0.15)", color: "#3A5B40" }} />
        </div>
        <button type="button" className="h-10 w-10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="#3A5B40" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" /></svg>
        </button>
        <div className="w-9 h-9 rounded-full bg-[#3A5B40]/10 border border-[#3A5B40]/40" />
      </div>
    </header>
  );

  const renderList = () => (
    <main className="flex-1 px-10 py-8">
      <div className="w-full max-w-5xl mx-auto bg-white rounded-[10px] px-6 md:px-8 py-6" style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.10)" }}>
        <h2 className="text-sm font-semibold text-[#3A5B40] mb-4">Semua Pesanan</h2>

        {loading && <div className="text-center py-10 text-[#3A5B40]">Memuat daftar pesanan...</div>}
        {error && <div className="text-center py-10 text-[#96352C]">{error}</div>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="text-[11px] font-semibold text-[#3A5B40] border-b border-[#E5E7EB] pb-3 mb-2">
                <div className="grid grid-cols-[40px,3fr,2fr,2fr,2fr,1.5fr] items-center gap-2">
                  <div><input type="checkbox" className="accent-[#3A5B40]" checked={allChecked} onChange={toggleSelectAll} /></div>
                  <div>Nama Pengguna</div>
                  <div className="text-left">Status</div>
                  <div className="text-center">Total</div>
                  <div className="text-left">Tanggal</div>
                  <div className="text-left">Aksi</div>
                </div>
              </div>

              <div className="space-y-3 text-xs text-[#3A5B40]">
                {orders.length === 0 ? (
                  <div className="text-center py-4 text-[#3A5B40]/70">Belum ada pesanan masuk.</div>
                ) : (
                  orders.map((order) => {
                    const selectStyle = getSelectStyles(order.status);
                    return (
                      <div key={order.id} className="border-b border-[#E5E7EB] pb-3 last:border-b-0">
                        <div className="grid grid-cols-[40px,3fr,2fr,2fr,2fr,1.5fr] items-center gap-2">
                          <div><input type="checkbox" className="accent-[#3A5B40]" checked={selectedIds.includes(order.id)} onChange={() => toggleSelectOne(order.id)} /></div>
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-[#3A5B40]/10 flex items-center justify-center"><span className="text-[9px] text-[#3A5B40]">P</span></div>
                            <span>{order.customerName || order.email}</span>
                          </div>
                          <div className="text-left">
                            <div className="relative">
                              <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)} className="w-full h-5 rounded-[10px] pl-2 pr-6 text-[11px] focus:outline-none focus:ring-1 focus:ring-[#3A5B40] appearance-none min-w-[160px]" style={selectStyle}>
                                {statusOptions.map((opt) => (<option key={opt} value={opt}>{getDisplayStatus(opt)}</option>))}
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke={(order.status === "DELIVERED" || order.status === "SETTLED" || order.status === "CANCELLED") ? "#FFFFFF" : "#3A5B40"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="6 9 12 15 18 9" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div className="pl-16 font-semibold">{formatRupiah(order.total)}</div>
                          <div className="text-left">{order.dateTime}</div>
                          <div className="flex items-center gap-3 justify-start">
                            <button type="button" onClick={() => fetchAdminOrderDetails(order.id)}>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#3A5B40" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></svg>
                            </button>
                            <button type="button" onClick={() => openDeleteModal(order)}>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#96352C" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );

  const StepArrow = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 24" className="w-8 h-5 md:w-10 md:h-6 flex-shrink-0" fill="none">
      <line x1="2" y1="12" x2="32" y2="12" stroke="#3A5B40" strokeWidth="1.5" strokeLinecap="round" />
      <polyline points="26,6 32,12 26,18" stroke="#3A5B40" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );

  // renderDetail uses selectedOrder (admin detail) and layout similar to OrderHistoryDetail
  const renderDetail = () => {
    if (!selectedOrder) return null;

    const currentOrder = selectedOrder;
    const subtotalProduk = Array.isArray(currentOrder.items) ? currentOrder.items.reduce((s, it) => s + (Number(it.price_at_order || 0) * Number(it.quantity || 0)), 0) : 0;
    const subtotalPengiriman = Number(currentOrder.shipping_cost || 0);
    const subtotalPengemasan = 1000; // dummy
    const total = Number(currentOrder.total_amount || subtotalProduk + subtotalPengemasan + subtotalPengiriman);

    const steps = [
      { icon: orderIcon, label: "Pesanan Diterima", status: "PENDING" },
      { icon: dollarIcon, label: "Pembayaran Dikonfirmasi", status: "PROCESSING" },
      { icon: deliveryIcon, label: "Pesanan Dikirim", status: "SHIPPED" },
      { icon: packageIcon, label: "Pesanan Diterima", status: "DELIVERED" },
      { icon: likeIcon, label: "Selesai", status: "SETTLED" },
    ];
    const currentStepIndex = steps.findIndex(s => s.status === (currentOrder.order_status || '').toUpperCase());

    return (
      <main className="flex-1 px-4 md:px-10 py-6 md:py-8">
        <div className="max-w-5xl mx-auto space-y-4 md:space-y-6">
          <div className="w-full bg-white rounded-[15px] px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2" style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.08)" }}>
            <button type="button" className="flex items-center gap-2 text-[#3A5B40] text-sm font-semibold" onClick={() => setSelectedOrder(null)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#3A5B40" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
              <span>Kembali</span>
            </button>
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-xs md:text-sm text-[#3A5B40]">
              <span>ID Pesanan : {currentOrder.order_id}</span>
              <span className="font-semibold">{getDisplayStatus(currentOrder.order_status)}</span>
            </div>
          </div>

          <div className="rounded-[15px] border border-[#3A5B40] px-4 md:px-8 py-5 md:py-7 space-y-5 md:space-y-7" style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.10)", backgroundColor: "#FFFEF6" }}>
            <div className="-mx-4 md:-mx-8 -mt-5 md:-mt-7 px-4 md:px-8 pt-5 md:pt-7 pb-0 bg-white rounded-t-[15px]">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {steps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-3 md:gap-4 flex-1 min-w-[90px]">
                      <div className="flex flex-col items-center text-center">
                        <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-[3px] border-[#3A5B40] flex items-center justify-center mb-2 bg-white ${idx <= currentStepIndex ? 'border-opacity-100' : 'border-opacity-30'}`}>
                          <img src={step.icon} alt={step.label} className="w-9 h-9 md:w-12 md:h-12 object-contain" />
                        </div>
                        <p className={`text-[10px] md:text-xs text-[#3A5B40] leading-tight ${idx <= currentStepIndex ? 'font-semibold' : 'opacity-60'}`}>{step.label}</p>
                      </div>
                      {idx < steps.length - 1 && <div className="flex-1 flex justify-center md:justify-start"><StepArrow /></div>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-[#3A5B40] mt-5 -mx-4 md:-mx-8" />
            </div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              <div className="flex-1 space-y-2 text-xs md:text-sm text-[#3A5B40]">
                <div className="font-semibold">{currentOrder.customerName || currentOrder.email}</div>
                {/* gunakan fallback sama persis seperti OrderHistoryDetail */}
                <div className="text-xs">{currentOrder.phone || "(Nomor tidak tersedia)"}</div>
                <p className="mt-2 leading-relaxed">{currentOrder.shipping_address || 'Alamat tidak tercatat.'}</p>
              </div>

              <div className="hidden md:block w-px bg-[#3A5B40]" />

              <div className="flex-[1.2]">
                {Array.isArray(currentOrder.items) && currentOrder.items.length > 0 ? (
                  currentOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 sm:gap-4 rounded-[10px] px-3 sm:px-4 py-3 mb-2" style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.06)", backgroundColor: "#FFFFFF" }}>
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-md bg-white flex items-center justify-center border border-[#E5E7EB]">
                        <img src={item.imageUrl || ""} alt={item.name || "Produk"} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 text-xs md:text-sm text-[#3A5B40] space-y-1">
                        <div className="font-semibold">{item.name}</div>
                        <div className="text-xs">x{item.quantity || 0} ({item.unit || "-"})</div>
                      </div>
                      <div className="text-xs md:text-sm text-[#3A5B40] font-medium">
                        {formatRupiah(Number(item.price_at_order || 0) * Number(item.quantity || 0))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-center text-gray-500 py-4">Tidak ada item dalam pesanan ini.</div>
                )}
              </div>
            </div>

            <div className="border-t border-[#3A5B40]" />

            <div className="space-y-2 text-xs md:text-sm text-[#3A5B40]">
              <div className="flex justify-between"><span>Subtotal Produk</span><span>{formatRupiah(subtotalProduk)}</span></div>
              <div className="flex justify-between"><span>Biaya Pengemasan</span><span>{formatRupiah(subtotalPengemasan)}</span></div>
              <div className="flex justify-between"><span>Subtotal Pengiriman</span><span>{formatRupiah(subtotalPengiriman)}</span></div>
              <div className="border-t border-[#3A5B40] mt-3 pt-3 flex justify-between font-semibold"><span>Total Pemesanan</span><span>{formatRupiah(total)}</span></div>
            </div>
          </div>
        </div>
      </main>
    );
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: bgPage, fontFamily: '"Inter", sans-serif' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar title={selectedOrder ? "Detail Pesanan" : "Pesanan"} />
        {selectedOrder ? renderDetail() : renderList()}
      </div>

      {isDeleteOpen && deleteTarget && (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative w-full max-w-[420px] bg-white border-[3px] border-[#3A5B40] rounded-[15px] shadow-[0_4px_6px_rgba(0,0,0,0.1)] px-6 py-8 text-center">
            <div className="flex justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#B0413C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
            </div>
            <h2 className="text-[18px] font-bold text-[#3A5B40] mb-3">Hapus Pesanan</h2>
            <p className="text-sm text-[#3A5B40] mb-6">Anda akan menghapus pesanan dengan ID <span className="font-semibold">{deleteTarget.id}</span>.<br/>Apakah Anda yakin?</p>
            <div className="flex justify-center gap-4">
              <button type="button" className="h-[40px] px-5 rounded-[10px] text-sm font-medium bg-[#B0413C] text-white" onClick={closeDeleteModal}>Tidak!</button>
              <button type="button" className="h-[40px] px-6 rounded-[10px] text-sm font-medium bg-[#3A5B40] text-white" onClick={confirmDelete}>Ya, Hapus!</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
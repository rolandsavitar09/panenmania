// backend/src/controllers/orderController.js
/**
 * Controller order — mendukung cart checkout, directBuy, history, detail, dan admin listing.
 *
 * Komentar singkat berbahasa Indonesia ada di bagian penting.
 */

const db = require('../config/db');
const orderModel = require('../models/orderModel');
const cartModel = require('../models/cartModel');

/** Helper: normalisasi items masuk (dibuat defensif) */
const normalizeIncomingItems = (items = []) => {
  if (!Array.isArray(items)) throw new Error('items harus berupa array.');
  return items.map((it, idx) => {
    const product_id = Number(it.product_id ?? it.productId ?? it.id);
    const quantity = Number(it.quantity ?? it.qty ?? it.qtyOrdered ?? it.cart_quantity ?? 0);
    const price = it.price !== undefined && it.price !== null ? Number(it.price) : undefined;

    if (!product_id || Number.isNaN(product_id)) {
      throw new Error(`items[${idx}].product_id tidak valid`);
    }
    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw new Error(`items[${idx}] quantity tidak valid`);
    }

    return {
      product_id,
      quantity: Math.floor(quantity),
      price: Number.isFinite(price) ? price : undefined
    };
  });
};

/**
 * Checkout controller (mendukung cart & directBuy)
 */
const checkout = async (req, res) => {
  const userId = req.user && (req.user.user_id ?? req.user.id);
  if (!userId) return res.status(401).json({ success: false, message: 'User tidak terautentikasi.' });

  const { shippingAddress, paymentMethod, directBuy, items: incomingItems } = req.body;

  if (!shippingAddress || typeof shippingAddress !== 'string') {
    return res.status(400).json({ success: false, message: 'Alamat pengiriman wajib diisi.' });
  }
  if (!paymentMethod || typeof paymentMethod !== 'string') {
    return res.status(400).json({ success: false, message: 'Metode pembayaran wajib diisi.' });
  }

  try {
    let items = [];
    let totalAmount = 0;

    if (directBuy) {
      // Direct buy flow (controller handles transaction)
      if (!incomingItems || !Array.isArray(incomingItems) || incomingItems.length === 0) {
        return res.status(400).json({ success: false, message: 'items diperlukan untuk direct buy.' });
      }

      // Normalisasi & validasi
      items = normalizeIncomingItems(incomingItems);

      // Pastikan semua produk ada & ambil harga dari DB jika price tidak dikirim
      const productIds = [...new Set(items.map(i => i.product_id))];
      const prodQ = `SELECT product_id, price, stock FROM products WHERE product_id = ANY($1::int[]) FOR UPDATE`;
      const client = await db.connect();
      try {
        await client.query('BEGIN');

        const { rows: prodRows } = await client.query(prodQ, [productIds]);
        const priceMap = new Map(prodRows.map(r => [Number(r.product_id), { price: Number(r.price), stock: Number(r.stock) }]));

        // Lengkapi price dari DB jika tidak dikirim; cek stok & validasi
        for (const it of items) {
          const pd = priceMap.get(it.product_id);
          if (!pd) {
            throw new Error(`Produk id=${it.product_id} tidak ditemukan.`);
          }
          if (!Number.isFinite(it.price)) {
            it.price = pd.price;
          }
          if (!Number.isFinite(it.price) || it.price < 0) {
            throw new Error(`Produk id=${it.product_id} memiliki harga tidak valid.`);
          }
          if (pd.stock < it.quantity) {
            throw new Error(`Stok tidak cukup untuk product_id=${it.product_id} (tersisa=${pd.stock}, diminta=${it.quantity}).`);
          }
        }

        // Hitung total server-side (kebenaran)
        totalAmount = items.reduce((s, it) => s + (Number(it.price) || 0) * Number(it.quantity), 0);

        // 1) Insert order header
        const orderInsText = `
          INSERT INTO orders (user_id, total_amount, shipping_address, payment_method, order_status)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING order_id, created_at
        `;
        const { rows: orderRows } = await client.query(orderInsText, [userId, totalAmount, shippingAddress, paymentMethod, 'PENDING']);
        const orderId = orderRows[0].order_id;

        // 2) Insert order_items (loop) and deduct stock in memory
        const insertedItems = [];
        for (const it of items) {
          const insertItemText = `
            INSERT INTO order_items (order_id, product_id, quantity, price_at_order)
            VALUES ($1, $2, $3, $4)
            RETURNING order_item_id
          `;
          const { rows: itemRows } = await client.query(insertItemText, [orderId, it.product_id, it.quantity, it.price]);
          insertedItems.push({
            order_item_id: itemRows[0].order_item_id,
            product_id: it.product_id,
            quantity: it.quantity,
            price_at_order: it.price
          });
        }

        // 3) Update stok untuk tiap produk (pakai batch)
        for (const pid of productIds) {
          // hitung new stock berdasarkan items requested
          const pd = priceMap.get(pid);
          const qtyRequested = items.filter(x => x.product_id === pid).reduce((s, x) => s + x.quantity, 0);
          const newStock = pd.stock - qtyRequested;
          await client.query(`UPDATE products SET stock = $1 WHERE product_id = $2`, [newStock, pid]);
        }

        // 4) Update order status -> CREATED dan updated_at
        await client.query(`UPDATE orders SET order_status = $1, updated_at = CURRENT_TIMESTAMP WHERE order_id = $2`, ['CREATED', orderId]);

        await client.query('COMMIT');

        // Susun response object (mirip orderModel response)
        const orderResult = {
          order_id: orderId,
          total_amount: Number(totalAmount),
          shipping_address: shippingAddress,
          payment_method: paymentMethod,
          order_status: 'CREATED',
          created_at: orderRows[0].created_at,
          items: insertedItems
        };

        return res.status(201).json({ success: true, message: 'Pesanan berhasil dibuat (direct buy).', order: orderResult });
      } catch (err) {
        try { await client.query('ROLLBACK'); } catch (e) { /* ignore */ }
        console.error('Error saat directBuy checkout:', err && err.stack ? err.stack : err);
        if (err && /tidak ditemukan|Stok tidak cukup|stok insufficient|quantity invalid|harga tidak valid|price not valid/i.test(err.message)) {
          return res.status(400).json({ success: false, message: err.message });
        }
        return res.status(500).json({ success: false, message: 'Terjadi kesalahan server saat memproses directBuy.' });
      } finally {
        client.release();
      }

    } else {
      // Cart flow (gunakan model transaksional yang sudah ada)
      const cartItems = await cartModel.getCartItemsByUserId(userId);
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).json({ success: false, message: 'Keranjang belanja Anda kosong.' });
      }

      // Normalisasi cart -> model expects items with quantity
      const normalizedItems = cartItems.map(ci => ({
        product_id: Number(ci.product_id),
        quantity: Number(ci.quantity),
        price: Number(ci.price ?? 0)
      }));

      // Hitung total server-side
      totalAmount = normalizedItems.reduce((s, it) => s + (Number(it.price) || 0) * Number(it.quantity), 0);

      // Panggil model transaksional (model akan membersihkan cart user)
      const created = await orderModel.createOrderFromCart(userId, normalizedItems, totalAmount, shippingAddress, paymentMethod);
      return res.status(201).json({ success: true, message: 'Pesanan berhasil dibuat!', order: created });
    }
  } catch (err) {
    console.error('Error in checkout controller (outer):', err && err.stack ? err.stack : err);
    if (err && /quantity invalid|stock insufficient|tidak ditemukan|Keranjang belanja Anda kosong|items harus berupa array/.test(err.message)) {
      return res.status(400).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server saat memproses pesanan.' });
  }
};

/**
 * getOrderHistory
 */
const getOrderHistory = async (req, res) => {
  try {
    const userId = req.user && (req.user.user_id ?? req.user.id);
    if (!userId) return res.status(401).json({ success: false, message: 'User tidak terautentikasi.' });

    const orders = await orderModel.getOrdersByUserId(userId);

    const formatted = (orders || []).map(o => ({
      ...o,
      total_amount: typeof o.total_amount === 'string' ? parseFloat(o.total_amount) : o.total_amount,
      first_item_image_url: o.first_item_image_url ? `http://localhost:5000${o.first_item_image_url}` : null
    }));

    return res.status(200).json({ success: true, orders: formatted });
  } catch (err) {
    console.error('Error saat mengambil riwayat pesanan:', err && err.stack ? err.stack : err);
    return res.status(500).json({ success: false, message: 'Gagal mengambil riwayat pesanan.' });
  }
};

/**
 * getOrderDetails (customer)
 */
const getOrderDetails = async (req, res) => {
  try {
    const userId = req.user && (req.user.user_id ?? req.user.id);
    if (!userId) return res.status(401).json({ success: false, message: 'User tidak terautentikasi.' });

    const { orderId: rawOrderId } = req.params;
    if (!rawOrderId || typeof rawOrderId !== 'string') {
      return res.status(400).json({ success: false, message: 'ID Pesanan tidak valid.' });
    }

    const extractLastDigitsGroup = (s) => {
      const groups = s.match(/\d+/g) || [];
      return groups.length ? groups[groups.length - 1] : null;
    };

    const cleanedFull = rawOrderId.replace(/[^0-9]/g, '');
    let candidate = null;
    if (rawOrderId.includes('-')) candidate = extractLastDigitsGroup(rawOrderId);
    else candidate = extractLastDigitsGroup(rawOrderId) || cleanedFull;
    if (!candidate && cleanedFull) candidate = cleanedFull;
    if (!candidate) return res.status(400).json({ success: false, message: 'ID Pesanan tidak valid.' });

    const parsed = parseInt(candidate, 10);
    if (isNaN(parsed) || parsed <= 0) return res.status(400).json({ success: false, message: 'ID Pesanan tidak valid.' });

    const INT32_MAX = 2147483647;
    if (parsed > INT32_MAX) return res.status(400).json({ success: false, message: 'ID Pesanan terlalu besar.' });

    const foundOrder = await orderModel.getOrderDetailsByOrderId(parsed, userId);
    if (!foundOrder) return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan atau bukan milik Anda.' });

    // normalisasi image urls & format
    const items = (foundOrder.items || []).map(item => ({
      ...item,
      price_at_order: parseFloat(item.price_at_order),
      imageUrl: item.image_url ? `http://localhost:5000${item.image_url}` : item.imageUrl || null
    }));

    const formattedOrder = {
      ...foundOrder,
      items,
      total_amount: typeof foundOrder.total_amount === 'string' ? parseFloat(foundOrder.total_amount) : foundOrder.total_amount,
      customerName: req.user.name || req.user.full_name || 'Customer'
    };

    return res.status(200).json({ success: true, order: formattedOrder });
  } catch (err) {
    console.error('*** FATAL ERROR in getOrderDetails:', err && err.stack ? err.stack : err);
    return res.status(500).json({ success: false, message: 'Gagal mengambil detail pesanan.' });
  }
};

/**
 * ADMIN: daftar order
 */
const getAllOrdersForAdmin = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'User tidak terautentikasi.' });
    if (req.user.role && String(req.user.role).toLowerCase() !== 'admin') {
      return res.status(403).json({ success: false, message: 'Akses ditolak. Admin saja.' });
    }

    const status = req.query.status ? String(req.query.status).toUpperCase() : null;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(200, Math.max(1, parseInt(req.query.limit, 10) || 50));
    const offset = (page - 1) * limit;

    const rows = await orderModel.getAllOrdersAdmin({ status, limit, offset });

    const orders = (rows || []).map(o => ({
      order_id: o.order_id,
      customer_name: o.customer_name,
      customer_email: o.customer_email,
      customer_phone: o.customer_phone,
      order_status: o.order_status,
      total_amount: parseFloat(o.total_amount),
      shipping_address: o.shipping_address,
      created_at: o.created_at
    }));

    return res.status(200).json({ success: true, orders, meta: { page, limit, count: orders.length } });
  } catch (err) {
    console.error('Error in getAllOrdersForAdmin:', err && (err.stack || err));
    return res.status(500).json({ success: false, message: 'Gagal mengambil daftar pesanan (admin).' });
  }
};

/**
 * ADMIN: detail pesanan (tanpa cek kepemilikan)
 */
const getOrderDetailsAdmin = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'User tidak terautentikasi.' });
    if (req.user.role && String(req.user.role).toLowerCase() !== 'admin') {
      return res.status(403).json({ success: false, message: 'Akses ditolak. Admin saja.' });
    }

    const { orderId } = req.params;
    const id = parseInt(orderId, 10);
    if (!id || id <= 0) return res.status(400).json({ success: false, message: 'ID Pesanan tidak valid.' });

    const found = await orderModel.getOrderDetailsAdmin(id);
    if (!found) return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });

    return res.status(200).json({ success: true, order: found });
  } catch (err) {
    console.error('Error in getOrderDetailsAdmin:', err && (err.stack || err));
    return res.status(500).json({ success: false, message: 'Gagal mengambil detail pesanan (admin).' });
  }
};

/**
 * ADMIN: update order status
 */
const updateOrderStatusAdmin = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'User tidak terautentikasi.' });
    if (req.user.role && String(req.user.role).toLowerCase() !== 'admin') {
      return res.status(403).json({ success: false, message: 'Akses ditolak. Admin saja.' });
    }

    const { orderId } = req.params;
    const id = parseInt(orderId, 10);
    const { status } = req.body;
    if (!id || id <= 0) return res.status(400).json({ success: false, message: 'ID Pesanan tidak valid.' });
    if (!status || typeof status !== 'string') return res.status(400).json({ success: false, message: 'Status tidak valid.' });

    const updated = await orderModel.updateOrderStatusById(id, status.toUpperCase());
    if (!updated) return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });

    // Berhasil -> kembalikan order header terbaru
    return res.status(200).json({ success: true, message: 'Status pesanan berhasil diperbarui.', order: updated });
  } catch (err) {
    console.error('Error in updateOrderStatusAdmin:', err && (err.stack || err));
    return res.status(500).json({ success: false, message: 'Gagal memperbarui status pesanan.' });
  }
};

/**
 * ADMIN: delete order
 */
const deleteOrderAdmin = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'User tidak terautentikasi.' });
    if (req.user.role && String(req.user.role).toLowerCase() !== 'admin') {
      return res.status(403).json({ success: false, message: 'Akses ditolak. Admin saja.' });
    }

    const { orderId } = req.params;
    const id = parseInt(orderId, 10);
    if (!id || id <= 0) return res.status(400).json({ success: false, message: 'ID Pesanan tidak valid.' });

    const deleted = await orderModel.deleteOrderById(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });

    return res.status(200).json({ success: true, message: 'Pesanan berhasil dihapus.' });
  } catch (err) {
    console.error('Error in deleteOrderAdmin:', err && (err.stack || err));
    return res.status(500).json({ success: false, message: 'Gagal menghapus pesanan.' });
  }
};

module.exports = {
  checkout,
  getOrderHistory,
  getOrderDetails,
  getAllOrdersForAdmin,
  getOrderDetailsAdmin,
  updateOrderStatusAdmin,
  deleteOrderAdmin
};
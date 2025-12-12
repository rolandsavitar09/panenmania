// backend/src/models/orderModel.js
const db = require('../config/db');

/* =========================================================
   1. createOrderFromCart
   - Membuat order dari array items (transactional)
   - Mengurangi stok, memasukkan order_items, menghapus cart_items
========================================================= */
const createOrderFromCart = async (userId, items, totalAmount, shippingAddress, paymentMethod) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Tidak ada item untuk diproses menjadi order');
  }

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const orderText = `
      INSERT INTO orders (user_id, total_amount, shipping_address, payment_method, order_status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING order_id, total_amount, shipping_address, payment_method, order_status, created_at
    `;
    const orderVals = [userId, totalAmount, shippingAddress, paymentMethod, 'PENDING'];

    const { rows: orderRows } = await client.query(orderText, orderVals);
    const order = orderRows[0];
    const orderId = order.order_id;

    const productIds = [...new Set(items.map(i => Number(i.product_id)))];
    if (productIds.length === 0) throw new Error('No products specified for order');

    const prodQ = `
      SELECT product_id, price, stock 
      FROM products 
      WHERE product_id = ANY($1::int[]) 
      FOR UPDATE
    `;
    const { rows: prodRows } = await client.query(prodQ, [productIds]);
    const priceMap = new Map(prodRows.map(r => [
      Number(r.product_id),
      { price: Number(r.price), stock: Number(r.stock) }
    ]));

    const insertedItems = [];
    for (const it of items) {
      const pid = Number(it.product_id);
      const qty = Number(it.quantity ?? it.qty ?? 0);
      const pricePerUnit = Number(it.price ?? (priceMap.get(pid)?.price) ?? 0);

      if (!qty || qty <= 0) throw new Error(`quantity invalid product_id=${pid}`);

      const prodInfo = priceMap.get(pid);
      if (!prodInfo) throw new Error(`Produk id=${pid} tidak ditemukan`);
      if (prodInfo.stock < qty) throw new Error(`stock insufficient product_id=${pid}`);

      const insertItemText = `
        INSERT INTO order_items (order_id, product_id, quantity, price_at_order)
        VALUES ($1, $2, $3, $4)
        RETURNING order_item_id
      `;
      const { rows: itemRows } = await client.query(insertItemText, [
        orderId,
        pid,
        qty,
        pricePerUnit
      ]);

      insertedItems.push({
        order_item_id: itemRows[0].order_item_id,
        product_id: pid,
        quantity: qty,
        price_at_order: pricePerUnit
      });

      prodInfo.stock -= qty;
    }

    for (const pid of productIds) {
      const newStock = priceMap.get(pid).stock;
      await client.query(`UPDATE products SET stock = $1 WHERE product_id = $2`, [
        newStock,
        pid
      ]);
    }

    await client.query(`DELETE FROM cart_items WHERE user_id = $1`, [userId]);

    await client.query(
      `UPDATE orders 
       SET total_amount = $1, order_status = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE order_id = $3`,
      [totalAmount, 'CREATED', orderId]
    );

    await client.query('COMMIT');

    return {
      order_id: orderId,
      total_amount: Number(totalAmount),
      shipping_address: shippingAddress,
      payment_method: paymentMethod,
      order_status: 'CREATED',
      created_at: order.created_at,
      items: insertedItems
    };
  } catch (err) {
    try { await client.query('ROLLBACK'); } catch (e) {}
    console.error('Error createOrderFromCart:', err);
    throw err;
  } finally {
    client.release();
  }
};

/* =========================================================
   2. getOrdersByUserId
========================================================= */
const getOrdersByUserId = async (userId) => {
  const text = `
    SELECT 
      o.order_id,
      o.total_amount,
      o.order_status,
      o.created_at,
      (SELECT p.image_url FROM order_items oi
        JOIN products p ON oi.product_id = p.product_id
        WHERE oi.order_id = o.order_id
        ORDER BY oi.order_item_id
        LIMIT 1
      ) AS first_item_image_url
    FROM orders o
    WHERE o.user_id = $1
    ORDER BY o.created_at DESC
  `;
  const { rows } = await db.query(text, [userId]);
  return rows;
};

/* =========================================================
   3. getOrderDetailsByOrderId
========================================================= */
const getOrderDetailsByOrderId = async (orderId, userId) => {
  const orderText = `
    SELECT 
      order_id,
      user_id,
      total_amount,
      shipping_address,
      order_status,
      created_at,
      payment_method
    FROM orders
    WHERE order_id = $1 AND user_id = $2
  `;
  const { rows: orderRows } = await db.query(orderText, [orderId, userId]);
  const order = orderRows[0];
  if (!order) return null;

  const itemsText = `
    SELECT 
      oi.order_item_id,
      oi.quantity,
      oi.price_at_order,
      p.product_id,
      p.name,
      p.unit,
      p.image_url
    FROM order_items oi
    JOIN products p ON oi.product_id = p.product_id
    WHERE oi.order_id = $1
    ORDER BY oi.order_item_id
  `;
  const { rows: itemRows } = await db.query(itemsText, [orderId]);

  const items = itemRows.map(item => ({
    ...item,
    price_at_order: parseFloat(item.price_at_order),
    imageUrl: item.image_url ? `http://localhost:5000${item.image_url}` : null
  }));

  return {
    ...order,
    total_amount: parseFloat(order.total_amount),
    items
  };
};

/* =========================================================
   4. ADMIN FUNCTIONS (NEW)
========================================================= */

const getAllOrdersAdmin = async ({ status = null, limit = 50, offset = 0 } = {}) => {
  const params = [];
  let whereClause = '';

  if (status) {
    params.push(status);
    whereClause = `WHERE o.order_status = $${params.length}`;
  }

  params.push(limit);
  const limitIdx = params.length;
  params.push(offset);
  const offsetIdx = params.length;

  const text = `
    SELECT
      o.order_id,
      o.user_id,
      o.total_amount,
      o.order_status,
      o.shipping_address,
      o.created_at,
      u.full_name AS customer_name,
      u.email AS customer_email,
      u.phone_number AS customer_phone
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.user_id
    ${whereClause}
    ORDER BY o.created_at DESC
    LIMIT $${limitIdx} OFFSET $${offsetIdx}
  `;

  const { rows } = await db.query(text, params);
  return rows;
};

const getOrderDetailsAdmin = async (orderId) => {
  const orderText = `
    SELECT
      o.order_id,
      o.user_id,
      o.total_amount,
      o.shipping_address,
      o.shipping_cost,
      o.payment_method,
      o.order_status,
      o.created_at,
      u.full_name AS customer_name,
      u.email AS customer_email,
      u.phone_number AS customer_phone
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.user_id
    WHERE o.order_id = $1
  `;

  const { rows: orderRows } = await db.query(orderText, [orderId]);
  const order = orderRows[0];
  if (!order) return null;

  const itemsText = `
    SELECT 
      oi.order_item_id,
      oi.quantity,
      oi.price_at_order,
      p.product_id,
      p.name,
      p.unit,
      p.image_url
    FROM order_items oi
    JOIN products p ON oi.product_id = p.product_id
    WHERE oi.order_id = $1
    ORDER BY oi.order_item_id
  `;
  const { rows: itemRows } = await db.query(itemsText, [orderId]);

  const items = itemRows.map(item => ({
    ...item,
    price_at_order: parseFloat(item.price_at_order),
    imageUrl:
      item.image_url?.startsWith('http')
        ? item.image_url
        : item.image_url
        ? `http://localhost:5000${item.image_url}`
        : null
  }));

  return {
    ...order,
    total_amount: parseFloat(order.total_amount),
    items
  };
};

const updateOrderStatusById = async (orderId, newStatus) => {
  const text = `
    UPDATE orders
    SET order_status = $1, updated_at = CURRENT_TIMESTAMP
    WHERE order_id = $2
    RETURNING order_id, user_id, order_status, updated_at, total_amount
  `;
  const { rows } = await db.query(text, [newStatus, orderId]);
  return rows[0] || null;
};

const deleteOrderById = async (orderId) => {
  const text = `DELETE FROM orders WHERE order_id = $1 RETURNING order_id`;
  const { rows } = await db.query(text, [orderId]);
  return rows[0] || null;
};

/* =========================================================
   5. getSalesStatistics (DITERAPKAN SESUAI SCHEMA SAAT INI)
   - Tidak tergantung pada tabel `categories`
   - Menggunakan products.category (VARCHAR) untuk topCategories
   - Defensive: jika error -> kembalikan struktur kosong
========================================================= */
const getSalesStatistics = async () => {
  try {
    // Total orders & revenue (hanya status yang relevan)
    const totalSalesText = `
      SELECT 
          COUNT(order_id) AS total_orders,
          COALESCE(SUM(total_amount), 0) AS total_revenue
      FROM orders
      WHERE order_status IN ('PROCESSING', 'SHIPPED', 'DELIVERED', 'SETTLED');
    `;
    const totalSalesRes = await db.query(totalSalesText);
    const totalsRow = (totalSalesRes.rows && totalSalesRes.rows[0]) ? totalSalesRes.rows[0] : { total_orders: 0, total_revenue: 0 };

    // Top products by quantity sold
    const topProductsText = `
      SELECT 
          p.product_id,
          p.name AS product_name, 
          p.unit,
          COALESCE(SUM(oi.quantity),0) AS total_sold 
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      GROUP BY p.product_id, p.name, p.unit
      ORDER BY total_sold DESC
      LIMIT 5;
    `;
    const topProductsRes = await db.query(topProductsText);
    const topProducts = topProductsRes.rows || [];

    // Top categories derived from products.category (string)
    const topCategoriesText = `
      SELECT 
          COALESCE(p.category, 'Uncategorized') AS category_name,
          COALESCE(SUM(oi.quantity),0) AS total_sold 
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      GROUP BY COALESCE(p.category, 'Uncategorized')
      ORDER BY total_sold DESC
      LIMIT 3;
    `;
    const topCategoriesRes = await db.query(topCategoriesText);
    const topCategories = topCategoriesRes.rows || [];

    return {
      totals: {
        total_orders: Number(totalsRow.total_orders || 0),
        total_revenue: Number(totalsRow.total_revenue || 0)
      },
      topProducts,
      topCategories
    };
  } catch (err) {
    console.error('[orderModel.getSalesStatistics] error:', err);
    return {
      totals: { total_orders: 0, total_revenue: 0 },
      topProducts: [],
      topCategories: []
    };
  }
};

/* =========================================================
   6. EXPORT
========================================================= */
module.exports = {
  createOrderFromCart,
  getOrdersByUserId,
  getOrderDetailsByOrderId,

  getAllOrdersAdmin,
  getOrderDetailsAdmin,
  updateOrderStatusById,
  deleteOrderById,

  getSalesStatistics
};
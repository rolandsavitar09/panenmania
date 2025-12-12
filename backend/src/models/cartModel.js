// backend/src/models/cartModel.js
// Model cart - dengan parsing/validasi defensif dan error handling
const db = require('../config/db');

/**
 * Helper: parse integer safe
 */
const toIntSafe = (v, fallback = 1) => {
  const n = Number(v);
  if (!Number.isFinite(n) || Number.isNaN(n) || n <= 0) return fallback;
  return Math.floor(n);
};

/**
 * Dapatkan semua item keranjang user
 * - Normalisasi fields: quantity => integer, price => number
 */
const getCartItemsByUserId = async (userId) => {
  const text = `
    SELECT
      ci.cart_item_id,
      ci.quantity,
      p.product_id,
      p.name,
      p.price,
      p.unit,
      p.image_url,
      p.stock
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.product_id
    WHERE ci.user_id = $1
    ORDER BY ci.created_at DESC
  `;
  try {
    const { rows } = await db.query(text, [userId]);
    // Normalisasi hasil supaya consumer (controller/model order) selalu menerima bentuk konsisten
    return rows.map(r => ({
      cart_item_id: r.cart_item_id,
      // pastikan quantity bukan null
      quantity: toIntSafe(r.quantity, 1),
      product_id: Number(r.product_id),
      name: r.name,
      price: Number(r.price ?? 0),
      unit: r.unit,
      image_url: r.image_url,
      stock: r.stock !== undefined && r.stock !== null ? Number(r.stock) : null
    }));
  } catch (err) {
    console.error('cartModel.getCartItemsByUserId error:', err && err.stack ? err.stack : err);
    throw err;
  }
};

/**
 * Dapatkan satu cart item berdasarkan user & product
 */
const getCartItemByUserAndProduct = async (userId, productId) => {
  const text = `SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2`;
  try {
    const { rows } = await db.query(text, [userId, productId]);
    const r = rows[0];
    if (!r) return null;
    return {
      ...r,
      quantity: toIntSafe(r.quantity, 1)
    };
  } catch (err) {
    console.error('cartModel.getCartItemByUserAndProduct error:', err && err.stack ? err.stack : err);
    throw err;
  }
};

/**
 * Insert cart item
 * - validasi quantity minimal 1
 */
const insertCartItem = async (userId, productId, quantity) => {
  const qty = toIntSafe(quantity, 1);
  const text = `INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *`;
  try {
    const { rows } = await db.query(text, [userId, productId, qty]);
    const r = rows[0];
    return { ...r, quantity: toIntSafe(r.quantity, qty) };
  } catch (err) {
    console.error('cartModel.insertCartItem error:', err && err.stack ? err.stack : err);
    throw err;
  }
};

/**
 * Update cart item quantity by cart_item_id
 * - validasi quantity minimal 1
 */
const updateCartItemQuantity = async (cartItemId, newQuantity) => {
  const qty = toIntSafe(newQuantity, 1);
  const text = `UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE cart_item_id = $2 RETURNING *`;
  try {
    const { rows } = await db.query(text, [qty, cartItemId]);
    const r = rows[0];
    return r ? { ...r, quantity: toIntSafe(r.quantity, qty) } : null;
  } catch (err) {
    console.error('cartModel.updateCartItemQuantity error:', err && err.stack ? err.stack : err);
    throw err;
  }
};

/**
 * Delete cart item
 */
const deleteCartItem = async (cartItemId, userId) => {
  const text = `DELETE FROM cart_items WHERE cart_item_id = $1 AND user_id = $2 RETURNING cart_item_id`;
  try {
    const { rows } = await db.query(text, [cartItemId, userId]);
    return rows[0] || null;
  } catch (err) {
    console.error('cartModel.deleteCartItem error:', err && err.stack ? err.stack : err);
    throw err;
  }
};

/**
 * Bersihkan seluruh cart user (digunakan setelah order sukses)
 */
const clearCartByUserId = async (userId) => {
  const text = `DELETE FROM cart_items WHERE user_id = $1`;
  try {
    await db.query(text, [userId]);
    return true;
  } catch (err) {
    console.error('cartModel.clearCartByUserId error:', err && err.stack ? err.stack : err);
    throw err;
  }
};

module.exports = {
  getCartItemsByUserId,
  getCartItemByUserAndProduct,
  insertCartItem,
  updateCartItemQuantity,
  deleteCartItem,
  clearCartByUserId
};
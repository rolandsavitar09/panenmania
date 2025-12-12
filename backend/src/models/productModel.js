// backend/src/models/productModel.js
const db = require('../config/db');

/**
 * Menyimpan data produk baru ke database.
 * @param {object} productData - Data produk (nama, deskripsi, harga, dll.)
 * @returns {Promise<object>} Objek produk yang baru dibuat.
 */
const createProduct = async ({ name, description, price, stock, unit, image_url, category }) => {
    const text = `
        INSERT INTO products (name, description, price, stock, unit, image_url, category)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `;
    const values = [name, description, price, stock, unit, image_url, category];
    const { rows } = await db.query(text, values);
    return rows[0];
};

/**
 * Mengambil semua produk dari database.
 * @returns {Promise<array>} Array objek produk.
 */
const getAllProducts = async () => {
    const text = `
        SELECT product_id, name, description, price, stock, unit, image_url, category, is_active
        FROM products
        WHERE is_active = TRUE 
        ORDER BY created_at DESC
    `;
    const { rows } = await db.query(text);
    return rows;
};

/**
 * Mengambil satu produk berdasarkan ID-nya.
 * @param {number} productId - ID produk yang dicari.
 * @returns {Promise<object|null>} Objek produk atau null jika tidak ditemukan.
 */
const getProductById = async (productId) => {
    const text = `
        SELECT product_id, name, description, price, stock, unit, image_url, category
        FROM products
        WHERE product_id = $1 AND is_active = TRUE
    `;
    const values = [productId];
    const { rows } = await db.query(text, values);
    return rows[0] || null;
};


module.exports = {
    createProduct,
    getAllProducts,
    getProductById, // <-- FUNGSI BARU DI EXPORT
};
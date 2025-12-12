// backend/src/routes/cartRoutes.js
const express = require('express');
const router = express.Router(); // <--- PERBAIKAN: Hanya memanggil express.Router()
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// Semua rute cart memerlukan otentikasi (protected)

// Endpoint: GET /api/cart
// Tujuan: Mengambil semua item keranjang untuk user yang sedang login
router.get('/', protect, cartController.getCart);

// Endpoint: POST /api/cart
// Tujuan: Menambah produk baru ke keranjang atau mengupdate kuantitas item yang sudah ada (Upsert)
router.post('/', protect, cartController.addToCart);

// Endpoint: DELETE /api/cart/:cartItemId
// Tujuan: Menghapus item spesifik dari keranjang user
router.delete('/:cartItemId', protect, cartController.removeFromCart);

module.exports = router;
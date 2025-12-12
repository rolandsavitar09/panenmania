// backend/src/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware'); 

// Rute untuk menambah produk (PROTECTED)
// Endpoint: POST /api/products/add
// Membutuhkan: Token Admin + Multipart/form-data
router.post('/add', protect, upload.single('image'), productController.addProduct);

// Rute untuk mendapatkan semua produk (PUBLIC ACCESS)
// Endpoint: GET /api/products
// Rute ini harus didefinisikan sebelum rute berparameter.
router.get('/', productController.getProducts); 

// Rute untuk mendapatkan DETAIL SATU PRODUK (PUBLIC ACCESS)
// Endpoint: GET /api/products/:id
router.get('/:id', productController.getProductDetails); 

module.exports = router;
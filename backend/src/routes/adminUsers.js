// backend/src/routes/adminUsers.js
const express = require('express');
const router = express.Router();

// CONTROLLER
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');

// MIDDLEWARE
const { protect } = require('../middleware/authMiddleware');
// Jika ingin lebih aman, nanti bisa ganti protect → protectAdmin

// =======================================
//            ADMIN USER MANAGEMENT
// =======================================

// GET Semua User
// GET /api/admin/all
router.get('/all', protect, authController.getUsers);


// =======================================
//            ADMIN DASHBOARD STATS
// =======================================

// GET Statistik Dashboard Admin
// GET /api/admin/dashboard/stats
router.get('/dashboard/stats', protect, adminController.getDashboardStats);


module.exports = router;
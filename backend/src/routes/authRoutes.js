// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); 
const { hashPassword } = require('../utils/passwordUtils'); 

// Register Customer
router.post('/register', authController.registerUser);

// Login Customer
router.post('/login', authController.loginUser);

// Login Admin
router.post('/admin-login', authController.loginUser);

// =======================
// TEMPORARY HASH GENERATOR
// =======================
router.get('/generate-admin-hash/:password', async (req, res) => {
    try {
        const password = req.params.password;
        if (!password) return res.status(400).send('Password parameter missing');

        const hash = await hashPassword(password);
        res.json({ password, hash });
    } catch (error) {
        console.error('Error generating hash:', error);
        res.status(500).send('Error generating hash');
    }
});

// Protected route: GET /api/auth/profile
router.get('/profile', protect, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Akses diterima.',
        user: req.user 
    });
});

module.exports = router;
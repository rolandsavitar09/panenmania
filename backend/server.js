// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

// Routes
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const adminUsersRoutes = require('./src/routes/adminUsers');

// Controllers & middleware
const authController = require('./src/controllers/authController');
const { protect } = require('./src/middleware/authMiddleware');

// DB
const db = require('./src/config/db');

const app = express();

/* ======================
   LOGGER
====================== */
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

/* ======================
   BODY PARSERS
====================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ======================
   STATIC FILES
====================== */
app.use('/public', express.static(path.join(__dirname, 'public')));

/* ======================
   CORS (Netlify + Local)
====================== */
const allowedOrigins = process.env.FRONTEND_ORIGIN
  ? process.env.FRONTEND_ORIGIN.split(',')
  : [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://panenmania.netlify.app',
    ];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

/* ======================
   HEALTH CHECK
====================== */
app.get('/api/health', async (req, res) => {
  try {
    if (db && typeof db.query === 'function') {
      await db.query('SELECT 1');
    }
    res.status(200).json({
      status: 'ok',
      service: 'PanenMania API',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
    });
  }
});

/* ======================
   API ROUTES
====================== */
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', adminUsersRoutes);

// Admin get all users
app.get('/api/users/admin/all', protect, authController.getUsers);

/* ======================
   404 HANDLER
====================== */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route tidak ditemukan',
  });
});

/* ======================
   GLOBAL ERROR HANDLER
====================== */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === 'production'
        ? 'Server error'
        : err.message || 'Server error',
  });
});

/* ======================
   EXPORT (WAJIB UNTUK VERCEL)
====================== */
module.exports = app;
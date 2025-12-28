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

// Controller & middleware
const authController = require('./src/controllers/authController');
const { protect } = require('./src/middleware/authMiddleware');

// DB
const db = require('./src/config/db');

const app = express();

/* Logger */
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

/* Body parser */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Static files */
app.use('/public', express.static(path.join(__dirname, 'public')));

/* CORS */
const allowedOrigins = process.env.FRONTEND_ORIGIN
  ? process.env.FRONTEND_ORIGIN.split(',')
  : ['http://localhost:3000'];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

/* Health check */
app.get('/health', async (req, res) => {
  try {
    if (db && typeof db.query === 'function') {
      await db.query('SELECT 1');
    }
    res.json({ status: 'ok', service: 'PanenMania API' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'DB error' });
  }
});

/* Routes */
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/users', adminUsersRoutes);

// Admin
app.get('/users/admin/all', protect, authController.getUsers);

/* 404 */
app.use((req, res) => {
  res.status(404).json({ message: 'Route tidak ditemukan' });
});

/* Export for Vercel */
module.exports = app;
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

/* ======================
   LOGGER
====================== */
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

/* ======================
   BODY PARSER
====================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ======================
   STATIC FILES
====================== */
app.use('/public', express.static(path.join(__dirname, 'public')));

/* ======================
   CORS (FIXED)
====================== */
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://panenmania.netlify.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Izinkan request tanpa origin (Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

/* ======================
   HEALTH CHECK
====================== */
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

/* ======================
   ROUTES
====================== */
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/users', adminUsersRoutes);

// Admin (protected)
app.get('/users/admin/all', protect, authController.getUsers);

/* ======================
   404 HANDLER
====================== */
app.use((req, res) => {
  res.status(404).json({ message: 'Route tidak ditemukan' });
});

/* ======================
   EXPORT FOR VERCEL
====================== */
module.exports = app;
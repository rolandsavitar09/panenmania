// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

// Routes
const authRoutes = require('./backend/src/routes/authRoutes');
const productRoutes = require('./backend/src/routes/productRoutes');
const cartRoutes = require('./backend/src/routes/cartRoutes');
const orderRoutes = require('./backend/src/routes/orderRoutes');
const adminUsersRoutes = require('./backend/src/routes/adminUsers');

// Controller & middleware
const authController = require('./backend/src/controllers/authController');
const { protect } = require('./backend/src/middleware/authMiddleware');

// DB
const db = require('./backend/src/config/db');

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
  'https://panenmania-web.vercel.app'
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

app.options("*", cors());

/* ======================
   HEALTH CHECK
====================== */
app.get('/api/health', async (req, res) => {
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
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', adminUsersRoutes);

// Admin (protected)
app.get('/api/users/admin/all', protect, authController.getUsers);

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
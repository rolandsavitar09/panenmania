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

// Logger (dev only)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// CORS config
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://panenmania.netlify.app',
  'https://panenmania-web.vercel.app',
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    if (db?.query) await db.query('SELECT 1');
    res.json({ status: 'ok', service: 'PanenMania API' });
  } catch {
    res.status(500).json({ status: 'error', message: 'DB error' });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', adminUsersRoutes);

// Admin route
app.get('/api/users/admin/all', protect, authController.getUsers);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route tidak ditemukan' });
});

// Export for Vercel
module.exports = app;
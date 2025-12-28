// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Logger
const morgan = require('morgan');

// Routes
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const adminUsersRoutes = require('./src/routes/adminUsers');


// Tambahan baru
const authController = require('./src/controllers/authController');
const { protect } = require('./src/middleware/authMiddleware');

const db = require('./src/config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Logger dev
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static
app.use('/public', express.static(path.join(__dirname, 'public')));

// CORS
const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN ? process.env.FRONTEND_ORIGIN.split(',') : ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// Healthcheck
app.get('/ping', (req, res) => res.json({ ok: true }));

// ===========================
// MOUNT ROUTES UTAMA
// ===========================
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', adminUsersRoutes);

// ===========================
// RUTE BARU (ADMIN GET USERS)
// ===========================
app.get('/api/users/admin/all', protect, authController.getUsers);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route tidak ditemukan' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const message = process.env.NODE_ENV === 'production' ? 'Server error' : err.message || 'Server error';
  res.status(500).json({ success: false, message });
});

// Verify DB
const verifyDbConnection = async () => {
  if (!db || typeof db.query !== 'function') {
    console.warn('db module tidak expose query() - skip verification.');
    return;
  }
  try {
    await db.query('SELECT 1');
    console.log('✅ Database connected');
  } catch (err) {
    console.error('❌ Database connection failed:', err);
  }
};

const server = app.listen(PORT, async () => {
  console.log(
    `🚀 Server berjalan di http://localhost:${PORT} (NODE_ENV=${process.env.NODE_ENV || 'development'})`
  );
  await verifyDbConnection();
});

// Graceful shutdown
const shutdown = async () => {
  console.log('Shutting down server...');
  server.close(async () => {
    if (db && typeof db.end === 'function') {
      try {
        await db.end();
        console.log('DB pool closed.');
      } catch (err) {
        console.error('Error closing DB pool:', err);
      }
    }
    process.exit(0);
  });

  setTimeout(() => {
    console.warn('Forcing shutdown.');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
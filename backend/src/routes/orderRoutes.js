// backend/src/routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

console.debug('orderRoutes loaded');

/**
 * Wrapper untuk logging + error handling
 */
const wrapperAsync = (handler) => {
  return async (req, res, next) => {
    try {
      console.debug('--- ROUTE CALLED:', req.method, req.originalUrl);
      console.debug(
        'user preview:',
        req.user
          ? { user_id: req.user.user_id, email: req.user.email, role: req.user.role }
          : null
      );

      // Log body
      try {
        console.debug(
          'request body preview:',
          typeof req.body === 'object'
            ? JSON.stringify(req.body).slice(0, 1000)
            : String(req.body)
        );
      } catch {
        console.debug('request body preview: <unserializable>');
      }

      await handler(req, res, next);
    } catch (err) {
      console.error(`ERROR in route ${req.method} ${req.originalUrl}:`, err.stack || err);
      if (!res.headersSent) {
        return res.status(500).json({
          success: false,
          message: 'Terjadi kesalahan server saat memproses permintaan.',
          error: err.message,
        });
      }
      return next(err);
    }
  };
};

/* =========================================================
   CUSTOMER ROUTES
========================================================= */

// Checkout
router.post('/checkout', protect, wrapperAsync(orderController.checkout));

// Order history user
router.get('/history', protect, wrapperAsync(orderController.getOrderHistory));

/* =========================================================
   ADMIN ROUTES (HARUS DIATAS /:orderId)
========================================================= */

// Get all orders (admin)
router.get(
  '/admin/all',
  protect,
  isAdmin,
  wrapperAsync(orderController.getAllOrdersForAdmin)
);

// Get order detail (admin)
router.get(
  '/admin/:orderId',
  protect,
  isAdmin,
  wrapperAsync(orderController.getOrderDetailsAdmin)
);

// Update order status (admin only)
router.put(
  '/admin/status/:orderId',
  protect,
  isAdmin,
  wrapperAsync(orderController.updateOrderStatusAdmin)
);

// Delete order (admin only)
router.delete(
  '/admin/:orderId',
  protect,
  isAdmin,
  wrapperAsync(orderController.deleteOrderAdmin)
);

/* =========================================================
   CUSTOMER: GET DETAIL ORDER (DINAMIS)
   HARUS PALING BAWAH!!
========================================================= */

router.get('/:orderId', protect, wrapperAsync(orderController.getOrderDetails));

module.exports = router;
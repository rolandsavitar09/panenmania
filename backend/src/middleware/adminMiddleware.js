// backend/src/middleware/adminMiddleware.js

/**
 * Middleware untuk memastikan user adalah admin.
 * Hanya bekerja jika protect() sudah memasang req.user dari JWT.
 */

const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User tidak terautentikasi.'
    });
  }

  const role = (req.user.role || "").toString().toLowerCase();

  if (role !== "admin") {
    return res.status(403).json({
      success: false,
      message: 'Akses ditolak. Admin saja.'
    });
  }

  return next();
};

module.exports = { isAdmin };
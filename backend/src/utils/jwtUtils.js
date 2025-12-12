// backend/src/utils/jwtUtils.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET; // Diambil dari .env

/**
 * Membuat JWT baru untuk pengguna yang berhasil login.
 * @param {object} user - Objek pengguna (user_id, email, role)
 * @returns {string} - JSON Web Token (JWT)
 */
const generateToken = (user) => {
  // Token akan menyimpan user_id, email, dan role
  const payload = {
    id: user.user_id,
    email: user.email,
    role: user.role
  };

  // Token berlaku selama 1 hari (misalnya)
  const options = {
    expiresIn: '1d'
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

// Fungsi verifikasiToken (akan digunakan di fitur selanjutnya/middleware)

module.exports = {
  generateToken,
};
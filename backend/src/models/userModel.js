// backend/src/models/userModel.js
const db = require('../config/db');

/**
 * Mencari user berdasarkan email (untuk cek apakah sudah terdaftar)
 */
const findUserByEmail = async (email) => {
  const text = 'SELECT user_id, email FROM users WHERE email = $1';
  const { rows } = await db.query(text, [email]);
  return rows[0];
};

/**
 * Membuat user baru (role default: customer)
 */
const createUser = async ({ full_name, email, password_hash, phone_number, gender }) => {
  const text = `
    INSERT INTO users (full_name, email, password_hash, phone_number, gender, role)
    VALUES ($1, $2, $3, $4, $5, 'customer')
    RETURNING user_id, full_name, email, role, created_at
  `;
  const values = [full_name, email, password_hash, phone_number, gender];
  const { rows } = await db.query(text, values);
  return rows[0];
};

/**
 * Mencari user berdasarkan email (untuk proses login)
 * Mengembalikan password_hash untuk verifikasi
 */
const findUserByEmailForLogin = async (email) => {
  const text = `
        SELECT user_id, email, password_hash, role 
        FROM users 
        WHERE email = $1
    `;
  const { rows } = await db.query(text, [email]);
  return rows[0];
};

/**
 * ADMIN: Mendapatkan daftar semua user
 */
const getUsersForAdmin = async () => {
  const text = `
        SELECT 
            user_id, 
            full_name, 
            email, 
            role, 
            created_at
        FROM users
        ORDER BY created_at DESC
    `;
  const { rows } = await db.query(text);
  return rows;
};

/* -------------------------------------------
   🔥 Tambahan Fungsi Baru dari Kode Lama
-------------------------------------------- */

/**
 * Mendapatkan hitungan total pengguna berdasarkan role.
 */
const getUserCounts = async () => {
  const text = `
        SELECT 
            COUNT(CASE WHEN role = 'admin' THEN 1 END) AS total_admin,
            COUNT(CASE WHEN role = 'customer' THEN 1 END) AS total_customer,
            COUNT(user_id) AS total_users
        FROM users;
    `;
  const result = await db.query(text);
  return result.rows[0];
};

/* -------------------------------------------
   EXPORT SEMUA FUNGSI LENGKAP
-------------------------------------------- */

module.exports = {
  findUserByEmail,
  createUser,
  findUserByEmailForLogin,
  getUsersForAdmin,

  // fungsi baru
  getUserCounts
};
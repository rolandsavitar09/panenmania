// backend/src/controllers/authController.js
const userModel = require('../models/userModel');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/jwtUtils');

/**
 * Logika Pendaftaran Pengguna (Sign Up)
 */
const registerUser = async (req, res) => {
  const { nama, email, password, phone, gender } = req.body;

  if (!nama || !email || !password || !phone || !gender) {
    return res.status(400).json({
      success: false,
      message: 'Semua field wajib diisi.'
    });
  }

  try {
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Gagal mendaftar. Email sudah terdaftar.'
      });
    }

    const password_hash = await hashPassword(password);

    const userData = {
      full_name: nama,
      email,
      password_hash,
      phone_number: phone,
      gender
    };

    const newUser = await userModel.createUser(userData);

    res.status(201).json({
      success: true,
      message: 'Pendaftaran berhasil! Silakan masuk.',
      user: {
        id: newUser.user_id,
        nama: newUser.full_name,
        email: newUser.email,
        role: newUser.role,
      }
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat pendaftaran.'
    });
  }
};

/**
 * Logika Masuk Akun (Sign In) - Customer + Admin
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const is_admin_attempt = req.route.path === '/admin-login';

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email dan Kata Sandi wajib diisi.'
    });
  }

  try {
    const user = await userModel.findUserByEmailForLogin(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email atau Kata Sandi salah.'
      });
    }

    const isMatch = await comparePassword(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email atau Kata Sandi salah.'
      });
    }

    // Role Validation
    if (is_admin_attempt && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak. Anda bukan Admin Panen Mania.'
      });
    }

    if (!is_admin_attempt && user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Silakan login melalui halaman Admin.'
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login berhasil!',
      token,
      user: {
        id: user.user_id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat login.'
    });
  }
};

/**
 * ADMIN — Mendapatkan semua pengguna
 */
const getUsers = async (req, res) => {
  try {
    const users = await userModel.getUsersForAdmin();

    const formattedUsers = users.map(u => ({
      id: u.user_id,
      name: u.role.toLowerCase() === 'admin' ? 'ADMIN PANEN MANIA' : u.full_name,
      email: u.email,
      role: u.role,
      joinedAt: u.created_at
    }));

    res.status(200).json({
      success: true,
      users: formattedUsers
    });

  } catch (error) {
    console.error('Error saat mengambil daftar pengguna Admin:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal memuat daftar pengguna.'
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUsers
};
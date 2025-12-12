// routes/adminAuth.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Hardcoded admin credentials (paten)
const ADMIN_EMAIL = "dev@gmail.com";
const ADMIN_PASSWORD = "Tired-AF_Developer";

// fixed response fields from your example
const SAMPLE_USER = {
  id: "abb1b403-6d53-4d97-a20f-9b16777bcfd7",
  username: "developer",
  email: "dev@gmail.com",
  role: "admin",
  avatar_url:
    "https://res.cloudinary.com/dg9ymmzym/image/upload/v1765252942/user_avatar/admin_id-abb1b403-6d53-4d97-a20f-9b16777bcfd7.jpg",
};

// secret untuk sign jwt (set via env var di production)
const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "3h";

router.post("/admin/login", (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(422).json({
        status: "Error",
        statusCode: 422,
        data: null,
        message: "Email dan password harus disertakan",
      });
    }

    // cek kredensial tetap (case-sensitive untuk password)
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        status: "Error",
        statusCode: 401,
        data: null,
        message: "Invalid credentials",
      });
    }

    // buat token JWT (payload minimal)
    const token = jwt.sign(
      {
        id: SAMPLE_USER.id,
        email: SAMPLE_USER.email,
        role: SAMPLE_USER.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN, issuer: "PAMan_api" }
    );

    // format respons sesuai contoh
    return res.status(201).json({
      status: "Success",
      statusCode: 201,
      data: {
        id: SAMPLE_USER.id,
        username: SAMPLE_USER.username,
        email: SAMPLE_USER.email,
        role: SAMPLE_USER.role,
        avatar_url: SAMPLE_USER.avatar_url,
        token,
      },
      message: "Login success",
    });
  } catch (err) {
    console.error("admin login error:", err);
    return res.status(500).json({
      status: "Error",
      statusCode: 500,
      data: null,
      message: "Server error",
    });
  }
});

module.exports = router;
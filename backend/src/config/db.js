// backend/src/config/db.js
const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is not defined");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // wajib untuk Neon + Vercel
  },
  max: 5, // aman untuk serverless
});

// Test connection (once)
(async () => {
  try {
    const res = await pool.query("SELECT 1");
    console.log("✅ Neon PostgreSQL connected");
  } catch (err) {
    console.error("❌ Neon DB connection error:", err.message);
  }
})();

module.exports = pool;
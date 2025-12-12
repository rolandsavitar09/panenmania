// backend/src/config/db.js
const { Pool } = require("pg");
require("dotenv").config();

// Pool instance
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  database: process.env.DB_NAME || "panenmania",
  password: process.env.DB_PASSWORD || "",
  port: Number(process.env.DB_PORT || 5432),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test simple connection once (non-blocking)
pool
  .query("SELECT NOW()")
  .then((res) => {
    console.log(`✅ PostgreSQL connected at: ${res.rows[0].now}`);
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
  });

// --- EXPORT ---
/**
 * pool.query(sql, params)
 * pool.connect() → client
 */
module.exports = pool;
// backend/src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * protect middleware
 * - mencari token di header Authorization (Bearer) atau cookie 'token'
 * - sanitasi header untuk menghilangkan newline/spasi berlebih
 * - mencoba mengekstrak JWT (3-part) secara robust
 * - verify token dan set req.user = { user_id, ...payload }
 * - mengembalikan 401 jika tidak ada token / token invalid / kadaluarsa
 *
 * Catatan: logging debug hanya ringkas (tidak mencetak token penuh).
 */
const protect = (req, res, next) => {
  try {
    // Debug: tampilkan sebagian header (tidak mem-blowup log)
    console.debug("authMiddleware: incoming headers keys=", Object.keys(req.headers || {}).slice(0, 50));

    // Ambil header Authorization case-insensitive dengan express req.get (lebih aman)
    // fallback ke req.headers.authorization jika req.get tidak tersedia
    let rawAuth = typeof req.get === "function" ? req.get("Authorization") : undefined;
    rawAuth = rawAuth || req.headers?.authorization || req.headers?.Authorization || null;

    // Jika ada cookie-parser, ambil token dari cookie sebagai fallback
    const cookieToken = req.cookies && req.cookies.token ? req.cookies.token : null;

    let token = null;

    if (rawAuth && typeof rawAuth === "string") {
      // Jika header di-representasikan sebagai array oleh proses/Proxy, gabungkan
      if (Array.isArray(rawAuth)) rawAuth = rawAuth.join(" ");

      // Hapus newline/carriage return (header yang terpecah menjadi beberapa baris)
      // dan kurangi spasi berlebih menjadi single space.
      let headerClean = rawAuth.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();

      // DEBUG: tampilkan ringkasan header (tanpa menampilkan token penuh)
      console.debug("authMiddleware: raw Authorization header (cleaned, first100) =", headerClean.slice(0, 100));

      // Cara 1: cari pola JWT 3-part di header (paling robust)
      const jwtMatch = headerClean.match(/([A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+)/);
      if (jwtMatch && jwtMatch[1]) {
        token = jwtMatch[1];
      } else {
        // Cara 2: jika header berbentuk "Bearer <token>" ambil kata kedua
        const parts = headerClean.split(" ");
        if (parts.length >= 2 && /^bearer$/i.test(parts[0])) {
          token = parts.slice(1).join(" "); // gabungkan sisa (jika token kebetulan memuat spasi)
          token = token.replace(/[\r\n]+/g, "").trim();
        } else if (/^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/.test(headerClean)) {
          // header mungkin hanya berisi token murni
          token = headerClean;
        } else {
          console.debug("authMiddleware: Authorization header unexpected format (cleaned) =", headerClean.slice(0, 120));
        }
      }
    }

    // Jika belum dapat token dari header, coba cookie
    if (!token && cookieToken) {
      token = typeof cookieToken === "string" ? cookieToken.replace(/[\r\n]+/g, "").trim() : cookieToken;
      console.debug("authMiddleware: token taken from cookie (len) =", token ? token.length : 0);
    }

    // Jika masih belum ada token -> 401
    if (!token) {
      console.debug("authMiddleware: no token found (header/cookie)");
      return res.status(401).json({ success: false, message: "User tidak terautentikasi. Token tidak ditemukan." });
    }

    // ringkasan token untuk debug (jangan log token penuh)
    const tokenPreview = (typeof token === "string" && token.length > 20)
      ? `${token.slice(0, 12)}...${token.slice(-8)}`
      : token;
    console.debug("authMiddleware: token extracted (preview) =", tokenPreview);

    if (!JWT_SECRET) {
      console.error("authMiddleware: JWT_SECRET tidak diset di environment");
      return res.status(500).json({ success: false, message: "Server configuration error" });
    }

    // Verifikasi token (akan melempar jika invalid/expired)
    const payload = jwt.verify(token, JWT_SECRET);

    // Normalisasi user identifier (cari salah satu field umum)
    const userId = payload.user_id ?? payload.id ?? payload.sub;
    if (!userId) {
      console.warn("authMiddleware: payload token tidak mengandung identifier user (user_id/id/sub)", payload);
      return res.status(401).json({ success: false, message: "Token tidak valid (missing user identifier)." });
    }

    // Set req.user supaya controller dapat memakai req.user.user_id
    req.user = {
      user_id: userId,
      ...(payload.email ? { email: payload.email } : {}),
      ...(payload.role ? { role: payload.role } : {}),
    };

    return next();
  } catch (err) {
    // Tangani error verifikasi token
    if (err && err.name === "TokenExpiredError") {
      console.debug("authMiddleware: token expired");
      return res.status(401).json({ success: false, message: "Token kadaluarsa." });
    }
    console.warn("authMiddleware: token verification failed:", err && err.message ? err.message : err);
    return res.status(401).json({ success: false, message: "User tidak terautentikasi. Token tidak valid." });
  }
};

module.exports = { protect };
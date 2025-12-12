// backend/src/middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan untuk Multer
const storage = multer.diskStorage({
  // Tentukan folder penyimpanan
  destination: (req, file, cb) => {
    // Path harus absolut.
    // __dirname adalah direktori saat ini (middleware), kita naik 2 tingkat (backend) lalu masuk public/uploads
    cb(null, path.join(__dirname, '..', '..', 'public', 'uploads'));
  },
  // Tentukan nama file
  filename: (req, file, cb) => {
    // Contoh nama file: product-17012025T103000.jpg
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// Filter untuk hanya menerima jenis file gambar tertentu
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar (JPEG, PNG, GIF) yang diizinkan.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Batas ukuran file 5 MB
  }
});

module.exports = upload;
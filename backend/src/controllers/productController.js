// backend/src/controllers/productController.js
const productModel = require('../models/productModel');
const fs = require('fs'); 

/**
 * Logika untuk menambah produk baru oleh Admin.
 */
const addProduct = async (req, res) => {
    // Data produk dari body form
    const { name, description, price, stock, unit, category } = req.body;

    if (!req.file) {
        return res.status(400).json({ success: false, message: 'File gambar produk wajib diunggah.' });
    }
    
    const image_url = `/public/uploads/${req.file.filename}`;

    // Validasi data penting
    if (!name || !price || !stock || !unit) {
        // PERBAIKAN KEAMANAN: Hapus file yang sudah terupload jika validasi data gagal
        try {
            fs.unlinkSync(req.file.path); 
        } catch (e) {
            console.error('Gagal menghapus file setelah validasi gagal:', e);
        }
        return res.status(400).json({ success: false, message: 'Nama, Harga, Stok, dan Satuan wajib diisi.' });
    }
    
    try {
        const productData = {
            name, 
            description, 
            price: parseFloat(price),
            stock: parseInt(stock, 10),
            unit, 
            image_url, 
            category
        };

        const newProduct = await productModel.createProduct(productData);

        res.status(201).json({
            success: true,
            message: 'Produk berhasil ditambahkan!',
            product: newProduct,
        });

    } catch (error) {
        console.error('Error saat menambah produk:', error);
        
        // PERBAIKAN KEAMANAN: Hapus file yang terupload jika ada error database/runtime
        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkErr) {
                console.error("Gagal menghapus file yang gagal diunggah karena error DB:", unlinkErr);
            }
        }
        
        res.status(500).json({ success: false, message: 'Terjadi kesalahan server saat menyimpan produk.' });
    }
};

/**
 * Mengambil semua produk untuk ditampilkan di katalog (Akses Publik)
 */
const getProducts = async (req, res) => {
    try {
        const products = await productModel.getAllProducts();
        
        const formattedProducts = products.map(p => ({
            ...p,
            price: parseFloat(p.price),
            imageUrl: `http://localhost:5000${p.image_url}` 
        }));

        res.status(200).json({
            success: true,
            products: formattedProducts,
        });

    } catch (error) {
        console.error('Error saat mengambil produk untuk katalog:', error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan server saat mengambil data produk.' });
    }
};

/**
 * Mengambil detail satu produk berdasarkan ID (Akses Publik)
 */
const getProductDetails = async (req, res) => {
    // ID diambil dari URL params, harus diubah ke integer
    const id = parseInt(req.params.id, 10); 
    
    if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'ID produk tidak valid.' });
    }

    try {
        const product = await productModel.getProductById(id);

        if (!product) {
            // Jika tidak ditemukan di DB, kembalikan 404 (sesuai data DB Anda)
            return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
        }
        
        // Format data sebelum dikirim
        const formattedProduct = {
            ...product,
            price: parseFloat(product.price),
            imageUrl: `http://localhost:5000${product.image_url}` 
        };

        res.status(200).json({
            success: true,
            product: formattedProduct,
        });

    } catch (error) {
        console.error('Error saat mengambil detail produk:', error);
        // Pastikan kita tidak mencoba menghapus req.file di sini (karena ini GET request)
        res.status(500).json({ success: false, message: 'Terjadi kesalahan server saat mengambil detail produk.' });
    }
};


module.exports = {
    addProduct,
    getProducts,
    getProductDetails, // <-- FUNGSI BARU DI EXPORT
};
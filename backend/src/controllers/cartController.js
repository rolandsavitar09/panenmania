// backend/src/controllers/cartController.js
const cartModel = require('../models/cartModel');

/**
 * Mengambil semua item di keranjang (PROTECTED)
 */
const getCart = async (req, res) => {
  const userId = req.user && req.user.user_id;
  if (!userId) return res.status(401).json({ success: false, message: 'User tidak terautentikasi.' });

  try {
    const cartItems = await cartModel.getCartItemsByUserId(userId);

    const formattedCart = cartItems.map((item) => ({
      ...item,
      price: parseFloat(item.price),
      imageUrl: item.image_url ? `http://localhost:5000${item.image_url}` : null,
    }));

    res.status(200).json({ success: true, cart: formattedCart });
  } catch (error) {
    console.error('Error saat mengambil keranjang:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data keranjang.' });
  }
};

/**
 * Menambahkan atau mengupdate produk di keranjang (PROTECTED)
 * Frontend mengirimkan quantity = DELTA (mis. +1 atau -1)
 */
const addToCart = async (req, res) => {
  const userId = req.user && req.user.user_id;
  if (!userId) return res.status(401).json({ success: false, message: 'User tidak terautentikasi.' });

  let { productId, quantity } = req.body;

  // Validasi input
  if (productId == null || isNaN(Number(productId))) {
    return res.status(400).json({ success: false, message: 'productId tidak valid.' });
  }
  if (quantity == null || typeof quantity !== 'number' || isNaN(quantity) || quantity === 0) {
    return res.status(400).json({ success: false, message: 'quantity harus berupa angka bukan 0.' });
  }

  try {
    // Cek apakah item sudah ada di cart
    const existing = await cartModel.getCartItemByUserAndProduct(userId, productId);

    if (existing) {
      const newQty = Number(existing.quantity) + Number(quantity);

      if (newQty <= 0) {
        // Hapus item bila hasilnya <= 0
        await cartModel.deleteCartItem(existing.cart_item_id, userId);
        return res.status(200).json({ success: true, message: 'Item dihapus karena quantity <= 0.' });
      }

      const updated = await cartModel.updateCartItemQuantity(existing.cart_item_id, newQty);
      return res.status(200).json({ success: true, message: 'Qty diperbarui.', item: updated });
    } else {
      // Jika belum ada, hanya insert jika quantity > 0
      if (quantity < 1) {
        return res.status(400).json({ success: false, message: 'Tidak dapat menambahkan item dengan quantity negatif atau 0.' });
      }
      const inserted = await cartModel.insertCartItem(userId, productId, quantity);
      return res.status(201).json({ success: true, message: 'Item ditambahkan ke keranjang.', item: inserted });
    }
  } catch (error) {
    console.error('Error saat menambah keranjang:', error);
    return res.status(500).json({ success: false, message: 'Gagal memproses keranjang.' });
  }
};

/**
 * Menghapus item dari keranjang (PROTECTED)
 */
const removeFromCart = async (req, res) => {
  const userId = req.user && req.user.user_id;
  if (!userId) return res.status(401).json({ success: false, message: 'User tidak terautentikasi.' });

  const { cartItemId } = req.params;
  try {
    const removed = await cartModel.deleteCartItem(cartItemId, userId);
    if (!removed) {
      return res.status(404).json({ success: false, message: 'Item keranjang tidak ditemukan.' });
    }
    return res.status(200).json({ success: true, message: 'Item berhasil dihapus dari keranjang.' });
  } catch (error) {
    console.error('Error saat menghapus keranjang:', error);
    return res.status(500).json({ success: false, message: 'Gagal menghapus item dari keranjang.' });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
};
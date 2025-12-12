// backend/src/controllers/adminController.js

const orderModel = require('../models/orderModel');
const userModel = require('../models/userModel'); // PASTIKAN DI IMPORT

/**
 * Mendapatkan semua metrik Dashboard (PROTECTED ADMIN)
 */
const getDashboardStats = async (req, res) => {
    try {
        const salesStats = await orderModel.getSalesStatistics();
        const userStats = await userModel.getUserCounts();
        
        // Gabungkan hasil
        const stats = {
            totalUsers: parseInt(userStats.total_users),
            totalCustomer: parseInt(userStats.total_customer),
            totalAdmin: parseInt(userStats.total_admin),
            totalOrders: parseInt(salesStats.totals.total_orders),
            totalRevenue: parseFloat(salesStats.totals.total_revenue),
            topProducts: salesStats.topProducts.map(p => ({
                name: p.product_name,
                unit: p.unit,
                sold: parseInt(p.total_sold),
            })),
            topCategories: salesStats.topCategories.map(c => ({
                name: c.category_name,
                sold: parseInt(c.total_sold),
            })),
        };

        res.status(200).json({ success: true, stats });
    } catch (error) {
        console.error('Error saat mengambil dashboard stats:', error);
        res.status(500).json({ success: false, message: 'Gagal memuat data dashboard.' });
    }
};

module.exports = {
    getDashboardStats,
};
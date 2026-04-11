import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Category from '../models/Category.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'Placed' });
    const confirmedOrders = await Order.countDocuments({ orderStatus: 'Confirmed' });
    const processingOrders = await Order.countDocuments({ orderStatus: 'Processing' });
    const shippedOrders = await Order.countDocuments({ orderStatus: { $in: ['Shipped', 'In Transit'] } });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered' });
    const cancelledOrders = await Order.countDocuments({ orderStatus: 'Cancelled' });
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalCategories = await Category.countDocuments();

    const revenueResult = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    const verifiedPaymentsResult = await Order.aggregate([
      { $match: { paymentStatus: 'Verified' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const verifiedRevenue = verifiedPaymentsResult.length > 0 ? verifiedPaymentsResult[0].total : 0;

    const monthlyRevenue = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' }, createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) } } },
      { $group: { _id: { $month: '$createdAt' }, revenue: { $sum: '$totalAmount' }, orders: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    const outOfStockProducts = await Product.countDocuments({ stockStatus: 'Out of Stock', isActive: true });

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        activeProducts,
        totalOrders,
        pendingOrders,
        confirmedOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalUsers,
        totalCategories,
        totalRevenue,
        verifiedRevenue,
        outOfStockProducts,
        monthlyRevenue,
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Category from '../models/Category.js';

export const getStats = asyncHandler(async (_req, res) => {
  const [users, products, orders, categories, revenueAgg] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Category.countDocuments(),
    Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
  ]);
  const recentOrders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(8);
  res.json({
    users,
    products,
    orders,
    categories,
    revenue: revenueAgg[0]?.total || 0,
    recentOrders,
  });
});

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});

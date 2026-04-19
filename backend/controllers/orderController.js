import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod = 'COD' } = req.body;
  if (!shippingAddress) {
    res.status(400);
    throw new Error('Shipping address is required');
  }
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Cart is empty');
  }
  const items = cart.items.map((i) => ({
    product: i.product._id,
    name: i.product.name,
    image: i.product.images?.[0] || '',
    price: i.product.price,
    quantity: i.quantity,
  }));
  const itemsTotal = items.reduce((a, b) => a + b.price * b.quantity, 0);
  const shippingFee = itemsTotal > 999 ? 0 : 49;
  const tax = Math.round(itemsTotal * 0.05);
  const total = itemsTotal + shippingFee + tax;

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    paymentMethod,
    itemsTotal,
    shippingFee,
    tax,
    total,
  });

  // decrement stock
  for (const i of items) {
    await Product.findByIdAndUpdate(i.product, { $inc: { stock: -i.quantity } });
  }
  cart.items = [];
  await cart.save();

  res.status(201).json(order);
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }
  res.json(order);
});

export const getAllOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  order.status = status;
  if (status === 'delivered') {
    order.deliveredAt = new Date();
    order.isPaid = true;
    order.paidAt = order.paidAt || new Date();
  }
  await order.save();
  res.json(order);
});

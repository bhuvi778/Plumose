import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

export const getProducts = asyncHandler(async (req, res) => {
  const { category, search, min, max, sort, featured, trending, bestseller, page = 1, limit = 24 } = req.query;
  const filter = {};

  if (category) {
    const cat = await Category.findOne({ slug: category });
    if (cat) filter.category = cat._id;
  }
  if (search) filter.name = { $regex: search, $options: 'i' };
  if (min || max) {
    filter.price = {};
    if (min) filter.price.$gte = Number(min);
    if (max) filter.price.$lte = Number(max);
  }
  if (featured === 'true') filter.featured = true;
  if (trending === 'true') filter.trending = true;
  if (bestseller === 'true') filter.bestseller = true;

  let sortBy = { createdAt: -1 };
  if (sort === 'price-asc') sortBy = { price: 1 };
  if (sort === 'price-desc') sortBy = { price: -1 };
  if (sort === 'rating') sortBy = { rating: -1 };
  if (sort === 'popular') sortBy = { numReviews: -1 };

  const skip = (Number(page) - 1) * Number(limit);
  const [products, total] = await Promise.all([
    Product.find(filter).populate('category', 'name slug').sort(sortBy).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug');
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  const related = await Product.find({ category: product.category, _id: { $ne: product._id } }).limit(8);
  res.json({ product, related });
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ message: 'Product deleted' });
});

export const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  const already = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
  if (already) {
    res.status(400);
    throw new Error('You already reviewed this product');
  }
  product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length;
  await product.save();
  res.status(201).json({ message: 'Review added' });
});

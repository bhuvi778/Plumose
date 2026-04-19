import asyncHandler from 'express-async-handler';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

export const getCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find().sort({ order: 1, name: 1 });
  const withCounts = await Promise.all(
    categories.map(async (c) => {
      const count = await Product.countDocuments({ category: c._id });
      return { ...c.toObject(), productCount: count };
    })
  );
  res.json(withCounts);
});

export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  res.json(category);
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json(category);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  res.json(category);
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  res.json({ message: 'Category deleted' });
});

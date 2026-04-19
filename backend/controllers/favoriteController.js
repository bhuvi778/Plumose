import asyncHandler from 'express-async-handler';
import Favorite from '../models/Favorite.js';

export const getFavorites = asyncHandler(async (req, res) => {
  let fav = await Favorite.findOne({ user: req.user._id }).populate('products');
  if (!fav) fav = await Favorite.create({ user: req.user._id, products: [] });
  res.json(fav);
});

export const toggleFavorite = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  let fav = await Favorite.findOne({ user: req.user._id });
  if (!fav) fav = await Favorite.create({ user: req.user._id, products: [] });
  const exists = fav.products.find((p) => p.toString() === productId);
  if (exists) {
    fav.products = fav.products.filter((p) => p.toString() !== productId);
  } else {
    fav.products.push(productId);
  }
  await fav.save();
  await fav.populate('products');
  res.json(fav);
});

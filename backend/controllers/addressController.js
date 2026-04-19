import asyncHandler from 'express-async-handler';
import Address from '../models/Address.js';

export const listAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
  res.json(addresses);
});

export const createAddress = asyncHandler(async (req, res) => {
  const data = { ...req.body, user: req.user._id };
  if (data.isDefault) {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
  }
  const address = await Address.create(data);
  res.status(201).json(address);
});

export const updateAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }
  if (req.body.isDefault) {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
  }
  Object.assign(address, req.body);
  await address.save();
  res.json(address);
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }
  res.json({ message: 'Address deleted' });
});

const Inventory = require('../models/Inventory');
const asyncHandler = require('express-async-handler');
const AppError = require('../utils/AppError');

exports.getInventory = asyncHandler(async (req, res, next) => {
  const inventory = await Inventory.find().populate('product', 'name category image_url');
  res.status(200).json({ success: true, data: inventory });
});

exports.stockMovement = asyncHandler(async (req, res, next) => {
  const { productId, warehouseLocation, batchNumber, quantity, type, unit, expiryDate } = req.body;

  if (!productId || !warehouseLocation || !batchNumber || quantity === undefined) {
    return next(new AppError('Please provide all required fields', 400));
  }

  const qtyNumber = Number(quantity);
  if (isNaN(qtyNumber) || qtyNumber <= 0) {
    return next(new AppError('Quantity must be a positive number', 400));
  }

  let inventory = await Inventory.findOne({
    product: productId,
    warehouseLocation,
    batchNumber
  });

  if (type === 'IN') {
    if (inventory) {
      inventory.quantity += qtyNumber;
    } else {
      inventory = new Inventory({
        product: productId,
        warehouseLocation,
        batchNumber,
        quantity: qtyNumber,
        unit: unit || 'MT',
        expiryDate
      });
    }
  } else if (type === 'OUT') {
    if (!inventory) {
      return next(new AppError('Inventory record not found', 404));
    }
    if (inventory.quantity < qtyNumber) {
      return next(new AppError('Insufficient stock', 400));
    }
    inventory.quantity -= qtyNumber;
  } else {
    return next(new AppError('Invalid movement type. Must be IN or OUT', 400));
  }

  if (inventory.quantity === 0) {
    inventory.status = 'Out of Stock';
  } else if (inventory.quantity < 10) {
    inventory.status = 'Low Stock';
  } else {
    inventory.status = 'In Stock';
  }

  await inventory.save();

  res.status(200).json({ success: true, data: inventory });
});

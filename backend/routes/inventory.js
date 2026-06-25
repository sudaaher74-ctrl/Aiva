const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// Get all inventory items
router.get('/', protect, async (req, res) => {
  try {
    const inventory = await Inventory.find().populate('product', 'name category image_url');
    res.status(200).json({ success: true, data: inventory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Add stock movement (Stock In / Stock Out)
router.post('/movement', protect, async (req, res) => {
  try {
    const { productId, warehouseLocation, batchNumber, quantity, type, unit, expiryDate } = req.body;

    if (!productId || !warehouseLocation || !batchNumber || quantity === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const qtyNumber = Number(quantity);
    if (isNaN(qtyNumber) || qtyNumber <= 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be a positive number' });
    }

    // Find existing inventory record
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
        return res.status(404).json({ success: false, message: 'Inventory record not found' });
      }
      if (inventory.quantity < qtyNumber) {
        return res.status(400).json({ success: false, message: 'Insufficient stock' });
      }
      inventory.quantity -= qtyNumber;
    } else {
      return res.status(400).json({ success: false, message: 'Invalid movement type. Must be IN or OUT' });
    }

    // Update status based on quantity
    if (inventory.quantity === 0) {
      inventory.status = 'Out of Stock';
    } else if (inventory.quantity < 10) { // arbitrary low stock threshold
      inventory.status = 'Low Stock';
    } else {
      inventory.status = 'In Stock';
    }

    await inventory.save();
    
    // We would also ideally log this in a separate StockMovementHistory collection

    res.status(200).json({ success: true, data: inventory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;

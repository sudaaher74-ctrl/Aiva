const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  warehouseLocation: {
    type: String,
    enum: ['Factory Warehouse', 'Cold Storage', 'Export Warehouse'],
    required: true
  },
  batchNumber: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  unit: {
    type: String,
    enum: ['MT', 'KG', 'Liters', 'Cartons'],
    default: 'MT'
  },
  expiryDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['In Stock', 'Low Stock', 'Out of Stock'],
    default: 'In Stock'
  }
}, { timestamps: true });

// Ensure batch and location combinations are unique per product if needed
// inventorySchema.index({ product: 1, batchNumber: 1, warehouseLocation: 1 }, { unique: true });

module.exports = mongoose.model('Inventory', inventorySchema);

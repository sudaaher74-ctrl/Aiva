const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  category: { type: String, required: true, index: true },
  description: { type: String },
  tab: { type: String, default: 'aseptic', index: true },
  brix: { type: String },
  shelfLife: { type: String },
  image_url: { type: String },
  pdf_catalog_url: { type: String },
  status: { 
    type: String, 
    enum: ['Active', 'Inactive'],
    default: 'Active',
    index: true
  }
}, { timestamps: true });

// Compound indexes for searching
productSchema.index({ category: 1, status: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);

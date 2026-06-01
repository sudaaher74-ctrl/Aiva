const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  tab: { type: String, default: 'aseptic' },
  brix: { type: String },
  shelfLife: { type: String },
  image_url: { type: String },
  pdf_catalog_url: { type: String },
  status: { 
    type: String, 
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

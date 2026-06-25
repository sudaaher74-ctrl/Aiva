const mongoose = require('mongoose');

// Auto-generate a unique inquiry ID like INQ-A7F3B2
function generateInquiryId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'INQ-';
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

const inquirySchema = new mongoose.Schema({
  inquiryId: {
    type: String,
    unique: true,
    default: generateInquiryId
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  company: {
    type: String,
    trim: true,
    default: ''
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  country: {
    type: String,
    trim: true,
    default: ''
  },
  product: {
    type: String,
    default: ''
  },
  quantity: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  source: {
    type: String,
    enum: ['Contact Page', 'Product Page', 'WhatsApp', 'Direct', 'Other'],
    default: 'Contact Page'
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Quoted', 'Closed', 'Lost'],
    default: 'New'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true  // adds createdAt and updatedAt automatically
});

// Index for faster queries
inquirySchema.index({ status: 1 });
inquirySchema.index({ createdAt: -1 });
inquirySchema.index({ name: 'text', company: 'text', email: 'text', country: 'text' });

module.exports = mongoose.model('Inquiry', inquirySchema);

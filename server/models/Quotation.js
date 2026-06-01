const mongoose = require('mongoose');

const quotationItemSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  unit_price: { type: Number, required: true }
});

const quotationSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  status: { 
    type: String, 
    enum: ['Draft', 'Sent', 'Accepted', 'Rejected'],
    default: 'Draft'
  },
  total_amount: { type: Number, default: 0 },
  pdf_url: { type: String },
  items: [quotationItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('Quotation', quotationSchema);

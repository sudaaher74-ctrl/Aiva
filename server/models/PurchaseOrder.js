const mongoose = require('mongoose');

// ============================================================
// Auto-generate sequential PO number: PO-AIVA-2026-0001
// ============================================================
async function generatePONumber() {
  const year = new Date().getFullYear();
  const prefix = `PO-AIVA-${year}-`;
  
  // Find the latest PO for this year
  const latest = await mongoose.model('PurchaseOrder')
    .findOne({ poNumber: { $regex: `^${prefix}` } })
    .sort({ poNumber: -1 })
    .lean();
  
  let nextNum = 1;
  if (latest && latest.poNumber) {
    const lastNum = parseInt(latest.poNumber.replace(prefix, ''), 10);
    if (!isNaN(lastNum)) nextNum = lastNum + 1;
  }
  
  return prefix + String(nextNum).padStart(4, '0');
}

// ============================================================
// Line Item Sub-Schema
// ============================================================
const lineItemSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'MT', enum: ['MT', 'Kg', 'Cartons', 'Drums', 'Bags'] },
  packaging: { type: String, default: '' },
  unitPrice: { type: Number, required: true },
  currency: { type: String, default: 'USD', enum: ['USD', 'EUR', 'GBP', 'INR', 'AED'] },
  storageCondition: { type: String, default: '' },
  shelfLife: { type: String, default: '' },
  amount: { type: Number, default: 0 }  // quantity * unitPrice
}, { _id: false });

// ============================================================
// Main Purchase Order Schema
// ============================================================
const purchaseOrderSchema = new mongoose.Schema({
  // --- PO Metadata ---
  poNumber: {
    type: String,
    unique: true
  },
  poDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Draft', 'Pending', 'Approved', 'Processing', 'Shipped', 'Delivered'],
    default: 'Draft'
  },

  // --- Buyer Information ---
  buyerName: {
    type: String,
    required: [true, 'Buyer name is required'],
    trim: true
  },
  buyerCompany: {
    type: String,
    required: [true, 'Buyer company is required'],
    trim: true
  },
  buyerCountry: {
    type: String,
    required: [true, 'Buyer country is required'],
    trim: true
  },
  buyerAddress: {
    type: String,
    default: '',
    trim: true
  },
  buyerEmail: {
    type: String,
    required: [true, 'Buyer email is required'],
    trim: true,
    lowercase: true
  },
  buyerPhone: {
    type: String,
    default: '',
    trim: true
  },

  // --- Line Items ---
  items: [lineItemSchema],

  // --- Shipment Details ---
  portOfLoading: {
    type: String,
    default: 'Nhava Sheva, India'
  },
  destinationPort: {
    type: String,
    default: ''
  },
  incoterms: {
    type: String,
    default: 'FOB',
    enum: ['FOB', 'CIF', 'EXW', 'CFR', 'DDP', 'FCA', 'CPT']
  },
  containerType: {
    type: String,
    default: '20ft Dry',
    enum: ['20ft Dry', '40ft Dry', '40ft HC', 'Reefer 20ft', 'Reefer 40ft']
  },
  shipmentMethod: {
    type: String,
    default: 'Sea',
    enum: ['Sea', 'Air', 'Road', 'Rail', 'Multimodal']
  },
  deliveryDate: {
    type: Date
  },

  // --- Financials ---
  subtotal: {
    type: Number,
    default: 0
  },
  gstPercent: {
    type: Number,
    default: 0
  },
  gstAmount: {
    type: Number,
    default: 0
  },
  freightCharges: {
    type: Number,
    default: 0
  },
  insurance: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },

  // --- Terms & Notes ---
  termsAndConditions: {
    type: String,
    default: `1. Payment: 30% advance, 70% against Bill of Lading.\n2. Quality: As per mutually agreed specifications and samples.\n3. Validity: This Purchase Order is valid for 30 days from the date of issue.\n4. Inspection: Goods subject to inspection at the port of loading.\n5. Packaging: Export-grade packaging as per international standards.\n6. Documents: Commercial Invoice, Packing List, Bill of Lading, Certificate of Origin, Phytosanitary Certificate.\n7. Force Majeure: Neither party shall be liable for delays due to force majeure events.\n8. Jurisdiction: Any disputes shall be subject to the jurisdiction of Indian courts.`
  },
  internalNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Pre-save: auto-generate PO number if not set
purchaseOrderSchema.pre('save', async function(next) {
  if (!this.poNumber) {
    this.poNumber = await generatePONumber();
  }
  
  // Auto-calculate item amounts and subtotal
  let subtotal = 0;
  this.items.forEach(item => {
    item.amount = item.quantity * item.unitPrice;
    subtotal += item.amount;
  });
  this.subtotal = subtotal;
  this.gstAmount = (subtotal * (this.gstPercent || 0)) / 100;
  this.totalAmount = subtotal + this.gstAmount + (this.freightCharges || 0) + (this.insurance || 0);
  
  next();
});

// Indexes for faster queries
purchaseOrderSchema.index({ status: 1 });
purchaseOrderSchema.index({ createdAt: -1 });
purchaseOrderSchema.index({ buyerCompany: 'text', buyerName: 'text', poNumber: 'text' });

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);

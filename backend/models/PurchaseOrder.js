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
  hsnCode: { type: String, default: '' },
  specification: { type: String, default: '' },
  packaging: { type: String, default: '' },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'MT', enum: ['MT', 'Kg', 'Cartons', 'Drums', 'Bags', 'PCS'] },
  unitPrice: { type: Number, required: true },
  currency: { type: String, default: 'USD', enum: ['USD', 'INR', 'EUR', 'GBP', 'AED'] },
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
    default: 'FOB'
  },
  containerType: {
    type: String,
    default: '20ft Dry'
  },
  shipmentMethod: {
    type: String,
    default: 'Sea'
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
  gstType: {
    type: String,
    enum: ['CGST_SGST', 'IGST', 'NONE', 'TAX'],
    default: 'NONE'
  },
  cgstPercent: { type: Number, default: 0 },
  cgstAmount: { type: Number, default: 0 },
  sgstPercent: { type: Number, default: 0 },
  sgstAmount: { type: Number, default: 0 },
  igstPercent: { type: Number, default: 0 },
  igstAmount: { type: Number, default: 0 },
  stateName: { type: String, default: '' },
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
    enum: ['USD', 'INR', 'EUR', 'GBP', 'AED'],
    default: 'USD'
  },

  // --- Terms & Conditions ---
  paymentTerms: {
    type: String,
    default: '30% Advance / 70% Against Documents'
  },
  validity: {
    type: String,
    default: '30 Days'
  },
  supplierGstin: {
    type: String,
    default: ''
  },
  supplierFssai: {
    type: String,
    default: ''
  },
  shipToName: {
    type: String,
    default: 'AIVA Enterprises – Export Warehouse'
  },
  shipToAddress: {
    type: String,
    default: 'Navi Mumbai, Maharashtra, India'
  },
  termsAndConditions: {
    type: String,
    default: `1. Goods must strictly comply with agreed specifications and quality standards.\n2. Batch-wise Certificate of Analysis (COA) and phytosanitary certificates required prior to dispatch.\n3. Payment terms as stated above: balance payable against presentation of original shipping documents.\n4. Delivery and shipment schedules must be adhered to as per the agreed Incoterms.\n5. Export-grade packaging as per international standards with proper markings.\n6. Any deviation requires prior written approval from AIVA Enterprises.\n7. All disputes subject to Navi Mumbai / Mumbai jurisdiction.`
  },
  internalNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Pre-save: auto-generate PO number if not set and calculate bill according to GSTIN
purchaseOrderSchema.pre('save', async function() {
  if (!this.poNumber) {
    this.poNumber = await generatePONumber();
  }
  
  // Auto-calculate item amounts and subtotal
  let subtotal = 0;
  if (Array.isArray(this.items)) {
    this.items.forEach(item => {
      if (item.unitPrice === undefined && item.unitPriceUSD !== undefined) {
        item.unitPrice = Number(item.unitPriceUSD);
      }
      item.quantity = Number(item.quantity) || 1;
      item.unitPrice = Number(item.unitPrice) || 0;
      item.amount = item.quantity * item.unitPrice;
      subtotal += item.amount;
    });
  }
  this.subtotal = subtotal;

  // Determine GST breakdown according to supplier GST number (GSTIN)
  const gstin = (this.supplierGstin || '').trim().toUpperCase();
  const gstRate = Number(this.gstPercent) || 0;

  if (gstRate > 0) {
    const stateCode = gstin.substring(0, 2);
    // AIVA Enterprises is based in Maharashtra (State Code 27)
    if (stateCode === '27') {
      this.gstType = 'CGST_SGST';
      this.cgstPercent = gstRate / 2;
      this.sgstPercent = gstRate / 2;
      this.igstPercent = 0;
      this.cgstAmount = (subtotal * this.cgstPercent) / 100;
      this.sgstAmount = (subtotal * this.sgstPercent) / 100;
      this.igstAmount = 0;
      this.gstAmount = this.cgstAmount + this.sgstAmount;
      this.stateName = 'Maharashtra';
    } else if (stateCode && /^\d{2}$/.test(stateCode)) {
      this.gstType = 'IGST';
      this.cgstPercent = 0;
      this.sgstPercent = 0;
      this.igstPercent = gstRate;
      this.cgstAmount = 0;
      this.sgstAmount = 0;
      this.igstAmount = (subtotal * gstRate) / 100;
      this.gstAmount = this.igstAmount;
    } else {
      this.gstType = 'TAX';
      this.cgstPercent = 0;
      this.sgstPercent = 0;
      this.igstPercent = 0;
      this.cgstAmount = 0;
      this.sgstAmount = 0;
      this.igstAmount = 0;
      this.gstAmount = (subtotal * gstRate) / 100;
    }
  } else {
    this.gstType = 'NONE';
    this.cgstPercent = 0;
    this.sgstPercent = 0;
    this.igstPercent = 0;
    this.cgstAmount = 0;
    this.sgstAmount = 0;
    this.igstAmount = 0;
    this.gstAmount = 0;
  }

  this.totalAmount = subtotal + this.gstAmount + (Number(this.freightCharges) || 0) + (Number(this.insurance) || 0);
});

// Indexes for faster queries
purchaseOrderSchema.index({ status: 1 });
purchaseOrderSchema.index({ createdAt: -1 });
purchaseOrderSchema.index({ buyerEmail: 1, status: 1 });
purchaseOrderSchema.index({ buyerCompany: 'text', buyerName: 'text', poNumber: 'text' });

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);

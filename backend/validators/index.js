const { z } = require('zod');

// Auth Validators
const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters')
  })
});

// Inquiry Validators
const inquirySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional().or(z.literal('')),
    company: z.string().optional().or(z.literal('')),
    country: z.string().optional().or(z.literal('')),
    product: z.string().optional().or(z.literal('')),
    quantity: z.string().optional().or(z.literal('')),
    message: z.string().optional().or(z.literal('')),
    source: z.enum(['Contact Page', 'Product Page', 'WhatsApp', 'Direct', 'Other']).optional(),
    status: z.enum(['New', 'Contacted', 'Quoted', 'Closed', 'Lost']).optional()
  })
});

// Quotation Validators
const quotationSchema = z.object({
  body: z.object({
    customerName: z.string().min(2, 'Customer name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional().or(z.literal('')),
    company: z.string().optional().or(z.literal('')),
    items: z.array(z.object({
      product: z.string(),
      quantity: z.number().positive(),
      unitPrice: z.number().nonnegative(),
      total: z.number().nonnegative()
    })).min(1, 'At least one item is required'),
    subtotal: z.number().nonnegative().optional(),
    tax: z.number().nonnegative().optional(),
    total: z.number().nonnegative().optional(),
    validUntil: z.string().optional(),
    notes: z.string().optional()
  })
});

// Customer Validators
const customerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    phone: z.string().optional().or(z.literal('')),
    company: z.string().optional().or(z.literal('')),
    address: z.string().optional().or(z.literal('')),
    tags: z.array(z.string()).optional()
  })
});

// Product Validators
const productSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Product name is required'),
    category: z.string().min(1, 'Category is required'),
    description: z.string().optional(),
    tab: z.string().optional(),
    brix: z.string().optional(),
    shelfLife: z.string().optional(),
    image_url: z.string().optional(),
    pdf_catalog_url: z.string().optional(),
    status: z.enum(['Active', 'Inactive']).optional()
  })
});

// Purchase Order Validators
const purchaseOrderItemSchema = z.object({
  productName: z.string().min(1, 'Product name is required'),
  category: z.string().optional(),
  packaging: z.string().optional(),
  netWeightKg: z.coerce.number().optional(),
  quantity: z.coerce.number().positive('Quantity must be greater than 0'),
  unit: z.string().optional(),
  unitPrice: z.coerce.number().nonnegative().optional(),
  unitPriceUSD: z.coerce.number().nonnegative().optional(),
  totalUSD: z.coerce.number().nonnegative().optional(),
  amount: z.coerce.number().nonnegative().optional(),
  currency: z.string().optional(),
  storageCondition: z.string().optional(),
  shelfLife: z.string().optional()
}).passthrough().refine(item => item.unitPrice !== undefined || item.unitPriceUSD !== undefined, {
  message: 'Unit price is required'
});

const purchaseOrderSchema = z.object({
  body: z.object({
    buyerCompany: z.string().min(2, 'Buyer company is required'),
    buyerName: z.string().optional(),
    buyerContactPerson: z.string().optional(),
    buyerCountry: z.string().optional(),
    buyerEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
    buyerPhone: z.string().optional(),
    buyerAddress: z.string().optional(),
    consignee: z.string().optional(),
    shippingAddress: z.string().optional(),
    portOfLoading: z.string().optional(),
    destinationPort: z.string().optional(),
    incoterms: z.string().optional(),
    containerType: z.string().optional(),
    shipmentMethod: z.string().optional(),
    deliveryDate: z.union([z.string(), z.date()]).optional(),
    freightCharges: z.coerce.number().optional(),
    insurance: z.coerce.number().optional(),
    gstPercent: z.coerce.number().optional(),
    gstAmount: z.coerce.number().optional(),
    subtotal: z.coerce.number().optional(),
    totalAmount: z.coerce.number().optional(),
    totalAmountUSD: z.coerce.number().optional(),
    currency: z.string().optional(),
    paymentTerms: z.string().optional(),
    termsAndConditions: z.string().optional(),
    internalNotes: z.string().optional(),
    status: z.enum([
      'Draft', 'Pending', 'Approved', 'Processing', 'Shipped', 'Delivered',
      'Confirmed', 'In Transit', 'Customs Clearance', 'Cancelled'
    ]).optional(),
    items: z.array(purchaseOrderItemSchema).optional()
  }).passthrough()
});

// Inventory Validators
const inventorySchema = z.object({
  body: z.object({
    productName: z.string().min(2, 'Product name is required'),
    category: z.string().optional(),
    sku: z.string().optional(),
    batchNumber: z.string().optional(),
    stockQuantity: z.number().nonnegative(),
    unit: z.string().optional(),
    reorderLevel: z.number().nonnegative().optional(),
    warehouseLocation: z.string().optional(),
    status: z.enum(['In Stock', 'Low Stock', 'Out of Stock']).optional()
  })
});

module.exports = {
  loginSchema,
  inquirySchema,
  quotationSchema,
  customerSchema,
  productSchema,
  purchaseOrderSchema,
  inventorySchema
};

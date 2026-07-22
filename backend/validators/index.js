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
const purchaseOrderSchema = z.object({
  body: z.object({
    buyerCompany: z.string().min(2, 'Buyer company is required'),
    buyerContactPerson: z.string().optional(),
    buyerEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
    buyerPhone: z.string().optional(),
    consignee: z.string().optional(),
    shippingAddress: z.string().optional(),
    items: z.array(z.object({
      productName: z.string().min(1),
      category: z.string().optional(),
      packaging: z.string().optional(),
      netWeightKg: z.number().optional(),
      quantity: z.number().positive(),
      unit: z.string().optional(),
      unitPriceUSD: z.number().nonnegative(),
      totalUSD: z.number().nonnegative().optional()
    })).optional(),
    totalAmountUSD: z.number().nonnegative().optional(),
    paymentTerms: z.string().optional(),
    status: z.enum(['Draft', 'Confirmed', 'Processing', 'In Transit', 'Customs Clearance', 'Delivered', 'Cancelled']).optional()
  })
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

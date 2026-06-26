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
    phone: z.string().min(10, 'Valid phone number is required'),
    company: z.string().optional(),
    message: z.string().min(10, 'Message must be at least 10 characters'),
    serviceOfInterest: z.string().optional()
  })
});

// Quotation Validators
const quotationSchema = z.object({
  body: z.object({
    customerName: z.string().min(2, 'Customer name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Valid phone number is required'),
    company: z.string().optional(),
    items: z.array(z.object({
      product: z.string(),
      quantity: z.number().positive(),
      unitPrice: z.number().nonnegative(),
      total: z.number().nonnegative()
    })).min(1, 'At least one item is required'),
    subtotal: z.number().nonnegative(),
    tax: z.number().nonnegative(),
    total: z.number().nonnegative(),
    validUntil: z.string().optional(),
    notes: z.string().optional()
  })
});

// Customer Validators
const customerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    phone: z.string().min(10, 'Valid phone number is required').optional().or(z.literal('')),
    company: z.string().optional(),
    address: z.string().optional(),
    tags: z.array(z.string()).optional()
  })
});

// Product Validators
const productSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Product name is required'),
    description: z.string().optional(),
    price: z.number().nonnegative('Price must be a positive number'),
    category: z.string().min(1, 'Category is required'),
    sku: z.string().min(1, 'SKU is required'),
    stock: z.number().int().nonnegative('Stock cannot be negative'),
    status: z.enum(['Active', 'Draft', 'Archived']).default('Active'),
    imageUrl: z.string().url().optional().or(z.literal(''))
  })
});

module.exports = {
  loginSchema,
  inquirySchema,
  quotationSchema,
  customerSchema,
  productSchema
};

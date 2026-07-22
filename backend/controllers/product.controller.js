const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');
const AppError = require('../utils/AppError');
const { uploadToCloudinary } = require('../utils/cloudinary');

exports.getProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json({ success: true, data: products });
});

exports.getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }
  res.json({ success: true, data: product });
});

exports.createProduct = asyncHandler(async (req, res, next) => {
  const { name, category, description, status, tab, brix, shelfLife } = req.body;
  let image_url = '';
  let pdf_catalog_url = '';

  if (req.files) {
    if (req.files.image) {
      const result = await uploadToCloudinary(req.files.image[0].buffer, 'products', 'image');
      image_url = result.secure_url;
    }
    if (req.files.pdf_catalog) {
      const result = await uploadToCloudinary(req.files.pdf_catalog[0].buffer, 'catalogs', 'raw');
      pdf_catalog_url = result.secure_url;
    }
  }

  const product = await Product.create({
    name, category, description, status, image_url, pdf_catalog_url, tab, brix, shelfLife
  });

  res.status(201).json({ success: true, data: product });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  let updateData = { ...req.body };

  if (req.files) {
    if (req.files.image) {
      const result = await uploadToCloudinary(req.files.image[0].buffer, 'products', 'image');
      updateData.image_url = result.secure_url;
    }
    if (req.files.pdf_catalog) {
      const result = await uploadToCloudinary(req.files.pdf_catalog[0].buffer, 'catalogs', 'raw');
      updateData.pdf_catalog_url = result.secure_url;
    }
  }

  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
  res.json({ success: true, data: updatedProduct });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }
  res.json({ success: true, message: 'Product deleted' });
});

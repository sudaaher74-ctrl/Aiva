const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadToCloudinary } = require('../utils/cloudinary');

// @route   GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/products
// @access  Private (Admin/Sales)
router.post('/', protect, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf_catalog', maxCount: 1 }]), async (req, res) => {
  try {
    const { name, category, description, status } = req.body;
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
      name, category, description, status, image_url, pdf_catalog_url
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/products/:id
// @access  Private
router.put('/:id', protect, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf_catalog', maxCount: 1 }]), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
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
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/products/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

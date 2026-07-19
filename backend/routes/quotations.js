const express = require('express');
const router = express.Router();
const Quotation = require('../models/Quotation');
const { protect, restrictTo } = require('../middleware/auth');

// @route   GET /api/quotations
// @access  Private
router.get('/', protect, restrictTo('Admin'), async (req, res) => {
  try {
    const quotations = await Quotation.find().populate('customer_id').populate('items.product_id').sort({ createdAt: -1 });
    res.json({ success: true, data: quotations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/quotations
// @access  Private
router.post('/', protect, restrictTo('Admin'), async (req, res) => {
  try {
    const quotation = await Quotation.create(req.body);
    res.status(201).json({ success: true, data: quotation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PATCH /api/quotations/:id/status
// @access  Private
router.patch('/:id/status', protect, restrictTo('Admin'), async (req, res) => {
  try {
    const quotation = await Quotation.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!quotation) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: quotation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/quotations/:id
// @access  Private
router.delete('/:id', protect, restrictTo('Admin'), async (req, res) => {
  try {
    const quotation = await Quotation.findByIdAndDelete(req.params.id);
    if (!quotation) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Quotation deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

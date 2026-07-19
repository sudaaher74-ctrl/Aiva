const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Inquiry = require('../models/Inquiry');
const PurchaseOrder = require('../models/PurchaseOrder');
const { protect, restrictTo } = require('../middleware/auth');

// @route   GET /api/search
// @access  Private
router.get('/', protect, restrictTo('Admin'), async (req, res) => {
  try {
    const query = req.query.q || '';
    if (!query.trim()) {
      return res.json({ success: true, data: { products: [], inquiries: [], purchaseOrders: [] } });
    }

    const safeQuery = query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const regex = new RegExp(safeQuery, 'i');

    const [products, inquiries, purchaseOrders] = await Promise.all([
      Product.find({ $or: [{ name: regex }, { category: regex }, { description: regex }] }).limit(10),
      Inquiry.find({ $or: [{ name: regex }, { company: regex }, { inquiryId: regex }] }).limit(10),
      PurchaseOrder.find({ $or: [{ poNumber: regex }, { buyerCompany: regex }] }).limit(10)
    ]);

    res.json({
      success: true,
      data: {
        products,
        inquiries,
        purchaseOrders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

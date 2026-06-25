const express = require('express');
const router = express.Router();
const PurchaseOrder = require('../models/PurchaseOrder');
const { protect } = require('../middleware/auth');

// ============================================================
// GET /api/purchase-orders — List all POs (with filters)
// Query: ?status=Draft&search=john&limit=50&page=1
// ============================================================
router.get('/', protect, async (req, res) => {
  try {
    const { status, search, limit = 50, page = 1 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { poNumber: { $regex: search, $options: 'i' } },
        { buyerName: { $regex: search, $options: 'i' } },
        { buyerCompany: { $regex: search, $options: 'i' } },
        { buyerCountry: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      PurchaseOrder.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      PurchaseOrder.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// GET /api/purchase-orders/stats — Dashboard KPIs
// ============================================================
router.get('/stats', protect, async (req, res) => {
  try {
    const [total, statusCounts, recentOrders, todayCount, revenueAgg] = await Promise.all([
      PurchaseOrder.countDocuments(),
      PurchaseOrder.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      PurchaseOrder.find().sort({ createdAt: -1 }).limit(5),
      PurchaseOrder.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      }),
      PurchaseOrder.aggregate([
        { $match: { status: { $nin: ['Draft'] } } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
      ])
    ]);

    // Build status counts
    const statuses = { Draft: 0, Pending: 0, Approved: 0, Processing: 0, Shipped: 0, Delivered: 0 };
    statusCounts.forEach(s => {
      if (statuses.hasOwnProperty(s._id)) {
        statuses[s._id] = s.count;
      }
    });

    // Recent buyers
    const recentBuyers = await PurchaseOrder.aggregate([
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$buyerCompany', buyerName: { $first: '$buyerName' }, country: { $first: '$buyerCountry' }, totalOrders: { $sum: 1 }, totalValue: { $sum: '$totalAmount' }, lastOrder: { $first: '$createdAt' } } },
      { $sort: { lastOrder: -1 } },
      { $limit: 5 }
    ]);

    // Country breakdown
    const countryBreakdown = await PurchaseOrder.aggregate([
      { $group: { _id: '$buyerCountry', count: { $sum: 1 }, value: { $sum: '$totalAmount' } } },
      { $sort: { value: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        total,
        today: todayCount,
        statuses,
        totalRevenue: revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0,
        recentOrders,
        recentBuyers,
        countryBreakdown
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// GET /api/purchase-orders/next-number — Get next PO number
// ============================================================
router.get('/next-number', protect, async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const prefix = `PO-AIVA-${year}-`;
    
    const latest = await PurchaseOrder
      .findOne({ poNumber: { $regex: `^${prefix}` } })
      .sort({ poNumber: -1 })
      .lean();
    
    let nextNum = 1;
    if (latest && latest.poNumber) {
      const lastNum = parseInt(latest.poNumber.replace(prefix, ''), 10);
      if (!isNaN(lastNum)) nextNum = lastNum + 1;
    }
    
    res.json({ success: true, data: { poNumber: prefix + String(nextNum).padStart(4, '0') } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// GET /api/purchase-orders/:id — Get single PO
// ============================================================
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Purchase order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// POST /api/purchase-orders — Create new PO
// ============================================================
router.post('/', protect, async (req, res) => {
  try {
    const order = await PurchaseOrder.create(req.body);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// PATCH /api/purchase-orders/:id — Update PO
// ============================================================
router.patch('/:id', protect, async (req, res) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Purchase order not found' });
    }

    // Update all provided fields
    Object.keys(req.body).forEach(key => {
      order[key] = req.body[key];
    });

    await order.save(); // triggers pre-save for recalculation
    res.json({ success: true, data: order });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// PATCH /api/purchase-orders/:id/status — Update PO status
// ============================================================
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Draft', 'Pending', 'Approved', 'Processing', 'Shipped', 'Delivered'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await PurchaseOrder.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Purchase order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// DELETE /api/purchase-orders/:id — Delete PO
// ============================================================
router.delete('/:id', protect, async (req, res) => {
  try {
    const order = await PurchaseOrder.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Purchase order not found' });
    }
    res.json({ success: true, message: 'Purchase order deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// POST /api/purchase-orders/:id/email — Email PO to buyer
// ============================================================
router.post('/:id/email', protect, async (req, res) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Purchase order not found' });
    }

    // TODO: Integrate Nodemailer + SMTP when credentials are available
    // For now, return success stub
    console.log(`📧 Email PO ${order.poNumber} to ${order.buyerEmail}`);

    res.json({ 
      success: true, 
      message: `Purchase order ${order.poNumber} email queued for ${order.buyerEmail}`,
      data: { poNumber: order.poNumber, recipient: order.buyerEmail }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

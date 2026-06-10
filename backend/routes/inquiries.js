const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');

// ============================================================
// GET /api/inquiries — List all inquiries (with filters)
// Query params: ?status=New&search=john&limit=50&page=1
// ============================================================
router.get('/', async (req, res) => {
  try {
    const { status, search, limit = 50, page = 1 } = req.query;
    const query = {};

    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Text search across name, company, email, country
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { inquiryId: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [inquiries, total] = await Promise.all([
      Inquiry.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Inquiry.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: inquiries,
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
// GET /api/inquiries/stats — Dashboard KPI stats
// ============================================================
router.get('/stats', async (req, res) => {
  try {
    const [total, statusCounts, recentInquiries, todayCount] = await Promise.all([
      Inquiry.countDocuments(),
      Inquiry.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Inquiry.find().sort({ createdAt: -1 }).limit(5),
      Inquiry.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      })
    ]);

    // Build status counts object
    const statuses = { New: 0, Contacted: 0, Quoted: 0, Closed: 0, Lost: 0 };
    statusCounts.forEach(s => {
      if (statuses.hasOwnProperty(s._id)) {
        statuses[s._id] = s.count;
      }
    });

    // Country breakdown
    const countryBreakdown = await Inquiry.aggregate([
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Product breakdown
    const productBreakdown = await Inquiry.aggregate([
      { $match: { product: { $ne: '' } } },
      { $group: { _id: '$product', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        total,
        today: todayCount,
        statuses,
        countryBreakdown,
        productBreakdown,
        recentInquiries,
        conversionRate: total > 0 
          ? ((statuses.Closed / total) * 100).toFixed(1) 
          : '0.0'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// GET /api/inquiries/:id — Get single inquiry
// ============================================================
router.get('/:id', async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    res.json({ success: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// POST /api/inquiries — Create new inquiry (from contact form)
// ============================================================
router.post('/', async (req, res) => {
  try {
    const { name, company, email, phone, country, product, quantity, message, source } = req.body;

    const inquiry = await Inquiry.create({
      name,
      company,
      email,
      phone,
      country,
      product: product || '',
      quantity: quantity || '',
      message: message || '',
      source: source || 'Contact Page'
    });

    res.status(201).json({ success: true, data: inquiry });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// PATCH /api/inquiries/:id/status — Update inquiry status
// ============================================================
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['New', 'Contacted', 'Quoted', 'Closed', 'Lost'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    res.json({ success: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// PATCH /api/inquiries/:id/notes — Update admin notes
// ============================================================
router.patch('/:id/notes', async (req, res) => {
  try {
    const { notes } = req.body;

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { notes },
      { new: true }
    );

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    res.json({ success: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// DELETE /api/inquiries/:id — Delete an inquiry
// ============================================================
router.delete('/:id', async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

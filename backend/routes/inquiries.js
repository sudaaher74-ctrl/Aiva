const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const { protect, restrictTo } = require('../middleware/auth');

// ============================================================
// GET /api/inquiries — List all inquiries (with filters)
// Query params: ?status=New&search=john&limit=50&page=1
// ============================================================
router.get('/', protect, restrictTo('Admin'), async (req, res) => {
  try {
    const { status, search, limit = 50, page = 1 } = req.query;
    const query = {};

    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Text search across name, company, email, country
    if (search) {
      const safeSearch = search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      query.$or = [
        { name: { $regex: safeSearch, $options: 'i' } },
        { company: { $regex: safeSearch, $options: 'i' } },
        { email: { $regex: safeSearch, $options: 'i' } },
        { country: { $regex: safeSearch, $options: 'i' } },
        { inquiryId: { $regex: safeSearch, $options: 'i' } }
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
router.get('/stats', protect, restrictTo('Admin'), async (req, res) => {
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
router.get('/:id', protect, restrictTo('Admin'), async (req, res) => {
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

const nodemailer = require('nodemailer');

// ============================================================
// POST /api/inquiries — Create new inquiry (from contact form)
// ============================================================
const escapeHtml = (unsafe) => {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

router.post('/', async (req, res) => {
  try {
    const { name, company, email, phone, country, product, quantity, message, source, _honeypot } = req.body;

    // Honeypot check
    if (_honeypot) {
      return res.status(201).json({ success: true, message: 'Inquiry received' });
    }

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

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER || '"AIVA System" <no-reply@aivaenterprises.com>',
        to: process.env.EMAIL_USER || 'Enquiry@aivaenterprises.com',
        subject: `New Bulk Inquiry from ${company || name}`,
        html: `
          <h2>New Bulk Inquiry Received</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Company:</strong> ${escapeHtml(company) || 'N/A'}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Country:</strong> ${escapeHtml(country)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone) || 'N/A'}</p>
          <p><strong>Product Interest:</strong> ${escapeHtml(product) || 'General'}</p>
          <p><strong>Quantity:</strong> ${escapeHtml(quantity) || 'N/A'}</p>
          <p><strong>Message:</strong><br/> ${escapeHtml(message)}</p>
        `
      };

      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await transporter.sendMail(mailOptions);
      } else {
        console.log('Skipping email notification: EMAIL_USER and EMAIL_PASS not configured in .env');
      }
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
    }

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
router.patch('/:id/status', protect, restrictTo('Admin'), async (req, res) => {
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
router.patch('/:id/notes', protect, restrictTo('Admin'), async (req, res) => {
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
router.delete('/:id', protect, restrictTo('Admin'), async (req, res) => {
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

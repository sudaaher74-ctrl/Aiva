const Inquiry = require('../models/Inquiry');
const asyncHandler = require('express-async-handler');
const AppError = require('../utils/AppError');
const nodemailer = require('nodemailer');

const escapeHtml = (unsafe) => {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

exports.getInquiries = asyncHandler(async (req, res, next) => {
  const { status, search, limit = 50, page = 1 } = req.query;
  const query = {};

  if (status && status !== 'All') {
    query.status = status;
  }

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
});

exports.getInquiryStats = asyncHandler(async (req, res, next) => {
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

  const statuses = { New: 0, Contacted: 0, Quoted: 0, Closed: 0, Lost: 0 };
  statusCounts.forEach(s => {
    if (statuses.hasOwnProperty(s._id)) {
      statuses[s._id] = s.count;
    }
  });

  const countryBreakdown = await Inquiry.aggregate([
    { $group: { _id: '$country', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

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
});

exports.getInquiryById = asyncHandler(async (req, res, next) => {
  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) {
    return next(new AppError('Inquiry not found', 404));
  }
  res.json({ success: true, data: inquiry });
});

exports.createInquiry = asyncHandler(async (req, res, next) => {
  const { name, company, email, phone, country, product, quantity, message, source, _honeypot } = req.body;

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
    }
  } catch (emailError) {
    console.error('Failed to send email notification:', emailError);
  }

  res.status(201).json({ success: true, data: inquiry });
});

exports.updateInquiryStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['New', 'Contacted', 'Quoted', 'Closed', 'Lost'];

  if (!validStatuses.includes(status)) {
    return next(new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400));
  }

  const inquiry = await Inquiry.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!inquiry) {
    return next(new AppError('Inquiry not found', 404));
  }

  res.json({ success: true, data: inquiry });
});

exports.updateInquiryNotes = asyncHandler(async (req, res, next) => {
  const { notes } = req.body;

  const inquiry = await Inquiry.findByIdAndUpdate(
    req.params.id,
    { notes },
    { new: true }
  );

  if (!inquiry) {
    return next(new AppError('Inquiry not found', 404));
  }

  res.json({ success: true, data: inquiry });
});

exports.deleteInquiry = asyncHandler(async (req, res, next) => {
  const inquiry = await Inquiry.findByIdAndDelete(req.params.id);

  if (!inquiry) {
    return next(new AppError('Inquiry not found', 404));
  }

  res.json({ success: true, message: 'Inquiry deleted successfully' });
});

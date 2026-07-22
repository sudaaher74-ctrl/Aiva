const PurchaseOrder = require('../models/PurchaseOrder');
const asyncHandler = require('express-async-handler');
const AppError = require('../utils/AppError');

exports.getPurchaseOrders = asyncHandler(async (req, res, next) => {
  const { status, search, limit = 50, page = 1 } = req.query;
  const query = {};

  if (status && status !== 'All') {
    query.status = status;
  }

  if (search) {
    const safeSearch = search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    query.$or = [
      { poNumber: { $regex: safeSearch, $options: 'i' } },
      { buyerName: { $regex: safeSearch, $options: 'i' } },
      { buyerCompany: { $regex: safeSearch, $options: 'i' } },
      { buyerCountry: { $regex: safeSearch, $options: 'i' } }
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
});

exports.getPurchaseOrderStats = asyncHandler(async (req, res, next) => {
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

  const statuses = { Draft: 0, Pending: 0, Approved: 0, Processing: 0, Shipped: 0, Delivered: 0 };
  statusCounts.forEach(s => {
    if (statuses.hasOwnProperty(s._id)) {
      statuses[s._id] = s.count;
    }
  });

  const recentBuyers = await PurchaseOrder.aggregate([
    { $sort: { createdAt: -1 } },
    { $group: { _id: '$buyerCompany', buyerName: { $first: '$buyerName' }, country: { $first: '$buyerCountry' }, totalOrders: { $sum: 1 }, totalValue: { $sum: '$totalAmount' }, lastOrder: { $first: '$createdAt' } } },
    { $sort: { lastOrder: -1 } },
    { $limit: 5 }
  ]);

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
});

exports.getNextPoNumber = asyncHandler(async (req, res, next) => {
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
});

exports.getPurchaseOrderById = asyncHandler(async (req, res, next) => {
  const order = await PurchaseOrder.findById(req.params.id);
  if (!order) {
    return next(new AppError('Purchase order not found', 404));
  }
  res.json({ success: true, data: order });
});

exports.createPurchaseOrder = asyncHandler(async (req, res, next) => {
  const order = await PurchaseOrder.create(req.body);
  res.status(201).json({ success: true, data: order });
});

exports.updatePurchaseOrder = asyncHandler(async (req, res, next) => {
  const order = await PurchaseOrder.findById(req.params.id);
  if (!order) {
    return next(new AppError('Purchase order not found', 404));
  }

  Object.keys(req.body).forEach(key => {
    order[key] = req.body[key];
  });

  await order.save();
  res.json({ success: true, data: order });
});

exports.updatePurchaseOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['Draft', 'Pending', 'Approved', 'Processing', 'Shipped', 'Delivered'];
  
  if (!validStatuses.includes(status)) {
    return next(new AppError('Invalid status', 400));
  }

  const order = await PurchaseOrder.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!order) {
    return next(new AppError('Purchase order not found', 404));
  }

  res.json({ success: true, data: order });
});

exports.deletePurchaseOrder = asyncHandler(async (req, res, next) => {
  const order = await PurchaseOrder.findByIdAndDelete(req.params.id);
  if (!order) {
    return next(new AppError('Purchase order not found', 404));
  }
  res.json({ success: true, message: 'Purchase order deleted' });
});

exports.sendPoEmail = asyncHandler(async (req, res, next) => {
  const order = await PurchaseOrder.findById(req.params.id);
  if (!order) {
    return next(new AppError('Purchase order not found', 404));
  }

  res.json({ 
    success: true, 
    message: `Purchase order ${order.poNumber} email queued for ${order.buyerEmail}`,
    data: { poNumber: order.poNumber, recipient: order.buyerEmail }
  });
});

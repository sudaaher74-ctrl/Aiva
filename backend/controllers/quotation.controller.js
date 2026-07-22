const Quotation = require('../models/Quotation');
const asyncHandler = require('express-async-handler');
const AppError = require('../utils/AppError');

exports.getQuotations = asyncHandler(async (req, res, next) => {
  const quotations = await Quotation.find().populate('customer_id').populate('items.product_id').sort({ createdAt: -1 });
  res.json({ success: true, data: quotations });
});

exports.createQuotation = asyncHandler(async (req, res, next) => {
  const quotation = await Quotation.create(req.body);
  res.status(201).json({ success: true, data: quotation });
});

exports.updateQuotationStatus = asyncHandler(async (req, res, next) => {
  const quotation = await Quotation.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!quotation) {
    return next(new AppError('Quotation not found', 404));
  }
  res.json({ success: true, data: quotation });
});

exports.deleteQuotation = asyncHandler(async (req, res, next) => {
  const quotation = await Quotation.findByIdAndDelete(req.params.id);
  if (!quotation) {
    return next(new AppError('Quotation not found', 404));
  }
  res.json({ success: true, message: 'Quotation deleted' });
});

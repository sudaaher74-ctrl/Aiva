const Customer = require('../models/Customer');
const asyncHandler = require('express-async-handler');
const AppError = require('../utils/AppError');

exports.getCustomers = asyncHandler(async (req, res, next) => {
  const customers = await Customer.find().sort({ createdAt: -1 });
  res.json({ success: true, data: customers });
});

exports.createCustomer = asyncHandler(async (req, res, next) => {
  const customer = await Customer.create(req.body);
  res.status(201).json({ success: true, data: customer });
});

exports.updateCustomer = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!customer) {
    return next(new AppError('Customer not found', 404));
  }
  res.json({ success: true, data: customer });
});

exports.deleteCustomer = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) {
    return next(new AppError('Customer not found', 404));
  }
  res.json({ success: true, message: 'Customer deleted' });
});

const CompanySetting = require('../models/CompanySetting');
const asyncHandler = require('express-async-handler');

// @desc    Get company & banking settings
// @route   GET /api/settings/company
// @access  Public
exports.getCompanySettings = asyncHandler(async (req, res, next) => {
  let settings = await CompanySetting.findOne({ key: 'default' });
  if (!settings) {
    settings = await CompanySetting.create({ key: 'default' });
  }
  res.json({ success: true, data: settings });
});

// @desc    Update company & banking settings
// @route   PUT /api/settings/company
// @access  Private/Admin
exports.updateCompanySettings = asyncHandler(async (req, res, next) => {
  let settings = await CompanySetting.findOne({ key: 'default' });
  if (!settings) {
    settings = new CompanySetting({ key: 'default' });
  }

  const allowedFields = [
    'companyName',
    'legalName',
    'address',
    'email',
    'phone',
    'gstin',
    'fssai',
    'iec',
    'inrBank',
    'usdBank',
    'authorizedSignatory'
  ];

  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      settings[field] = req.body[field];
    }
  });

  await settings.save();
  res.json({
    success: true,
    data: settings,
    message: 'Company settings updated successfully'
  });
});

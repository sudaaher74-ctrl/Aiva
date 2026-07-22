const AnalyticsEvent = require('../models/AnalyticsEvent');
const asyncHandler = require('express-async-handler');

exports.trackEvent = asyncHandler(async (req, res, next) => {
  const { eventType, pageUrl, countryCode } = req.body;
  const event = await AnalyticsEvent.create({ eventType, pageUrl, countryCode });
  res.status(201).json({ success: true, data: event });
});

exports.getAnalyticsStats = asyncHandler(async (req, res, next) => {
  const totalVisits = await AnalyticsEvent.countDocuments({ eventType: 'page_view' });
  
  const countryBreakdown = await AnalyticsEvent.aggregate([
    { $match: { eventType: 'page_view' } },
    { $group: { _id: '$countryCode', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  const pageViews = await AnalyticsEvent.aggregate([
    { $match: { eventType: 'page_view' } },
    { $group: { _id: '$pageUrl', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  res.json({ 
    success: true, 
    data: {
      totalVisits,
      countryBreakdown,
      pageViews
    }
  });
});

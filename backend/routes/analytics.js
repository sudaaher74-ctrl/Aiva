const express = require('express');
const router = express.Router();
const AnalyticsEvent = require('../models/AnalyticsEvent');
const { protect, restrictTo } = require('../middleware/auth');

// @route   POST /api/analytics/track
// @access  Public
router.post('/track', async (req, res) => {
  try {
    const { eventType, pageUrl, countryCode } = req.body;
    const event = await AnalyticsEvent.create({ eventType, pageUrl, countryCode });
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/analytics/stats
// @access  Private
router.get('/stats', protect, restrictTo('Admin'), async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

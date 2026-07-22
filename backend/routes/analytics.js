const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { protect, restrictTo } = require('../middleware/auth');

router.post('/track', analyticsController.trackEvent);
router.get('/stats', protect, restrictTo('Admin'), analyticsController.getAnalyticsStats);

module.exports = router;

const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const { protect, restrictTo } = require('../middleware/auth');

router.get('/company', settingsController.getCompanySettings);
router.put('/company', protect, restrictTo('Admin'), settingsController.updateCompanySettings);

module.exports = router;

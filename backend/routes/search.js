const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller');
const { protect, restrictTo } = require('../middleware/auth');

router.get('/', protect, restrictTo('Admin'), searchController.globalSearch);

module.exports = router;

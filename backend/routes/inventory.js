const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');
const { protect, restrictTo } = require('../middleware/auth');

router.get('/', protect, restrictTo('Admin'), inventoryController.getInventory);
router.post('/movement', protect, restrictTo('Admin'), inventoryController.stockMovement);

module.exports = router;

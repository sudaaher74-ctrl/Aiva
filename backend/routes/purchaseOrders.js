const express = require('express');
const router = express.Router();
const poController = require('../controllers/purchaseOrder.controller');
const { protect, restrictTo } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { purchaseOrderSchema } = require('../validators');

router.get('/', protect, restrictTo('Admin'), poController.getPurchaseOrders);
router.get('/stats', protect, restrictTo('Admin'), poController.getPurchaseOrderStats);
router.get('/next-number', protect, restrictTo('Admin'), poController.getNextPoNumber);
router.get('/:id', protect, restrictTo('Admin'), poController.getPurchaseOrderById);
router.post('/', protect, restrictTo('Admin'), validate(purchaseOrderSchema), poController.createPurchaseOrder);
router.patch('/:id', protect, restrictTo('Admin'), poController.updatePurchaseOrder);
router.patch('/:id/status', protect, restrictTo('Admin'), poController.updatePurchaseOrderStatus);
router.delete('/:id', protect, restrictTo('Admin'), poController.deletePurchaseOrder);
router.post('/:id/email', protect, restrictTo('Admin'), poController.sendPoEmail);

module.exports = router;

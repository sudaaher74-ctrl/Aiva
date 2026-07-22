const express = require('express');
const router = express.Router();
const quotationController = require('../controllers/quotation.controller');
const { protect, restrictTo } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { quotationSchema } = require('../validators');

router.get('/', protect, restrictTo('Admin'), quotationController.getQuotations);
router.post('/', protect, restrictTo('Admin'), validate(quotationSchema), quotationController.createQuotation);
router.patch('/:id/status', protect, restrictTo('Admin'), quotationController.updateQuotationStatus);
router.delete('/:id', protect, restrictTo('Admin'), quotationController.deleteQuotation);

module.exports = router;

const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiry.controller');
const { protect, restrictTo } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { inquirySchema } = require('../validators');

router.get('/', protect, restrictTo('Admin'), inquiryController.getInquiries);
router.get('/stats', protect, restrictTo('Admin'), inquiryController.getInquiryStats);
router.get('/:id', protect, restrictTo('Admin'), inquiryController.getInquiryById);
router.post('/', validate(inquirySchema), inquiryController.createInquiry);
router.patch('/:id/status', protect, restrictTo('Admin'), inquiryController.updateInquiryStatus);
router.patch('/:id/notes', protect, restrictTo('Admin'), inquiryController.updateInquiryNotes);
router.delete('/:id', protect, restrictTo('Admin'), inquiryController.deleteInquiry);

module.exports = router;

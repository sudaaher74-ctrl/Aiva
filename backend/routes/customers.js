const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const { protect, restrictTo } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { customerSchema } = require('../validators');

router.get('/', protect, restrictTo('Admin'), customerController.getCustomers);
router.post('/', protect, restrictTo('Admin'), validate(customerSchema), customerController.createCustomer);
router.put('/:id', protect, restrictTo('Admin'), customerController.updateCustomer);
router.delete('/:id', protect, restrictTo('Admin'), customerController.deleteCustomer);

module.exports = router;

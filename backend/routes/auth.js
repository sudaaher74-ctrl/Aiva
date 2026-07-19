const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect, restrictTo } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { loginSchema } = require('../validators');

router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/login', validate(loginSchema), authController.login);
router.post('/register', authController.register);
router.put('/profile', protect, restrictTo('Admin'), authController.updateProfile);

module.exports = router;

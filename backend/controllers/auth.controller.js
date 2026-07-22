const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');
const AppError = require('../utils/AppError');

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(200).json({ success: true, message: 'Email sent. Check server logs if email env vars not set.' });
  }

  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/#reset=${resetToken}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER || '"AIVA System" <no-reply@aivaenterprises.com>',
    to: user.email,
    subject: 'Password Reset Request',
    html: `You are receiving this email because you requested a password reset. <br/><br/>
           Click <a href="${resetUrl}">here</a> to reset your password, or use this token manually if required:<br/>
           <b>${resetToken}</b><br/><br/>
           If you didn't request this, please ignore this email.`
  };

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    await transporter.sendMail(mailOptions);
  } else if (process.env.NODE_ENV === 'development') {
    console.log(`Email simulated. Reset Token: ${resetToken}`);
  }

  res.status(200).json({ success: true, message: 'Email sent. Check server logs if email env vars not set.' });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { token, password } = req.body;
  if (!token || !password) return next(new AppError('Please provide token and password', 400));
  
  const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError('Invalid or expired token', 400));
  }

  const salt = await bcrypt.genSalt(10);
  user.password_hash = await bcrypt.hash(password, salt);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({ success: true, message: 'Password reset successfully' });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('Invalid credentials', 401));
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return next(new AppError('Invalid credentials', 401));
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.status(200).json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
});

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  
  const count = await User.countDocuments();
  if (count > 0) {
    return next(new AppError('Registration locked. Contact admin.', 403));
  }

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  await User.create({ name, email, password_hash, role });

  res.status(201).json({ success: true, message: 'Admin user created successfully' });
});

exports.updateProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError('User not found', 404));

  if (req.body.name) user.name = req.body.name;
  if (req.body.email) user.email = req.body.email;
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(req.body.password, salt);
  }
  await user.save();

  res.status(200).json({
    success: true,
    data: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
});

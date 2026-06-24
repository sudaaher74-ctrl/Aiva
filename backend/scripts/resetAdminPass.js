const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();

const resetPassword = async () => {
  await connectDB();
  
  try {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash('admin123', salt);

    await User.updateOne({ email: 'admin@aivaenterprises.com' }, { $set: { password_hash } }, { upsert: true });

    console.log('Admin password forcefully reset to admin123');
  } catch (error) {
    console.error('Error resetting password:', error);
  }
  process.exit(0);
};

resetPassword();

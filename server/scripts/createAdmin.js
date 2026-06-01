const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();

const createAdmin = async () => {
  await connectDB();
  
  try {
    const existingAdmin = await User.findOne({ email: 'admin@aivaenterprises.com' });
    if (existingAdmin) {
      console.log('Admin user already exists.');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash('admin123', salt);

    await User.create({
      name: 'Super Admin',
      email: 'admin@aivaenterprises.com',
      password_hash,
      role: 'Admin'
    });

    console.log('Admin user created successfully: admin@aivaenterprises.com / admin123');
  } catch (error) {
    console.error('Error creating admin:', error);
  }
  process.exit(0);
};

createAdmin();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();

const createAdmin = async () => {
  await connectDB();
  
  try {
    const targetEmail = 'aivaenterprises11@gmail.com';
    const existingAdmin = await User.findOne({ email: targetEmail });
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash('cabin7', salt);

    if (existingAdmin) {
      existingAdmin.password_hash = password_hash;
      existingAdmin.role = 'Admin';
      await existingAdmin.save();
      console.log(`Admin user password updated successfully: ${targetEmail} / cabin7`);
      process.exit(0);
    }

    await User.create({
      name: 'Super Admin',
      email: targetEmail,
      password_hash,
      role: 'Admin'
    });

    console.log(`Admin user created successfully: ${targetEmail} / cabin7`);
  } catch (error) {
    console.error('Error creating admin:', error);
  }
  process.exit(0);
};

createAdmin();

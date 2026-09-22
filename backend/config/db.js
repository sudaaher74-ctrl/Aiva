const mongoose = require('mongoose');

const DEFAULT_URI = 'mongodb+srv://milquufresh_db_user:Aiva2026@cluster0.ws9o2vv.mongodb.net/aiva_enterprises?retryWrites=true&w=majority&appName=Cluster0';

let cachedConnection = null;

const seedAdminUser = async () => {
  try {
    const User = require('../models/User');
    const bcrypt = require('bcryptjs');
    const targetEmail = 'aivaenterprises11@gmail.com';
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash('cabin7', salt);

    const existingAdmin = await User.findOne({ email: targetEmail });
    if (!existingAdmin) {
      await User.create({
        name: 'Super Admin',
        email: targetEmail,
        password_hash,
        role: 'Admin'
      });
      console.log(`✅ Default admin initialized: ${targetEmail}`);
    } else {
      existingAdmin.password_hash = password_hash;
      existingAdmin.role = 'Admin';
      await existingAdmin.save();
      console.log(`✅ Default admin credentials verified: ${targetEmail}`);
    }
  } catch (err) {
    console.warn('⚠️ Admin seed warning:', err.message);
  }
};

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (cachedConnection) {
    return cachedConnection;
  }

  const uri = process.env.MONGODB_URI || DEFAULT_URI;

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    cachedConnection = conn;

    // Seed/verify admin user credentials (aivaenterprises11@gmail.com / cabin7)
    seedAdminUser();

    return conn;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);

    // Fallback: use mongodb-memory-server in non-production environments
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.log('⚠️ Local/Atlas MongoDB not available, starting in-memory MongoDB for development...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const memUri = mongod.getUri();
        
        const conn = await mongoose.connect(memUri);
        console.log(`✅ In-memory MongoDB started at: ${memUri}`);
        cachedConnection = conn;
        return conn;
      } catch (memError) {
        console.error(`❌ In-memory MongoDB error: ${memError.message}`);
      }
    }

    throw err;
  }
};

module.exports = connectDB;

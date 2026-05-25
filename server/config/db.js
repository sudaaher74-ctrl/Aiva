const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Try connecting to the configured MongoDB URI first
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/aiva_enterprises';
    
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
      console.log(`✅ MongoDB connected: ${conn.connection.host}`);
      return;
    } catch (err) {
      console.log('⚠️  Local/Atlas MongoDB not available, starting in-memory MongoDB...');
    }

    // Fallback: use mongodb-memory-server (in-memory, no installation needed)
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const memUri = mongod.getUri();
    
    const conn = await mongoose.connect(memUri);
    console.log(`✅ In-memory MongoDB started at: ${memUri}`);
    console.log('   ⚡ Data will persist only while the server is running.');
    console.log('   💡 Install MongoDB locally or use Atlas for persistent storage.\n');
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.error('   Make sure mongodb-memory-server is installed: npm install mongodb-memory-server');
    process.exit(1);
  }
};

module.exports = connectDB;

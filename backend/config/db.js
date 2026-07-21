const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log(`✅ MongoDB connected: ${conn.connection.host}`);
      return;
    } catch (err) {
      if (process.env.NODE_ENV === 'production') {
        console.error('❌ MongoDB connection failed in production. Server cannot start.');
        console.error(err.message);
        process.exit(1); // Force exit in production
      }
      console.log('⚠️  Local/Atlas MongoDB not available, starting in-memory MongoDB for development...');
    }

    // Fallback: use mongodb-memory-server ONLY in development
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const memUri = mongod.getUri();
    
    const conn = await mongoose.connect(memUri);
    console.log(`✅ In-memory MongoDB started at: ${memUri}`);
    console.log('   ⚡ Data will persist only while the server is running.');
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.error('   Make sure mongodb-memory-server is installed: npm install mongodb-memory-server');
    process.exit(1);
  }
};

module.exports = connectDB;

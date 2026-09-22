const mongoose = require('mongoose');

const DEFAULT_URI = 'mongodb+srv://milquufresh_db_user:Aiva2026@cluster0.ws9o2vv.mongodb.net/aiva_enterprises?retryWrites=true&w=majority&appName=Cluster0';

let cachedConnection = null;

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

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const compression = require('compression');
const connectDB = require('./config/db');
const validateEnv = require('./config/env');
const globalErrorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');

// Catch Uncaught Exceptions immediately
process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Load environment variables
dotenv.config();

// Validate Environment Variables
validateEnv();

// Create Express app
const app = express();

// Set security HTTP headers
app.use(helmet());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  // Production logging format: IP, user, date, method, url, HTTP version, status, response length, response time
  app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms'));
}

// Dynamic CORS handling for multi-domain deployments
const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map(url => url.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, curl) or if origin is explicitly allowed
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy violation: ${origin} is not permitted`));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Compress all responses
app.use(compression());

// Rate Limiting
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many login attempts, please try again after 15 minutes.' }
});

app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter);

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/inquiries', require('./routes/inquiries'));
app.use('/api/purchase-orders', require('./routes/purchaseOrders'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/quotations', require('./routes/quotations'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/search', require('./routes/search'));
app.use('/api/ai', require('./routes/ai'));

// Base Health Check endpoints (Requested)
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AIVA Backend Running',
    version: '1.0.0'
  });
});

app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  res.status(200).json({
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Handle undefined Routes (404 Handler)
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

// Connect to Database and start server
let server;
connectDB().then(async () => {
  
  // Dynamic Render Port
  const PORT = process.env.PORT || 5001;
  server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

}).catch(err => {
  console.error('Failed to connect to database', err);
  process.exit(1);
});

// Handle Unhandled Promise Rejections (e.g. database connection issues after startup)
process.on('unhandledRejection', err => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

module.exports = app;

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Connect to MongoDB and seed admin if needed
connectDB().then(async () => {
  const User = require('./models/User');
  const bcrypt = require('bcryptjs');
  try {
    const existingAdmin = await User.findOne({ email: 'admin@aivaenterprises.com' });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash('admin123', salt);
      await User.create({
        name: 'Super Admin',
        email: 'admin@aivaenterprises.com',
        password_hash,
        role: 'Admin'
      });
      console.log('✅ Default Admin created: admin@aivaenterprises.com / admin123');
    }
  } catch (e) {
    console.error('Error seeding admin user:', e);
  }
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`\n🚀 AIVA Backend running on http://localhost:${PORT}`);
    console.log(`📡 API endpoint: http://localhost:${PORT}/api/inquiries\n`);
  });
}).catch(err => {
  console.error('Failed to connect to database', err);
  process.exit(1);
});

// Middleware
app.use(cors({
  origin: '*',  // Allow all origins for development
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (simple)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

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

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).send('Server is running');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Express server startup logic has been moved to the DB connection success block.

// Export for Vercel serverless functions
module.exports = app;

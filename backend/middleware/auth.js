const jwt = require('jsonwebtoken');

const User = require('../models/User');

const getFallbackAdminUser = async () => {
  try {
    let admin = await User.findOne({ role: { $regex: /^admin$/i } }).select('-password_hash');
    if (!admin) {
      admin = await User.findOne().select('-password_hash');
    }
    if (admin) {
      admin.role = 'Admin';
      return admin;
    }
  } catch (err) {
    // Ignore db query error in fallback
  }
  return {
    _id: 'default-admin-id',
    name: 'Super Admin',
    email: 'admin@aivaenterprises.com',
    role: 'Admin'
  };
};

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    // Since login is removed from admin dashboard, grant default admin access
    req.user = await getFallbackAdminUser();
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id).select('-password_hash');
    
    if (!currentUser) {
      req.user = await getFallbackAdminUser();
      return next();
    }

    req.user = currentUser;
    next();
  } catch (err) {
    // If token is invalid/mock/expired, fallback to admin access
    req.user = await getFallbackAdminUser();
    return next();
  }
};

const restrictTo = (...roles) => {
  const normalizedRoles = roles.map(r => String(r).toLowerCase());
  return (req, res, next) => {
    const userRole = (req.user && req.user.role) ? String(req.user.role).toLowerCase() : '';
    if (!req.user || (!roles.includes(req.user.role) && !normalizedRoles.includes(userRole) && userRole !== 'admin')) {
      return res.status(403).json({ success: false, message: 'You do not have permission to perform this action' });
    }
    next();
  };
};

module.exports = { protect, restrictTo };

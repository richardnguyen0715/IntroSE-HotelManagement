// middleware/auth.js
const jwt = require('jsonwebtoken');
const BlacklistedToken = require('../models/BlacklistedToken');
const User = require('../models/User');

// Middleware xác thực token
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    const token = authHeader.split(' ')[1];

    // Kiểm tra token trong danh sách đen
    const blacklisted = await BlacklistedToken.findOne({ token });
    if (blacklisted) {
      return res.status(401).json({ message: 'Token is invalidated' });
    }

    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Lưu thông tin người dùng vào request

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Tạo token with additional claims
const generateToken = (user, expiresIn = '1d', additionalClaims = {}) => {
  return jwt.sign(
    { 
      id: user._id,
      email: user.email,
      role: user.role,
      ...additionalClaims 
    },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

// Middleware kiểm tra quyền admin
const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied: Admin only' });
  }
};

// Middleware kiểm tra quyền chỉnh sửa 
const authorizeUser = (req, res, next) => {
  if (req.user.id === req.params.id || req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Không có quyền thực hiện hành động này' });
  }
};

// Thêm token vào blacklist khi đăng xuất
const invalidateToken = async (token) => {
  await BlacklistedToken.create({ token });
};

// Alias of authenticate for consistency with report routes
const protect = authenticate;

// Role-based authorization middleware that accepts an array of roles
const authorize = (requiredAuth = {}) => {
  return async (req, res, next) => {
    try {
      // Get token from header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      // Extract token
      const token = authHeader.split(' ')[1];
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Add user to request
      req.user = decoded;
      
      // Case 1: If roles are provided as string or array
      if (Array.isArray(requiredAuth) || typeof requiredAuth === 'string') {
        const roles = Array.isArray(requiredAuth) ? requiredAuth : [requiredAuth];
        if (!roles.includes(req.user.role)) {
          return res.status(403).json({ 
            message: `Role ${req.user.role} is not authorized to access this route`
          });
        }
      } 
      // Case 2: If special rights like isPasswordReset are required
      else if (typeof requiredAuth === 'object') {
        for (const [key, value] of Object.entries(requiredAuth)) {
          if (req.user[key] !== value) {
            return res.status(403).json({ 
              message: `Missing required authorization`
            });
          }
        }
      }
      
      next();
    } catch (error) {
      console.error('Auth error:', error.message);
      return res.status(401).json({ message: 'User not authenticated' });
    }
  };
};

module.exports = {
  authenticate,
  generateToken,
  authorizeAdmin,
  authorizeUser,
  invalidateToken,
  protect, // Added alias for authenticate
  authorize // Added new role-based middleware
};
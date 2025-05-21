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

// Tạo token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id,
      email: user.email,
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' } // Token hết hạn sau 1 ngày
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

module.exports = {
  authenticate,
  generateToken,
  authorizeAdmin,
  authorizeUser,
  invalidateToken
};

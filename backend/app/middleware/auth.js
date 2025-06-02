// middleware/auth.js
const jwt = require("jsonwebtoken");
const BlacklistedToken = require("../models/BlacklistedToken");
const User = require("../models/User");

// Middleware xác thực token
const authenticate = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Không có token, từ chối truy cập" });
    }

    // Kiểm tra token trong danh sách đen
    const blacklisted = await BlacklistedToken.findOne({ token });
    if (blacklisted) {
      return res.status(401).json({ message: "Token đã bị vô hiệu hóa" });
    }

    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tìm user dựa trên ID trong token (quan trọng!)
    const user = await User.findById(decoded.userId || decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Không tìm thấy người dùng" });
    }

    // Lưu thông tin đầy đủ của user vào request
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res
      .status(401)
      .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

// Tạo token with additional claims
const generateToken = (user, expiresIn = "1d", additionalClaims = {}) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" } // Token hết hạn sau 1 ngày
  );
};

// Middleware kiểm tra quyền admin
const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied: Admin only" });
  }
};

// Middleware kiểm tra quyền chỉnh sửa
const authorizeUser = (req, res, next) => {
  if (req.user.id === req.params.id || req.user.role === "admin") {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Không có quyền thực hiện hành động này" });
  }
};

// Thêm token vào blacklist khi đăng xuất
const invalidateToken = async (token) => {
  await BlacklistedToken.create({ token });
};

// Alias of authenticate for consistency with report routes
const protect = authenticate;

// Role-based authorization middleware that accepts an array of roles
const authorize = (roles = []) => {
  return (req, res, next) => {
    // Convert string to array if needed
    if (typeof roles === "string") {
      roles = [roles];
    }

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role ${req.user.role} is not authorized to access this route`,
      });
    }

    next();
  };
};

module.exports = {
  protect,
  generateToken,
  authorizeAdmin,
  authorizeUser,
  invalidateToken,
  authorize, // Added new role-based middleware
};

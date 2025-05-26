const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    let query = User.find();

    // Filter by role if provided in query params
    if (req.query.role) {
      query = query.find({ role: req.query.role });
    }

    // Thực hiện query và loại bỏ password
    const users = await query.select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// Get single user
exports.getUser = async (req, res, next) => {
  try {
    const identifier = req.params.id; // có thể là ID hoặc email
    let user;

    // Kiểm tra xem identifier có phải là email không
    if (identifier.includes('@')) {
      user = await User.findOne({ email: identifier }).select('-password');
    } else {
      // Nếu không phải email thì tìm bằng ID
      user = await User.findById(identifier).select('-password');
    }
    
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    // Nếu ID không hợp lệ
    if (error.name === 'CastError') {
      const customError = new Error('Invalid user ID format');
      customError.statusCode = 400;
      return next(customError);
    }
    next(error);
  }
};

// Create new user
exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      error.statusCode = 400;
      error.message = messages;
    } else if (error.code === 11000) {
      error.statusCode = 400;
      error.message = 'Email already exists';
    }
    next(error);
  }
};

// Update user
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).select('-password');
    // select('-password') thực hiện lọc trường password ra khỏi kết quả trả về

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};


const matchPassword = async (user, password) => {
  return await bcrypt.compare(password, user.password);
};

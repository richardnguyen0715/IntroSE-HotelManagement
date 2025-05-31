const User = require('../models/User');
const PendingUser = require('../models/PendingUser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const BlacklistedToken = require('../models/BlacklistedToken');
const sendEmail = require('../utils/sendEmail');
const { validateEmail } = require('../utils/emailValidator');

// Bước 1: Gửi OTP để bắt đầu đăng ký
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Tên, email và mật khẩu là bắt buộc' 
      });
    }

    // Validate email
    const emailValidation = await validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({
        message: 'Email không hợp lệ',
        errors: emailValidation.errors
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã được đăng ký' });
    }

    // Check if there's already a pending registration
    const existingPending = await PendingUser.findOne({ email });
    if (existingPending) {
      // Xóa đăng ký cũ để tạo mới
      await PendingUser.deleteOne({ email });
    }
    
    // Tạo OTP 6 số
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Lưu thông tin đăng ký tạm thời với OTP
    const pendingUser = new PendingUser({
      name,
      email,
      password, // Sẽ được hash tự động bởi pre-save middleware
      role: role || 'customer',
      registrationOTP: await bcrypt.hash(otp, 10),
      registrationOTPExpire: Date.now() + 10 * 60 * 1000 // 10 phút
    });
    
    await pendingUser.save();
    
    // Gửi email OTP
    const message = `Chào ${name},\n\nMã OTP để xác thực đăng ký tài khoản của bạn là: ${otp}\nMã có hiệu lực trong 10 phút.\n\nNếu bạn không yêu cầu tạo tài khoản, vui lòng bỏ qua email này.`;
    console.log(`Registration OTP for ${email}: ${otp}`);
    
    await sendEmail({
      email,
      subject: 'Xác Thực Đăng Ký Tài Khoản - Mã OTP',
      message
    });
    
    res.status(200).json({
      message: 'Mã OTP đã được gửi đến email của bạn',
      data: {
        email,
        expiresIn: '10 phút',
        note: 'Vui lòng kiểm tra email và xác thực OTP để hoàn tất đăng ký'
      }
    });
    
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Bước 2: Xác thực OTP và tạo user thật - FIXED
exports.verifyRegistrationOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({
        message: 'Email và OTP là bắt buộc'
      });
    }
    
    // Tìm pending user với email và OTP chưa hết hạn
    const pendingUser = await PendingUser.findOne({
      email,
      registrationOTPExpire: { $gt: Date.now() }
    });
    
    if (!pendingUser) {
      return res.status(400).json({
        message: 'OTP đã hết hạn hoặc email không hợp lệ'
      });
    }
    
    // Verify OTP
    const isValidOTP = await bcrypt.compare(otp, pendingUser.registrationOTP);
    if (!isValidOTP) {
      return res.status(400).json({
        message: 'OTP không chính xác'
      });
    }
    
    // OTP hợp lệ - tạo user thật
    const user = new User({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password, // ĐÃ ĐƯỢC HASH trong PendingUser
      role: pendingUser.role,
      isEmailVerified: true
    });
    
    // QUAN TRỌNG: Bỏ qua pre-save middleware để tránh hash lại password
    await user.save({ validateBeforeSave: false });
    
    // Xóa pending user
    await PendingUser.deleteOne({ email });
    
    // Generate token
    const token = jwt.sign(
      { 
        id: user._id,  // Thay đổi từ userId thành id để consistency
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'Tài khoản đã được tạo thành công!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: true
      }
    });
    
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user - Fixed version
// Login user - Debug version
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // console.log('Login attempt for:', email);
    // console.log('Password provided:', password);
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc' });
    }
    
    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');
    // console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }
    
    // console.log('Stored password hash:', user.password);
    // console.log('Password length:', user.password ? user.password.length : 'undefined');
    
    // Verify password using bcrypt.compare directly
    const isMatch = await bcrypt.compare(password, user.password);
    // console.log('Password match result:', isMatch);
    
    if (!isMatch) {
      // console.log('Password mismatch for user:', email);
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }
    
    // Generate token
    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(200).json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// logout user (giữ nguyên)
exports.logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(400).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];

    // Decode token to get expiration time
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return res.status(400).json({ message: 'Invalid token' });
    }
    const expiresAt = new Date(decoded.exp * 1000);

    // save token to blacklist
    await BlacklistedToken.create({ token, expiresAt });

    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
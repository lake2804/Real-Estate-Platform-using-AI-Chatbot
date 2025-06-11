const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.cjs');

console.log('🔧 Loading auth controller (CommonJS)...');

// Generate JWT token
const generateToken = (userId) => {
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  return jwt.sign(
    { userId: userId, id: userId },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Register new user
const register = async (req, res) => {
  try {
    console.log(' Register endpoint called');
    const { fullName, email, password, phone } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }

    const user = new User({
      fullName,
      email: email.toLowerCase(),
      password,
      phone
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error(' Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng ký'
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    console.log(' Login endpoint called');
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập email và mật khẩu'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error(' Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng nhập'
    });
  }
};

// Get user profile (renamed from getProfile to getMe for route compatibility)
const getMe = async (req, res) => {
  try {
    console.log(' GetMe endpoint called');
    const user = await User.findById(req.user.userId || req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error(' Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    console.log(' UpdateProfile endpoint called');
    const { fullName, phone } = req.body;
    
    const user = await User.findById(req.user.userId || req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;

    await user.save();

    res.json({
      success: true,
      message: 'Cập nhật thành công',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error(' UpdateProfile error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

console.log(' Auth controller functions defined (CommonJS)');

module.exports = {
  register,
  login,
  getMe,
  updateProfile
};

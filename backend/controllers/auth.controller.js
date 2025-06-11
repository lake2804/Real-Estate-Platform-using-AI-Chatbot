import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import User from '../models/User.cjs';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// Register new user
export const register = async (req, res) => {
  try {
    // const { fullName, email, password, phone, role = 'user' } = req.body;

    // // Validation
    // if (!fullName || !email || !password) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Please provide all required fields: fullName, email, password'
    //   });
    // }

    // // Email validation
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(email)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Please provide a valid email address'
    //   });
    // }

    // // Password validation
    // if (password.length < 6) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Password must be at least 6 characters long'
    //   });
    // }

    // // Check if user already exists
    // const existingUser = await User.findOne({ email: email.toLowerCase() });
    // if (existingUser) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'User with this email already exists'
    //   });
    // }

    // // Hash password
    // const salt = await bcrypt.genSalt(12);
    // const hashedPassword = await bcrypt.hash(password, salt);

    // // Create user
    // const user = new User({
    //   fullName: fullName.trim(),
    //   email: email.toLowerCase().trim(),
    //   password: hashedPassword,
    //   phone: phone?.trim(),
    //   role,
    //   isActive: true
    // });

    // await user.save();

    // // Generate token
    // const token = generateToken(user._id);

    // // Remove password from response
    // const userResponse = {
    //   id: user._id,
    //   fullName: user.fullName,
    //   email: user.email,
    //   phone: user.phone,
    //   role: user.role,
    //   avatar: user.avatar,
    //   isActive: user.isActive,
    //   createdAt: user.createdAt
    // };

    // console.log('✅ User registered successfully:', user.email);

    // res.status(201).json({
    //   success: true,
    //   message: 'User registered successfully',
    //   data: {
    //     user: userResponse,
    //     token
    //   }
    // });
    res.status(501).json({ success: false, message: 'User registration temporarily disabled for diagnostics' });

  } catch (error) {
    console.error('❌ Registration error (controller - user logic commented out):', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration (controller - user logic commented out)',
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    // const { email, password } = req.body;

    // // Validation
    // if (!email || !password) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Please provide email and password'
    //   });
    // }

    // // Find user
    // const user = await User.findOne({
    //   email: email.toLowerCase().trim(),
    //   isActive: true
    // });

    // if (!user) {
    //   return res.status(401).json({
    //     success: false,
    //     message: 'Invalid email or password'
    //   });
    // }

    // // Check password
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //   return res.status(401).json({
    //     success: false,
    //     message: 'Invalid email or password'
    //   });
    // }

    // // Update last login
    // user.lastLogin = new Date();
    // await user.save();

    // // Generate token
    // const token = generateToken(user._id);

    // // Remove password from response
    // const userResponse = {
    //   id: user._id,
    //   fullName: user.fullName,
    //   email: user.email,
    //   phone: user.phone,
    //   role: user.role,
    //   avatar: user.avatar,
    //   isActive: user.isActive,
    //   lastLogin: user.lastLogin,
    //   createdAt: user.createdAt
    // };

    // console.log('✅ User logged in successfully:', user.email);

    // res.json({
    //   success: true,
    //   message: 'Login successful',
    //   data: {
    //     user: userResponse,
    //     token
    //   }
    // });
    res.status(501).json({ success: false, message: 'User login temporarily disabled for diagnostics' });

  } catch (error) {
    console.error('❌ Login error (controller - user logic commented out):', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login (controller - user logic commented out)',
    });
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  try {
    // const user = await User.findById(req.user.id).select('-password');
    
    // if (!user) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'User not found'
    //   });
    // }

    // const userResponse = {
    //   id: user._id,
    //   fullName: user.fullName,
    //   email: user.email,
    //   phone: user.phone,
    //   role: user.role,
    //   avatar: user.avatar,
    //   isActive: user.isActive,
    //   lastLogin: user.lastLogin,
    //   createdAt: user.createdAt
    // };

    // res.json({
    //   success: true,
    //   data: userResponse
    // });
    res.status(501).json({ success: false, message: 'Get profile temporarily disabled for diagnostics' });

  } catch (error) {
    console.error('❌ Get profile error (controller - user logic commented out):', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting profile (controller - user logic commented out)',
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    // const { fullName, phone, avatar } = req.body;
    
    // const user = await User.findById(req.user.id);
    
    // if (!user) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'User not found'
    //   });
    // }

    // // Update fields if provided
    // if (fullName) user.fullName = fullName.trim();
    // if (phone) user.phone = phone.trim();
    // if (avatar) user.avatar = avatar;

    // await user.save();

    // const userResponse = {
    //   id: user._id,
    //   fullName: user.fullName,
    //   email: user.email,
    //   phone: user.phone,
    //   role: user.role,
    //   avatar: user.avatar,
    //   isActive: user.isActive,
    //   lastLogin: user.lastLogin,
    //   createdAt: user.createdAt
    // };

    // console.log('✅ Profile updated successfully:', user.email);

    // res.json({
    //   success: true,
    //   message: 'Profile updated successfully',
    //   data: userResponse
    // });
    res.status(501).json({ success: false, message: 'Update profile temporarily disabled for diagnostics' });

  } catch (error) {
    console.error('❌ Update profile error (controller - user logic commented out):', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile (controller - user logic commented out)',
    });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    // const { currentPassword, newPassword } = req.body;

    // // Validation
    // if (!currentPassword || !newPassword) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Please provide current password and new password'
    //   });
    // }

    // if (newPassword.length < 6) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'New password must be at least 6 characters long'
    //   });
    // }

    // // Find user with password
    // const user = await User.findById(req.user.id);
    
    // if (!user) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'User not found'
    //   });
    // }

    // // Check current password
    // const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    // if (!isCurrentPasswordValid) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Current password is incorrect'
    //   });
    // }

    // // Hash new password
    // const salt = await bcrypt.genSalt(12);
    // const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // // Update password
    // user.password = hashedNewPassword;
    // await user.save();

    // console.log('✅ Password changed successfully:', user.email);

    // res.json({
    //   success: true,
    //   message: 'Password changed successfully'
    // });
    res.status(501).json({ success: false, message: 'Change password temporarily disabled for diagnostics' });

  } catch (error) {
    console.error('❌ Change password error (controller - user logic commented out):', error);
    res.status(500).json({
      success: false,
      message: 'Server error changing password (controller - user logic commented out)',
    });
  }
};

// Verify token (for frontend token validation)
export const verifyToken = async (req, res) => {
  try {
    // // If we reach here, token is valid (auth middleware passed)
    // const userResponse = {
    //   id: req.user._id,
    //   fullName: req.user.fullName,
    //   email: req.user.email,
    //   phone: req.user.phone,
    //   role: req.user.role,
    //   avatar: req.user.avatar,
    //   isActive: req.user.isActive,
    //   lastLogin: req.user.lastLogin,
    //   createdAt: req.user.createdAt
    // };

    // res.json({
    //   success: true,
    //   message: 'Token is valid',
    //   data: userResponse
    // });
    res.status(501).json({ success: false, message: 'Token verification temporarily disabled for diagnostics (controller)' });


  } catch (error) {
    console.error('❌ Verify token error (controller - user logic commented out):', error);
    res.status(500).json({
      success: false,
      message: 'Server error verifying token'
    });
  }
};

// Logout (optional - mainly for logging)
export const logout = async (req, res) => {
  try {
    console.log('✅ User logged out:', req.user.email);
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('❌ Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
};
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()

// ✅ FIXED: Import with .cjs extension
const User = require('../models/User.cjs')

// ✅ JWT Secret from environment
const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key'

// POST /api/auth/register - User registration
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body

    // Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin'
      })
    }

    // Check if user exists
    const existingUser = await User.findOne({ email }).select('+password')
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      })
    }

    // Hash password
    const salt = await bcrypt.genSalt(12); // Using salt factor 12
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      fullName,
      email,
      password: hashedPassword, // Use hashed password
      phone
    });

    await user.save()

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    console.log(`✅ User registered: ${email}`)

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
    })
  } catch (error) {
    console.error('❌ Registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng ký',
      error: error.message
    })
  }
})

// POST /api/auth/login - User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập email và mật khẩu'
      })
    }

    // Find user with password
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      })
    }

    // Update last login
    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() })

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    console.log(`✅ User logged in: ${email}`)

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
    })
  } catch (error) {
    console.error('❌ Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng nhập',
      error: error.message
    })
  }
})

// GET /api/auth/me - Get current user
router.get('/me', (req, res) => { // Temporarily non-async for extreme safety check
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Không có token xác thực'
      });
    }

    // Use a try-catch for jwt.verify as it can throw errors
    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      // User.findById might involve an await, so we'd need async here.
      // For now, let's ensure the route definition itself is the focus.
      // If this structure works, we can re-add async and User.findById.
      // This simplification is to ensure the Express router parses this GET route correctly.
      // The actual database call will require async.
      // For now, to ensure the route itself is valid to Express:
      User.findById(decoded.userId).then(user => {
        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'Token không hợp lệ (user not found)'
          });
        }
        res.json({
          success: true,
          data: {
            user: {
              id: user._id,
              fullName: user.fullName,
              email: user.email,
              role: user.role
            }
          }
        });
      }).catch(userError => {
        console.error('❌ User.findById error in /me:', userError);
        return res.status(500).json({
          success: false,
          message: 'Lỗi khi tìm người dùng',
          error: userError.message
        });
      });

    } catch (jwtError) {
      console.error('❌ JWT verification error in /me:', jwtError);
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ (jwt verify failed)',
        error: jwtError.message
      });
    }

  } catch (error) { // Outer try-catch for any synchronous errors earlier
    console.error('❌ Auth verification error (outer) in /me:', error);
    res.status(501).json({ // Use 501 to indicate it's not the intended final state
      success: false,
      message: 'Lỗi server khi xác thực (controller issue)',
      error: error.message
    });
  }
});

module.exports = router
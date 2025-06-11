const express = require('express')
const router = express.Router()
// Import controller functions
// Assuming ES Modules or require works for .js files from .cjs context
// If not, this might need adjustment during testing/integration
const authController = require('../controllers/auth.controller.js')
const { auth } = require('../middleware/auth.js'); // Import the auth middleware

// User and jwt are no longer needed here as /me route will use middleware and controller
// const User = require('../models/User.js')
// const jwt = require('jsonwebtoken')


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

    // Create user
    const user = new User({
      fullName,
      email,
      password,
      phone
    })

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
router.post('/login', authController.login)

// GET /api/auth/me - Get current user
// Now uses auth middleware to protect the route and authController.getProfile for logic
router.get('/me', auth, authController.getProfile)

module.exports = router
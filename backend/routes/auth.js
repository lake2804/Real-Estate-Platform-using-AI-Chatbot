const express = require('express')
const router = express.Router()
// Import controller functions
// Assuming ES Modules or require works for .js files from .cjs context
// If not, this might need adjustment during testing/integration
const authController = require('../controllers/auth.controller.js')
const { auth } = require('../middleware/auth.js'); // Import the auth middleware

// POST /api/auth/register - User registration
router.post('/register', authController.register)

// POST /api/auth/login - User login
router.post('/login', authController.login)

// GET /api/auth/me - Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Không có token xác thực'
      })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ'
      })
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
    })
  } catch (error) {
    console.error('❌ Auth verification error:', error)
    res.status(401).json({
      success: false,
      message: 'Token không hợp lệ',
      error: error.message
    })
  }
})

module.exports = router
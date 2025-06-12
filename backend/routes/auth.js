const express = require('express')
const router = express.Router()

// Import controllers and middleware
const authController = require('../controllers/auth.controller.js')
const auth = require('../middleware/auth.js')

console.log('🔧 Setting up auth routes...')

// Public routes
router.post('/register', authController.register)
router.post('/login', authController.login)

// Protected routes (require authentication)
router.get('/me', auth, authController.getMe)
router.put('/profile', auth, authController.updateProfile)
router.put('/change-password', auth, authController.changePassword)

// Health check for auth system
router.get('/health', async (req, res) => {
  try {
    const User = require('../models/User.cjs')
    const userCount = await User.countDocuments()
    const activeUsers = await User.countDocuments({ isActive: true })
    
    res.json({
      success: true,
      message: 'Auth system is healthy',
      data: {
        auth_system: 'healthy',
        total_users: userCount,
        active_users: activeUsers,
        timestamp: new Date().toISOString(),
        routes: [
          'POST /api/auth/register',
          'POST /api/auth/login',
          'GET /api/auth/me',
          'PUT /api/auth/profile',
          'PUT /api/auth/change-password'
        ]
      }
    })
  } catch (error) {
    console.error('❌ Auth health check error:', error)
    res.status(500).json({
      success: false,
      message: 'Auth system health check failed',
      error: error.message
    })
  }
})

console.log('✅ Auth routes configured successfully')

module.exports = router
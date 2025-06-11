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
// Now uses auth middleware to protect the route and authController.getProfile for logic
router.get('/me', auth, authController.getMe)

router.put('/profile', auth, authController.updateProfile)

module.exports = router
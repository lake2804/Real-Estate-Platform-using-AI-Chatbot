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
router.post('/register', authController.register)

// POST /api/auth/login - User login
router.post('/login', authController.login)

// GET /api/auth/me - Get current user
// Now uses auth middleware to protect the route and authController.getProfile for logic
router.get('/me', auth, authController.getProfile)

module.exports = router
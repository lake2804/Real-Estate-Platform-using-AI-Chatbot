// import jwt from 'jsonwebtoken';
// import User from '../models/User.cjs';
const jwt = require('jsonwebtoken')
const User = require('../models/User.cjs')

const auth = async (req, res, next) => {
  try {
    console.log('🔐 Auth middleware called')
    
    // Get token from header
    const authHeader = req.header('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    console.log('🔍 Token check:', { 
      hasAuthHeader: !!authHeader, 
      hasToken: !!token,
      tokenStart: token?.substring(0, 20) + '...' || 'N/A'
    })
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy token. Vui lòng đăng nhập.'
      })
    }

    // Verify token
    const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      console.log('✅ Token verified:', { 
        userId: decoded.userId || decoded.id, 
        email: decoded.email, 
        role: decoded.role 
      })
      
      // Add user info to request
      req.user = {
        userId: decoded.userId || decoded.id,
        email: decoded.email,
        role: decoded.role
      }
      
      // Optional: Check if user still exists and is active
      const user = await User.findById(req.user.userId)
      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Tài khoản không hợp lệ hoặc đã bị vô hiệu hóa'
        })
      }
      
      console.log('✅ Auth middleware passed for:', user.email)
      next()
      
    } catch (jwtError) {
      console.error('❌ JWT verification failed:', jwtError.message)
      
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ. Vui lòng đăng nhập lại.',
        error: process.env.NODE_ENV === 'development' ? jwtError.message : undefined
      })
    }
    
  } catch (error) {
    console.error('❌ Auth middleware error:', error)
    
    res.status(500).json({
      success: false,
      message: 'Lỗi xác thực. Vui lòng thử lại.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

console.log('✅ Auth middleware defined')

module.exports = auth
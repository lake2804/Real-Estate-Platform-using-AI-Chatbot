const express = require('express')
const router = express.Router()

// Corrected import to use .js extension
const User = require('../models/User.cjs')

// GET /api/users - Get all users (admin only)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, role } = req.query
    
    const query = {}
    if (role) query.role = role
    
    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    const [users, total] = await Promise.all([
      User.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      User.countDocuments(query)
    ])

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('❌ Error fetching users:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách người dùng',
      error: error.message
    })
  }
})

// GET /api/users/:id - Get single user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean()
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      })
    }

    res.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('❌ Error fetching user:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin người dùng',
      error: error.message
    })
  }
})

module.exports = router
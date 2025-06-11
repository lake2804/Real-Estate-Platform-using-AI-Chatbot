const express = require('express')
const FeaturedProject = require('../models/FeaturedProject.cjs')
const router = express.Router()

// GET /api/featured-projects
router.get('/', async (req, res) => {
  try {
    console.log('🏗️ [Backend] Featured projects request received')
    
    const { limit = 8 } = req.query
    
    const projects = await FeaturedProject.find({
      $or: [
        { isFeatured: true },
        { featured: true }
      ]
    })
    .limit(parseInt(limit))
    .sort({ createdAt: -1 })
    .lean()
    
    console.log(`🏗️ [Backend] Found ${projects.length} featured projects`)
    
    res.json({
      success: true,
      data: projects,
      total: projects.length
    })
    
  } catch (error) {
    console.error('❌ [Backend] Featured projects error:', error)
    res.status(500).json({
      success: false,
      message: 'Không thể tải dự án nổi bật',
      error: error.message
    })
  }
})

module.exports = router
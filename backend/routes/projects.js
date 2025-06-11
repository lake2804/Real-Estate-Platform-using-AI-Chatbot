const express = require('express')
const FeaturedProject = require('../models/FeaturedProject.cjs')
const router = express.Router()

// GET /api/projects - Get all projects
router.get('/', async (req, res) => {
  try {
    const { limit = 12, featured } = req.query
    
    const query = { isActive: true }
    
    // Featured filter
    if (featured === 'true') {
      query.$or = [
        { isFeatured: true },
        { featured: true }
      ]
    }
    
    console.log(`🏗️ Getting projects (limit: ${limit}, featured: ${featured})`)
    
    const projects = await FeaturedProject.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean()

    console.log(`✅ Found ${projects.length} projects`)

    res.json({
      success: true,
      data: projects
    })
  } catch (error) {
    console.error('❌ Error fetching projects:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách dự án',
      error: error.message
    })
  }
})

// GET /api/projects/featured - Get featured projects
router.get('/featured', async (req, res) => {
  try {
    const { limit = 8 } = req.query
    
    console.log(`🌟 Getting featured projects (limit: ${limit})`)
    
    const projects = await FeaturedProject.find({
      $or: [
        { isFeatured: true },
        { featured: true }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean()

    console.log(`✅ Found ${projects.length} featured projects`)

    res.json({
      success: true,
      data: projects
    })
  } catch (error) {
    console.error('❌ Error fetching featured projects:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy dự án nổi bật',
      error: error.message
    })
  }
})

// GET /api/projects/:id - Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await FeaturedProject.findById(req.params.id).lean()
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy dự án'
      })
    }

    // Increment views
    await FeaturedProject.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } })

    res.json({
      success: true,
      data: project
    })
  } catch (error) {
    console.error('❌ Error fetching project:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin dự án',
      error: error.message
    })
  }
})

module.exports = router
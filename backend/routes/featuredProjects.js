const express = require('express')
const router = express.Router()
const FeaturedProject = require('../models/FeaturedProject.cjs')

// GET /api/featured-projects - Get all featured projects
router.get('/', async (req, res) => {
  try {
    let {
      page = 1,
      limit = 12,
      location,
      status,
      priceMin,
      priceMax,
      sort = 'createdAt',
      order = 'desc'
    } = req.query

    console.log(`🏗️ Getting featured projects (limit: ${limit})`)

    const query = {}
    
    // Location filter
    if (location && location !== 'Tất cả') {
      query.$or = [
        { 'location.district': { $regex: location, $options: 'i' } },
        { 'location.city': { $regex: location, $options: 'i' } }
      ]
    }
    
    // Status filter
    if (status && status !== 'all') {
      query.status = status
    }
    
    // Price filter
    if (priceMin || priceMax) {
      query.priceFrom = {}
      if (priceMin) query.priceFrom.$gte = parseInt(priceMin)
      if (priceMax) query.priceFrom.$lte = parseInt(priceMax)
    }

    const sortObj = {}
    sortObj[sort] = order === 'desc' ? -1 : 1

    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    const [projects, total] = await Promise.all([
      FeaturedProject.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      FeaturedProject.countDocuments(query)
    ])

    console.log(`✅ Found ${projects.length}/${total} featured projects`)

    res.json({
      success: true,
      data: projects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('❌ Error fetching featured projects:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách dự án nổi bật',
      error: error.message
    })
  }
})

// GET /api/featured-projects/:id - Single project by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    console.log(`🔍 Looking for project with ID: ${id}`)
    
    // Check if id is valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'ID không hợp lệ'
      })
    }
    
    const project = await FeaturedProject.findById(id).lean()
    
    if (!project) {
      console.log(`❌ Project not found: ${id}`)
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy dự án'
      })
    }
    
    // Increment views
    await FeaturedProject.findByIdAndUpdate(id, { $inc: { views: 1 } })
    
    console.log(`✅ Found project: ${project.title}`)
    
    res.json({
      success: true,
      data: project
    })
  } catch (error) {
    console.error(`❌ Error fetching project ${req.params.id}:`, error)
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin dự án',
      error: error.message
    })
  }
})

module.exports = router
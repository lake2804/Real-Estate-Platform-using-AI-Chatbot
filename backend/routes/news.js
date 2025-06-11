const express = require('express')
const router = express.Router()

// ✅ FIXED: Import with .cjs extension
const News = require('../models/News.cjs')

// GET /api/news - Get all news
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      sort = 'publishedAt',
      order = 'desc'
    } = req.query

    const query = { isActive: true }
    
    if (category && category !== 'all') {
      query.category = category
    }

    const sortObj = {}
    sortObj[sort] = order === 'desc' ? -1 : 1

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [news, total] = await Promise.all([
      News.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('author', 'fullName email avatar')
        .lean(),
      News.countDocuments(query)
    ])

    console.log(`✅ Found ${news.length}/${total} news articles`)

    res.json({
      success: true,
      data: news,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('❌ Error fetching news:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách tin tức',
      error: error.message
    })
  }
})

// GET /api/news/featured - Get featured news
router.get('/featured', async (req, res) => {
  try {
    const { limit = 6 } = req.query
    
    console.log(`🌟 Getting featured news (limit: ${limit})`)
    
    const news = await News.find({
      isActive: true,
      $or: [
        { isFeatured: true },
        { featured: true }
      ]
    })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .populate('author', 'fullName email avatar')
      .lean()

    console.log(`✅ Found ${news.length} featured news articles`)

    res.json({
      success: true,
      data: news
    })
  } catch (error) {
    console.error('❌ Error fetching featured news:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy tin tức nổi bật',
      error: error.message
    })
  }
})

// GET /api/news/:id - Get single news article
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id)
      .populate('author', 'fullName email avatar')
      .lean()
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      })
    }

    // Increment views
    await News.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } })

    res.json({
      success: true,
      data: news
    })
  } catch (error) {
    console.error('❌ Error fetching news:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin bài viết',
      error: error.message
    })
  }
})

module.exports = router
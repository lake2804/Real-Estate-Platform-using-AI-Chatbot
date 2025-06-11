const express = require('express')
const News = require('../models/News.cjs')
const router = express.Router()

// GET /api/news/featured - Get featured news
router.get('/featured', async (req, res) => {
  try {
    console.log('📰 [Backend] Featured news request received')
    
    const { limit = 6 } = req.query
    
    const news = await News.find({
      $and: [
        { isPublished: true },
        {
          $or: [
            { isFeatured: true },
            { featured: true }
          ]
        }
      ]
    })
    .limit(parseInt(limit))
    .sort({ publishedAt: -1, createdAt: -1 })
    .lean()
    
    console.log(`📰 [Backend] Found ${news.length} featured news`)
    
    res.json({
      success: true,
      data: news,
      total: news.length
    })
    
  } catch (error) {
    console.error('❌ [Backend] Featured news error:', error)
    res.status(500).json({
      success: false,
      message: 'Không thể tải tin tức nổi bật',
      error: error.message
    })
  }
})

// GET /api/news - Get all news
router.get('/', async (req, res) => {
  try {
    const { limit = 20, category, featured } = req.query
    
    let query = { isPublished: true }
    
    if (category && category !== 'Tất cả') {
      query.category = category
    }
    
    if (featured === 'true') {
      query.$or = [
        { isFeatured: true },
        { featured: true }
      ]
    }
    
    const news = await News.find(query)
      .limit(parseInt(limit))
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean()
    
    res.json({
      success: true,
      data: news,
      total: news.length
    })
    
  } catch (error) {
    console.error('❌ [Backend] News error:', error)
    res.status(500).json({
      success: false,
      message: 'Không thể tải tin tức',
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
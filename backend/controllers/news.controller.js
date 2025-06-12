const News = require('../models/News.cjs')
const User = require('../models/User.cjs')
const { validationResult } = require('express-validator')

console.log('🔧 Loading news controller...')

// Get all news with filters
const getAllNews = async (req, res) => {
  try {
    console.log('📰 Getting all news with filters:', req.query)
    
    const {
      page = 1,
      limit = 10,
      category,
      featured,
      search,
      sort = 'publishedAt'
    } = req.query

    // Build filter object
    const filter = { isPublished: true }
    
    if (category && category !== 'Tất cả') {
      filter.category = category
    }
    
    if (featured === 'true') {
      filter.isFeatured = true
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } }
      ]
    }

    // Build sort object
    let sortObj = {}
    switch (sort) {
      case 'newest':
        sortObj = { publishedAt: -1 }
        break
      case 'popular':
        sortObj = { views: -1 }
        break
      case 'featured':
        sortObj = { isFeatured: -1, publishedAt: -1 }
        break
      default:
        sortObj = { publishedAt: -1 }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [news, total] = await Promise.all([
      News.find(filter)
        .populate('author', 'fullName avatar')
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      News.countDocuments(filter)
    ])

    console.log(`✅ Found ${news.length} news articles`)

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
    console.error('❌ Get all news error:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy tin tức',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// Get featured news
const getFeaturedNews = async (req, res) => {
  try {
    console.log('⭐ Getting featured news')
    
    const { limit = 6 } = req.query

    const featuredNews = await News.find({
      isPublished: true,
      isFeatured: true
    })
      .populate('author', 'fullName avatar')
      .sort({ publishedAt: -1 })
      .limit(parseInt(limit))
      .lean()

    console.log(`✅ Found ${featuredNews.length} featured news`)

    res.json({
      success: true,
      data: featuredNews,
      total: featuredNews.length
    })

  } catch (error) {
    console.error('❌ Get featured news error:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy tin nổi bật',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// Get news by ID
const getNewsById = async (req, res) => {
  try {
    console.log('📰 Getting news by ID:', req.params.id)
    
    const { id } = req.params

    const news = await News.findById(id)
      .populate('author', 'fullName avatar')
      .populate('relatedProperties', 'title price images location')

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      })
    }

    // Increment views
    await News.findByIdAndUpdate(id, { $inc: { views: 1 } })

    console.log('✅ News found and views incremented')

    res.json({
      success: true,
      data: news
    })

  } catch (error) {
    console.error('❌ Get news by ID error:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy bài viết',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// Get news categories
const getCategories = async (req, res) => {
  try {
    console.log('📂 Getting news categories')
    
    const categories = [
      'Tin tức',
      'Phân tích', 
      'Pháp lý',
      'Dự án',
      'Đầu tư',
      'Hướng dẫn'
    ]

    res.json({
      success: true,
      data: categories
    })

  } catch (error) {
    console.error('❌ Get categories error:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh mục',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// Create news (Admin/Editor only)
const createNews = async (req, res) => {
  try {
    console.log('📝 Creating news article')
    
    // Check validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array()
      })
    }

    const newsData = {
      ...req.body,
      author: req.user.userId || req.user.id
    }

    const news = new News(newsData)
    await news.save()

    const populatedNews = await News.findById(news._id)
      .populate('author', 'fullName avatar')

    console.log('✅ News created successfully:', news._id)

    res.status(201).json({
      success: true,
      message: 'Tạo bài viết thành công',
      data: populatedNews
    })

  } catch (error) {
    console.error('❌ Create news error:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo bài viết',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// Update news
const updateNews = async (req, res) => {
  try {
    console.log('📝 Updating news:', req.params.id)
    
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array()
      })
    }

    const { id } = req.params
    const updateData = req.body

    const news = await News.findById(id)
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      })
    }

    // Check if user can update this news
    const isAuthor = news.author.toString() === (req.user.userId || req.user.id)
    const isAdmin = req.user.role === 'admin'
    
    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền chỉnh sửa bài viết này'
      })
    }

    const updatedNews = await News.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'fullName avatar')

    console.log('✅ News updated successfully')

    res.json({
      success: true,
      message: 'Cập nhật bài viết thành công',
      data: updatedNews
    })

  } catch (error) {
    console.error('❌ Update news error:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật bài viết',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// Delete news
const deleteNews = async (req, res) => {
  try {
    console.log('🗑️ Deleting news:', req.params.id)
    
    const { id } = req.params

    const news = await News.findById(id)
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      })
    }

    // Check if user can delete this news
    const isAuthor = news.author.toString() === (req.user.userId || req.user.id)
    const isAdmin = req.user.role === 'admin'
    
    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xóa bài viết này'
      })
    }

    await News.findByIdAndDelete(id)

    console.log('✅ News deleted successfully')

    res.json({
      success: true,
      message: 'Xóa bài viết thành công'
    })

  } catch (error) {
    console.error('❌ Delete news error:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa bài viết',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// Toggle like news
const toggleLike = async (req, res) => {
  try {
    console.log('❤️ Toggling news like:', req.params.id)
    
    const { id } = req.params
    const userId = req.user.userId || req.user.id

    const news = await News.findById(id)
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      })
    }

    const hasLiked = news.likedBy.includes(userId)
    
    if (hasLiked) {
      // Unlike
      news.likedBy.pull(userId)
      news.likes = Math.max(0, news.likes - 1)
    } else {
      // Like
      news.likedBy.push(userId)
      news.likes += 1
    }

    await news.save()

    console.log(`✅ News ${hasLiked ? 'unliked' : 'liked'}`)

    res.json({
      success: true,
      data: {
        likes: news.likes,
        isLiked: !hasLiked
      }
    })

  } catch (error) {
    console.error('❌ Toggle like error:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi thích bài viết',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

console.log('✅ News controller functions defined')

module.exports = {
  getAllNews,
  getFeaturedNews,
  getNewsById,
  getCategories,
  createNews,
  updateNews,
  deleteNews,
  toggleLike
}
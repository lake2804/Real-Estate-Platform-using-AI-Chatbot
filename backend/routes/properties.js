const express = require('express')
const router = express.Router()

// ✅ FIXED: Import with .cjs extension
const Property = require('../models/Property.cjs')

// GET /api/properties - Get properties with filters
router.get('/', async (req, res) => {
  try {
    const query = { isActive: true }
    
    let {
      page = 1,
      limit = 12,
      type,
      location,
      priceMin,
      priceMax,
      sort = 'createdAt',
      order = 'desc',
      featured
    } = req.query
    
    console.log(`🏠 Getting properties (type: ${type}, limit: ${limit}, featured: ${featured})`)
    
    // Type filter
    if (type) {
      query.type = type
    }
    
    // Apply filters
    if (location && location !== 'Tất cả') {
      query.$or = [
        { 'location.district': { $regex: location, $options: 'i' } },
        { 'location.city': { $regex: location, $options: 'i' } }
      ]
    }
    
    if (priceMin || priceMax) {
      query.price = {}
      if (priceMin) query.price.$gte = parseInt(priceMin)
      if (priceMax) query.price.$lte = parseInt(priceMax)
    }
    
    // Featured filter
    if (featured === 'true') {
      query.$and = query.$and || []
      query.$and.push({
        $or: [
          { isFeatured: true },
          { featured: true }
        ]
      })
    }

    const sortObj = {}
    sortObj[sort] = order === 'desc' ? -1 : 1

    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    const [properties, total] = await Promise.all([
      Property.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('owner', 'fullName email phone avatar')
        .lean(),
      Property.countDocuments(query)
    ])

    console.log(`✅ Found ${properties.length}/${total} properties`)

    res.json({
      success: true,
      data: properties,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('❌ Error fetching properties:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách bất động sản',
      error: error.message
    })
  }
})

// GET /api/properties/featured - Get featured properties
router.get('/featured', async (req, res) => {
  try {
    const { limit = 8 } = req.query
    
    console.log(`🌟 Getting featured properties (limit: ${limit})`)
    
    const properties = await Property.find({
      isActive: true,
      $or: [
        { isFeatured: true },
        { featured: true }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('owner', 'fullName email phone avatar')
      .lean()

    console.log(`✅ Found ${properties.length} featured properties`)

    res.json({
      success: true,
      data: properties
    })
  } catch (error) {
    console.error('❌ Error fetching featured properties:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy bất động sản nổi bật',
      error: error.message
    })
  }
})

// GET /api/properties/search/filters - Get search filters
router.get('/search/filters', async (req, res) => {
  try {
    console.log('🔍 Getting search filters...')
    
    // Get unique locations
    const locations = await Property.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, cities: { $addToSet: '$location.city' } } },
      { $project: { _id: 0, cities: 1 } }
    ])
    
    const filters = {
      locations: locations[0]?.cities?.filter(Boolean).sort() || [
        'TP.HCM', 'Hà Nội', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
        'Biên Hòa', 'Nha Trang', 'Hạ Long', 'Vũng Tàu', 'Đà Lạt',
        'Huế', 'Quy Nhơn', 'Vinh', 'Buôn Ma Thuột', 'Thái Nguyên'
      ],
      priceRanges: [
        { label: 'Dưới 2 tỷ', value: 'under-2', min: 0, max: 2000000000 },
        { label: '2 - 5 tỷ', value: '2-5', min: 2000000000, max: 5000000000 },
        { label: '5 - 10 tỷ', value: '5-10', min: 5000000000, max: 10000000000 },
        { label: 'Trên 10 tỷ', value: 'above-10', min: 10000000000, max: null }
      ],
      types: [
        { label: 'Bán', value: 'sale' },
        { label: 'Cho thuê', value: 'rent' }
      ]
    }
    
    console.log(`✅ Found filters: ${filters.locations.length} locations`)
    
    res.json({
      success: true,
      data: filters
    })
  } catch (error) {
    console.error('❌ Error getting search filters:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy bộ lọc tìm kiếm',
      error: error.message
    })
  }
})

// GET /api/properties/search/popular - Get popular searches
router.get('/search/popular', async (req, res) => {
  try {
    console.log('🔥 Getting popular searches...')
    
    const popularSearches = [
      'Căn hộ TP.HCM',
      'Nhà phố Quận 7',
      'Chung cư Hà Nội',
      'Biệt thự Đà Nẵng',
      'Căn hộ Vinhomes',
      'Nhà cho thuê Bình Thạnh',
      'Chung cư Masteri',
      'Căn hộ cao cấp'
    ]
    
    console.log(`✅ Found ${popularSearches.length} popular search terms`)
    
    res.json({
      success: true,
      data: popularSearches
    })
  } catch (error) {
    console.error('❌ Error getting popular searches:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy tìm kiếm phổ biến',
      error: error.message
    })
  }
})

// GET /api/properties/:id - Get single property
router.get('/:id', async (req, res) => {
  try {
    console.log(`🔍 Looking for property with ID: ${req.params.id}`)
    
    const property = await Property.findById(req.params.id)
      .populate('owner', 'fullName email phone avatar')
      .lean()
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bất động sản'
      })
    }

    // Increment views
    await Property.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } })

    res.json({
      success: true,
      data: property
    })
  } catch (error) {
    console.error('❌ Error fetching property:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin bất động sản',
      error: error.message
    })
  }
})

module.exports = router
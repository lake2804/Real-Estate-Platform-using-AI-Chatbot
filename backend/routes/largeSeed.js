const express = require('express')
const router = express.Router()

// GET /api/seed/test - Test route
router.get('/test', async (req, res) => {
  try {
    const User = require('../models/User.cjs')
    const Property = require('../models/Property.cjs')
    const News = require('../models/News.cjs')
    const FeaturedProject = require('../models/FeaturedProject.cjs')
    
    const counts = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(), 
      News.countDocuments(),
      FeaturedProject.countDocuments()
    ])
    
    res.json({
      success: true,
      message: 'Seed system working',
      counts: {
        users: counts[0],
        properties: counts[1],
        news: counts[2],
        projects: counts[3]
      }
    })
  } catch (error) {
    console.error('❌ Seed test error:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// POST /api/seed/run - Run large seed
router.post('/run', async (req, res) => {
  try {
    console.log('🌱 Starting large seed process...')
    
    // Import and run the large seed function
    const largeSeedDatabase = require('../seeders/largeSeedDatabase')
    const result = await largeSeedDatabase()
    
    console.log('🎉 Large seed completed successfully!')
    
    res.json({
      success: true,
      message: 'Database seeded successfully',
      data: result
    })
  } catch (error) {
    console.error('❌ Large seed error:', error)
    res.status(500).json({
      success: false,
      message: 'Seeding failed',
      error: error.message
    })
  }
})

// DELETE /api/seed/clear - Clear all data
router.delete('/clear', async (req, res) => {
  try {
    console.log('🗑️ Clearing all data...')
    
    const User = require('../models/User.cjs')
    const Property = require('../models/Property.cjs')
    const News = require('../models/News.cjs')
    const FeaturedProject = require('../models/FeaturedProject.cjs')
    
    await Promise.all([
      User.deleteMany({}),
      Property.deleteMany({}),
      News.deleteMany({}),
      FeaturedProject.deleteMany({})
    ])
    
    console.log('✅ All data cleared')
    
    res.json({
      success: true,
      message: 'All data cleared successfully'
    })
  } catch (error) {
    console.error('❌ Clear data error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to clear data',
      error: error.message
    })
  }
})

module.exports = router
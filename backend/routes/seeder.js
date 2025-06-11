const express = require('express')
const router = express.Router()

// Sửa import thành User.cjs
const User = require('../models/User.cjs')
const Property = require('../models/Property.cjs')
const News = require('../models/News.cjs')
const FeaturedProject = require('../models/FeaturedProject.cjs')

// Import seed functions từ largeSeedData.js
const { 
  seedDatabase, 
  generateUsers, 
  generateProperties, 
  generateNews, 
  generateFeaturedProjects 
} = require('../seeders/largeSeedData')

// POST /api/seed/run - Chạy seed toàn bộ database
router.post('/run', async (req, res) => {
  try {
    console.log('🌱 Starting database seeding via API...')
    
    await seedDatabase()
    
    res.json({
      success: true,
      message: 'Database seeding completed successfully!',
      data: {
        users: 100,
        properties: 2000,
        news: 200,
        projects: 150,
        total: 2450
      }
    })
  } catch (error) {
    console.error('❌ Seeding error:', error)
    res.status(500).json({
      success: false,
      message: 'Database seeding failed',
      error: error.message
    })
  }
})

// POST /api/seed/users - Seed chỉ users
router.post('/users', async (req, res) => {
  try {
    const { count = 50 } = req.body
    
    console.log(`👥 Seeding ${count} users...`)
    const users = generateUsers(count)
    
    await User.deleteMany({})
    await User.insertMany(users)
    
    res.json({
      success: true,
      message: `Successfully seeded ${users.length} users`,
      data: { count: users.length }
    })
  } catch (error) {
    console.error('❌ User seeding error:', error)
    res.status(500).json({
      success: false,
      message: 'User seeding failed',
      error: error.message
    })
  }
})

// POST /api/seed/properties - Seed chỉ properties
router.post('/properties', async (req, res) => {
  try {
    const { count = 500 } = req.body
    
    console.log(`🏠 Seeding ${count} properties...`)
    const properties = generateProperties(count)
    
    await Property.deleteMany({})
    await Property.insertMany(properties)
    
    res.json({
      success: true,
      message: `Successfully seeded ${properties.length} properties`,
      data: { count: properties.length }
    })
  } catch (error) {
    console.error('❌ Property seeding error:', error)
    res.status(500).json({
      success: false,
      message: 'Property seeding failed',
      error: error.message
    })
  }
})

// POST /api/seed/news - Seed chỉ news
router.post('/news', async (req, res) => {
  try {
    const { count = 100 } = req.body
    
    console.log(`📰 Seeding ${count} news articles...`)
    const news = generateNews(count)
    
    await News.deleteMany({})
    await News.insertMany(news)
    
    res.json({
      success: true,
      message: `Successfully seeded ${news.length} news articles`,
      data: { count: news.length }
    })
  } catch (error) {
    console.error('❌ News seeding error:', error)
    res.status(500).json({
      success: false,
      message: 'News seeding failed',
      error: error.message
    })
  }
})

// POST /api/seed/projects - Seed chỉ projects
router.post('/projects', async (req, res) => {
  try {
    const { count = 75 } = req.body
    
    console.log(`🏗️ Seeding ${count} featured projects...`)
    const projects = generateFeaturedProjects(count)
    
    await FeaturedProject.deleteMany({})
    await FeaturedProject.insertMany(projects)
    
    res.json({
      success: true,
      message: `Successfully seeded ${projects.length} featured projects`,
      data: { count: projects.length }
    })
  } catch (error) {
    console.error('❌ Project seeding error:', error)
    res.status(500).json({
      success: false,
      message: 'Project seeding failed',
      error: error.message
    })
  }
})

// DELETE /api/seed/clear - Xóa toàn bộ data
router.delete('/clear', async (req, res) => {
  try {
    console.log('🧹 Clearing all data...')
    
    await Promise.all([
      User.deleteMany({}),
      Property.deleteMany({}),
      News.deleteMany({}),
      FeaturedProject.deleteMany({})
    ])
    
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

// GET /api/seed/status - Kiểm tra trạng thái database
router.get('/status', async (req, res) => {
  try {
    const [userCount, propertyCount, newsCount, projectCount] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      News.countDocuments(),
      FeaturedProject.countDocuments()
    ])
    
    res.json({
      success: true,
      data: {
        users: userCount,
        properties: propertyCount,
        news: newsCount,
        projects: projectCount,
        total: userCount + propertyCount + newsCount + projectCount
      }
    })
  } catch (error) {
    console.error('❌ Status check error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get database status',
      error: error.message
    })
  }
})

module.exports = router
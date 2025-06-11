const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

// Import models to ensure they're registered
const User = require('./models/User')
const Property = require('./models/Property')
const News = require('./models/News')
const FeaturedProject = require('./models/FeaturedProject')

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes registration
app.use('/api/auth', require('./routes/auth'))
app.use('/api/properties', require('./routes/properties'))
app.use('/api/news', require('./routes/news'))
app.use('/api/featured-projects', require('./routes/featuredProjects'))

// Development routes
if (process.env.NODE_ENV === 'development') {
  app.use('/api/seed', require('./routes/largeSeed'))
}

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState
    const dbStatus = dbState === 1 ? 'connected' : 'disconnected'
    
    let counts = {
      userCount: 0,
      propertyCount: 0,
      newsCount: 0,
      projectCount: 0
    }
    
    try {
      const [userCount, propertyCount, newsCount, projectCount] = await Promise.all([
        User.countDocuments(),
        Property.countDocuments(),
        News.countDocuments(),
        FeaturedProject.countDocuments()
      ])
      
      counts = { userCount, propertyCount, newsCount, projectCount }
    } catch (countError) {
      console.warn('Error getting counts:', countError.message)
    }

    res.json({
      success: true,
      data: {
        database: dbStatus,
        server: 'running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        counts
      }
    })
    
  } catch (error) {
    console.error('Health check error:', error)
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message
    })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

// 404 handler
app.use('*', (req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`)
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    availableRoutes: [
      'GET /api/health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/profile',
      'GET /api/properties',
      'GET /api/properties/for-sale',
      'GET /api/properties/for-rent',
      'GET /api/properties/featured',
      'GET /api/properties/search/filters',
      'GET /api/properties/search/popular',
      'GET /api/properties/:id',
      'GET /api/news',
      'GET /api/news/featured',
      'GET /api/news/:id',
      'GET /api/featured-projects',
      'GET /api/featured-projects/:id'
    ]
  })
})

const PORT = process.env.PORT || 4000

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate')
  .then(() => {
    console.log('✅ Connected to MongoDB')
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📡 API Base URL: http://localhost:${PORT}/api`)
      console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`)
      console.log(`🌱 Seed Database: POST http://localhost:${PORT}/api/seed/run`)
      console.log('\n🔗 Available endpoints:')
      console.log('   - GET /api/properties/search/filters')
      console.log('   - GET /api/properties/search/popular')
      console.log('   - GET /api/featured-projects')
      console.log('   - GET /api/news/featured')
    })
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  })

module.exports = app
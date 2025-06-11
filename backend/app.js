const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

// Check for JWT_SECRET
if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in environment variables.");
  process.exit(1); // Exit the application if JWT_SECRET is not set
}

const app = express()

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:4000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/real-estate', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB')
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err)
})

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const User = require('./models/User.cjs')
    const Property = require('./models/Property.cjs')
    const News = require('./models/News.cjs')
    const FeaturedProject = require('./models/FeaturedProject.cjs')
    
    const [userCount, propertyCount, newsCount, projectCount] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      News.countDocuments(),
      FeaturedProject.countDocuments()
    ])
    
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      data: {
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        server: 'running',
        counts: {
          userCount,
          propertyCount,
          newsCount,
          projectCount
        }
      }
    })
  } catch (error) {
    console.error('Health check error:', error)
    res.status(500).json({
      status: 'ERROR',
      error: error.message
    })
  }
})

// ✅ ROUTES - Make sure all routes are registered
console.log('🔗 Registering API routes...')

app.use('/api/auth', require('./routes/auth'))
console.log('✅ Registered /api/auth routes')

app.use('/api/users', require('./routes/users'))
console.log('✅ Registered /api/users routes')

app.use('/api/properties', require('./routes/properties'))
console.log('✅ Registered /api/properties routes')

app.use('/api/projects', require('./routes/projects'))
console.log('✅ Registered /api/projects routes')

app.use('/api/news', require('./routes/news'))
console.log('✅ Registered /api/news routes')

app.use('/api/seed', require('./routes/seeder'))
console.log('✅ Registered /api/seed routes')

// 404 handler with detailed logging
app.use('*', (req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`)
  console.log(`   Headers:`, req.headers)
  console.log(`   Query:`, req.query)
  
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    requestedPath: req.originalUrl,
    method: req.method,
    availableRoutes: [
      'GET /api/health',
      'GET /api/properties',
      'GET /api/properties/featured',
      'GET /api/properties/search/filters',
      'GET /api/properties/search/popular',
      'GET /api/projects',
      'GET /api/projects/featured',
      'GET /api/news',
      'GET /api/news/featured',
      'POST /api/seed/run'
    ]
  })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Global error:', err)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📖 API Documentation: http://localhost:${PORT}/api/health`)
  console.log(`🌱 Seed Database: POST http://localhost:${PORT}/api/seed/run`)
  console.log('🎯 Available endpoints:')
  console.log('   GET /api/properties/search/filters')
  console.log('   GET /api/properties/search/popular')
  console.log('   GET /api/projects/featured')
  console.log('   GET /api/properties?type=rent&featured=true')
  console.log('   GET /api/properties?type=sale&featured=true')
  console.log('   GET /api/news/featured')
})

module.exports = app
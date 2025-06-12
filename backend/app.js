const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

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

// MongoDB connection với options được cập nhật
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate'

mongoose.connect(mongoUri, {
  // Chỉ giữ lại các options được hỗ trợ
  serverSelectionTimeoutMS: 30000, // Timeout khi chọn server
  socketTimeoutMS: 45000,          // Timeout cho socket
  maxPoolSize: 10,                 // Số lượng connection tối đa
  minPoolSize: 2,                  // Số lượng connection tối thiểu
  maxIdleTimeMS: 30000,           // Thời gian idle tối đa
  retryWrites: true,              // Retry writes
  w: 'majority'                   // Write concern
})
.then(() => {
  console.log('✅ Connected to MongoDB Atlas successfully!')
  console.log('🌐 Database:', mongoose.connection.db.databaseName)
  console.log('🔗 Connection host:', mongoose.connection.host)
})
.catch((err) => {
  console.error('❌ MongoDB Atlas connection error:', err.message)
  process.exit(1)
})

// Connection event listeners
mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose connected to MongoDB')
})

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err)
})

mongoose.connection.on('disconnected', () => {
  console.log('📡 Mongoose disconnected from MongoDB')
})

// Handle process termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close()
    console.log('📡 MongoDB connection closed through app termination')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error)
    process.exit(1)
  }
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
      mongodb: {
        status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        host: mongoose.connection.host,
        database: mongoose.connection.db?.databaseName,
        readyState: mongoose.connection.readyState
      },
      counts: {
        users: userCount,
        properties: propertyCount,
        news: newsCount,
        projects: projectCount,
        total: userCount + propertyCount + newsCount + projectCount
      }
    })
  } catch (error) {
    console.error('❌ Health check error:', error)
    res.status(500).json({
      status: 'ERROR',
      error: error.message,
      mongodb: {
        status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        readyState: mongoose.connection.readyState
      }
    })
  }
})

// ✅ Register all API routes
console.log('🔗 Registering API routes...')

app.use('/api/auth', require('./routes/auth'))
app.use('/api/users', require('./routes/users'))
app.use('/api/properties', require('./routes/properties'))
app.use('/api/projects', require('./routes/projects'))
app.use('/api/featured-projects', require('./routes/featuredProjects'))
app.use('/api/news', require('./routes/news'))
app.use('/api/seed', require('./routes/seeder'))

// Import chatbot routes
const chatbotRoutes = require('./routes/chatbot.routes');

// Add chatbot routes
app.use('/api/chatbot', chatbotRoutes);

console.log('✅ All routes registered')

// 404 handler
app.use('*', (req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`)
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /api/health',
      'GET /api/properties',
      'GET /api/projects/featured',
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
    message: err.message || 'Internal server error'
  })
})

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📖 API Health: http://localhost:${PORT}/api/health`)
  console.log(`🌱 Seed Database: POST http://localhost:${PORT}/api/seed/run`)
})

module.exports = app
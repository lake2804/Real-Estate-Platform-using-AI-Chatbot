const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...')
    console.log('📍 MongoDB URI:', process.env.MONGODB_URI?.replace(/mongodb\+srv:\/\/[^:]+:[^@]+@/, 'mongodb+srv://***:***@'))
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    console.log(`📊 Database: ${conn.connection.name}`)
    
    // List collections to verify
    const collections = await mongoose.connection.db.listCollections().toArray()
    console.log('📋 Available collections:', collections.map(c => c.name).join(', '))
    
    return conn
  } catch (error) {
    console.error('❌ Database connection error:', error.message)
    process.exit(1)
  }
}

// ✅ Handle connection events
mongoose.connection.on('connected', () => {
  console.log('🟢 Mongoose connected to MongoDB')
})

mongoose.connection.on('error', (err) => {
  console.error('🔴 Mongoose connection error:', err)
})

mongoose.connection.on('disconnected', () => {
  console.log('🟡 Mongoose disconnected')
})

// ✅ Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close()
  console.log('👋 MongoDB connection closed due to app termination')
  process.exit(0)
})

module.exports = connectDB
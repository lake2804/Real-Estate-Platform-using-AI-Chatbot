const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })

const Property = require('../models/Property.cjs')
const User = require('../models/User.cjs')
const { generatePropertiesWithOwners } = require('../seeders/largeSeedData.js')

async function updatePropertyData() {
  try {
    console.log('🔄 Updating property data structure...')
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate')
    console.log('✅ Connected to MongoDB')

    // Xóa properties cũ
    await Property.deleteMany({})
    console.log('🗑️ Cleared old property data')

    // Lấy user IDs để làm owners
    const users = await User.find({}).select('_id')
    const userIds = users.map(user => user._id)
    
    if (userIds.length === 0) {
      console.log('⚠️ No users found. Creating sample users first...')
      const sampleUsers = [
        { fullName: 'Agent Minh', email: 'agent1@example.com', role: 'agent', phone: '+84901234567', password: 'password123' },
        { fullName: 'Agent Hương', email: 'agent2@example.com', role: 'agent', phone: '+84901234568', password: 'password123' }
      ]
      
      const createdUsers = await User.insertMany(sampleUsers)
      userIds.push(...createdUsers.map(user => user._id))
    }
    
    // Tạo properties mới với cấu trúc chi tiết
    console.log('🏠 Generating detailed property data...')
    const properties = generatePropertiesWithOwners(500, userIds)
    
    // Insert properties
    const insertedProperties = await Property.insertMany(properties)
    console.log(`✅ Inserted ${insertedProperties.length} detailed properties`)

    console.log('\n📊 Sample Property Data:')
    const sampleProperty = insertedProperties[0]
    console.log({
      title: sampleProperty.title,
      details: sampleProperty.details,
      furniture: sampleProperty.furniture,
      project: sampleProperty.project,
      formattedPrice: sampleProperty.formattedPrice
    })

    await mongoose.disconnect()
    console.log('📡 Disconnected from MongoDB')
    console.log('🎉 Property data update completed!')

  } catch (error) {
    console.error('❌ Update failed:', error)
    process.exit(1)
  }
}

// Chạy nếu file được gọi trực tiếp
if (require.main === module) {
  updatePropertyData()
}

module.exports = { updatePropertyData }
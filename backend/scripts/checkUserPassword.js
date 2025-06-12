const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const User = require('../models/User.cjs')

async function checkUserPassword() {
  try {
    // Connect to database
    const dbUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/real_estate_db'
    await mongoose.connect(dbUrl)
    console.log('✅ Connected to database')

    // Find the test user
    const user = await User.findOne({ email: 'user1@example.com' }).select('+password')
    
    if (!user) {
      console.log('❌ User not found')
      process.exit(1)
    }

    console.log('👤 User found:', {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      hasPassword: !!user.password,
      passwordLength: user.password?.length,
      passwordHash: user.password?.substring(0, 20) + '...'
    })

    // Test password comparison
    const testPasswords = ['password123', 'Password123', '123456', 'password']
    
    console.log('\n🔐 Testing passwords:')
    for (const testPassword of testPasswords) {
      try {
        const isMatch = await user.comparePassword(testPassword)
        console.log(`${isMatch ? '✅' : '❌'} "${testPassword}": ${isMatch ? 'MATCH' : 'NO MATCH'}`)
        
        // Also test direct bcrypt compare
        const directMatch = await bcrypt.compare(testPassword, user.password)
        console.log(`   Direct bcrypt: ${directMatch ? 'MATCH' : 'NO MATCH'}`)
        
        if (isMatch) {
          console.log(`🎉 FOUND CORRECT PASSWORD: "${testPassword}"`)
        }
      } catch (error) {
        console.log(`❌ Error testing "${testPassword}":`, error.message)
      }
    }

    // Check if password is properly hashed
    const isHashed = user.password.startsWith('$2a$') || user.password.startsWith('$2b$')
    console.log('\n🔍 Password analysis:')
    console.log('- Is properly hashed:', isHashed)
    console.log('- Hash algorithm:', user.password.substring(0, 4))
    
    if (!isHashed) {
      console.log('⚠️ Password is NOT hashed! It appears to be plain text.')
      
      // Re-hash the password
      console.log('🔧 Re-hashing password...')
      const hashedPassword = await bcrypt.hash('password123', 10)
      
      await User.findByIdAndUpdate(user._id, { password: hashedPassword })
      console.log('✅ Password re-hashed and updated')
      
      // Test again
      const updatedUser = await User.findById(user._id).select('+password')
      const finalTest = await updatedUser.comparePassword('password123')
      console.log('🧪 Final test with "password123":', finalTest ? 'SUCCESS' : 'FAILED')
    }

    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

checkUserPassword()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const User = require('../models/User.cjs')

async function fixUsersPasswords() {
  try {
    console.log('🔧 Fixing all user passwords with proper bcrypt hashing...')
    
    // Connect to database
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate'
    await mongoose.connect(mongoUri)
    console.log('✅ Connected to MongoDB')

    // Get all users
    const users = await User.find({}).select('+password')
    console.log(`📋 Found ${users.length} users to fix`)

    if (users.length === 0) {
      console.log('ℹ️ No users found. Creating test users...')
      
      // Create test users with proper passwords
      const testUsers = [
        {
          fullName: 'Admin User',
          email: 'admin@realestate.com',
          password: 'admin123',
          role: 'admin',
          phone: '+84901234567',
          isActive: true,
          isVerified: true
        },
        {
          fullName: 'Agent User',
          email: 'agent@realestate.com', 
          password: 'agent123',
          role: 'agent',
          phone: '+84902345678',
          isActive: true,
          isVerified: true
        },
        {
          fullName: 'Regular User',
          email: 'user@realestate.com',
          password: 'user123',
          role: 'user',
          phone: '+84903456789',
          isActive: true,
          isVerified: true
        },
        {
          fullName: 'Test User 1',
          email: 'user1@example.com',
          password: 'password123',
          role: 'user',
          phone: '+84904567890',
          isActive: true,
          isVerified: true
        }
      ]

      for (const userData of testUsers) {
        // Hash password properly
        const hashedPassword = await bcrypt.hash(userData.password, 12)
        console.log(`🔐 Hashing password for ${userData.email}:`)
        console.log(`   Original: ${userData.password}`)
        console.log(`   Hashed: ${hashedPassword.substring(0, 20)}...`)
        
        // Create user with hashed password (skip pre-save hook)
        await User.create({
          ...userData,
          password: hashedPassword
        })
        
        console.log(`✅ Created user: ${userData.email}`)
      }
    } else {
      // Fix existing users
      for (const user of users) {
        let originalPassword = 'password123' // default
        
        // Determine original password based on email/role
        if (user.email.includes('admin')) {
          originalPassword = 'admin123'
        } else if (user.email.includes('agent')) {
          originalPassword = 'agent123'
        } else if (user.email === 'user@realestate.com') {
          originalPassword = 'user123'
        } else if (user.email === 'user1@example.com') {
          originalPassword = 'password123'
        }
        
        // Check if password is already properly hashed
        const isValidHash = user.password && (
          user.password.startsWith('$2a$') || 
          user.password.startsWith('$2b$') || 
          user.password.startsWith('$2y$')
        )
        
        if (!isValidHash) {
          console.log(`🔧 Fixing password for: ${user.email}`)
          console.log(`   Current password field: ${user.password?.substring(0, 20)}...`)
          console.log(`   Using original password: ${originalPassword}`)
          
          // Hash the original password
          const hashedPassword = await bcrypt.hash(originalPassword, 12)
          console.log(`   New hash: ${hashedPassword.substring(0, 20)}...`)
          
          // Update user directly (bypass pre-save hook)
          await User.updateOne(
            { _id: user._id },
            { $set: { password: hashedPassword } }
          )
          
          console.log(`✅ Fixed password for: ${user.email}`)
        } else {
          console.log(`✅ Password already properly hashed for: ${user.email}`)
        }
      }
    }

    // Test all passwords
    console.log('\n🧪 Testing all user passwords...')
    const allUsers = await User.find({}).select('+password')
    
    for (const user of allUsers) {
      let testPassword = 'password123' // default
      
      if (user.email.includes('admin')) {
        testPassword = 'admin123'
      } else if (user.email.includes('agent')) {
        testPassword = 'agent123'
      } else if (user.email === 'user@realestate.com') {
        testPassword = 'user123'
      } else if (user.email === 'user1@example.com') {
        testPassword = 'password123'
      }
      
      const isMatch = await bcrypt.compare(testPassword, user.password)
      console.log(`${isMatch ? '✅' : '❌'} ${user.email}: ${testPassword} - ${isMatch ? 'WORKS' : 'FAILED'}`)
    }

    console.log('\n📋 Final User List:')
    const finalUsers = await User.find({}, 'fullName email role isActive')
    finalUsers.forEach(user => {
      let password = 'password123'
      if (user.email.includes('admin')) password = 'admin123'
      else if (user.email.includes('agent')) password = 'agent123'
      else if (user.email === 'user@realestate.com') password = 'user123'
      
      console.log(`👤 ${user.fullName} (${user.role}): ${user.email} / ${password}`)
    })

    console.log('\n🎉 Password fixing completed successfully!')
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Password fixing error:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  fixUsersPasswords()
}

module.exports = fixUsersPasswords
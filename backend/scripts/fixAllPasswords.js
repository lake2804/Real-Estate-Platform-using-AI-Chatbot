const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const User = require('../models/User.cjs')

async function fixAllPasswords() {
  try {
    // Connect to database
    const dbUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/real_estate_db'
    await mongoose.connect(dbUrl)
    console.log('✅ Connected to database')

    // Password mappings
    const passwordMappings = {
      'user1@example.com': 'password123',
      'user2@example.com': 'password123', 
      'agent1@example.com': 'password123',
      'admin@example.com': 'admin123',
      'test@test.com': '123456'
    }

    console.log('🔧 Fixing passwords for all users...')

    for (const [email, plainPassword] of Object.entries(passwordMappings)) {
      try {
        const user = await User.findOne({ email }).select('+password')
        
        if (!user) {
          console.log(`❌ User not found: ${email}`)
          continue
        }

        // Check if password is already hashed properly
        const isHashed = user.password.startsWith('$2a$') || user.password.startsWith('$2b$')
        
        // Test current password
        let currentPasswordWorks = false
        if (isHashed) {
          try {
            currentPasswordWorks = await bcrypt.compare(plainPassword, user.password)
          } catch (error) {
            console.log(`⚠️ Error testing current password for ${email}:`, error.message)
          }
        }

        if (!isHashed || !currentPasswordWorks) {
          console.log(`🔧 Fixing password for: ${email}`)
          
          // Hash the password properly
          const hashedPassword = await bcrypt.hash(plainPassword, 10)
          
          // Update user with new hashed password
          await User.findByIdAndUpdate(user._id, { 
            password: hashedPassword,
            isActive: true 
          })
          
          console.log(`✅ Fixed password for: ${email}`)
          
          // Verify the fix
          const updatedUser = await User.findById(user._id).select('+password')
          const testResult = await updatedUser.comparePassword(plainPassword)
          console.log(`   Verification: ${testResult ? '✅ SUCCESS' : '❌ FAILED'}`)
          
        } else {
          console.log(`✅ Password already correct for: ${email}`)
        }

      } catch (error) {
        console.error(`❌ Error fixing password for ${email}:`, error.message)
      }
    }

    // Final verification
    console.log('\n🧪 Final verification of all users:')
    for (const [email, plainPassword] of Object.entries(passwordMappings)) {
      try {
        const user = await User.findOne({ email }).select('+password')
        if (user) {
          const isValid = await user.comparePassword(plainPassword)
          console.log(`${isValid ? '✅' : '❌'} ${email}: ${isValid ? 'VALID' : 'INVALID'}`)
        }
      } catch (error) {
        console.log(`❌ ${email}: ERROR - ${error.message}`)
      }
    }

    console.log('\n🎉 Password fix completed!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

fixAllPasswords()
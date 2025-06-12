const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Vui lòng nhập họ tên'],
    trim: true,
    maxlength: [50, 'Họ tên không được quá 50 ký tự']
  },
  email: {
    type: String,
    required: [true, 'Vui lòng nhập email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email không hợp lệ']
  },
  password: {
    type: String,
    required: [true, 'Vui lòng nhập mật khẩu'],
    minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
    select: false
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'agent', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

userSchema.pre('save', async function(next) {
  // Only hash password if it's modified and not already hashed
  if (!this.isModified('password')) {
    return next()
  }
  
  try {
    // Check if password is already hashed
    const isAlreadyHashed = this.password.startsWith('$2a$') || 
                           this.password.startsWith('$2b$') || 
                           this.password.startsWith('$2y$')
    
    if (isAlreadyHashed) {
      console.log('🔐 Password already hashed, skipping hash step')
      return next()
    }
    
    console.log('🔐 Hashing password for user:', this.email)
    
    // Generate salt and hash password
    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)
    this.password = await bcrypt.hash(this.password, salt)
    
    console.log('✅ Password hashed successfully')
    next()
  } catch (error) {
    console.error('❌ Password hashing error:', error)
    next(error)
  }
})

userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    if (!candidatePassword || !this.password) {
      console.log('❌ Missing password data for comparison')
      return false
    }
    
    console.log('🔐 Comparing passwords for user:', this.email)
    console.log('   Candidate length:', candidatePassword.length)
    console.log('   Hash starts with:', this.password.substring(0, 7))
    
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    console.log('   Match result:', isMatch)
    
    return isMatch
  } catch (error) {
    console.error('❌ Password comparison error:', error)
    return false
  }
}

// ✅ Add method to manually hash password
userSchema.methods.hashPassword = async function(plainPassword) {
  try {
    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)
    return await bcrypt.hash(plainPassword, salt)
  } catch (error) {
    console.error('❌ Manual password hashing error:', error)
    throw error
  }
}

module.exports = mongoose.model('User', userSchema)

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
    default: function() {
      const initials = this.fullName?.split(' ').map(n => n[0]).join('') || 'U'
      return `https://ui-avatars.com/api/?name=${initials}&background=F62E56&color=fff&size=128`
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  }
}, {
  timestamps: true
})

// Indexes
userSchema.index({ email: 1 })
userSchema.index({ role: 1 })
userSchema.index({ isActive: 1 })

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

// Pre-save middleware to hash password ONLY for new users or password changes
userSchema.pre('save', async function(next) {
  try {
    // Only hash if password is modified AND not already hashed
    if (!this.isModified('password')) {
      return next()
    }
    
    // Check if password is already a bcrypt hash
    const isAlreadyHashed = this.password.startsWith('$2a$') || 
                           this.password.startsWith('$2b$') || 
                           this.password.startsWith('$2y$')
    
    if (isAlreadyHashed) {
      console.log('🔐 Password already hashed for:', this.email)
      return next()
    }
    
    console.log('🔐 Hashing new password for:', this.email)
    
    // Hash password
    const saltRounds = 12
    this.password = await bcrypt.hash(this.password, saltRounds)
    
    console.log('✅ Password hashed successfully')
    next()
    
  } catch (error) {
    console.error('❌ Password hashing error:', error)
    next(error)
  }
})

// Enhanced password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    if (!candidatePassword || !this.password) {
      console.log('❌ Missing password data for comparison')
      return false
    }
    
    console.log('🔐 Comparing passwords for:', this.email)
    console.log('   Candidate length:', candidatePassword.length)
    console.log('   Hash format valid:', this.password.startsWith('$2'))
    
    // Check if stored password is a valid bcrypt hash
    if (!this.password.startsWith('$2')) {
      console.log('⚠️ Invalid hash format detected')
      return false
    }
    
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    console.log('   Result:', isMatch ? 'MATCH' : 'NO MATCH')
    
    return isMatch
    
  } catch (error) {
    console.error('❌ Password comparison error:', error)
    return false
  }
}

// Method to handle failed login attempts
userSchema.methods.incLoginAttempts = async function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    })
  }
  
  const updates = { $inc: { loginAttempts: 1 } }
  
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }
  }
  
  return this.updateOne(updates)
}

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = async function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
    $set: { lastLogin: new Date() }
  })
}

// Static method to find user for authentication
userSchema.statics.findForAuth = function(email) {
  return this.findOne({ 
    email: email.toLowerCase(),
    isActive: true 
  }).select('+password +loginAttempts +lockUntil')
}

module.exports = mongoose.model('User', userSchema)

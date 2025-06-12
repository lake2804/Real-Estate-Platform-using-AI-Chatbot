const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User.cjs') 

console.log('🔧 Loading enhanced auth controller...')

// Generate JWT token
const generateToken = (user) => {
  const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'
  const payload = {
    userId: user._id,
    id: user._id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000)
  }
  
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: '7d',
    issuer: 'realestate-platform',
    audience: 'realestate-users'
  })
}

// Register new user
const register = async (req, res) => {
  try {
    console.log('📝 Register request:', {
      email: req.body.email,
      fullName: req.body.fullName,
      role: req.body.role || 'user'
    })

    const { fullName, email, password, phone, role } = req.body

    // Validation
    if (!fullName?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin bắt buộc'
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải có ít nhất 6 ký tự'
      })
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng. Vui lòng sử dụng email khác.'
      })
    }

    // Create user (password will be hashed by pre-save hook)
    const userData = {
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password: password.trim(),
      phone: phone?.trim() || '',
      role: ['user', 'agent', 'admin'].includes(role) ? role : 'user',
      isVerified: false
    }

    console.log('👤 Creating user:', { email: userData.email, role: userData.role })
    
    const user = await User.create(userData)
    console.log('✅ User created successfully:', user._id)

    // Generate token
    const token = generateToken(user)

    // Update user's last login
    await user.updateOne({ lastLogin: new Date() })

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công! Chào mừng bạn đến với hệ thống.',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          phone: user.phone,
          isVerified: user.isVerified
        },
        token
      }
    })

  } catch (error) {
    console.error('❌ Registration error:', error)
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email đã tồn tại trong hệ thống'
      })
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message)
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại sau.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// Enhanced login with better password debugging
const login = async (req, res) => {
  try {
    console.log('🔐 Login endpoint called with:', { 
      email: req.body.email, 
      hasPassword: !!req.body.password 
    })

    const { email, password } = req.body

    // Input validation
    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ email và mật khẩu'
      })
    }

    // Find user with authentication fields
    const user = await User.findForAuth(email.trim())
    console.log('🔍 User found:', !!user)
    
    if (!user) {
      console.log('❌ User not found:', email)
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      })
    }

    // Debug password info
    console.log('🔐 Password debug info:', {
      email: user.email,
      hasStoredPassword: !!user.password,
      storedPasswordLength: user.password?.length || 0,
      storedPasswordStart: user.password?.substring(0, 10) || 'N/A',
      isValidBcryptHash: user.password?.startsWith('$2') || false,
      inputPasswordLength: password.length
    })

    // Check if account is locked
    if (user.isLocked) {
      console.log('🔒 Account locked:', email)
      return res.status(423).json({
        success: false,
        message: 'Tài khoản đã bị khóa do đăng nhập sai quá nhiều lần. Vui lòng thử lại sau.'
      })
    }

    // Check if account is active
    if (!user.isActive) {
      console.log('🚫 Account inactive:', email)
      return res.status(401).json({
        success: false,
        message: 'Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.'
      })
    }

    // Manual password comparison with detailed logging
    console.log('🔐 Comparing passwords for user:', user.email)
    console.log('   Candidate length:', password.length)
    console.log('   Hash starts with:', user.password.substring(0, 7))
    
    let isPasswordValid = false
    
    try {
      isPasswordValid = await bcrypt.compare(password, user.password)
      console.log('   Match result:', isPasswordValid)
    } catch (bcryptError) {
      console.error('   Bcrypt error:', bcryptError.message)
      
      // If bcrypt fails, the stored password might not be a valid hash
      const directMatch = password === user.password
      console.log('   Direct comparison (fallback):', directMatch)
      
      if (directMatch) {
        console.log('🚨 WARNING: Password stored as plaintext! Fixing...')
        
        // Hash the password and update user
        const hashedPassword = await bcrypt.hash(password, 12)
        await User.updateOne(
          { _id: user._id },
          { $set: { password: hashedPassword } }
        )
        
        console.log('✅ Password re-hashed and updated')
        isPasswordValid = true
      }
    }
    
    console.log('🔐 Password match:', isPasswordValid)
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password for:', email)
      
      // Increment failed login attempts
      await user.incLoginAttempts()
      
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      })
    }

    // Successful login
    await user.resetLoginAttempts()
    console.log('✅ Login successful:', email)

    // Generate token
    const token = generateToken(user)

    // Return success response
    res.json({
      success: true,
      message: `Chào mừng ${user.fullName}! Đăng nhập thành công.`,
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          phone: user.phone,
          isVerified: user.isVerified,
          lastLogin: user.lastLogin
        },
        token,
        expiresIn: '7d'
      }
    })

  } catch (error) {
    console.error('❌ Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng nhập. Vui lòng thử lại.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// Get current user profile
const getMe = async (req, res) => {
  try {
    console.log('👤 GetMe request for user:', req.user.userId)
    
    const user = await User.findById(req.user.userId)
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin người dùng'
      })
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản đã bị vô hiệu hóa'
      })
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
          isVerified: user.isVerified,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        }
      }
    })
    
  } catch (error) {
    console.error('❌ GetMe error:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// Update user profile
const updateProfile = async (req, res) => {
  try {
    console.log('📝 UpdateProfile request for user:', req.user.userId)
    
    const { fullName, phone } = req.body
    const updates = {}
    
    // Filter allowed updates
    if (fullName?.trim()) updates.fullName = fullName.trim()
    if (phone?.trim()) updates.phone = phone.trim()
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có thông tin nào để cập nhật'
      })
    }
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      { new: true, runValidators: true }
    )
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      })
    }

    res.json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
          isVerified: user.isVerified
        }
      }
    })
    
  } catch (error) {
    console.error('❌ UpdateProfile error:', error)
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message)
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// Change password
const changePassword = async (req, res) => {
  try {
    console.log('🔐 ChangePassword request for user:', req.user.userId)
    
    const { currentPassword, newPassword } = req.body
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới'
      })
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự'
      })
    }
    
    const user = await User.findById(req.user.userId).select('+password')
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      })
    }
    
    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword)
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu hiện tại không đúng'
      })
    }
    
    // Update password
    user.password = newPassword
    await user.save()
    
    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    })
    
  } catch (error) {
    console.error('❌ ChangePassword error:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

console.log('✅ All auth controller functions defined successfully')

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword
}

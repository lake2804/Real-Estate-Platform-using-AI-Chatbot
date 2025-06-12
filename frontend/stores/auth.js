import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isLoading: false,
    error: null // ✅ Thêm error state
  }),

  getters: {
    currentUser: (state) => state.user,
    isAuthenticated: (state) => !!state.user && !!state.token,
    isLoggedIn: (state) => !!state.user && !!state.token
  },

  actions: {
    // Initialize auth from localStorage
    initAuth() {
      if (process.client) {
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')
        
        console.log('🔍 Initializing auth:', { token: !!token, userData: !!userData })
        
        if (token && userData) {
          try {
            this.token = token
            this.user = JSON.parse(userData)
            console.log('✅ Auth initialized:', this.user)
          } catch (error) {
            console.error('❌ Auth init error:', error)
            this.clearAuth()
          }
        }
      }
    },

    // ✅ FIX: Login method with error handling
    async login(credentials) {
      this.isLoading = true
      this.error = null
      
      try {
        // Mock login for testing - replace with actual API call
        const mockUser = {
          id: Date.now(),
          name: 'Test User',
          email: credentials.email,
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          role: 'user'
        }
        const mockToken = 'mock-jwt-token-' + Date.now()
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // In real app, replace with:
        // const response = await $fetch('/api/auth/login', {
        //   method: 'POST',
        //   body: credentials
        // })
        
        // Save to store
        this.user = mockUser
        this.token = mockToken
        
        // Save to localStorage
        localStorage.setItem('token', mockToken)
        localStorage.setItem('user', JSON.stringify(mockUser))
        
        console.log('✅ Login successful:', this.user)
        return { success: true, user: mockUser, token: mockToken }
        
      } catch (error) {
        console.error('❌ Login error:', error)
        this.error = error.message || 'Đăng nhập thất bại'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // ✅ NEW: Register method
    async register(userData) {
      this.isLoading = true
      this.error = null
      
      try {
        console.log('📝 Starting registration process...', userData)
        
        // Validate input
        if (!userData.email || !userData.password || !userData.fullName) {
          throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc')
        }
        
        if (userData.password !== userData.confirmPassword) {
          throw new Error('Mật khẩu xác nhận không khớp')
        }
        
        if (userData.password.length < 6) {
          throw new Error('Mật khẩu phải có ít nhất 6 ký tự')
        }
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Mock registration - replace with actual API call
        const newUser = {
          id: Date.now(),
          name: userData.fullName,
          email: userData.email,
          phone: userData.phone || '',
          role: userData.role || 'user',
          avatar: `https://randomuser.me/api/portraits/${userData.role === 'agent' ? 'women' : 'men'}/${Math.floor(Math.random() * 50) + 1}.jpg`,
          createdAt: new Date().toISOString()
        }
        
        const newToken = 'mock-jwt-token-' + Date.now()
        
        // In real app, replace with:
        // const response = await $fetch('/api/auth/register', {
        //   method: 'POST',
        //   body: {
        //     fullName: userData.fullName,
        //     email: userData.email,
        //     phone: userData.phone,
        //     password: userData.password,
        //     role: userData.role
        //   }
        // })
        
        // Save to store
        this.user = newUser
        this.token = newToken
        
        // Save to localStorage
        localStorage.setItem('token', newToken)
        localStorage.setItem('user', JSON.stringify(newUser))
        
        console.log('✅ Registration successful:', this.user)
        
        return { 
          success: true, 
          user: newUser, 
          token: newToken,
          message: `Chào mừng ${newUser.name}! Đăng ký thành công.`
        }
        
      } catch (error) {
        console.error('❌ Registration error:', error)
        this.error = error.message || 'Đăng ký thất bại'
        
        // Mock some common registration errors
        if (error.message.includes('email')) {
          this.error = 'Email này đã được sử dụng'
        }
        
        return { 
          success: false, 
          message: this.error 
        }
      } finally {
        this.isLoading = false
      }
    },

    // Logout method
    logout() {
      console.log('🚪 Logging out...')
      this.clearAuth()
    },

    // Clear auth data
    clearAuth() {
      this.user = null
      this.token = null
      this.error = null
      
      if (process.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
      
      console.log('🧹 Auth cleared')
    },

    // Clear error
    clearError() {
      this.error = null
    },

    // Check auth status
    checkAuth() {
      if (process.client) {
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')
        
        if (token && userData) {
          try {
            this.token = token
            this.user = JSON.parse(userData)
            return true
          } catch (error) {
            this.clearAuth()
            return false
          }
        }
      }
      return false
    }
  }
})
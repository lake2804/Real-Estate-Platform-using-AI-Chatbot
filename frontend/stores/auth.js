import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isLoggedIn: false,
    isLoading: false,
    error: null
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'admin',
    isAgent: (state) => state.user?.role === 'agent',
    isUser: (state) => state.user?.role === 'user',
    userInitials: (state) => {
      if (!state.user?.fullName) return 'U'
      return state.user.fullName.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
    }
  },

  actions: {
    // Initialize auth from localStorage
    initAuth() {
      console.log('🔐 Initializing auth...')
      
      if (process.client) {
        try {
          const token = localStorage.getItem('token')
          const user = localStorage.getItem('user')
          
          if (token && user) {
            this.token = token
            this.user = JSON.parse(user)
            this.isLoggedIn = true
            console.log('✅ Auth restored from localStorage:', this.user.email)
          } else {
            console.log('ℹ️ No stored auth data found')
          }
        } catch (error) {
          console.error('❌ Error restoring auth:', error)
          this.clearAuth()
        }
      }
    },

    // Login action with better error handling
    async login(credentials) {
      // Prevent concurrent login attempts
      if (this.isLoading) {
        console.log('⚠️ Login already in progress')
        return { success: false, message: 'Login already in progress' }
      }

      console.log('🔐 Login attempt:', { email: credentials.email })
      
      this.isLoading = true
      this.error = null

      try {
        const response = await $fetch('/api/auth/login', {
          method: 'POST',
          body: {
            email: credentials.email.trim(),
            password: credentials.password
          }
        })

        console.log('✅ Login response:', { 
          success: response.success, 
          user: response.data?.user?.email 
        })

        if (response.success && response.data?.user && response.data?.token) {
          // Set auth data
          this.user = response.data.user
          this.token = response.data.token
          this.isLoggedIn = true

          // Store in localStorage
          if (process.client) {
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.user))
          }

          console.log('🎉 Login successful:', this.user.fullName)
          
          return { 
            success: true, 
            message: response.message || 'Đăng nhập thành công!',
            user: this.user
          }
        } else {
          throw new Error(response.message || 'Đăng nhập thất bại')
        }

      } catch (error) {
        console.error('❌ Login error:', error)
        
        const errorMessage = error.data?.message || error.message || 'Lỗi kết nối. Vui lòng thử lại.'
        this.error = errorMessage
        
        // Clear any partial auth state
        this.clearAuth()
        
        return { 
          success: false, 
          message: errorMessage 
        }
        
      } finally {
        this.isLoading = false
      }
    },

    // Register action
    async register(userData) {
      if (this.isLoading) {
        return { success: false, message: 'Registration already in progress' }
      }

      console.log('📝 Register attempt:', { email: userData.email, role: userData.role })
      
      this.isLoading = true
      this.error = null

      try {
        const response = await $fetch('/api/auth/register', {
          method: 'POST',
          body: {
            fullName: userData.fullName.trim(),
            email: userData.email.trim(),
            password: userData.password,
            phone: userData.phone?.trim() || '',
            role: userData.role || 'user'
          }
        })

        console.log('✅ Register response:', { success: response.success })

        if (response.success && response.data?.user && response.data?.token) {
          // Set auth data
          this.user = response.data.user
          this.token = response.data.token
          this.isLoggedIn = true

          // Store in localStorage
          if (process.client) {
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.user))
          }

          console.log('🎉 Registration successful:', this.user.fullName)
          return { success: true, message: response.message }
        } else {
          throw new Error(response.message || 'Đăng ký thất bại')
        }

      } catch (error) {
        console.error('❌ Registration error:', error)
        
        const errorMessage = error.data?.message || error.message || 'Lỗi kết nối. Vui lòng thử lại.'
        this.error = errorMessage
        
        return { 
          success: false, 
          message: errorMessage 
        }
        
      } finally {
        this.isLoading = false
      }
    },

    // Logout action
    logout() {
      console.log('👋 Logging out user:', this.user?.email)
      
      this.clearAuth()
      
      // Navigate to home page
      if (process.client) {
        setTimeout(() => {
          navigateTo('/')
        }, 100)
      }
    },

    // Clear auth data
    clearAuth() {
      this.user = null
      this.token = null
      this.isLoggedIn = false
      this.error = null

      if (process.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    },

    // Get current user profile
    async fetchProfile() {
      if (!this.token) return

      try {
        const response = await $fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })

        if (response.success && response.data?.user) {
          this.user = response.data.user
          
          // Update localStorage
          if (process.client) {
            localStorage.setItem('user', JSON.stringify(response.data.user))
          }
        }

      } catch (error) {
        console.error('❌ Profile fetch error:', error)
        
        // If token is invalid, logout
        if (error.status === 401) {
          this.logout()
        }
      }
    }
  }
})
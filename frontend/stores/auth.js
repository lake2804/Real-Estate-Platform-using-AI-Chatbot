import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isLoading: false,
    error: null,
    initialized: false,
    redirectTo: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    currentUser: (state) => state.user,
    userRole: (state) => state.user?.role || 'user',
    isAdmin: (state) => state.user?.role === 'admin',
    isAgent: (state) => state.user?.role === 'agent',
    isUser: (state) => state.user?.role === 'user'
  },

  actions: {
    // ✅ Set redirect destination
    setRedirectTo(path) {
      // Only set redirect for protected pages, not for login/register
      if (path && !path.includes('/login') && !path.includes('/register')) {
        this.redirectTo = path
      }
    },

    // ✅ Get and clear redirect destination
    getAndClearRedirect() {
      const redirect = this.redirectTo || '/'
      this.redirectTo = null
      return redirect
    },

    // ✅ Smart redirect after login
    getPostLoginRedirect() {
      // Get intended destination or default to home
      const intended = this.getAndClearRedirect()
      
      // Don't redirect to auth pages
      if (intended.includes('/login') || intended.includes('/register')) {
        return '/'
      }
      
      return intended
    },

    async login(credentials) {
      console.log('🔐 AuthStore login attempt:', credentials.email)
      
      this.isLoading = true
      this.error = null
      
      try {
        const { $api } = useApi()
        
        const response = await $api('/auth/login', {
          method: 'POST',
          body: credentials
        })
        
        if (response.success && response.data) {
          this.token = response.data.token
          this.user = response.data.user
          
          // Save to cookies
          const tokenCookie = useCookie('auth-token', {
            default: () => null,
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          })
          
          const userCookie = useCookie('auth-user', {
            default: () => null,
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          })
          
          tokenCookie.value = this.token
          userCookie.value = JSON.stringify(this.user)
          
          console.log('✅ Login successful, user role:', this.user.role)
          
          // Get redirect destination
          const redirectPath = this.getPostLoginRedirect()
          console.log('🔄 Redirecting to:', redirectPath)
          
          // Use navigateTo with replace to prevent back button issues
          await navigateTo(redirectPath, { replace: true })
          
        } else {
          throw new Error(response.message || 'Đăng nhập thất bại')
        }
        
      } catch (error) {
        console.error('❌ Login error:', error)
        this.error = error.data?.message || error.message || 'Đăng nhập thất bại'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async register(userData) {
      console.log('📝 AuthStore register attempt:', userData.email)
      
      this.isLoading = true
      this.error = null
      
      try {
        const { $api } = useApi()
        
        const response = await $api('/auth/register', {
          method: 'POST',
          body: userData
        })
        
        if (response.success && response.data) {
          this.token = response.data.token
          this.user = response.data.user
          
          // Save to cookies
          const tokenCookie = useCookie('auth-token', {
            default: () => null,
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          })
          
          const userCookie = useCookie('auth-user', {
            default: () => null,
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          })
          
          tokenCookie.value = this.token
          userCookie.value = JSON.stringify(this.user)
          
          console.log('✅ Register successful, redirecting to home...')
          
          // New users always go to home page
          await navigateTo('/', { replace: true })
          
        } else {
          throw new Error(response.message || 'Đăng ký thất bại')
        }
        
      } catch (error) {
        console.error('❌ Register error:', error)
        this.error = error.data?.message || error.message || 'Đăng ký thất bại'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      console.log('🚪 AuthStore logout')
      
      try {
        // Clear state
        this.user = null
        this.token = null
        this.error = null
        this.redirectTo = null
        
        // Clear cookies
        const tokenCookie = useCookie('auth-token')
        const userCookie = useCookie('auth-user')
        
        tokenCookie.value = null
        userCookie.value = null
        
        console.log('✅ Logout completed, redirecting to home...')
        
        // Always redirect to home page after logout
        await navigateTo('/', { replace: true })
        
      } catch (error) {
        console.error('❌ Logout error:', error)
      }
    },

    async restoreAuth() {
      if (this.initialized) return
      
      console.log('🔄 Restoring auth from cookies...')
      
      try {
        const tokenCookie = useCookie('auth-token')
        const userCookie = useCookie('auth-user')
        
        if (tokenCookie.value && userCookie.value) {
          this.token = tokenCookie.value
          this.user = JSON.parse(userCookie.value)
          console.log('✅ Auth restored from cookies, user role:', this.user?.role)
        }
      } catch (error) {
        console.error('❌ Error restoring auth:', error)
        this.clearAuth()
      } finally {
        this.initialized = true
      }
    },

    clearAuth() {
      this.user = null
      this.token = null
      this.error = null
      this.redirectTo = null
      
      const tokenCookie = useCookie('auth-token')
      const userCookie = useCookie('auth-user')
      
      tokenCookie.value = null
      userCookie.value = null
    }
  }
})
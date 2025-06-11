import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    isAuthenticated: false
  }),

  getters: {
    user: (state) => state.currentUser,
    isLoggedIn: (state) => state.isAuthenticated
  },

  actions: {
    login(userData) {
      console.log('🔧 UserStore login called with:', userData)
      this.currentUser = userData
      this.isAuthenticated = true
    },

    logout() {
      console.log('🔧 UserStore logout called')
      this.currentUser = null
      this.isAuthenticated = false
      
      // Clear localStorage if exists
      if (process.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    },

    setUser(userData) {
      console.log('🔧 UserStore setUser called with:', userData)
      this.currentUser = userData
      this.isAuthenticated = !!userData
    }
  }
})
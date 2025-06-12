export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  
  if (process.client) {
    // Initialize auth state from localStorage
    authStore.initAuth()
    
    console.log('🔐 Auth plugin initialized:', {
      isAuthenticated: authStore.isAuthenticated,
      user: authStore.currentUser?.name || authStore.currentUser?.email || 'None'
    })
  }
})
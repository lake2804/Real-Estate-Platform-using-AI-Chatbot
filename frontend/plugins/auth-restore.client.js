export default defineNuxtPlugin(async () => {
  console.log('🔧 Auth restore plugin loading...')
  
  // Only run on client side
  if (!process.client) {
    console.log('⏸️ Skipping auth restore on server side')
    return
  }

  try {
    const { useAuthStore } = await import('~/stores/auth')
    const authStore = useAuthStore()
    
    // Check if auth is already initialized
    if (authStore.initialized) {
      console.log('✅ Auth already initialized, skipping restore')
      return
    }
    
    console.log('🔧 Restoring auth state from localStorage...')
    
    // Manually check localStorage first for debugging
    const token = localStorage.getItem('token')
    const userJson = localStorage.getItem('user')
    
    console.log('🔧 Found in localStorage:', {
      token: !!token,
      user: !!userJson
    })
    
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson)
        console.log('🔧 Restoring user:', user.email || user.fullName)
        
        // Use the restoreAuth method
        await authStore.restoreAuth()
        
        console.log('✅ Auth state restored successfully')
      } catch (parseError) {
        console.error('❌ Error parsing stored user data:', parseError)
        // Clear invalid data
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    } else {
      console.log('ℹ️ No stored auth data found')
    }
    
  } catch (error) {
    console.error('❌ Auth restore error:', error)
    // Don't throw error to prevent app from crashing
  }
})
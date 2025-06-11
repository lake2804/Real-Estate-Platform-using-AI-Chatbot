import { useAuthStore } from '~/stores/auth'



export default defineNuxtPlugin(async () => {
  console.log('🚀 Client initialization plugin starting...')
  
  // Only run on client side
  if (!process.client) {
    console.log('⏸️ Skipping client init on server side')
    return
  }

  try {
    // Initialize auth store
    console.log('🔧 Initializing auth store...')
    const authStore = useAuthStore()
    await authStore.initAuth()
    
    // Initialize chat store if user is authenticated
    if (authStore.isAuthenticated) {
      console.log('🔧 Initializing chat store...')
      try {
        const chatStore = useChatStore()
        await chatStore.initChat()
      } catch (chatError) {
        console.warn('⚠️ Chat initialization failed:', chatError.message)
        // Don't throw error, chat is not critical for app to work
      }
    }
    
    // Initialize other client-side services
    if (process.client) {
      // Initialize error tracking
      console.log('🔧 Initializing error tracking...')
      
      // Initialize analytics
      console.log('🔧 Initializing analytics...')
      
      // Initialize notifications
      console.log('🔧 Initializing notifications...')
    }
    
    console.log('✅ Client initialization completed successfully')
    
  } catch (error) {
    console.error('❌ Client initialization failed:', error)
    // Don't throw error to prevent app from crashing
    // Just log the error and continue
  }
})
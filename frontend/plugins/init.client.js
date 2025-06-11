import { useAuthStore } from '~/stores/auth'



export default defineNuxtPlugin(async () => {

  // Only run on client side
  if (!process.client) {
    return
  }

  try {
    // Initialize auth store
    const authStore = useAuthStore()
    // await authStore.initAuth()

    // Initialize chat store if user is authenticated
    if (authStore.isAuthenticated) {
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

      // Initialize analytics
      // Initialize notifications
    }


  } catch (error) {
    console.error('❌ Client initialization failed:', error)
    // Don't throw error to prevent app from crashing
    // Just log the error and continue
  }
})
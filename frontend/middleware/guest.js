export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  console.log('👥 Guest middleware - checking for:', to.path)
  console.log('👤 User authenticated:', authStore.isAuthenticated)
  
  // If already authenticated, redirect to appropriate page
  if (authStore.isAuthenticated) {
    console.log('✅ Already authenticated, determining redirect...')
    
    // Check if there's a redirect query parameter
    const redirectTo = to.query.redirect || from.path
    
    // Don't redirect back to auth pages
    if (redirectTo && !redirectTo.includes('/login') && !redirectTo.includes('/register')) {
      console.log('🔄 Redirecting to intended page:', redirectTo)
      return navigateTo(redirectTo, { replace: true })
    }
    
    // Default redirect to home
    console.log('🔄 Redirecting to home page')
    return navigateTo('/', { replace: true })
  }
  
  console.log('✅ Guest access allowed')
})
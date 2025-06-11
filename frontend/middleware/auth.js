export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  console.log('🔒 Auth middleware - checking authentication for:', to.path)
  console.log('👤 User authenticated:', authStore.isAuthenticated)
  
  // If not authenticated, redirect to login
  if (!authStore.isAuthenticated) {
    console.log('❌ Not authenticated, storing redirect and going to login')
    
    // Store where user wanted to go (only if it's not login/register)
    if (!to.path.includes('/login') && !to.path.includes('/register')) {
      authStore.setRedirectTo(to.fullPath)
    }
    
    // Add redirect query parameter for better UX
    const redirectQuery = to.fullPath !== '/login' ? { redirect: to.fullPath } : {}
    
    return navigateTo({
      path: '/login',
      query: redirectQuery
    })
  }
  
  console.log('✅ Authentication check passed')
})
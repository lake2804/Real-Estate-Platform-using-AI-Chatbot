export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  console.log('👑 Admin middleware - checking for:', to.path)
  
  // First check authentication
  if (!authStore.isAuthenticated) {
    console.log('❌ Not authenticated')
    authStore.setRedirectTo(to.fullPath)
    return navigateTo('/login')
  }
  
  // Then check admin role
  if (!authStore.isAdmin) {
    console.log('❌ Not admin, redirecting to home')
    throw createError({
      statusCode: 403,
      statusMessage: 'Access Denied - Admin role required'
    })
  }
  
  console.log('✅ Admin access granted')
})
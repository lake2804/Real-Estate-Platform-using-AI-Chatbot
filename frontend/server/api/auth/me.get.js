export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, 'token') || getHeader(event, 'authorization')?.replace('Bearer ', '')
    
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token không tồn tại'
      })
    }

    // Get backend URL
    const config = useRuntimeConfig()
    const backendUrl = config.public.backendUrl || 'http://localhost:4000'
    
    // Call Express backend
    const response = await $fetch(`${backendUrl}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    return response

  } catch (error) {
    console.error('❌ Nuxt Auth Me Error:', error)
    
    throw createError({
      statusCode: error.status || 401,
      statusMessage: error.data?.message || error.message || 'Token không hợp lệ'
    })
  }
})
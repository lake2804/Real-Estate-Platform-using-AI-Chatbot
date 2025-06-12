export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    console.log('🔐 Nuxt Auth - Login request:', { email: body.email })

    // Validate input
    if (!body.email || !body.password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email và mật khẩu là bắt buộc'
      })
    }

    // Get backend URL
    const config = useRuntimeConfig()
    const backendUrl = config.public.backendUrl || 'http://localhost:4000'
    
    console.log('📡 Calling backend:', `${backendUrl}/api/auth/login`)

    // Call Express backend
    const response = await $fetch(`${backendUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        email: body.email,
        password: body.password
      }
    })

    console.log('✅ Backend login response:', { 
      success: response.success, 
      hasToken: !!response.data?.token,
      user: response.data?.user?.email
    })

    return response

  } catch (error) {
    console.error('❌ Nuxt Auth Login Error:', error)
    
    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.data?.message || error.message || 'Lỗi đăng nhập'
    })
  }
})
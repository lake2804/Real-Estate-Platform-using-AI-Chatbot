export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    console.log('📝 Nuxt Auth - Register request:', { email: body.email, role: body.role })

    // Validate input
    if (!body.email || !body.password || !body.fullName) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thông tin đầy đủ là bắt buộc'
      })
    }

    // Get backend URL
    const config = useRuntimeConfig()
    const backendUrl = config.public.backendUrl || 'http://localhost:4000'
    
    console.log('📡 Calling backend:', `${backendUrl}/api/auth/register`)

    // Call Express backend
    const response = await $fetch(`${backendUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        fullName: body.fullName,
        email: body.email,
        password: body.password,
        phone: body.phone || '',
        role: body.role || 'user'
      }
    })

    console.log('✅ Backend register response:', { 
      success: response.success, 
      hasToken: !!response.data?.token,
      user: response.data?.user?.email
    })

    return response

  } catch (error) {
    console.error('❌ Nuxt Auth Register Error:', error)
    
    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.data?.message || error.message || 'Lỗi đăng ký'
    })
  }
})
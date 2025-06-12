export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    console.log('🤖 Nuxt API - Received request:', {
      message: body.message?.substring(0, 50) + '...',
      conversationId: body.conversationId
    })

    // Validate input
    if (!body.message || typeof body.message !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Message is required'
      })
    }

    // Get backend URL from runtime config
    const config = useRuntimeConfig()
    const backendUrl = config.public.backendUrl || 'http://localhost:4000'
    
    console.log('📡 Calling backend:', `${backendUrl}/api/chatbot/chat`)

    // Call Express backend
    const response = await $fetch(`${backendUrl}/api/chatbot/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        message: body.message,
        conversationId: body.conversationId,
        userId: body.userId || 'nuxt-user'
      }
    })

    console.log('✅ Backend response received:', {
      success: response.success,
      hasMessage: !!response.data?.message,
      confidence: response.data?.confidence
    })

    return response

  } catch (error) {
    console.error('❌ Nuxt API Error:', error)
    
    // Return structured error response
    return {
      success: false,
      error: true,
      message: 'Xin lỗi, tôi đang gặp vấn đề kỹ thuật. Vui lòng thử lại sau.',
      details: error.message
    }
  }
})
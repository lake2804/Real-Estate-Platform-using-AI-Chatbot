const express = require('express')
const axios = require('axios')
const router = express.Router()

console.log('🤖 Loading chatbot routes...')

// Python RAG API configuration
const RAG_API_URL = process.env.RAG_API_URL || 'http://localhost:8001'
const RAG_TIMEOUT = 30000 // 30 seconds

// Chat with RAG bot
router.post('/chat', async (req, res) => {
  try {
    console.log('🤖 Chatbot request received:', {
      message: req.body.message ? req.body.message.substring(0, 50) + '...' : 'No message',
      conversationId: req.body.conversationId,
      userId: req.body.userId || 'anonymous'
    })

    const { message, conversationId, userId } = req.body

    // Validate input
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập nội dung tin nhắn',
        data: null
      })
    }

    // Generate conversation ID if not provided
    const finalConversationId = conversationId || generateConversationId()

    // Prepare request data for Python API
    const ragRequest = {
      query: message.trim(),  // Python API expects 'query' field
      message: message.trim(), // Also send as 'message' for compatibility
      conversation_id: finalConversationId,
      user_id: userId || 'frontend-user',
      context: {
        domain: 'real-estate',
        language: 'vi'
      }
    }

    console.log('📡 Calling Python RAG API at:', `${RAG_API_URL}/chat`)
    console.log('📤 Request data:', {
      query: ragRequest.query.substring(0, 50) + '...',
      conversation_id: ragRequest.conversation_id,
      user_id: ragRequest.user_id
    })

    // Call Python RAG API
    const ragResponse = await axios.post(`${RAG_API_URL}/chat`, ragRequest, {
      timeout: RAG_TIMEOUT,
      headers: {
        'Content-Type': 'application/json'
      },
      validateStatus: function (status) {
        return status < 500 // Accept any status code less than 500
      }
    })

    console.log('✅ RAG API Response:', {
      status: ragResponse.status,
      success: ragResponse.data?.success,
      hasResponse: !!ragResponse.data?.data?.response,
      confidence: ragResponse.data?.data?.confidence
    })

    // ADD THIS DEBUG LOG - Log full response content
    console.log('📋 Full RAG Response Data:', {
      response: ragResponse.data?.data?.response ? 
        ragResponse.data.data.response.substring(0, 200) + '...' : 'NO RESPONSE',
      category: ragResponse.data?.data?.category,
      sources: ragResponse.data?.data?.sources?.length || 0
    })

    // Check if RAG API returned success
    if (ragResponse.data?.success && ragResponse.data?.data?.response) {
      const responseData = ragResponse.data.data
      
      // ADD THIS DEBUG LOG - Log what we're sending to frontend
      console.log('🚀 Sending to frontend:', {
        success: true,
        response_length: responseData.response?.length || 0,
        confidence: responseData.confidence,
        conversationId: responseData.conversationId || finalConversationId
      })
      
      return res.json({
        success: true,
        message: 'Phản hồi thành công',
        data: {
          response: responseData.response,
          confidence: responseData.confidence || 0.8,
          sources: responseData.sources || [],
          conversationId: responseData.conversationId || finalConversationId,
          timestamp: responseData.timestamp || new Date().toISOString(),
          category: responseData.category || 'general',
          processingTime: 0.5
        }
      })
    } else {
      // RAG API failed or returned error
      console.warn('⚠️ RAG API returned error:', ragResponse.data)
      
      return res.json({
        success: true, // Still return success to frontend
        message: 'Phản hồi từ hệ thống dự phòng',
        data: {
          response: getFallbackResponse(message),
          confidence: 0.6,
          sources: ['Fallback System'],
          conversationId: finalConversationId,
          timestamp: new Date().toISOString(),
          category: 'fallback',
          processingTime: 0.1
        }
      })
    }

  } catch (error) {
    console.error('❌ Chatbot API Error Details:')
    console.error('- Error message:', error.message)
    console.error('- Error code:', error.code)
    console.error('- Response status:', error.response?.status)
    console.error('- Response data:', error.response?.data)

    // Get conversationId safely
    const fallbackConversationId = req.body.conversationId || generateConversationId()

    // Return fallback response on error
    return res.json({
      success: true,
      message: 'Phản hồi từ hệ thống dự phòng',
      data: {
        response: getFallbackResponse(req.body.message),
        confidence: 0.5,
        sources: ['Emergency Fallback'],
        conversationId: fallbackConversationId,
        timestamp: new Date().toISOString(),
        category: 'error_fallback',
        processingTime: 0.05,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      }
    })
  }
})

// Health check for RAG API
router.get('/health', async (req, res) => {
  try {
    const ragResponse = await axios.get(`${RAG_API_URL}/health`, { timeout: 5000 })
    
    res.json({
      success: true,
      data: {
        chatbot_status: 'healthy',
        rag_api_status: ragResponse.data?.status || 'unknown',
        rag_api_url: RAG_API_URL,
        response_time: Date.now()
      }
    })
  } catch (error) {
    res.json({
      success: false,
      data: {
        chatbot_status: 'degraded',
        rag_api_status: 'unreachable',
        rag_api_url: RAG_API_URL,
        error: error.message
      }
    })
  }
})

// Utility functions
function getFallbackResponse(message) {
  const messageLC = message?.toLowerCase() || ''
  
  if (messageLC.includes('xin chào') || messageLC.includes('hello') || messageLC.includes('hi')) {
    return `👋 **Xin chào! Tôi là AI Assistant bất động sản.**

🏠 **Tôi có thể hỗ trợ bạn:**
• Tìm kiếm căn hộ, nhà đất
• Tư vấn giá cả thị trường  
• Thông tin dự án mới
• Hướng dẫn thủ tục pháp lý

*Bạn cần tư vấn gì về bất động sản?*`
  }
  
  if (messageLC.includes('giá') || messageLC.includes('price') || messageLC.includes('tư vấn')) {
    return `💰 **Giá bất động sản TP.HCM hiện tại:**

🏢 **Căn hộ chung cư:**
• Trung tâm (Q1,Q3): 80-150 triệu/m²
• Khu Đông (Q2,Q9): 35-65 triệu/m²  
• Khu Nam (Q7): 50-90 triệu/m²

📈 **Xu hướng 2024:** Tăng nhẹ 5-8%/năm
🔥 **Khu vực hot:** Q2, Q9, Thủ Đức

*Bạn quan tâm khu vực nào cụ thể?*`
  }
  
  return `🤖 **Xin lỗi, hệ thống AI chính đang bảo trì.**

📞 **Liên hệ trực tiếp:**
• **Hotline:** 1900 1000
• **Email:** support@realestate.com  
• **Zalo:** 0901234567

🏠 **Hoặc duyệt tin đăng trên website để tìm bất động sản phù hợp.**

*Cảm ơn bạn đã sử dụng dịch vụ!*`
}

function generateConversationId() {
  return 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

console.log('✅ Chatbot routes configured')

module.exports = router
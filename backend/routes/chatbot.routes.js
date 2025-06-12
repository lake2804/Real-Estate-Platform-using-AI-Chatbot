const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbot.controller');

console.log('🛣️ Loading OpenAI-only chatbot routes (no fallback)...');

// POST /api/chatbot/chat - Main chat endpoint (OpenAI only)
router.post('/chat', chatbotController.chat);

// GET /api/chatbot/health - Comprehensive health check
router.get('/health', chatbotController.health);

// GET /api/chatbot/conversation/:conversation_id - Get conversation history
router.get('/conversation/:conversation_id', chatbotController.getConversation);

// DELETE /api/chatbot/conversation - Clear specific conversation
router.delete('/conversation', chatbotController.clearConversation);

// GET /api/chatbot/stats - Get detailed statistics
router.get('/stats', chatbotController.getStats);

// GET /api/chatbot/test - Test endpoint with OpenAI verification
router.get('/test', async (req, res) => {
  try {
    const openaiService = require('../services/openai.service');
    
    const testData = {
      service_type: 'OpenAI Only (No Fallback)',
      openai_configured: !!process.env.OPENAI_API_KEY,
      openai_healthy: openaiService.isHealthy(),
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      test_queries: [
        'Xin chào, tôi muốn tư vấn bất động sản',
        'Giá căn hộ 2PN ở Quận 7 bao nhiêu?',
        'Tư vấn đầu tư 3 tỷ đồng',
        'Thủ tục mua nhà cần giấy tờ gì?',
        'Dự án Vinhomes nào đang hot?'
      ],
      sample_request: {
        url: '/api/chatbot/chat',
        method: 'POST',
        body: {
          message: 'Tôi muốn tư vấn về bất động sản',
          conversation_id: 'test_conv_123',
          user_id: 'test_user'
        }
      },
      timestamp: new Date().toISOString()
    };

    // Test OpenAI if healthy
    if (openaiService.isHealthy()) {
      try {
        const testResult = await openaiService.generateResponse('Test connection', []);
        testData.connection_test = {
          status: 'success',
          response_length: testResult.response.length,
          tokens_used: testResult.tokensUsed
        };
      } catch (testError) {
        testData.connection_test = {
          status: 'failed',
          error: testError.message
        };
      }
    } else {
      testData.connection_test = {
        status: 'service_not_healthy',
        error: openaiService.getLastError()
      };
    }

    res.json({
      success: true,
      message: 'OpenAI-only chatbot test endpoint',
      data: testData
    });
  } catch (error) {
    console.error('❌ Test endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Test endpoint failed',
      error: error.message
    });
  }
});

console.log('✅ OpenAI-only chatbot routes loaded (no fallback system)');

module.exports = router;
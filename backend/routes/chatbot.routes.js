const express = require('express');
const axios = require('axios');
const router = express.Router();

// Python RAG API endpoint
const PYTHON_RAG_API = process.env.PYTHON_RAG_API || 'http://localhost:8001';

// Chat with RAG bot
router.post('/chat', async (req, res) => {
  try {
    const { message, conversationId, userId } = req.body;
    
    console.log('🤖 Chatbot request received:', { 
      message: message?.substring(0, 50) + '...', 
      conversationId, 
      userId 
    });

    // Validate input
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required and must be a non-empty string'
      });
    }
    
    // Call Python RAG API
    console.log('📡 Calling Python RAG API at:', `${PYTHON_RAG_API}/chat`);
    
    const response = await axios.post(`${PYTHON_RAG_API}/chat`, {
      query: message.trim(),
      conversation_id: conversationId,
      user_id: userId,
      context: {
        domain: 'real-estate',
        language: 'vi'
      }
    }, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Python RAG API response received:', {
      status: response.status,
      hasData: !!response.data,
      answerLength: response.data.answer?.length || 0
    });
    
    const botResponse = response.data;
    
    res.json({
      success: true,
      data: {
        message: botResponse.answer || botResponse.response || 'Xin lỗi, tôi không thể trả lời câu hỏi này.',
        confidence: botResponse.confidence || 0.5,
        sources: botResponse.sources || [],
        conversationId: botResponse.conversation_id || conversationId,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Chatbot API Error Details:');
    console.error('- Error message:', error.message);
    console.error('- Error code:', error.code);
    console.error('- Response status:', error.response?.status);
    console.error('- Response data:', error.response?.data);
    console.error('- Full error:', error);
    
    // Check if Python service is down
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      console.error('🔥 Python RAG service appears to be down!');
      return res.json({
        success: true,
        data: {
          message: "Dịch vụ AI tạm thời không khả dụng. Vui lòng liên hệ hotline 1900 1000 để được hỗ trợ trực tiếp bởi chuyên viên tư vấn.",
          confidence: 0.0,
          sources: [],
          conversationId: conversationId,
          timestamp: new Date().toISOString(),
          fallback: true,
          error: 'Service unavailable'
        }
      });
    }
    
    // Fallback response for other errors
    res.json({
      success: true,
      data: {
        message: "Xin lỗi, tôi đang gặp vấn đề kỹ thuật. Vui lòng thử lại sau hoặc liên hệ với chúng tôi qua hotline 1900 1000.",
        confidence: 0.5,
        sources: [],
        conversationId: conversationId,
        timestamp: new Date().toISOString(),
        fallback: true,
        error: error.message
      }
    });
  }
});

// Test endpoint to check Python service
router.get('/test-python', async (req, res) => {
  try {
    console.log('🧪 Testing Python RAG service...');
    
    const response = await axios.get(`${PYTHON_RAG_API}/health`, {
      timeout: 5000
    });
    
    console.log('✅ Python service is healthy:', response.data);
    
    res.json({
      success: true,
      message: 'Python RAG service is running',
      data: response.data
    });
    
  } catch (error) {
    console.error('❌ Python service test failed:', error.message);
    
    res.json({
      success: false,
      message: 'Python RAG service is not accessible',
      error: error.message,
      pythonUrl: PYTHON_RAG_API
    });
  }
});

// Get conversation history
router.get('/history/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    const response = await axios.get(`${PYTHON_RAG_API}/history/${conversationId}`);
    
    res.json({
      success: true,
      data: response.data
    });
    
  } catch (error) {
    console.error('❌ History API Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Không thể tải lịch sử chat'
    });
  }
});

// Clear conversation
router.delete('/clear/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    await axios.delete(`${PYTHON_RAG_API}/clear/${conversationId}`);
    
    res.json({
      success: true,
      message: 'Đã xóa lịch sử chat'
    });
    
  } catch (error) {
    console.error('❌ Clear API Error:', error.message);
    res.json({
      success: true,
      message: 'Đã xóa lịch sử chat'
    });
  }
});

module.exports = router;
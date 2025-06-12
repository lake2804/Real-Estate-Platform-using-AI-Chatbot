const openaiService = require('../services/openai.service');
const ragService = require('../services/rag.service');

console.log('🤖 Loading enhanced chatbot controller with OpenAI + RAG...');

// In-memory conversation storage
const conversations = new Map();

const chat = async (req, res) => {
  try {
    console.log('💬 Chat request received (OpenAI + RAG):', {
      body: req.body,
      hasMessage: !!req.body.message,
      hasQuery: !!req.body.query
    });

    const { message, query, conversation_id, user_id } = req.body;
    const userMessage = query || message;

    if (!userMessage?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Tin nhắn không được để trống',
        data: {
          response: '❓ Vui lòng nhập câu hỏi để tôi có thể tư vấn bất động sản dựa trên pháp luật hiện hành.',
          confidence: 0.0,
          sources: ['Validation Error'],
          conversationId: conversation_id || `conv_${Date.now()}`,
          timestamp: new Date().toISOString(),
          category: 'input_validation',
          provider: 'System'
        }
      });
    }

    const conversationId = conversation_id || `conv_${user_id || 'anonymous'}_${Date.now()}`;
    const conversationHistory = conversations.get(conversationId) || [];
    
    console.log('🔍 Processing with OpenAI + RAG:', {
      message: userMessage.substring(0, 50) + '...',
      conversationId,
      historyLength: conversationHistory.length,
      openaiHealth: openaiService.isHealthy(),
      ragHealth: ragService.isHealthy()
    });

    // Check OpenAI service
    if (!openaiService.isHealthy()) {
      console.error('❌ OpenAI service not available');
      return res.status(503).json({
        success: false,
        message: 'Dịch vụ AI không khả dụng',
        data: {
          response: '🔧 Hệ thống AI hiện không khả dụng. Vui lòng kiểm tra cấu hình OpenAI API key và thử lại.',
          confidence: 0.0,
          sources: ['System Error'],
          conversationId,
          timestamp: new Date().toISOString(),
          category: 'service_unavailable',
          provider: 'OpenAI + RAG'
        }
      });
    }

    // Generate response using OpenAI + RAG
    const startTime = Date.now();
    let result;
    
    try {
      result = await openaiService.generateResponse(userMessage, conversationHistory);
    } catch (openaiError) {
      console.error('❌ OpenAI + RAG call failed:', openaiError.message);
      
      return res.status(500).json({
        success: false,
        message: 'Lỗi OpenAI + RAG API',
        data: {
          response: '🤖 Không thể kết nối với hệ thống AI. Vui lòng kiểm tra cấu hình và thử lại sau.',
          confidence: 0.0,
          sources: ['OpenAI + RAG Error'],
          conversationId,
          timestamp: new Date().toISOString(),
          category: 'api_error',
          provider: 'OpenAI + RAG',
          error: process.env.NODE_ENV === 'development' ? openaiError.message : 'API error'
        }
      });
    }

    const processingTime = (Date.now() - startTime) / 1000;

    if (!result || !result.response) {
      console.error('❌ Invalid response from OpenAI + RAG');
      return res.status(500).json({
        success: false,
        message: 'Phản hồi không hợp lệ',
        data: {
          response: '🔧 Nhận được phản hồi không hợp lệ từ hệ thống AI. Vui lòng thử lại.',
          confidence: 0.0,
          sources: ['Response Error'],
          conversationId,
          timestamp: new Date().toISOString(),
          category: 'invalid_response',
          provider: 'OpenAI + RAG'
        }
      });
    }

    console.log('✅ OpenAI + RAG response generated:', {
      responseLength: result.response.length,
      tokensUsed: result.tokensUsed,
      processingTime: `${processingTime}s`,
      model: result.model,
      ragDocsFound: result.rag_docs_found,
      confidence: result.confidence
    });

    // Update conversation history
    const updatedHistory = [
      ...conversationHistory,
      { role: 'user', content: userMessage },
      { role: 'assistant', content: result.response }
    ];

    if (updatedHistory.length > 20) {
      updatedHistory.splice(0, updatedHistory.length - 20);
    }

    conversations.set(conversationId, updatedHistory);

    // Return successful response
    return res.json({
      success: true,
      message: 'Tư vấn thành công với OpenAI + RAG',
      data: {
        response: result.response,
        confidence: result.confidence,
        sources: result.sources,
        conversationId,
        timestamp: new Date().toISOString(),
        category: 'openai_rag_success',
        processingTime,
        tokensUsed: result.tokensUsed,
        model: result.model,
        provider: result.provider,
        rag_documents_found: result.rag_docs_found,
        legal_context_used: result.rag_docs_found > 0
      }
    });

  } catch (error) {
    console.error('❌ Unexpected chatbot error:', error);

    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống không mong muốn',
      data: {
        response: '💥 Đã xảy ra lỗi không mong muốn. Vui lòng thử lại hoặc liên hệ hỗ trợ kỹ thuật.',
        confidence: 0.0,
        sources: ['System Error'],
        conversationId: req.body.conversation_id || `conv_error_${Date.now()}`,
        timestamp: new Date().toISOString(),
        category: 'unexpected_error',
        provider: 'OpenAI + RAG',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Unexpected system error'
      }
    });
  }
};

// Enhanced health check
const health = async (req, res) => {
  try {
    const openaiStatus = openaiService.isHealthy();
    const ragStatus = ragService.isHealthy();
    const conversationCount = conversations.size;
    const ragStats = ragService.getStats();

    const overallHealth = openaiStatus && ragStatus;

    const response = {
      success: overallHealth,
      data: {
        status: overallHealth ? 'healthy' : 'degraded',
        service_type: 'OpenAI + RAG Enhanced',
        openai_service: {
          healthy: openaiStatus,
          model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
          api_key_configured: !!process.env.OPENAI_API_KEY
        },
        rag_service: {
          healthy: ragStatus,
          ...ragStats
        },
        conversations: {
          active: conversationCount,
          total_messages: Array.from(conversations.values())
            .reduce((sum, history) => sum + history.length, 0)
        },
        timestamp: new Date().toISOString()
      }
    };

    res.status(overallHealth ? 200 : 503).json(response);

  } catch (error) {
    console.error('❌ Health check error:', error);
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message
    });
  }
};

// Get conversation history
const getConversation = async (req, res) => {
  try {
    const { conversation_id } = req.params;
    const history = conversations.get(conversation_id) || [];
    
    res.json({
      success: true,
      data: {
        conversation_id,
        message_count: history.length,
        messages: history,
        provider: 'OpenAI + RAG',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve conversation',
      error: error.message
    });
  }
};

// Clear conversation
const clearConversation = async (req, res) => {
  try {
    const { conversation_id } = req.body;
    const existed = conversations.has(conversation_id);
    conversations.delete(conversation_id);
    
    res.json({
      success: true,
      message: existed ? 'Conversation cleared' : 'Conversation not found',
      data: { conversation_id, existed, timestamp: new Date().toISOString() }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to clear conversation',
      error: error.message
    });
  }
};

// Get statistics
const getStats = async (req, res) => {
  try {
    const ragStats = ragService.getStats();
    const totalConversations = conversations.size;
    const allHistories = Array.from(conversations.values());
    const totalMessages = allHistories.reduce((sum, history) => sum + history.length, 0);

    res.json({
      success: true,
      data: {
        service_info: {
          type: 'OpenAI + RAG Enhanced',
          provider: 'OpenAI + FAISS',
          model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo'
        },
        rag_service: ragStats,
        conversations: {
          total: totalConversations,
          total_messages: totalMessages,
          average_per_conversation: totalConversations > 0 ? Math.round(totalMessages / totalConversations) : 0
        },
        performance: {
          openai_healthy: openaiService.isHealthy(),
          rag_healthy: ragService.isHealthy(),
          uptime: process.uptime()
        },
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve statistics',
      error: error.message
    });
  }
};

console.log('✅ Enhanced chatbot controller with OpenAI + RAG loaded');

module.exports = {
  chat,
  health,
  getConversation,
  clearConversation,
  getStats
};
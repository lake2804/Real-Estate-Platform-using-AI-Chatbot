const { OpenAI } = require('openai');
const ragService = require('./rag.service');

class OpenAIService {
  constructor() {
    this.client = null;
    this.isInitialized = false;
    this.lastError = null;
    this.quotaExceeded = false;
    this.init();
  }

  async init() {
    try {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY not found in environment variables');
      }

      this.client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
      
      await this.client.models.list();
      
      this.isInitialized = true;
      this.lastError = null;
      this.quotaExceeded = false;
      console.log('✅ OpenAI Service with optimized RAG initialized successfully');
      
    } catch (error) {
      console.error('❌ OpenAI Service initialization failed:', error.message);
      this.isInitialized = false;
      this.lastError = error.message;
      this.client = null;
    }
  }

  async generateResponse(userMessage, conversationHistory = []) {
    if (!this.isInitialized || !this.client) {
      throw new Error(`OpenAI service not initialized: ${this.lastError || 'Unknown error'}`);
    }

    try {
      console.log('🔍 Searching for relevant legal documents...');
      const relevantDocs = await ragService.searchRelevantDocs(userMessage, 2); // ✅ Giảm xuống 2
      
      let ragContext = '';
      let sources = ['OpenAI GPT-3.5', 'Luật Đất đai 2024'];
      
      if (relevantDocs && relevantDocs.length > 0) {
        console.log(`📚 Found ${relevantDocs.length} relevant legal documents`);
        const ragData = await ragService.generateRAGResponse(userMessage, relevantDocs);
        if (ragData && ragData.context) {
          ragContext = ragData.context;
          sources = [...sources, ...ragData.sources];
        }
      }

      // ✅ Optimized system prompt - shorter but effective
      const systemPrompt = `Bạn là AI Tư Vấn Bất Động Sản chuyên nghiệp tại Việt Nam, chuyên về Luật Đất đai 2024.

🎯 VAI TRÒ: Chuyên gia tư vấn dựa trên Luật Đất đai 2024 (có hiệu lực từ 01/01/2025)

${ragContext ? `📋 THÔNG TIN PHÁP LÝ LIÊN QUAN:
${ragContext}

Hãy ưu tiên sử dụng thông tin pháp lý trên để trả lời.` : ''}

💡 NGUYÊN TẮC:
- Trả lời chính xác theo Luật Đất đai 2024
- Trích dẫn điều luật cụ thể khi có
- Sử dụng emoji để dễ đọc
- Giữ câu trả lời súc tích nhưng đầy đủ`;

      const messages = [
        { role: "system", content: systemPrompt }
      ];

      // ✅ Giới hạn conversation history để tiết kiệm token
      const recentHistory = conversationHistory.slice(-8); // Chỉ lấy 8 tin nhắn gần nhất
      messages.push(...recentHistory);
      messages.push({ role: "user", content: userMessage });

      console.log('📡 Calling OpenAI API with optimized context...');
      console.log(`📊 Token estimation: ~${this.estimateTokens(messages)} tokens`);

      const response = await this.client.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 1000, // ✅ Giảm từ 1500 xuống 1000
        temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.3,
      });

      if (!response?.choices?.[0]?.message?.content) {
        throw new Error('Invalid response structure from OpenAI');
      }

      const aiResponse = response.choices[0].message.content;
      const tokensUsed = response.usage?.total_tokens || 0;

      console.log(`✅ OpenAI response generated (${tokensUsed} tokens used)`);

      return {
        response: aiResponse,
        confidence: relevantDocs.length > 0 ? 0.95 : 0.85,
        sources: [...new Set(sources)],
        tokensUsed,
        model: response.model || process.env.OPENAI_MODEL,
        provider: 'OpenAI + RAG (Optimized)',
        rag_docs_found: relevantDocs.length,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ OpenAI + RAG API call failed:', error);
      
      if (error.code === 'context_length_exceeded') {
        throw new Error('Context length exceeded. Please try with a shorter question.');
      } else if (error.code === 'insufficient_quota') {
        this.quotaExceeded = true;
        throw new Error('OpenAI quota exceeded. Please check your billing.');
      } else if (error.code === 'invalid_api_key') {
        throw new Error('Invalid OpenAI API key. Please check configuration.');
      } else {
        throw new Error(`OpenAI + RAG error: ${error.message}`);
      }
    }
  }

  // ✅ Hàm ước tính token (rough estimation)
  estimateTokens(messages) {
    return messages.reduce((total, msg) => {
      return total + Math.ceil(msg.content.length / 4); // Rough: 4 chars = 1 token
    }, 0);
  }

  isHealthy() {
    return this.isInitialized && this.client !== null;
  }

  getLastError() {
    return this.lastError;
  }

  async reinitialize() {
    console.log('🔄 Reinitializing OpenAI + RAG service...');
    await this.init();
    return this.isInitialized;
  }
}

module.exports = new OpenAIService();
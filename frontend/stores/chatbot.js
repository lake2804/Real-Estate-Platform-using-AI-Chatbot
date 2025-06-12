import { defineStore } from 'pinia'

export const useChatbotStore = defineStore('chatbot', {
  state: () => ({
    isOpen: false,
    messages: [],
    isLoading: false,
    conversationId: null,
    isInitialized: false,
    isConnected: true // ✅ Add connection status
  }),

  actions: {
    // Initialize chatbot
    async initChatbot() {
      if (this.isInitialized) return
      
      console.log('🤖 Initializing chatbot...')
      
      // Add welcome message if no messages exist
      if (this.messages.length === 0) {
        this.messages.push({
          id: Date.now(),
          text: `👋 **Xin chào! Tôi là AI Assistant chuyên về bất động sản.**

🎯 **Tôi có thể giúp bạn:**
🏠 Tìm kiếm căn hộ, nhà đất phù hợp
💰 Tư vấn giá cả và xu hướng thị trường
🏗️ Thông tin các dự án mới nhất
📋 Hướng dẫn thủ tục mua bán
📈 Phân tích cơ hội đầu tư

💬 **Bạn quan tâm về điều gì? Hãy hỏi tôi nhé!**`,
          isUser: false,
          from: 'bot', // ✅ Add for compatibility
          timestamp: new Date(),
          isWelcome: true
        })
      }
      
      this.isInitialized = true
      console.log('✅ Chatbot initialized')
    },

    async sendMessage(message) {
      try {
        console.log('🤖 Sending message:', message)
        this.isLoading = true
        
        // Add user message
        this.messages.push({
          id: Date.now(),
          text: message,
          isUser: true,
          from: 'user', // ✅ Add for compatibility
          timestamp: new Date()
        })

        console.log('📡 Calling backend API...')
        
        // Get runtime config
        const config = useRuntimeConfig()
        const apiBase = config.public.apiBase || 'http://localhost:4000/api'
        
        // Call backend API directly
        const response = await fetch(`${apiBase}/chatbot/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: message,
            conversationId: this.conversationId || null,
            userId: 'frontend-user'
          })
        })

        console.log('📡 Response status:', response.status)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        console.log('✅ Backend Response:', data)

        if (data.success && data.data) {
          // Add bot response
          this.messages.push({
            id: Date.now() + 1,
            text: data.data.message,
            isUser: false,
            from: 'bot', // ✅ Add for compatibility
            timestamp: new Date(),
            confidence: data.data.confidence,
            sources: data.data.sources || []
          })
          
          this.conversationId = data.data.conversationId
          this.isConnected = true
        } else {
          throw new Error(data.message || 'Invalid response from backend')
        }
        
      } catch (error) {
        console.error('❌ Chatbot error:', error)
        this.isConnected = false
        
        // Add error message
        this.messages.push({
          id: Date.now() + 1,
          text: 'Xin lỗi, tôi đang gặp vấn đề kỹ thuật. Vui lòng thử lại sau hoặc liên hệ hotline 1900 1000 để được hỗ trợ trực tiếp.',
          isUser: false,
          from: 'bot',
          timestamp: new Date(),
          error: true
        })
      } finally {
        this.isLoading = false
      }
    },

    toggleChatbot() {
      this.isOpen = !this.isOpen
      if (this.isOpen && !this.isInitialized) {
        this.initChatbot()
      }
    },

    closeChatbot() {
      this.isOpen = false
    },

    clearMessages() {
      this.messages = []
      this.conversationId = null
      this.isInitialized = false
    },

    // ✅ Add methods for compatibility with layout
    async handleQuickReply(buttonText) {
      await this.sendMessage(buttonText)
    },

    async loadHistory() {
      console.log('📜 Loading chat history...')
      // Implement if needed
    },

    async clearConversation() {
      this.clearMessages()
      await this.initChatbot()
    }
  }
})
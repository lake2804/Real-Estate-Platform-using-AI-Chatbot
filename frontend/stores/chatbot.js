import { defineStore } from 'pinia'

export const useChatbotStore = defineStore('chatbot', {
  state: () => ({
    isOpen: false,
    isLoading: false,
    messages: [],
    conversationId: null,
    error: null
  }),

  actions: {
    // Initialize chatbot - if this was being called
    initChatbot() {
      console.log('🤖 Chatbot initialized')
      this.clearMessages()
      this.error = null
    },

    toggleChatbot() {
      this.isOpen = !this.isOpen
      console.log('🤖 Chatbot toggled:', this.isOpen)
      
      // Add welcome message when opening
      if (this.isOpen) {
        this.addWelcomeMessage()
      }
    },

    closeChatbot() {
      this.isOpen = false
      console.log('🤖 Chatbot closed')
    },

    openChatbot() {
      this.isOpen = true
      console.log('🤖 Chatbot opened')
      this.addWelcomeMessage()
    },

    async sendMessage(message) {
      if (!message?.trim()) {
        console.warn('⚠️ Empty message, skipping')
        return
      }

      console.log('🤖 Sending message:', message)
      
      // Add user message immediately
      const userMessage = {
        id: Date.now(),
        text: message,
        isUser: true,
        timestamp: new Date().toISOString(),
        error: false
      }
      
      this.messages.push(userMessage)
      this.isLoading = true
      this.error = null

      try {
        console.log('📡 Calling backend API...')
        
        // Call Nuxt API (which calls Express backend)
        const response = await $fetch('/api/chatbot/chat', {
          method: 'POST',
          body: {
            message: message.trim(),
            conversationId: this.conversationId,
            userId: 'frontend-user'
          }
        })

        console.log('📡 Response status: 200')
        console.log('✅ Backend Response:', response)

        // DEBUG: Log response structure
        console.log('🔍 Response structure:', {
          hasSuccess: !!response?.success,
          hasData: !!response?.data,
          hasResponse: !!response?.data?.response,
          responseType: typeof response?.data?.response,
          responseLength: response?.data?.response?.length || 0
        })

        // Check if response is successful and has content
        if (response?.success && response?.data?.response) {
          const responseData = response.data
          
          // Update conversation ID
          if (responseData.conversationId) {
            this.conversationId = responseData.conversationId
            console.log('🔗 Updated conversationId:', this.conversationId)
          }

          // Add bot response
          const botMessage = {
            id: Date.now() + 1,
            text: responseData.response,
            isUser: false,
            timestamp: responseData.timestamp || new Date().toISOString(),
            confidence: responseData.confidence,
            sources: responseData.sources || [],
            category: responseData.category,
            error: false
          }
          
          this.messages.push(botMessage)
          console.log('✅ Bot message added:', {
            id: botMessage.id,
            textLength: botMessage.text.length,
            confidence: botMessage.confidence,
            preview: botMessage.text.substring(0, 100) + '...'
          })
          
        } else {
          // Handle unsuccessful response or missing data
          console.warn('⚠️ Backend returned unsuccessful response or missing data:', response)
          
          const errorMessage = {
            id: Date.now() + 1,
            text: response?.data?.response || response?.message || 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.',
            isUser: false,
            timestamp: new Date().toISOString(),
            error: true
          }
          
          this.messages.push(errorMessage)
        }

      } catch (error) {
        console.error('❌ Chatbot error:', error)
        
        // Add error message
        const errorMessage = {
          id: Date.now() + 1,
          text: 'Xin lỗi, không thể kết nối đến hệ thống. Vui lòng thử lại sau.',
          isUser: false,
          timestamp: new Date().toISOString(),
          error: true
        }
        
        this.messages.push(errorMessage)
        this.error = error.message || 'Unknown error'
        
      } finally {
        this.isLoading = false
        console.log('🔄 Loading finished, total messages:', this.messages.length)
        console.log('💬 All messages:', this.messages.map(m => ({
          id: m.id,
          isUser: m.isUser,
          preview: m.text.substring(0, 50) + '...'
        })))
      }
    },

    clearMessages() {
      this.messages = []
      this.conversationId = null
      console.log('🗑️ Messages cleared')
    },

    addWelcomeMessage() {
      if (this.messages.length === 0) {
        const welcomeMessage = {
          id: Date.now(),
          text: `👋 **Xin chào! Tôi là AI Assistant chuyên về bất động sản.**

🎯 **Tôi có thể giúp bạn:**
• Tìm kiếm căn hộ, nhà đất phù hợp
• Tư vấn giá cả và xu hướng thị trường
• Thông tin các dự án mới nhất
• Hướng dẫn thủ tục mua bán

💬 **Hãy hỏi tôi bất cứ điều gì về bất động sản!**`,
          isUser: false,
          timestamp: new Date().toISOString(),
          confidence: 1.0,
          error: false
        }
        
        this.messages.push(welcomeMessage)
        console.log('👋 Welcome message added')
      }
    }
  }
})
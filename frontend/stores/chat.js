import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const useChatStore = defineStore('chat', {
  state: () => ({
    conversations: [],
    messages: {},
    activeConversation: null,
    isConnected: false,
    isLoading: false
  }),

  actions: {
    async initChat() {
      console.log('🔧 Initializing chat system...')
      
      const authStore = useAuthStore()
      if (!authStore.currentUser || !authStore.token) {
        throw new Error('User not authenticated')
      }

      this.isLoading = true

      try {
        await this.loadConversations()
        this.isConnected = true
        console.log('✅ Chat system initialized')
      } catch (error) {
        console.error('❌ Failed to initialize chat:', error)
        this.isConnected = false
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async loadConversations() {
      console.log('🔧 Loading conversations...')
      
      const authStore = useAuthStore()
      const { $api } = useApi() // ✅ Use composable
      
      try {
        const response = await $api('/chat/conversations', {
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        })

        if (response.success) {
          this.conversations = response.data || []
          console.log('✅ Loaded conversations:', this.conversations.length)
        }
      } catch (error) {
        console.error('❌ Error loading conversations:', error)
        this.conversations = []
      }
    },

    async sendMessage(conversationId, content, messageType = 'text') {
      const authStore = useAuthStore()
      const { $api } = useApi() // ✅ Use composable
      
      try {
        const response = await $api('/chat/messages', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authStore.token}`
          },
          body: {
            conversationId,
            content,
            messageType
          }
        })

        if (response.success) {
          console.log('✅ Message sent successfully')
          return response.data
        } else {
          throw new Error(response.message || 'Failed to send message')
        }
      } catch (error) {
        console.error('❌ Error sending message:', error)
        throw error
      }
    },

    async createConversationFromProperty(propertyData) {
      const authStore = useAuthStore()
      const { $api } = useApi() // ✅ Use composable
      
      try {
        const response = await $api('/chat/conversations', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authStore.token}`
          },
          body: {
            propertyId: propertyData.id,
            propertyOwnerId: propertyData.ownerId,
            propertyTitle: propertyData.title
          }
        })

        if (response.success) {
          const newConversation = response.data
          this.conversations.unshift(newConversation)
          this.messages[newConversation._id] = []
          this.setActiveConversation(newConversation._id)
          
          console.log('✅ Conversation created:', newConversation._id)
          return newConversation
        } else {
          throw new Error(response.message || 'Failed to create conversation')
        }
      } catch (error) {
        console.error('❌ Error creating conversation:', error)
        throw error
      }
    }
  }
})
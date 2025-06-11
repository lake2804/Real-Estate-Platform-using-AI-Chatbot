export const usePropertyChat = () => {
  const chatStore = useChatStore()
  const authStore = useAuthStore()

  // Start chat from property detail
  const startChatFromProperty = async (propertyData) => {
    console.log('🔧 Starting chat from property:', propertyData)

    // Check authentication
    if (!authStore.currentUser) {
      console.log('⚠️ User not authenticated, redirecting to login')
      await navigateTo('/login')
      throw new Error('User not authenticated')
    }

    // Check if trying to chat with self
    if (authStore.currentUser.id === propertyData.ownerId) {
      console.log('⚠️ Cannot chat with self')
      throw new Error('Không thể nhắn tin với chính mình!')
    }

    try {
      // Initialize chat if not already initialized
      if (!chatStore.isConnected) {
        console.log('🔧 Initializing chat store...')
        await chatStore.initChat()
      }

      // Create or get conversation via API
      console.log('🔧 Creating/getting conversation via API...')
      const conversation = await chatStore.createConversationFromProperty({
        id: propertyData.id,
        title: propertyData.title,
        ownerId: propertyData.ownerId,
        ownerName: propertyData.ownerName,
        ownerAvatar: propertyData.ownerAvatar
      })

      console.log('✅ API conversation created/found:', conversation._id)

      // Set as active conversation
      if (conversation) {
        chatStore.setActiveConversation(conversation._id)
        console.log('✅ Set active conversation:', conversation._id)
      }

      return conversation

    } catch (error) {
      console.error('❌ Error starting chat from property:', error)
      throw error
    }
  }

  // Schedule viewing
  const scheduleViewing = async (propertyData) => {
    console.log('🔧 Scheduling viewing for property:', propertyData)

    try {
      // Start chat first
      const conversation = await startChatFromProperty(propertyData)

      // Send scheduling message
      const schedulingMessage = `Chào ${propertyData.ownerName}, tôi muốn hẹn lịch xem nhà "${propertyData.title}". Bạn có thể sắp xếp thời gian phù hợp không?`
      
      if (conversation && chatStore.activeConversation) {
        await chatStore.sendMessage(chatStore.activeConversation, schedulingMessage)
      }

      // Navigate to chat
      await navigateTo('/contact')

    } catch (error) {
      console.error('❌ Error scheduling viewing:', error)
      throw error
    }
  }

  // Quick contact
  const quickContact = async (propertyData, message = '') => {
    console.log('🔧 Quick contact for property:', propertyData)

    try {
      // Start chat first
      const conversation = await startChatFromProperty(propertyData)

      // Send initial message if provided
      if (message && conversation && chatStore.activeConversation) {
        await chatStore.sendMessage(chatStore.activeConversation, message)
      }

      // Navigate to chat
      await navigateTo('/contact')

    } catch (error) {
      console.error('❌ Error in quick contact:', error)
      throw error
    }
  }

  return {
    startChatFromProperty,
    scheduleViewing,
    quickContact
  }
}
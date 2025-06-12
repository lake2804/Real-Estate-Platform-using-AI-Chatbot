<!-- filepath: c:\Users\hom02\Real-Estate-Platform-using-AI-Chatbot\frontend\components\Chatbot.vue -->
<template>
  <div class="fixed z-50 bottom-5 right-5">
    <!-- Floating Button -->
    <button 
      v-if="!chatbotStore.isOpen"
      @click="openChatbot"
      class="flex items-center justify-center text-white transition-all duration-300 transform rounded-full shadow-lg w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-xl hover:scale-110"
      aria-label="Open chatbot"
    >
      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"></path>
      </svg>
    </button>

    <!-- Chat Window -->
    <div v-if="chatbotStore.isOpen" class="flex flex-col overflow-hidden bg-white shadow-2xl w-96 h-96 rounded-2xl">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 text-white bg-gradient-to-r from-blue-500 to-purple-600">
        <h3 class="text-lg font-semibold">🏠 Real Estate AI Assistant</h3>
        <button @click="chatbotStore.closeChatbot()" class="p-1 transition-colors rounded hover:bg-white hover:bg-opacity-20">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>

      <!-- Messages Container -->
      <div ref="messagesContainer" class="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50">
        <div
          v-for="message in chatbotStore.messages"
          :key="message.id"
          :class="[
            'flex',
            message.isUser ? 'justify-end' : 'justify-start'
          ]"
        >
          <div
            :class="[
              'max-w-xs px-4 py-2 rounded-lg break-words',
              message.isUser
                ? 'bg-blue-500 text-white rounded-br-none'
                : message.error
                ? 'bg-red-100 text-red-800 rounded-bl-none'
                : 'bg-white text-gray-800 rounded-bl-none shadow-sm border'
            ]"
          >
            <!-- Message Content -->
            <div v-html="formatMessage(message.text)" class="message-content"></div>
            
            <!-- Message Info -->
            <div class="flex items-center justify-between mt-2 text-xs opacity-70">
              <span>{{ formatTime(message.timestamp) }}</span>
              <span v-if="!message.isUser && message.confidence" class="ml-2">
                📊 {{ Math.round(message.confidence * 100) }}%
              </span>
            </div>
          </div>
        </div>

        <!-- Loading indicator -->
        <div v-if="chatbotStore.isLoading" class="flex justify-start">
          <div class="flex items-center px-4 py-2 bg-white rounded-lg shadow-sm">
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
            <span class="ml-2 text-sm text-gray-600">Đang trả lời...</span>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="p-4 bg-white border-t">
        <div class="flex space-x-2">
          <input
            v-model="currentMessage"
            @keypress.enter="sendMessage"
            type="text"
            placeholder="Nhập câu hỏi về bất động sản..."
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            :disabled="chatbotStore.isLoading"
          />
          <button
            @click="sendMessage"
            :disabled="chatbotStore.isLoading || !currentMessage.trim()"
            class="px-4 py-2 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// CORRECT IMPORT FOR NUXT 3
const chatbotStore = useChatbotStore()
const currentMessage = ref('')
const messagesContainer = ref(null)

console.log('🤖 Chatbot.vue - Component mounted, store:', !!chatbotStore)

const openChatbot = () => {
  console.log('🤖 Opening chatbot...')
  chatbotStore.openChatbot()
}

const sendMessage = async () => {
  if (!currentMessage.value.trim()) {
    console.warn('⚠️ Empty message, skipping')
    return
  }
  
  const message = currentMessage.value.trim()
  currentMessage.value = ''
  
  console.log('🚀 Chatbot.vue - Sending message:', message)
  
  try {
    await chatbotStore.sendMessage(message)
    console.log('✅ Chatbot.vue - Message sent successfully')
  } catch (error) {
    console.error('❌ Chatbot.vue - Error sending message:', error)
  }
  
  // Scroll to bottom
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatMessage = (text) => {
  if (!text) return ''
  
  console.log('🎨 Formatting message length:', text.length)
  
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
    .replace(/•/g, '•')
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Auto-scroll when new messages arrive
watch(() => chatbotStore.messages.length, async (newLength, oldLength) => {
  console.log('📨 Messages changed:', oldLength, '->', newLength)
  console.log('💬 Current messages:', chatbotStore.messages.map(m => ({
    id: m.id,
    isUser: m.isUser,
    textLength: m.text?.length || 0,
    preview: m.text?.substring(0, 50) + '...'
  })))
  
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}, { immediate: true })
</script>

<style scoped>
.message-content {
  line-height: 1.5;
}

.message-content strong {
  font-weight: 600;
}

/* Scrollbar styling */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
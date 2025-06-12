<!-- filepath: c:\Users\hom02\Real-Estate-Platform-using-AI-Chatbot\frontend\components\Chatbot.vue -->
<template>
  <div class="fixed z-50 bottom-5 right-5">
    <!-- Floating Button -->
    <button 
      v-if="!chatbotStore.isOpen"
      @click="chatbotStore.toggleChatbot()"
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
        <button @click="chatbotStore.closeChatbot()" class="p-1 transition-colors rounded hover:bg-white hover:bg-opacity-20" aria-label="Close chatbot">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>

      <!-- Messages -->
      <div class="flex-1 p-4 space-y-3 overflow-y-auto" ref="messagesContainer" style="height: 350px;">
        <div
          v-for="message in chatbotStore.messages"
          :key="message.id"
          class="flex"
          :class="message.isUser ? 'justify-end' : 'justify-start'"
        >
          <div 
            class="max-w-xs p-3 text-sm lg:max-w-md rounded-2xl"
            :class=" [
              message.isUser 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md' 
                : message.error 
                  ? 'bg-red-50 text-red-700 border border-red-200 rounded-bl-md'
                  : 'bg-gray-100 text-gray-800 rounded-bl-md'
            ]"
          >
            <div class="message-text" v-html="formatMessage(message.text)"></div>
            <div class="flex items-center justify-between mt-1 text-xs opacity-70">
              <small>{{ formatTime(message.timestamp) }}</small>
              <small v-if="message.confidence" class="font-medium text-green-600">
                📊 {{ Math.round(message.confidence * 100) }}%
              </small>
            </div>
          </div>
        </div>

        <!-- Loading indicator -->
        <div v-if="chatbotStore.isLoading" class="flex justify-start">
          <div class="max-w-xs p-3 text-sm text-gray-800 bg-gray-100 lg:max-w-md rounded-2xl rounded-bl-md">
            <div class="flex py-2 space-x-1">
              <span class="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
              <span class="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style="animation-delay: 0.2s;"></span>
              <span class="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style="animation-delay: 0.4s;"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="p-4 border-t border-gray-200">
        <form @submit.prevent="sendMessage" class="flex space-x-2">
          <input
            v-model="currentMessage"
            type="text"
            placeholder="Nhập câu hỏi của bạn..."
            :disabled="chatbotStore.isLoading"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button 
            type="submit" 
            :disabled="!currentMessage.trim() || chatbotStore.isLoading"
            class="flex items-center justify-center w-10 h-10 text-white transition-all duration-200 transform rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
            </svg>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const chatbotStore = useChatbotStore()
const currentMessage = ref('')
const messagesContainer = ref(null)

const sendMessage = async () => {
  if (!currentMessage.value.trim()) return
  
  const message = currentMessage.value.trim()
  currentMessage.value = ''
  
  await chatbotStore.sendMessage(message)
  
  // Scroll to bottom
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatMessage = (text) => {
  if (!text) return ''
  
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
watch(() => chatbotStore.messages.length, async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
})
</script>
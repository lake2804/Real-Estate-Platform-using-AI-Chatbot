<template>
  <div v-if="config.public.dev" class="fixed z-50 max-w-sm p-3 text-xs text-white bg-black rounded-lg bottom-4 left-4">
    <h3 class="mb-2 font-bold text-yellow-400">🔧 Contact Debug</h3>
    <div class="space-y-1">
      <div><span class="text-yellow-400">Page:</span> {{ currentPage }}</div>
      <div><span class="text-yellow-400">Conversations:</span> {{ chatStore.conversations.length }}</div>
      <div><span class="text-yellow-400">Local Convs:</span> {{ localConversations.length }}</div>
      <div><span class="text-yellow-400">Active:</span> {{ chatStore.activeConversation || 'None' }}</div>
      <div><span class="text-yellow-400">Active Type:</span> {{ activeConversationType }}</div>
      <div><span class="text-yellow-400">Messages:</span> {{ activeMessageCount }}</div>
      <div><span class="text-yellow-400">Auth:</span> {{ authStore.currentUser ? '✅' : '❌' }}</div>
      <div><span class="text-yellow-400">Connected:</span> {{ chatStore.isConnected ? '✅' : '❌' }}</div>
      
      <!-- Debug conversation data -->
      <div v-if="chatStore.activeConversation" class="p-2 mt-2 text-xs bg-gray-800 rounded">
        <div class="font-bold text-green-400">Active Conversation:</div>
        <div>ID: {{ chatStore.activeConversation.slice(0, 20) }}...</div>
        <div>In Store: {{ activeConversationInStore ? '✅' : '❌' }}</div>
        <div>Has Messages: {{ hasActiveMessages ? '✅' : '❌' }}</div>
      </div>
      
      <!-- Debug buttons -->
      <div class="mt-2 space-y-1">
        <button 
          @click="addTestMessage"
          class="w-full px-2 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Add Test Message
        </button>
        
        <button 
          @click="forceRefreshConversations"
          class="w-full px-2 py-1 text-xs text-white bg-green-600 rounded hover:bg-green-700"
        >
          Force Refresh
        </button>
        
        <button 
          @click="clearLocalData"
          class="w-full px-2 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700"
        >
          Clear Local Data
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useChatStore } from '~/stores/chat'
import { useAuthStore } from '~/stores/auth'
import { useRoute } from 'vue-router'

const chatStore = useChatStore()
const authStore = useAuthStore()
const config = useRuntimeConfig()
const route = useRoute()

const currentPage = computed(() => {
  return process.client ? window.location.pathname : route.path
})

const localConversations = computed(() => {
  return chatStore.conversations.filter(c => c._id?.startsWith('local_'))
})

const activeConversationType = computed(() => {
  if (!chatStore.activeConversation) return 'None'
  return chatStore.activeConversation.startsWith('local_') ? 'Local' : 'Real'
})

const activeMessageCount = computed(() => {
  return chatStore.activeConversation ? 
    (chatStore.messages[chatStore.activeConversation]?.length || 0) : 0
})

const activeConversationInStore = computed(() => {
  return !!chatStore.conversations.find(c => c._id === chatStore.activeConversation)
})

const hasActiveMessages = computed(() => {
  return chatStore.activeConversation && 
         chatStore.messages[chatStore.activeConversation] &&
         chatStore.messages[chatStore.activeConversation].length > 0
})

const addTestMessage = async () => {
  if (!chatStore.activeConversation) {
    alert('No active conversation')
    return
  }
  
  try {
    await chatStore.sendMessage(
      chatStore.activeConversation, 
      `Test message at ${new Date().toLocaleTimeString()}`
    )
  } catch (error) {
    console.log('Test message error:', error)
  }
}

const forceRefreshConversations = () => {
  console.log('🔧 Force refreshing conversations...')
  console.log('Current conversations:', chatStore.conversations)
  console.log('Current messages:', chatStore.messages)
  console.log('Active conversation:', chatStore.activeConversation)
}

const clearLocalData = () => {
  if (confirm('Clear all local conversations and messages?')) {
    // Remove local conversations
    chatStore.conversations = chatStore.conversations.filter(c => !c._id?.startsWith('local_'))
    
    // Clear local messages
    Object.keys(chatStore.messages).forEach(key => {
      if (key.startsWith('local_')) {
        delete chatStore.messages[key]
      }
    })
    
    // Clear active if it was local
    if (chatStore.activeConversation?.startsWith('local_')) {
      chatStore.activeConversation = null
    }
    
    console.log('✅ Local data cleared')
  }
}
</script>
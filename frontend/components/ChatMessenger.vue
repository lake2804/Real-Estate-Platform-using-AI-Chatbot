<template>
  <div class="fixed bottom-0 right-0 m-6 w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border border-[#F62E56]">
    <div class="flex items-center px-4 py-3 border-b bg-[#F62E56] rounded-t-2xl">
      <span class="flex-1 text-lg font-bold text-white">Chat với Nhà Đất</span>
      <button @click="$emit('close')" class="text-2xl font-bold text-white">&times;</button>
    </div>
    <div class="flex-1 overflow-y-auto p-4 bg-[#fff6f8]">
      <div v-for="msg in messages" :key="msg.time" class="flex mb-2" :class="msg.from === 'me' ? 'justify-end' : 'justify-start'">
        <div
          :class="msg.from === 'me'
            ? 'bg-[#F62E56] text-white rounded-br-2xl rounded-t-2xl rounded-bl-md'
            : 'bg-white text-[#F62E56] border border-[#F62E56] rounded-bl-2xl rounded-t-2xl rounded-br-md'"
          class="px-4 py-2 max-w-[70%] shadow"
        >
          {{ msg.text }}
        </div>
      </div>
    </div>
    <div class="flex gap-2 p-4 bg-white border-t">
      <input
        v-model="input"
        @keyup.enter="send"
        class="flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#F62E56]"
        placeholder="Nhập tin nhắn..."
      />
      <button @click="send" class="bg-[#F62E56] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#d81b4a] transition">Gửi</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useChatStore } from '~/stores/chat'
import { useUserStore } from '~/stores/user'

const props = defineProps({
  productId: { type: [String, Number], required: true }
})

const chatStore = useChatStore()
const userStore = useUserStore()
const input = ref('')
const messages = computed(() => chatStore.messages[props.productId] || [])

function send() {
  if (!input.value.trim()) return
  chatStore.sendMessage(props.productId, 'me', input.value)
  // Giả lập phản hồi bot
  setTimeout(() => {
    chatStore.sendMessage(props.productId, 'bot', 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm.')
  }, 1000)
  input.value = ''
}
</script>
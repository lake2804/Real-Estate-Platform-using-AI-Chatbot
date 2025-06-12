<!-- layouts/default.vue -->
<template>
  <div class="flex flex-col min-h-screen bg-white">
    <!-- Navbar -->
    <Navbar />

    <!-- Chat Notification Badge -->
    <div v-if="authStore.currentUser && chatStore.getTotalUnreadCount > 0" class="fixed z-50 top-20 right-4">
      <NuxtLink 
        to="/contact"
        class="flex items-center gap-2 px-4 py-2 bg-[#F62E56] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
        <span class="font-medium">{{ chatStore.getTotalUnreadCount }} tin nhắn mới</span>
      </NuxtLink>
    </div>

    <!-- Main Content -->
    <main
      id="main-content"
      class="flex-1 pt-[48px] md:pt-[56px]"
      tabindex="-1"
      role="main"
    >
      <!-- Thêm :key="$route.fullPath" để ép reload page khi đổi id -->
      <NuxtPage :key="$route.fullPath" />
    </main>

    <!-- Footer -->
    <footer class="mt-auto" role="contentinfo">
      <Footer />
    </footer>

    <!-- Import Chatbot Component thay vì code trực tiếp -->
    <Chatbot />
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, watch } from "vue";
import Navbar from "~/components/Navbar.vue";
import Footer from "~/components/Footer.vue";
import Chatbot from "~/components/Chatbot.vue"; // ✅ Import component
import { useChatStore } from '~/stores/chat'
import { useAuthStore } from '~/stores/auth'
import { useChatbotStore } from '~/stores/chatbot'

// Stores
const chatStore = useChatStore()
const authStore = useAuthStore()
const chatbotStore = useChatbotStore()

console.log('🏠 Default layout loaded')

// Optional: Initialize chatbot store if needed
console.log('🤖 Chatbot store initialized in layout')
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>

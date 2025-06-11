<template>
  <div class="h-screen overflow-hidden bg-gray-50">
    <!-- Chat Header -->
    <header class="z-10 bg-white border-b border-gray-200 shadow-sm">
      <div class="px-4 py-3">
        <div class="flex items-center justify-between">
          <!-- Left: Logo & Title -->
          <div class="flex items-center space-x-4">
            <NuxtLink to="/" class="flex items-center space-x-2 transition-opacity hover:opacity-80">
              <div class="w-8 h-8 bg-gradient-to-r from-[#F62E56] to-pink-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span class="font-bold text-gray-900">Real Estate</span>
            </NuxtLink>
            
            <div class="w-px h-6 bg-gray-300"></div>
            
            <div>
              <h1 class="text-lg font-semibold text-gray-900">Tin nhắn</h1>
              <p class="text-xs text-gray-500">Trò chuyện real-time</p>
            </div>
          </div>

          <!-- Center: Connection Status -->
          <div class="items-center hidden px-3 py-1 space-x-2 bg-gray-100 rounded-full md:flex">
            <div :class="['w-2 h-2 rounded-full', chatStore.isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500']"></div>
            <span :class="['text-xs font-medium', chatStore.isConnected ? 'text-green-600' : 'text-red-600']">
              {{ chatStore.isConnected ? 'Đã kết nối' : 'Mất kết nối' }}
            </span>
          </div>

          <!-- Right: User Menu -->
          <div class="flex items-center space-x-3">
            <!-- Back to Home -->
            <NuxtLink 
              to="/" 
              class="p-2 text-gray-500 transition-colors rounded-lg hover:text-gray-700 hover:bg-gray-100"
              title="Về trang chủ"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </NuxtLink>

            <!-- User Profile -->
            <div class="flex items-center space-x-2">
              <img 
                :src="authStore.currentUser?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'" 
                :alt="authStore.currentUser?.name"
                class="object-cover w-8 h-8 border-2 border-gray-200 rounded-full"
              />
              <div class="hidden md:block">
                <p class="text-sm font-medium text-gray-900">{{ authStore.currentUser?.name }}</p>
                <p class="text-xs text-gray-500">{{ authStore.currentUser?.email }}</p>
              </div>
            </div>

            <!-- Logout -->
            <button 
              @click="handleLogout"
              class="p-2 text-gray-500 transition-colors rounded-lg hover:text-red-600 hover:bg-red-50"
              title="Đăng xuất"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Chat Content -->
    <main class="h-[calc(100vh-73px)] overflow-hidden">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useChatStore } from '~/stores/chat'
import { useAuthStore } from '~/stores/auth'

const chatStore = useChatStore()
const authStore = useAuthStore()

async function handleLogout() {
  if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
    await authStore.logout()
    await navigateTo('/login')
  }
}

// Set page title
useHead({
  title: 'Tin nhắn | Real Estate',
  meta: [
    { name: 'description', content: 'Trò chuyện real-time với người mua/bán bất động sản' }
  ]
})
</script>
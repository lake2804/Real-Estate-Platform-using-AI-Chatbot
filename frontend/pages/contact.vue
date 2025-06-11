<template>
  <!-- Fix: Set proper height container -->
  <div class="relative flex h-screen bg-white">
    <!-- Conversations Sidebar -->
    <div class="flex flex-col h-full bg-white border-r border-gray-200 w-80">
      <!-- Enhanced Header with Navigation Buttons -->
      <div class="flex-shrink-0 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
        <!-- Navigation Buttons Row -->
        <div class="flex items-center justify-between p-3 border-b border-gray-200/50">
          <div class="flex space-x-2">
            <!-- Back to Property Button -->
            <button
              v-if="previousPropertyUrl"
              @click="goBackToProperty"
              class="flex items-center px-3 py-2 text-gray-700 transition-all duration-200 bg-white border border-gray-200 rounded-lg shadow-sm group hover:bg-gray-50 hover:shadow-md"
              title="Quay lại chi tiết sản phẩm"
            >
              <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span class="text-sm font-medium">Sản phẩm</span>
            </button>

            <!-- Back to Home Button -->
            <NuxtLink
              to="/"
              class="flex items-center px-3 py-2 text-gray-700 transition-all duration-200 bg-white border border-gray-200 rounded-lg shadow-sm group hover:bg-gray-50 hover:shadow-md"
              title="Về trang chủ"
            >
              <svg class="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span class="text-sm font-medium">Trang chủ</span>
            </NuxtLink>
          </div>

          <!-- Connection Status -->
          <div class="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div :class="['w-2 h-2 rounded-full mr-2', chatStore?.isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500']"></div>
            <span :class="['text-xs font-medium', chatStore?.isConnected ? 'text-green-600' : 'text-red-600']">
              {{ chatStore?.isConnected ? 'Online' : 'Offline' }}
            </span>
          </div>
        </div>

        <!-- Chat Title & Search Section -->
        <div class="p-4">
          <!-- Chat Title with Property Context -->
          <div class="mb-4">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-lg font-semibold text-gray-900">💬 Tin nhắn</h1>
                <p class="text-xs text-gray-500">Trò chuyện với khách hàng</p>
              </div>
              <!-- Property Context Chip -->
              <div v-if="previousPropertyTitle" class="px-3 py-1 bg-blue-100 rounded-full">
                <p class="text-xs font-medium text-blue-800 truncate max-w-[120px]" :title="previousPropertyTitle">
                  {{ previousPropertyTitle }}
                </p>
              </div>
            </div>
          </div>

          <!-- Search Input -->
          <div class="relative">
            <svg class="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm kiếm cuộc trò chuyện..."
              class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F62E56] focus:border-transparent bg-white text-sm"
            />
          </div>
          
          <!-- Conversation Stats -->
          <div class="flex items-center justify-between mt-3 text-xs text-gray-500">
            <span>{{ (filteredConversations || []).length }} cuộc trò chuyện</span>
            <span v-if="chatStore?.getTotalUnreadCount && chatStore.getTotalUnreadCount > 0" class="px-2 py-1 bg-[#F62E56] text-white rounded-full">
              {{ chatStore.getTotalUnreadCount }} tin nhắn mới
            </span>
          </div>
        </div>
      </div>

      <!-- Conversations List - Fix: Add proper scrollable area -->
      <div class="flex-1 min-h-0 overflow-y-auto">
        <!-- Loading State -->
        <div v-if="chatStore?.isLoading" class="p-4">
          <div class="space-y-4">
            <div v-for="i in 4" :key="i" class="animate-pulse">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div class="flex-1">
                  <div class="w-3/4 h-4 mb-2 bg-gray-200 rounded"></div>
                  <div class="w-1/2 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!filteredConversations || filteredConversations.length === 0" class="flex flex-col items-center justify-center h-full p-8 text-center">
          <div class="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 class="mb-2 text-lg font-medium text-gray-900">Chưa có cuộc trò chuyện</h3>
          <p class="mb-4 text-sm text-gray-500">Bắt đầu trò chuyện từ các tin đăng bất động sản</p>
          
          <!-- Quick Action Buttons in Empty State -->
          <div class="flex flex-col space-y-2">
            <NuxtLink 
              to="/" 
              class="inline-flex items-center px-4 py-2 bg-[#F62E56] text-white rounded-lg hover:bg-[#F62E56]/90 transition-colors text-sm font-medium"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Tìm bất động sản
            </NuxtLink>
            
            <button
              v-if="previousPropertyUrl"
              @click="goBackToProperty"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Quay lại sản phẩm
            </button>
          </div>
        </div>

        <!-- Conversation Items -->
        <div v-else class="divide-y divide-gray-100">
          <div
            v-for="conversation in filteredConversations"
            :key="conversation._id"
            :class="[
              'p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 relative',
              chatStore?.activeConversation === conversation._id ? 'bg-gradient-to-r from-[#F62E56]/5 to-transparent border-r-3 border-[#F62E56]' : ''
            ]"
            @click="selectConversation(conversation._id)"
          >
            <div class="flex items-start space-x-3">
              <!-- Avatar with status -->
              <div class="relative flex-shrink-0">
                <img
                  :src="getOtherParticipant(conversation)?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'"
                  :alt="getOtherParticipant(conversation)?.name || 'User'"
                  class="object-cover w-12 h-12 border-2 border-white rounded-full shadow-sm"
                />
                <!-- Online status -->
                <div
                  v-if="chatStore?.isUserOnline && chatStore.isUserOnline(getOtherParticipant(conversation)?._id)"
                  class="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"
                ></div>
                <!-- Unread indicator -->
                <div
                  v-else-if="chatStore?.unreadCounts && chatStore.unreadCounts[conversation._id] > 0"
                  class="absolute -top-1 -right-1 w-5 h-5 bg-[#F62E56] text-white text-xs rounded-full flex items-center justify-center font-medium"
                >
                  {{ chatStore.unreadCounts[conversation._id] > 9 ? '9+' : chatStore.unreadCounts[conversation._id] }}
                </div>
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <h3 class="text-sm font-semibold text-gray-900 truncate">
                    {{ getOtherParticipant(conversation)?.name || 'Unknown User' }}
                  </h3>
                  <span class="flex-shrink-0 text-xs text-gray-500">
                    {{ formatTime(conversation.lastActivity) }}
                  </span>
                </div>
                
                <!-- Property info -->
                <div class="flex items-center mb-2">
                  <div class="w-2 h-2 bg-[#F62E56] rounded-full mr-2"></div>
                  <p class="text-xs text-[#F62E56] font-medium truncate">
                    {{ conversation.propertyTitle || 'Unknown Property' }}
                  </p>
                </div>
                
                <!-- Last message -->
                <div class="flex items-center justify-between">
                  <p class="flex-1 text-sm text-gray-600 truncate">
                    <span v-if="conversation.lastMessage?.senderId?._id === authStore?.currentUser?.id" class="font-medium text-gray-400">
                      Bạn: 
                    </span>
                    {{ conversation.lastMessage?.content || 'Chưa có tin nhắn' }}
                  </p>
                </div>
                
                <!-- Typing indicator -->
                <div
                  v-if="chatStore?.isUserTyping && chatStore.isUserTyping(getOtherParticipant(conversation)?._id, conversation._id)"
                  class="text-xs text-[#F62E56] mt-2 flex items-center font-medium"
                >
                  <div class="flex mr-2 space-x-1">
                    <div class="w-1 h-1 bg-[#F62E56] rounded-full animate-bounce"></div>
                    <div class="w-1 h-1 bg-[#F62E56] rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                    <div class="w-1 h-1 bg-[#F62E56] rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                  </div>
                  đang nhập...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chat Messages Area - Fix: Proper height management -->
    <div class="flex flex-col flex-1 h-full bg-gray-50">
      <!-- No conversation selected -->
      <div v-if="!chatStore?.activeConversation" class="flex items-center justify-center flex-1">
        <div class="max-w-md p-8 mx-auto text-center">
          <div class="w-24 h-24 bg-gradient-to-br from-[#F62E56]/20 to-pink-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-[#F62E56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 class="mb-3 text-xl font-semibold text-gray-900">Chọn cuộc trò chuyện</h3>
          <p class="mb-6 text-gray-600">Chọn một cuộc trò chuyện để bắt đầu nhắn tin real-time với người mua/bán bất động sản</p>
          
          <!-- Navigation shortcuts - Enhanced -->
          <div class="grid grid-cols-1 gap-3">
            <NuxtLink 
              to="/" 
              class="inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-[#F62E56] to-pink-600 text-white rounded-xl hover:from-[#F62E56]/90 hover:to-pink-600/90 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Tìm bất động sản
            </NuxtLink>
            
            <button
              v-if="previousPropertyUrl"
              @click="goBackToProperty"
              class="inline-flex items-center justify-center px-6 py-4 font-medium text-white transition-all duration-200 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {{ previousPropertyTitle ? `Quay lại: ${previousPropertyTitle.substring(0, 20)}...` : 'Quay lại sản phẩm vừa xem' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Active conversation - Fix: Proper header and scrollable content -->
      <div v-else class="flex flex-col flex-1 h-full">
        <!-- Chat Header - Fixed Header -->
        <div class="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
          <!-- Top Navigation Bar -->
          <div class="flex items-center justify-between p-3 border-b border-gray-100 bg-gray-50">
            <div class="flex space-x-2">
              <!-- Back to Property Button -->
              <button
                v-if="previousPropertyUrl"
                @click="goBackToProperty"
                class="flex items-center px-3 py-1.5 text-sm text-gray-700 transition-all duration-200 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 hover:shadow-md"
                title="Quay lại chi tiết sản phẩm"
              >
                <svg class="w-4 h-4 mr-1.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span class="font-medium">Quay lại</span>
              </button>

              <!-- Home Button -->
              <NuxtLink
                to="/"
                class="flex items-center px-3 py-1.5 text-sm text-gray-700 transition-all duration-200 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 hover:shadow-md"
                title="Về trang chủ"
              >
                <svg class="w-4 h-4 mr-1.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span class="font-medium">Trang chủ</span>
              </NuxtLink>
            </div>

            <!-- Property Context Info -->
            <div v-if="previousPropertyTitle" class="px-3 py-1.5 bg-blue-100 rounded-md">
              <p class="text-xs font-medium text-blue-800 truncate max-w-[200px]" :title="previousPropertyTitle">
                📍 {{ previousPropertyTitle }}
              </p>
            </div>
          </div>

          <!-- Chat Partner Info -->
          <div class="p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="relative">
                  <img
                    :src="activeConversationPartner?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'"
                    :alt="activeConversationPartner?.name || 'User'"
                    class="object-cover w-12 h-12 border-white rounded-full shadow-md border-3"
                  />
                  <div
                    v-if="chatStore?.isUserOnline && chatStore.isUserOnline(activeConversationPartner?._id)"
                    class="absolute w-4 h-4 bg-green-500 border-2 border-white rounded-full -bottom-1 -right-1"
                  ></div>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">{{ activeConversationPartner?.name || 'Unknown User' }}</h3>
                  <p class="flex items-center text-sm">
                    <span v-if="chatStore?.isUserOnline && chatStore.isUserOnline(activeConversationPartner?._id)" class="font-medium text-green-600">
                      🟢 Đang online
                    </span>
                    <span v-else-if="chatStore?.isUserTyping && chatStore.isUserTyping(activeConversationPartner?._id, chatStore.activeConversation)" class="text-[#F62E56] font-medium">
                      ✏️ Đang nhập...
                    </span>
                    <span v-else class="text-gray-500">
                      🔘 Offline
                    </span>
                  </p>
                </div>
              </div>

              <!-- Enhanced Property Info Card -->
              <div class="bg-gradient-to-r from-[#F62E56]/10 to-pink-600/10 rounded-xl p-3 max-w-xs border border-[#F62E56]/20">
                <p class="mb-2 text-sm font-semibold text-gray-900 truncate">{{ activeConversationData?.propertyTitle || 'Unknown Property' }}</p>
                <div class="flex flex-wrap gap-1">
                  <button 
                    v-if="activeConversationData?.propertyUrl"
                    @click="goToProperty(activeConversationData.propertyUrl)"
                    class="text-xs text-[#F62E56] hover:text-[#F62E56]/80 font-medium transition-colors bg-white/50 px-2 py-1 rounded-md"
                  >
                    📍 Chi tiết
                  </button>
                  <button
                    @click="goBackToProperty"
                    class="px-2 py-1 text-xs font-medium text-gray-600 transition-colors rounded-md hover:text-gray-800 bg-white/50"
                  >
                    ↩️ Quay lại
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Messages Container - Fix: Scrollable area with proper height -->
        <div
          ref="messagesContainer"
          class="flex-1 min-h-0 p-6 space-y-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white"
          @scroll="handleScroll"
        >
          <div
            v-for="message in activeMessages || []"
            :key="message._id"
            :class="['flex', message.senderId?._id === authStore?.currentUser?.id ? 'justify-end' : 'justify-start']"
          >
            <div
              :class="[
                'max-w-xs lg:max-w-md px-4 py-3 rounded-2xl relative shadow-sm',
                message.senderId?._id === authStore?.currentUser?.id 
                  ? 'bg-gradient-to-r from-[#F62E56] to-pink-600 text-white' 
                  : 'bg-white text-gray-900 border border-gray-200'
              ]"
            >
              <p class="text-sm leading-relaxed">{{ message.content || '' }}</p>
              
              <div
                :class="[
                  'flex items-center justify-between mt-2 text-xs',
                  message.senderId?._id === authStore?.currentUser?.id 
                    ? 'text-pink-100' 
                    : 'text-gray-500'
                ]"
              >
                <span>{{ formatTime(message.createdAt) }}</span>
                
                <!-- Message status for sent messages -->
                <div
                  v-if="message.senderId?._id === authStore?.currentUser?.id"
                  class="flex items-center ml-2"
                >
                  <svg v-if="message.status === 'sending'" class="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <svg v-else-if="message.status === 'sent'" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else-if="message.status === 'failed'" class="w-3 h-3 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Typing indicator -->
          <div
            v-if="chatStore?.isUserTyping && chatStore.isUserTyping(activeConversationPartner?._id, chatStore.activeConversation)"
            class="flex justify-start"
          >
            <div class="px-4 py-3 bg-white border border-gray-200 shadow-sm rounded-2xl">
              <div class="flex space-x-1">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Message Input Area - Fixed Footer -->
        <div class="flex-shrink-0 p-4 bg-white border-t border-gray-200">
          <form @submit.prevent="sendMessage" class="flex items-end space-x-3">
            <div class="flex-1">
              <div class="relative">
                <textarea
                  ref="messageInput"
                  v-model="newMessage"
                  placeholder="Nhập tin nhắn... (Enter để gửi, Shift+Enter để xuống dòng)"
                  rows="1"
                  class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#F62E56] focus:border-transparent resize-none min-h-[48px] max-h-[120px] bg-gray-50 text-sm"
                  :class="{ 'opacity-50': isSending }"
                  @keydown="handleKeyDown"
                  @input="handleInput"
                  @focus="handleFocus"
                  @blur="handleBlur"
                  :disabled="isSending"
                ></textarea>
                
                <!-- Character count -->
                <div v-if="newMessage && newMessage.length > 100" class="absolute text-xs text-gray-400 bottom-2 right-12">
                  {{ newMessage.length }}/1000
                </div>
              </div>
            </div>
            
            <!-- Send Button -->
            <button
              type="submit"
              :disabled="!newMessage || !newMessage.trim() || isSending"
              class="p-3 bg-gradient-to-r from-[#F62E56] to-pink-600 text-white rounded-2xl hover:from-[#F62E56]/90 hover:to-pink-600/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center min-w-[48px] h-[48px] shadow-lg hover:shadow-xl"
            >
              <svg v-if="isSending" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Debug Components -->
    <ContactDebug />
    <LayoutDebug />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'chat'
})

useHead({
  title: 'Tin nhắn | Real Estate',
  meta: [
    { name: 'description', content: 'Trò chuyện real-time với người mua/bán bất động sản' }
  ]
})

// Reactive data
const searchQuery = ref('')
const newMessage = ref('')
const isSending = ref(false)
const messagesContainer = ref(null)
const messageInput = ref(null)
const typingTimer = ref(null)
const previousPropertyUrl = ref('')
const previousPropertyTitle = ref('')
const hasRecentProperty = ref(false)

// Get route
const route = useRoute()

// Safe store initialization
const chatStore = useChatStore() || {}
const authStore = useAuthStore() || {}

// ✅ Enhanced navigation data management
function loadNavigationData() {
  console.log('🔧 Loading navigation data...')
  console.log('🔧 Route query:', route.query)
  
  // Priority 1: From route query parameters
  if (route.query.from) {
    previousPropertyUrl.value = decodeURIComponent(route.query.from)
    console.log('✅ Got property URL from route:', previousPropertyUrl.value)
    
    if (route.query.title) {
      previousPropertyTitle.value = decodeURIComponent(route.query.title)
      console.log('✅ Got property title from route:', previousPropertyTitle.value)
    }
  }
  
  // Priority 2: From sessionStorage
  if (process.client) {
    try {
      const storedUrl = sessionStorage.getItem('lastViewedProperty')
      const storedTitle = sessionStorage.getItem('lastViewedPropertyTitle')
      
      console.log('🔧 SessionStorage URL:', storedUrl)
      console.log('🔧 SessionStorage Title:', storedTitle)
      
      if (storedUrl && !previousPropertyUrl.value) {
        previousPropertyUrl.value = storedUrl
        console.log('✅ Using sessionStorage URL:', previousPropertyUrl.value)
      }
      
      if (storedTitle && !previousPropertyTitle.value) {
        previousPropertyTitle.value = storedTitle
        console.log('✅ Using sessionStorage title:', previousPropertyTitle.value)
      }
      
      // Check if there are recent properties
      const recentProperties = JSON.parse(sessionStorage.getItem('recentProperties') || '[]')
      hasRecentProperty.value = recentProperties.length > 0
      console.log('🔧 Recent properties count:', recentProperties.length)
      
    } catch (error) {
      console.error('❌ Error reading sessionStorage:', error)
    }
  }
  
  console.log('🔧 Final navigation data:', {
    url: previousPropertyUrl.value,
    title: previousPropertyTitle.value,
    hasRecent: hasRecentProperty.value
  })
}

// ✅ Enhanced navigation methods
function goBackToProperty() {
  console.log('🔧 Going back to property:', previousPropertyUrl.value)
  
  if (previousPropertyUrl.value) {
    // Store current chat context
    if (process.client) {
      sessionStorage.setItem('chatReferrer', '/contact')
    }
    navigateTo(previousPropertyUrl.value)
  } else {
    // Fallback to recent properties or home
    goToRecentProperty()
  }
}

function goToRecentProperty() {
  if (process.client) {
    try {
      const recentProperties = JSON.parse(sessionStorage.getItem('recentProperties') || '[]')
      if (recentProperties.length > 0) {
        const mostRecent = recentProperties[0]
        navigateTo(mostRecent.url)
      } else {
        navigateTo('/buy') // Fallback to property listings
      }
    } catch (error) {
      console.error('❌ Error reading recent properties:', error)
      navigateTo('/buy')
    }
  } else {
    navigateTo('/')
  }
}

function goToProperty(url) {
  if (url) {
    if (process.client) {
      sessionStorage.setItem('chatReferrer', '/contact')
    }
    navigateTo(url)
  }
}

// ✅ Safe computed properties with fallbacks
const filteredConversations = computed(() => {
  if (!chatStore.conversations || !Array.isArray(chatStore.conversations)) {
    return []
  }
  
  if (!searchQuery.value) return chatStore.conversations
  
  return chatStore.conversations.filter(conv => {
    const otherParticipant = getOtherParticipant(conv)
    return otherParticipant?.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
           conv.propertyTitle?.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})

const activeConversationData = computed(() => {
  if (!chatStore.getConversationById || !chatStore.activeConversation) {
    return null
  }
  return chatStore.getConversationById(chatStore.activeConversation)
})

const activeConversationPartner = computed(() => {
  if (!activeConversationData.value) return null
  return getOtherParticipant(activeConversationData.value)
})

const activeMessages = computed(() => {
  if (!chatStore.getMessagesByConversationId || !chatStore.activeConversation) {
    return []
  }
  return chatStore.getMessagesByConversationId(chatStore.activeConversation) || []
})

// All methods...
function getOtherParticipant(conversation) {
  if (!conversation || !conversation.participants || !Array.isArray(conversation.participants)) {
    return null
  }
  return conversation.participants.find(p => p._id !== authStore?.currentUser?.id) || conversation.participants[0]
}

function formatTime(timestamp) {
  if (!timestamp) return ''
  
  try {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffHours = diffMs / (1000 * 60 * 60)
    const diffDays = diffMs / (1000 * 60 * 60 * 24)
    
    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      return diffMinutes < 1 ? 'Vừa xong' : `${diffMinutes} phút`
    } else if (diffDays < 1) {
      return `${Math.floor(diffHours)} giờ`
    } else if (diffDays < 7) {
      return `${Math.floor(diffDays)} ngày`
    } else {
      return date.toLocaleDateString('vi-VN')
    }
  } catch (error) {
    return ''
  }
}

async function selectConversation(conversationId) {
  if (chatStore.setActiveConversation) {
    chatStore.setActiveConversation(conversationId)
  }
  
  await nextTick()
  scrollToBottom()
  focusInput()
}

async function sendMessage() {
  if (!newMessage.value || !newMessage.value.trim() || isSending.value) {
    return
  }
  
  if (!chatStore.activeConversation) {
    if (process.client) {
      alert('Không có cuộc trò chuyện nào được chọn')
    }
    return
  }
  
  isSending.value = true
  const messageContent = newMessage.value.trim()
  
  try {
    newMessage.value = ''
    resetTextareaHeight()
    
    if (chatStore.sendMessage) {
      await chatStore.sendMessage(chatStore.activeConversation, messageContent)
    }
    
    await nextTick()
    scrollToBottom()
    focusInput()
    
  } catch (error) {
    console.error('❌ Error sending message:', error)
    newMessage.value = messageContent
    focusInput()
    
  } finally {
    isSending.value = false
  }
}

function resetTextareaHeight() {
  if (messageInput.value) {
    messageInput.value.style.height = 'auto'
    messageInput.value.style.height = '48px'
  }
}

function handleKeyDown(event) {
  if (event.key === 'Enter') {
    if (event.shiftKey) {
      return
    } else {
      event.preventDefault()
      sendMessage()
    }
  }
}

function handleInput(event) {
  const textarea = event.target
  if (textarea) {
    textarea.style.height = 'auto'
    const newHeight = Math.min(Math.max(textarea.scrollHeight, 48), 120)
    textarea.style.height = newHeight + 'px'
  }
  
  if (activeConversationPartner.value && chatStore.activeConversation && chatStore.sendTyping) {
    chatStore.sendTyping(chatStore.activeConversation, activeConversationPartner.value._id)
    
    if (typingTimer.value) {
      clearTimeout(typingTimer.value)
    }
    
    typingTimer.value = setTimeout(() => {
      if (activeConversationPartner.value && chatStore.activeConversation && chatStore.stopTyping) {
        chatStore.stopTyping(chatStore.activeConversation, activeConversationPartner.value._id)
      }
    }, 2000)
  }
}

function handleFocus() {
  if (chatStore.activeConversation && chatStore.markAsRead) {
    chatStore.markAsRead(chatStore.activeConversation)
  }
}

function handleBlur(event) {
  if (!isSending.value) {
    if (activeConversationPartner.value && chatStore.activeConversation && chatStore.stopTyping) {
      chatStore.stopTyping(chatStore.activeConversation, activeConversationPartner.value._id)
    }
  }
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

function focusInput() {
  if (messageInput.value) {
    setTimeout(() => {
      messageInput.value.focus()
    }, 100)
  }
}

function handleScroll() {
  // TODO: Implement load more messages when scrolling to top
}

// ✅ Lifecycle management
onMounted(async () => {
  console.log('🚀 Chat page mounted')
  
  // Load navigation data
  loadNavigationData()
  
  // Check authentication
  if (!authStore.currentUser) {
    await navigateTo('/login')
    return
  }
  
  try {
    if (chatStore.initChat) {
      await chatStore.initChat()
    }
  } catch (error) {
    console.error('❌ Error initializing chat:', error)
  }
})

onUnmounted(() => {
  if (typingTimer.value) {
    clearTimeout(typingTimer.value)
  }
})

watch(() => chatStore.activeConversation, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    nextTick(() => {
      scrollToBottom()
      
      if (newVal && chatStore.markAsRead) {
        chatStore.markAsRead(newVal)
      }
    })
  }
})
</script>

<style scoped>
/* Custom scrollbar for messages */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Border utilities */
.border-r-3 {
  border-right-width: 3px;
}

.border-3 {
  border-width: 3px;
}

/* Enhanced backdrop blur */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>
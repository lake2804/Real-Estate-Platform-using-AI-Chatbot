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

    <!-- Chatbot Floating Button & Box -->
    <div>
      <!-- Floating Button -->
      <button
        @click="showChat = !showChat"
        class="fixed z-50 bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-[#F62E56] to-[#ff7cae] shadow-xl flex items-center justify-center hover:scale-110 transition"
        aria-label="Chatbot"
      >
        <svg
          class="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="white"
            stroke-width="2"
            fill="#F62E56"
          />
          <path stroke="white" stroke-width="2" d="M8 12h8M8 16h5" />
        </svg>
      </button>
      <!-- Chat Box -->
      <transition name="fade">
        <div
          v-if="showChat"
          class="fixed z-50 bottom-28 right-6 w-[370px] max-w-[95vw] rounded-2xl shadow-2xl border border-[#F62E56] flex flex-col overflow-hidden bg-[#fff]"
        >
          <!-- Header -->
          <div class="relative">
            <div
              class="h-20 bg-gradient-to-br from-[#F62E56] to-[#ff7cae] flex items-center px-5"
            >
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="avatar"
                class="w-10 h-10 border-2 border-white rounded-full shadow"
              />
              <div class="flex-1 ml-3">
                <div class="text-base font-semibold text-white">
                  Real Estate Bot
                </div>
                <div class="flex items-center gap-1">
                  <span
                    class="inline-block w-2 h-2 bg-green-400 rounded-full"
                  ></span>
                  <span class="text-xs text-white/80">Online</span>
                </div>
              </div>
              <button
                @click="showMenu = !showMenu"
                class="flex items-center justify-center w-8 h-8 transition rounded-full hover:bg-white/20"
                aria-label="Menu"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                  <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                  <circle cx="12" cy="19" r="1.5" fill="currentColor" />
                </svg>
              </button>
              <button
                @click="clearChat"
                class="flex items-center justify-center w-8 h-8 ml-1 transition rounded-full hover:bg-white/20"
                aria-label="Clear chat"
                title="Clear chat"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    d="M6 6l12 12M6 18L18 6"
                  />
                </svg>
              </button>
              <!-- Dropdown menu (demo only) -->
              <div
                v-if="showMenu"
                class="absolute top-16 right-4 bg-white rounded-xl shadow-lg border border-gray-100 min-w-[160px] z-10"
              >
                <button
                  class="block w-full px-4 py-3 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-t-xl"
                  @click="
                    showHistory = !showHistory;
                    showMenu = false;
                  "
                >
                  Chat history
                </button>
                <button
                  class="block w-full px-4 py-3 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-b-xl"
                  @click="showMenu = false"
                >
                  Close menu
                </button>
              </div>
            </div>
          </div>
          <!-- Chat history modal (demo only) -->
          <transition name="fade">
            <div
              v-if="showHistory"
              class="absolute inset-0 z-50 flex items-center justify-center bg-black/30"
              @click.self="showHistory = false"
            >
              <div class="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md">
                <div class="font-bold text-lg mb-2 text-[#F62E56]">
                  Chat History
                </div>
                <div class="mb-4 text-sm text-gray-500">
                  Demo: Lưu lịch sử chat ở đây.
                </div>
                <button
                  class="px-4 py-2 bg-[#F62E56] text-white rounded-full font-medium hover:bg-[#ff7cae] transition"
                  @click="showHistory = false"
                >
                  Close
                </button>
              </div>
            </div>
          </transition>
          <!-- Messages -->
          <div
            class="flex-1 px-4 py-3 overflow-y-auto bg-[#f8f8fa]"
            style="min-height: 180px; max-height: 300px"
          >
            <div
              v-for="(msg, i) in messages"
              :key="i"
              class="flex mb-2"
              :class="msg.from === 'user' ? 'justify-end' : 'justify-start'"
            >
              <div v-if="msg.from === 'bot'" class="flex items-end gap-2">
                <span class="flex-shrink-0">
                  <svg
                    v-if="msg.icon"
                    class="w-6 h-6 text-[#F62E56]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      x="4"
                      y="4"
                      width="16"
                      height="16"
                      rx="6"
                      fill="#fff"
                    />
                    <path
                      d="M8 12h8M8 16h5"
                      stroke="#F62E56"
                      stroke-width="2"
                    />
                  </svg>
                </span>
                <div
                  class="bg-white text-gray-800 px-4 py-3 rounded-2xl rounded-bl-none text-base shadow border border-[#fce6ec] max-w-[80%]"
                >
                  {{ msg.text }}
                  <div v-if="msg.buttons" class="flex flex-wrap gap-2 mt-2">
                    <button
                      v-for="(btn, idx) in msg.buttons"
                      :key="idx"
                      @click="quickReply(btn)"
                      class="px-3 py-1.5 rounded-full border-2 border-[#F62E56] text-[#F62E56] bg-white font-medium hover:bg-[#ffe6ef] transition text-sm"
                      :class="{
                        'bg-[#F62E56] text-white': selectedReply === btn,
                      }"
                    >
                      {{ btn }}
                    </button>
                  </div>
                  <div v-if="msg.ratings" class="flex gap-2 mt-2">
                    <button
                      v-for="n in [5, 4, 3, 2, 1]"
                      :key="n"
                      @click="rate(n)"
                      class="w-8 h-8 rounded-full border-2 border-[#F62E56] text-[#F62E56] font-bold bg-white hover:bg-[#ffe6ef] transition"
                      :class="{ 'bg-[#F62E56] text-white': rating === n }"
                    >
                      {{ n }}
                    </button>
                  </div>
                </div>
              </div>
              <div
                v-else
                class="bg-gradient-to-br from-[#F62E56] to-[#ff7cae] text-white px-4 py-3 rounded-2xl rounded-br-none text-base shadow max-w-[80%]"
              >
                {{ msg.text }}
              </div>
            </div>
          </div>
          <!-- Input -->
          <div
            class="border-t border-[#ffe6ef] bg-white px-4 py-3 flex items-center gap-2"
          >
            <button
              class="text-[#ff7cae] hover:text-[#F62E56] p-1"
              title="Attachment"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-width="2"
                  d="M16.5 13.5V7a4.5 4.5 0 00-9 0v8a4.5 4.5 0 009 0V9.5"
                />
              </svg>
            </button>
            <button
              class="text-[#ff7cae] hover:text-[#F62E56] p-1"
              title="Emoji"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <path
                  stroke="currentColor"
                  stroke-width="2"
                  d="M8 15s1.5 2 4 2 4-2 4-2"
                />
                <path
                  stroke="currentColor"
                  stroke-width="2"
                  d="M9 9h.01M15 9h.01"
                />
              </svg>
            </button>
            <input
              v-model="input"
              type="text"
              class="flex-1 px-4 py-3 rounded-full border border-[#ffe6ef] bg-[#f7fafd] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F62E56] text-base placeholder:text-[#ff7cae]"
              placeholder="Send a message..."
              autocomplete="off"
              @keyup.enter="sendMessage"
            />
            <button
              type="button"
              @click="sendMessage"
              class="w-12 h-12 rounded-full bg-gradient-to-br from-[#F62E56] to-[#ff7cae] flex items-center justify-center text-white shadow hover:scale-110 transition"
            >
              <svg
                class="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="white"
                  stroke-width="2"
                  d="M5 12h14M12 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
          <div
            class="flex items-center justify-between px-4 py-2 text-xs text-[#ff7cae] bg-white border-t border-[#ffe6ef]"
          >
            <span>POWERED BY DEMO</span>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Navbar from "~/components/Navbar.vue";
import Footer from "~/components/Footer.vue";
import { useChatStore } from '~/stores/chat'
import { useAuthStore } from '~/stores/auth'

const showChat = ref(false);
const input = ref("");
const showMenu = ref(false);
const showHistory = ref(false);
const selectedReply = ref("");
const rating = ref(null);

const messages = ref([
  {
    from: "bot",
    text: "Choose your preferred contact option.",
    icon: true,
    buttons: ["Email", "Chat with agent"],
  },
]);

const chatStore = useChatStore()
const authStore = useAuthStore()

// Initialize chat on app start if user is logged in
onMounted(() => {
  if (authStore.currentUser) {
    chatStore.initChat().catch(error => {
      console.warn('Could not initialize chat on app start:', error)
    })
  }
})

function sendMessage() {
  if (!input.value.trim()) return;
  messages.value.push({ from: "user", text: input.value });
  // Demo bot reply
  setTimeout(() => {
    messages.value.push({
      from: "bot",
      text: "Thank you! Our agent will reply soon.",
      icon: true,
    });
  }, 700);
  input.value = "";
}

function quickReply(text) {
  selectedReply.value = text;
  messages.value.push({ from: "user", text });
  if (text === "Chat with agent") {
    setTimeout(() => {
      messages.value.push({
        from: "bot",
        text: "Sure! I'm transferring you to an agent.",
        icon: true,
      });
      setTimeout(() => {
        messages.value.push({
          from: "bot",
          text: "Hi, how can I help you?",
        });
      }, 800);
    }, 700);
  } else if (text === "Email") {
    setTimeout(() => {
      messages.value.push({
        from: "bot",
        text: "Please send your email to support@realestate.vn.",
        icon: true,
      });
    }, 700);
  } else if (typeof text === "number") {
    rating.value = text;
    setTimeout(() => {
      messages.value.push({
        from: "bot",
        text: "Wow, that's great! 🎉",
        icon: true,
      });
    }, 700);
  }
}

function rate(n) {
  quickReply(n);
}

function clearChat() {
  messages.value = [
    {
      from: "bot",
      text: "Choose your preferred contact option.",
      icon: true,
      buttons: ["Email", "Chat with agent"],
    },
  ];
  selectedReply.value = "";
  rating.value = null;
}
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
</style>

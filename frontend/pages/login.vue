<template>
  <client-only>
    <div class="fixed inset-0 flex bg-[#f5f8ff]">
      <!-- Banner trái nhỏ, nền đỏ -->
      <div class="items-center justify-center hidden w-2/5 h-full bg-gradient-to-br from-[#F62E56] to-[#7b1e3a] lg:flex">
        <div class="w-[90%] h-[80%] rounded-[48px] flex flex-col justify-between p-10 text-white shadow-2xl bg-gradient-to-br from-[#F62E56] to-[#7b1e3a]">
          <div>
            <h2 class="mb-4 text-4xl font-bold leading-tight">Start Your<br />Journey<br />with Us</h2>
          </div>
          <div>
            <div class="flex items-center gap-2 mb-2">
              <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#fff" fill-opacity="0.1"/><path d="M16 8a8 8 0 100 16 8 8 0 000-16zm0 14.4A6.4 6.4 0 1116 9.6a6.4 6.4 0 010 12.8z" fill="#fff"/></svg>
              <span class="text-lg font-bold">N</span>
            </div>
            <p class="text-sm opacity-80">We're crafting an attractive UI UX Design<br />that can solve problems</p>
          </div>
        </div>
      </div>
      <!-- Form đăng nhập -->
      <div class="flex flex-col items-center justify-center w-full h-full lg:w-3/5">
        <div class="relative flex flex-col justify-center w-full h-full px-2 py-8 bg-white rounded-none shadow-xl lg:rounded-3xl lg:px-16 lg:py-16">
          <button
            class="absolute text-5xl text-gray-400 top-6 right-6 hover:text-gray-600"
            @click="goHome"
            aria-label="Đóng"
          >
            &times;
          </button>
          <!-- Title & Description -->
          <div class="mb-8 max-w-[400px] w-full mx-auto">
            <h1 class="mb-2 text-3xl font-bold text-[#1C1917] flex items-center gap-2">
              <span class="text-[#F62E56]">Đăng nhập</span>
              <span class="text-lg">👋</span>
            </h1>
            <p class="text-[#6B7280] text-base">
              Chào mừng trở lại! Hãy đăng nhập vào tài khoản của bạn.
            </p>
          </div>

          <!-- Form đăng nhập -->
          <form @submit.prevent="handleLogin" class="max-w-[400px] w-full mx-auto space-y-6">
            <!-- Email Field -->
            <div>
              <label for="email" class="block text-sm font-medium text-[#1C1917] mb-2">
                Email
              </label>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                autocomplete="email"
                class="w-full px-4 py-3 border border-[#E4E4E7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F62E56] focus:border-transparent text-base"
                placeholder="your@email.com"
              />
            </div>

            <!-- Password Field -->
            <div>
              <label for="password" class="block text-sm font-medium text-[#1C1917] mb-2">
                Mật khẩu
              </label>
              <div class="relative">
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  autocomplete="current-password"
                  class="w-full px-4 py-3 border border-[#E4E4E7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F62E56] focus:border-transparent text-base pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] hover:text-[#1C1917]"
                >
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>
            </div>

            <!-- Remember & Forgot -->
            <div class="flex items-center justify-between">
              <label class="flex items-center text-sm text-[#6B7280]">
                <input
                  v-model="remember"
                  type="checkbox"
                  class="mr-2 rounded border-[#E4E4E7] text-[#F62E56] focus:ring-[#F62E56]"
                />
                Ghi nhớ đăng nhập
              </label>
              <button
                type="button"
                @click="forgotPassword"
                class="text-sm text-[#F62E56] hover:underline"
              >
                Quên mật khẩu?
              </button>
            </div>

            <!-- Error Message -->
            <div v-if="authStore.error" class="p-3 border border-red-200 rounded-lg bg-red-50">
              <p class="text-sm text-red-600">{{ authStore.error }}</p>
            </div>

            <!-- Login Button -->
            <button
              type="submit"
              :disabled="authStore.isLoading"
              class="w-full bg-[#F62E56] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#d9254a] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ authStore.isLoading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
            </button>

            <!-- Divider -->
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-[#E4E4E7]"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-[#6B7280]">hoặc</span>
              </div>
            </div>

            <!-- Google Login Button -->
            <button
              type="button"
              @click="signInWithGoogle"
              class="w-full flex items-center justify-center gap-3 bg-white border border-[#E4E4E7] text-[#1C1917] py-3 px-4 rounded-lg font-medium hover:bg-[#F9FAFB] transition-colors duration-200"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>
          </form>
          <p class="mt-6 text-sm text-center text-gray-500 md:text-base max-w-[400px] w-full mx-auto">
            Don't have an account?
            <NuxtLink to="/register" class="text-[#F62E56] hover:underline ml-1">Sign up</NuxtLink>
          </p>

          <!-- Test Section -->
          <div class="mt-8 max-w-[400px] w-full mx-auto border-t pt-6">
            <h3 class="mb-4 text-lg font-medium text-gray-900">Quick Test</h3>
            <div class="space-y-2">
              <button
                type="button"
                @click="testAdminLogin"
                class="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Test Admin Login
              </button>
              <button
                type="button"
                @click="testHealthCheck"
                class="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Test API Health
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </client-only>
</template>

<script setup>
console.log('🔧 Login page loading...')

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

// Check if composables are available
try {
  const authStore = useAuthStore()
  console.log('✅ AuthStore loaded:', !!authStore)
} catch (error) {
  console.error('❌ AuthStore error:', error)
}

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const remember = ref(false)

async function handleLogin() {
  console.log('🔧 Login form submitted')
  console.log('🔧 Email:', email.value)
  console.log('🔧 Password length:', password.value.length)
  
  try {
    console.log('🔧 Auth state before login:', {
      user: authStore.user,
      isAuthenticated: authStore.isAuthenticated
    })
    
    await authStore.login({
      email: email.value,
      password: password.value
    })
    
    console.log('🔧 Auth state after login:', {
      user: authStore.user,
      isAuthenticated: authStore.isAuthenticated
    })
    
    console.log('✅ Login completed successfully')
    
    // Force navigation if not redirected automatically
    await nextTick()
    if (process.client && !authStore.isAuthenticated) {
      console.warn('⚠️ Login success but not authenticated, forcing state update')
    }
    
  } catch (error) {
    console.error('❌ Login failed:', error)
  }
}

function goHome() {
  console.log('🔧 Going home...')
  try {
    router.push('/')
    console.log('✅ Router.push completed')
  } catch (error) {
    console.error('❌ Router.push error:', error)
  }
}

function forgotPassword() {
  console.log('🔧 Forgot password clicked')
  alert('Tính năng này chưa hỗ trợ!')
}

function signInWithGoogle() {
  console.log('🔧 Google sign in clicked')
  alert('Tính năng Google chưa tích hợp!')
}

// Test functions
async function testAdminLogin() {
  console.log('🔧 Test admin login clicked')
  email.value = 'admin@realestate.com'
  password.value = 'admin123'
  
  console.log('🔧 Starting test login...')
  await handleLogin()
  
  // Force check after login
  await nextTick()
  console.log('🔧 Final auth state after test login:', {
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    token: authStore.token
  })
}

async function testHealthCheck() {
  console.log('🔧 Test health check clicked')
  try {
    const { $api } = useApi() // ✅ Use composable
    const response = await $api('/health') // ✅ Correct URL
    console.log('✅ API Health response:', response)
    alert(`API Health: ${JSON.stringify(response, null, 2)}`)
  } catch (error) {
    console.error('❌ API Health error:', error)
    alert(`API Error: ${error.message}`)
  }
}

// Watch auth state changes
watch(() => authStore.isAuthenticated, (newVal) => {
  console.log('🔧 Auth state changed:', newVal)
  if (newVal) {
    console.log('🔧 User authenticated, should redirect to home')
  }
})

console.log('✅ Login page script setup completed')
</script>
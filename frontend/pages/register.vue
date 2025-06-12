<template>
  <div class="flex items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-green-50 to-blue-100 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <!-- Header -->
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          🏠 Đăng ký
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Tạo tài khoản mới
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleRegister" class="mt-8 space-y-6">
        <div class="p-8 space-y-6 bg-white shadow-lg rounded-xl">
          <!-- Full Name -->
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700">
              Họ và tên *
            </label>
            <input
              id="fullName"
              v-model="form.fullName"
              type="text"
              required
              class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Nguyễn Văn A"
              :disabled="authStore.isLoading"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email *
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="your@email.com"
              :disabled="authStore.isLoading"
            />
          </div>

          <!-- Phone -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">
              Số điện thoại
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="+84901234567"
              :disabled="authStore.isLoading"
            />
          </div>

          <!-- Role -->
          <div>
            <label for="role" class="block text-sm font-medium text-gray-700">
              Vai trò
            </label>
            <select
              id="role"
              v-model="form.role"
              class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              :disabled="authStore.isLoading"
            >
              <option value="user">👤 Người dùng</option>
              <option value="agent">🏢 Môi giới</option>
            </select>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Mật khẩu *
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                minlength="6"
                class="block w-full px-3 py-2 pr-10 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="••••••••"
                :disabled="authStore.isLoading"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <svg v-if="showPassword" class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
                <svg v-else class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            <p class="mt-1 text-sm text-gray-500">
              Tối thiểu 6 ký tự
            </p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Xác nhận mật khẩu *
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              required
              class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              :class="{'border-red-300': form.password && form.confirmPassword && form.password !== form.confirmPassword}"
              placeholder="••••••••"
              :disabled="authStore.isLoading"
            />
            <p v-if="form.password && form.confirmPassword && form.password !== form.confirmPassword" class="mt-1 text-sm text-red-600">
              Mật khẩu không khớp
            </p>
          </div>

          <!-- Error message -->
          <div v-if="authStore.error" class="p-4 border border-red-200 rounded-lg bg-red-50">
            <div class="flex">
              <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
              <div class="ml-3">
                <p class="text-sm text-red-800">{{ authStore.error }}</p>
              </div>
            </div>
          </div>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="authStore.isLoading || !isFormValid"
            class="flex justify-center w-full px-4 py-3 text-sm font-medium text-white transition-colors bg-green-600 border border-transparent rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="authStore.isLoading" class="w-5 h-5 mr-3 -ml-1 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ authStore.isLoading ? 'Đang đăng ký...' : 'Đăng ký' }}
          </button>
        </div>
      </form>

      <!-- Links -->
      <div class="space-y-2 text-center">
        <NuxtLink to="/login" class="font-medium text-green-600 hover:text-green-800">
          Đã có tài khoản? Đăng nhập ngay
        </NuxtLink>
        <div>
          <NuxtLink to="/" class="text-gray-600 hover:text-gray-800">
            ← Về trang chủ
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'auth'
})

const authStore = useAuthStore()
const router = useRouter()

// Form data
const form = ref({
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  role: 'user'
})

const showPassword = ref(false)

// Form validation
const isFormValid = computed(() => {
  return form.value.fullName?.trim() &&
         form.value.email?.trim() &&
         form.value.password?.length >= 6 &&
         form.value.password === form.value.confirmPassword
})

// Handle register
const handleRegister = async () => {
  console.log('📝 Register form submitted')
  
  if (!isFormValid.value) {
    console.warn('⚠️ Form validation failed')
    return
  }

  const result = await authStore.register({
    fullName: form.value.fullName,
    email: form.value.email,
    phone: form.value.phone,
    password: form.value.password,
    role: form.value.role
  })

  if (result.success) {
    console.log('✅ Registration successful, redirecting...')
    
    // Show success message
    ElMessage.success(result.message || 'Đăng ký thành công!')
    
    // Redirect to home or dashboard
    setTimeout(() => {
      router.push('/')
    }, 1000)
  } else {
    console.error('❌ Registration failed:', result.message)
  }
}

// Check if already logged in
onMounted(() => {
  if (authStore.isLoggedIn) {
    console.log('👤 User already logged in, redirecting...')
    router.push('/')
  }
})
</script>
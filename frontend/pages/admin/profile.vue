<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm">
      <div class="container px-4 py-6 mx-auto max-w-7xl">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Hồ sơ Admin</h1>
            <p class="text-gray-600">Quản lý thông tin tài khoản quản trị viên</p>
          </div>
          
          <!-- Back to Dashboard -->
          <NuxtLink 
            to="/admin"
            class="flex items-center gap-2 px-4 py-2 text-gray-600 transition-colors hover:text-gray-900"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Quay lại Dashboard
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="container max-w-4xl px-4 py-8 mx-auto">
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <!-- Profile Card -->
        <div class="lg:col-span-1">
          <div class="p-6 text-center bg-white rounded-lg shadow-md">
            <!-- Avatar Upload -->
            <div class="relative inline-block mb-4">
              <img
                :src="profileData.avatar || defaultAvatar"
                :alt="profileData.name"
                class="object-cover w-32 h-32 mx-auto border-4 border-gray-200 rounded-full"
              />
              
              <!-- Upload Overlay -->
              <div class="absolute inset-0 flex items-center justify-center transition-opacity bg-black bg-opacity-50 rounded-full opacity-0 cursor-pointer hover:opacity-100">
                <label for="avatar-upload" class="text-sm font-medium text-white cursor-pointer">
                  <svg class="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  Đổi ảnh
                </label>
              </div>
              
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                @change="handleAvatarUpload"
                class="hidden"
              />
            </div>
            
            <h2 class="mb-2 text-xl font-bold text-gray-900">{{ profileData.name }}</h2>
            <p class="mb-1 text-gray-600">{{ profileData.email }}</p>
            <div class="inline-flex items-center px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
              </svg>
              Quản trị viên
            </div>
            
            <!-- Stats -->
            <div class="grid grid-cols-2 gap-4 mt-6 text-center">
              <div class="p-3 rounded-lg bg-gray-50">
                <div class="text-lg font-bold text-gray-900">{{ adminStats.totalProperties || 0 }}</div>
                <div class="text-xs text-gray-600">BĐS quản lý</div>
              </div>
              <div class="p-3 rounded-lg bg-gray-50">
                <div class="text-lg font-bold text-gray-900">{{ adminStats.totalUsers || 0 }}</div>
                <div class="text-xs text-gray-600">Người dùng</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Form -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-md">
            <!-- Tab Navigation -->
            <div class="border-b border-gray-200">
              <nav class="flex px-6 pt-6 space-x-8">
                <button
                  :class=" [
                    'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                    activeTab === 'general' 
                      ? 'border-[#F62E56] text-[#F62E56]' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  ]"
                  @click="activeTab = 'general'"
                >
                  Thông tin chung
                </button>
                <button
                  :class=" [
                    'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                    activeTab === 'security' 
                      ? 'border-[#F62E56] text-[#F62E56]' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  ]"
                  @click="activeTab = 'security'"
                >
                  Bảo mật
                </button>
              </nav>
            </div>

            <!-- Tab Content -->
            <div class="p-6">
              <!-- General Info Tab -->
              <form v-if="activeTab === 'general'" @submit.prevent="updateProfile" class="space-y-6">
                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <!-- Name -->
                  <div>
                    <label for="name" class="block mb-2 text-sm font-medium text-gray-700">
                      Họ và tên
                    </label>
                    <input
                      id="name"
                      v-model="profileData.name"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F62E56] focus:border-transparent"
                    />
                  </div>

                  <!-- Email -->
                  <div>
                    <label for="email" class="block mb-2 text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      id="email"
                      v-model="profileData.email"
                      type="email"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F62E56] focus:border-transparent"
                    />
                  </div>

                  <!-- Phone -->
                  <div>
                    <label for="phone" class="block mb-2 text-sm font-medium text-gray-700">
                      Số điện thoại
                    </label>
                    <input
                      id="phone"
                      v-model="profileData.phone"
                      type="tel"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F62E56] focus:border-transparent"
                    />
                  </div>

                  <!-- Role (read-only) -->
                  <div>
                    <label for="role" class="block mb-2 text-sm font-medium text-gray-700">
                      Vai trò
                    </label>
                    <input
                      id="role"
                      :value="profileData.role"
                      type="text"
                      readonly
                      class="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                </div>

                <!-- Bio -->
                <div>
                  <label for="bio" class="block mb-2 text-sm font-medium text-gray-700">
                    Giới thiệu
                  </label>
                  <textarea
                    id="bio"
                    v-model="profileData.bio"
                    rows="4"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F62E56] focus:border-transparent"
                    placeholder="Viết vài dòng giới thiệu về bản thân..."
                  ></textarea>
                </div>

                <!-- Save Button -->
                <div class="flex justify-end">
                  <button
                    type="submit"
                    :disabled="isUpdating"
                    class="px-6 py-2 bg-[#F62E56] text-white rounded-lg hover:bg-[#F62E56]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span v-if="isUpdating">Đang lưu...</span>
                    <span v-else>Lưu thay đổi</span>
                  </button>
                </div>
              </form>

              <!-- Security Tab -->
              <form v-if="activeTab === 'security'" @submit.prevent="updatePassword" class="space-y-6">
                <!-- Current Password -->
                <div>
                  <label for="current-password" class="block mb-2 text-sm font-medium text-gray-700">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    id="current-password"
                    v-model="passwordData.currentPassword"
                    type="password"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F62E56] focus:border-transparent"
                  />
                </div>

                <!-- New Password -->
                <div>
                  <label for="new-password" class="block mb-2 text-sm font-medium text-gray-700">
                    Mật khẩu mới
                  </label>
                  <input
                    id="new-password"
                    v-model="passwordData.newPassword"
                    type="password"
                    required
                    minlength="6"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F62E56] focus:border-transparent"
                  />
                </div>

                <!-- Confirm Password -->
                <div>
                  <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-700">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    id="confirm-password"
                    v-model="passwordData.confirmPassword"
                    type="password"
                    required
                    minlength="6"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F62E56] focus:border-transparent"
                  />
                  <p v-if="passwordData.newPassword && passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword" 
                     class="mt-1 text-sm text-red-600">
                    Mật khẩu xác nhận không khớp
                  </p>
                </div>

                <!-- Update Password Button -->
                <div class="flex justify-end">
                  <button
                    type="submit"
                    :disabled="isUpdatingPassword || passwordData.newPassword !== passwordData.confirmPassword"
                    class="px-6 py-2 bg-[#F62E56] text-white rounded-lg hover:bg-[#F62E56]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span v-if="isUpdatingPassword">Đang cập nhật...</span>
                    <span v-else>Cập nhật mật khẩu</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const config = useRuntimeConfig()

// Redirect if not admin
definePageMeta({
  middleware: 'admin'
})

// Reactive data
const activeTab = ref('general')
const isUpdating = ref(false)
const isUpdatingPassword = ref(false)
const adminStats = ref({
  totalProperties: 0,
  totalUsers: 0
})

const defaultAvatar = 'https://randomuser.me/api/portraits/men/1.jpg'

const profileData = ref({
  name: '',
  email: '',
  phone: '',
  role: 'admin',
  bio: '',
  avatar: ''
})

const passwordData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Load profile data
const loadProfile = async () => {
  try {
    const { data } = await $fetch('/api/auth/profile', {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    
    profileData.value = {
      name: data.user.name || 'Admin',
      email: data.user.email || 'admin@example.com',
      phone: data.user.phone || '',
      role: data.user.role || 'admin',
      bio: data.user.bio || '',
      avatar: data.user.avatar || ''
    }
    
    console.log('✅ Profile loaded:', profileData.value)
  } catch (error) {
    console.error('❌ Error loading profile:', error)
    
    // Fallback with auth store data
    profileData.value = {
      name: authStore.currentUser?.name || 'Admin',
      email: authStore.currentUser?.email || 'admin@example.com',
      phone: authStore.currentUser?.phone || '',
      role: 'admin',
      bio: '',
      avatar: authStore.currentUser?.avatar || ''
    }
  }
}

// Load admin stats
const loadAdminStats = async () => {
  try {
    const [propertiesRes, usersRes] = await Promise.all([
      $fetch('/api/properties/count', {
        headers: { Authorization: `Bearer ${authStore.token}` }
      }),
      $fetch('/api/users/count', {
        headers: { Authorization: `Bearer ${authStore.token}` }
      })
    ])
    
    adminStats.value = {
      totalProperties: propertiesRes.data?.count || 0,
      totalUsers: usersRes.data?.count || 0
    }
  } catch (error) {
    console.warn('Could not load admin stats:', error)
  }
}

// Handle avatar upload
const handleAvatarUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  // Validate file
  if (!file.type.startsWith('image/')) {
    alert('Vui lòng chọn file ảnh!')
    return
  }
  
  if (file.size > 5 * 1024 * 1024) { // 5MB
    alert('Kích thước ảnh không được vượt quá 5MB!')
    return
  }
  
  try {
    const formData = new FormData()
    formData.append('avatar', file)
    
    const { data } = await $fetch('/api/auth/upload-avatar', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authStore.token}`
      },
      body: formData
    })
    
    profileData.value.avatar = data.avatarUrl
    
    // Update auth store
    authStore.currentUser.avatar = data.avatarUrl
    
    alert('Cập nhật ảnh đại diện thành công!')
    
  } catch (error) {
    console.error('❌ Error uploading avatar:', error)
    alert('Không thể tải lên ảnh. Vui lòng thử lại!')
  }
}

// Update profile
const updateProfile = async () => {
  isUpdating.value = true
  
  try {
    const { data } = await $fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: {
        name: profileData.value.name,
        email: profileData.value.email,
        phone: profileData.value.phone,
        bio: profileData.value.bio
      }
    })
    
    // Update auth store
    authStore.currentUser = { ...authStore.currentUser, ...data.user }
    
    alert('Cập nhật thông tin thành công!')
    
  } catch (error) {
    console.error('❌ Error updating profile:', error)
    alert('Không thể cập nhật thông tin. Vui lòng thử lại!')
  } finally {
    isUpdating.value = false
  }
}

// Update password
const updatePassword = async () => {
  if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
    alert('Mật khẩu xác nhận không khớp!')
    return
  }
  
  isUpdatingPassword.value = true
  
  try {
    await $fetch('/api/auth/change-password', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: {
        currentPassword: passwordData.value.currentPassword,
        newPassword: passwordData.value.newPassword
      }
    })
    
    // Reset form
    passwordData.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
    
    alert('Cập nhật mật khẩu thành công!')
    
  } catch (error) {
    console.error('❌ Error updating password:', error)
    alert('Không thể cập nhật mật khẩu. Vui lòng kiểm tra mật khẩu hiện tại!')
  } finally {
    isUpdatingPassword.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadProfile()
  loadAdminStats()
})

// SEO
useHead({
  title: 'Hồ sơ Admin - Quản lý',
  meta: [
    { name: 'description', content: 'Quản lý thông tin tài khoản quản trị viên' }
  ]
})
</script>
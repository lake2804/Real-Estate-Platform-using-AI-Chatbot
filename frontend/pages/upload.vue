<!-- filepath: c:\Users\hom02\Real-Estate-Platform-using-AI-Chatbot\frontend\pages\upload.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
    <div class="container max-w-4xl px-4 py-8 mx-auto">
      <!-- Header -->
      <div class="mb-8 text-center">
        <h1 class="mb-4 text-4xl font-bold text-gray-900">
          🏠 Đăng tin bất động sản
        </h1>
        <p class="text-lg text-gray-600">
          Chia sẻ thông tin bất động sản của bạn với hàng nghìn khách hàng tiềm năng
        </p>
      </div>

      <!-- Form Container -->
      <div class="overflow-hidden bg-white shadow-2xl rounded-2xl">
        <form @submit.prevent="handleSubmit" class="divide-y divide-gray-200">
          
          <!-- Step 1: Basic Information -->
          <div class="p-8">
            <div class="flex items-center mb-6">
              <div class="flex items-center justify-center w-8 h-8 mr-3 text-sm font-bold text-white bg-blue-600 rounded-full">
                1
              </div>
              <h2 class="text-2xl font-bold text-gray-900">Thông tin cơ bản</h2>
            </div>

            <div class="grid gap-6 md:grid-cols-2">
              <!-- Title -->
              <div class="md:col-span-2">
                <label for="title" class="block mb-2 text-sm font-medium text-gray-700">
                  Tiêu đề tin đăng *
                </label>
                <input
                  id="title"
                  v-model="form.title"
                  type="text"
                  required
                  class="w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ví dụ: Bán căn hộ 2PN view sông Saigon Pearl"
                  :disabled="isSubmitting"
                />
              </div>

              <!-- Property Type -->
              <div>
                <label for="type" class="block mb-2 text-sm font-medium text-gray-700">
                  Loại hình *
                </label>
                <select
                  id="type"
                  v-model="form.type"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :disabled="isSubmitting"
                >
                  <option value="">Chọn loại hình</option>
                  <option value="apartment">🏢 Căn hộ</option>
                  <option value="house">🏠 Nhà riêng</option>
                  <option value="villa">🏘️ Biệt thự</option>
                  <option value="land">🌾 Đất nền</option>
                  <option value="commercial">🏪 Thương mại</option>
                </select>
              </div>

              <!-- Transaction Type -->
              <div>
                <label for="transactionType" class="block mb-2 text-sm font-medium text-gray-700">
                  Hình thức *
                </label>
                <select
                  id="transactionType"
                  v-model="form.transactionType"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :disabled="isSubmitting"
                >
                  <option value="">Chọn hình thức</option>
                  <option value="sell">💰 Bán</option>
                  <option value="rent">🏠 Cho thuê</option>
                </select>
              </div>

              <!-- Price -->
              <div>
                <label for="price" class="block mb-2 text-sm font-medium text-gray-700">
                  Giá {{ form.transactionType === 'rent' ? '(VND/tháng)' : '(VND)' }} *
                </label>
                <input
                  id="price"
                  v-model="form.price"
                  type="number"
                  required
                  min="0"
                  step="1000000"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ví dụ: 5000000000"
                  :disabled="isSubmitting"
                />
                <p class="mt-1 text-sm text-gray-500">
                  {{ formatPrice(form.price) }}
                </p>
              </div>

              <!-- Area -->
              <div>
                <label for="area" class="block mb-2 text-sm font-medium text-gray-700">
                  Diện tích (m²) *
                </label>
                <input
                  id="area"
                  v-model="form.area"
                  type="number"
                  required
                  min="1"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ví dụ: 85"
                  :disabled="isSubmitting"
                />
              </div>
            </div>
          </div>

          <!-- Step 2: Property Details -->
          <div class="p-8">
            <div class="flex items-center mb-6">
              <div class="flex items-center justify-center w-8 h-8 mr-3 text-sm font-bold text-white bg-green-600 rounded-full">
                2
              </div>
              <h2 class="text-2xl font-bold text-gray-900">Chi tiết bất động sản</h2>
            </div>

            <div class="grid gap-6 md:grid-cols-3">
              <!-- Bedrooms -->
              <div>
                <label for="bedrooms" class="block mb-2 text-sm font-medium text-gray-700">
                  Số phòng ngủ
                </label>
                <input
                  id="bedrooms"
                  v-model="form.bedrooms"
                  type="number"
                  min="0"
                  max="10"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                  :disabled="isSubmitting"
                />
              </div>

              <!-- Bathrooms -->
              <div>
                <label for="bathrooms" class="block mb-2 text-sm font-medium text-gray-700">
                  Số phòng tắm
                </label>
                <input
                  id="bathrooms"
                  v-model="form.bathrooms"
                  type="number"
                  min="0"
                  max="10"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                  :disabled="isSubmitting"
                />
              </div>

              <!-- Floors -->
              <div>
                <label for="floors" class="block mb-2 text-sm font-medium text-gray-700">
                  Số tầng
                </label>
                <input
                  id="floors"
                  v-model="form.floors"
                  type="number"
                  min="1"
                  max="50"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1"
                  :disabled="isSubmitting"
                />
              </div>
            </div>

            <!-- Features -->
            <div class="mt-6">
              <label class="block mb-4 text-sm font-medium text-gray-700">
                Tiện ích đi kèm
              </label>
              <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
                <label v-for="feature in availableFeatures" :key="feature.value" class="flex items-center">
                  <input
                    type="checkbox"
                    :value="feature.value"
                    v-model="form.features"
                    class="text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    :disabled="isSubmitting"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ feature.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Step 3: Location -->
          <div class="p-8">
            <div class="flex items-center mb-6">
              <div class="flex items-center justify-center w-8 h-8 mr-3 text-sm font-bold text-white bg-purple-600 rounded-full">
                3
              </div>
              <h2 class="text-2xl font-bold text-gray-900">Vị trí</h2>
            </div>

            <div class="grid gap-6 md:grid-cols-2">
              <!-- Province/City -->
              <div>
                <label for="city" class="block mb-2 text-sm font-medium text-gray-700">
                  Thành phố *
                </label>
                <select
                  id="city"
                  v-model="form.location.city"
                  required
                  @change="updateDistricts"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :disabled="isSubmitting"
                >
                  <option value="">Chọn thành phố</option>
                  <option value="Ho Chi Minh">TP. Hồ Chí Minh</option>
                  <option value="Ha Noi">Hà Nội</option>
                  <option value="Da Nang">Đà Nẵng</option>
                  <option value="Can Tho">Cần Thơ</option>
                  <option value="Hai Phong">Hải Phòng</option>
                </select>
              </div>

              <!-- District -->
              <div>
                <label for="district" class="block mb-2 text-sm font-medium text-gray-700">
                  Quận/Huyện *
                </label>
                <select
                  id="district"
                  v-model="form.location.district"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :disabled="isSubmitting || !form.location.city"
                >
                  <option value="">Chọn quận/huyện</option>
                  <option v-for="district in availableDistricts" :key="district" :value="district">
                    {{ district }}
                  </option>
                </select>
              </div>

              <!-- Ward -->
              <div>
                <label for="ward" class="block mb-2 text-sm font-medium text-gray-700">
                  Phường/Xã
                </label>
                <input
                  id="ward"
                  v-model="form.location.ward"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ví dụ: Phường Bến Nghé"
                  :disabled="isSubmitting"
                />
              </div>

              <!-- Street -->
              <div>
                <label for="street" class="block mb-2 text-sm font-medium text-gray-700">
                  Đường/Phố
                </label>
                <input
                  id="street"
                  v-model="form.location.street"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ví dụ: Đường Nguyễn Huệ"
                  :disabled="isSubmitting"
                />
              </div>

              <!-- Full Address -->
              <div class="md:col-span-2">
                <label for="address" class="block mb-2 text-sm font-medium text-gray-700">
                  Địa chỉ chi tiết *
                </label>
                <textarea
                  id="address"
                  v-model="form.location.address"
                  required
                  rows="3"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ví dụ: 123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM"
                  :disabled="isSubmitting"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Step 4: Images -->
          <div class="p-8">
            <div class="flex items-center mb-6">
              <div class="flex items-center justify-center w-8 h-8 mr-3 text-sm font-bold text-white bg-red-600 rounded-full">
                4
              </div>
              <h2 class="text-2xl font-bold text-gray-900">Hình ảnh</h2>
            </div>

            <!-- Image Upload -->
            <div class="mb-6">
              <label class="block mb-4 text-sm font-medium text-gray-700">
                Thêm hình ảnh (tối đa 10 ảnh) *
              </label>
              
              <!-- Upload Area -->
              <div 
                @drop="handleDrop"
                @dragover.prevent
                @dragenter.prevent
                class="p-8 text-center transition-colors border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400"
                :class="{'border-blue-400 bg-blue-50': isDragging}"
              >
                <input
                  ref="fileInput"
                  type="file"
                  multiple
                  accept="image/*"
                  @change="handleFileSelect"
                  class="hidden"
                  :disabled="isSubmitting"
                />
                
                <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                
                <p class="mb-2 text-gray-600">
                  <button
                    type="button"
                    @click="$refs.fileInput.click()"
                    class="font-medium text-blue-600 hover:text-blue-500"
                    :disabled="isSubmitting"
                  >
                    Click để chọn ảnh
                  </button>
                  hoặc kéo thả ảnh vào đây
                </p>
                <p class="text-sm text-gray-500">PNG, JPG, GIF tối đa 5MB mỗi ảnh</p>
              </div>
            </div>

            <!-- Image Preview -->
            <div v-if="form.images.length > 0" class="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div
                v-for="(image, index) in form.images"
                :key="index"
                class="relative group"
              >
                <img
                  :src="image.preview || image.url"
                  :alt="`Ảnh ${index + 1}`"
                  class="object-cover w-full h-24 border border-gray-200 rounded-lg"
                />
                <button
                  type="button"
                  @click="removeImage(index)"
                  class="absolute flex items-center justify-center w-6 h-6 text-xs text-white transition-colors bg-red-500 rounded-full -top-2 -right-2 hover:bg-red-600"
                  :disabled="isSubmitting"
                >
                  ×
                </button>
                <div v-if="index === 0" class="absolute px-2 py-1 text-xs text-white bg-blue-600 rounded bottom-1 left-1">
                  Ảnh chính
                </div>
              </div>
            </div>

            <!-- Upload Progress -->
            <div v-if="uploadProgress > 0 && uploadProgress < 100" class="mt-4">
              <div class="h-2 bg-gray-200 rounded-full">
                <div 
                  class="h-2 transition-all duration-300 bg-blue-600 rounded-full"
                  :style="`width: ${uploadProgress}%`"
                ></div>
              </div>
              <p class="mt-1 text-sm text-gray-600">Đang tải lên: {{ uploadProgress }}%</p>
            </div>
          </div>

          <!-- Step 5: Description -->
          <div class="p-8">
            <div class="flex items-center mb-6">
              <div class="flex items-center justify-center w-8 h-8 mr-3 text-sm font-bold text-white bg-orange-600 rounded-full">
                5
              </div>
              <h2 class="text-2xl font-bold text-gray-900">Mô tả chi tiết</h2>
            </div>

            <div>
              <label for="description" class="block mb-2 text-sm font-medium text-gray-700">
                Mô tả bất động sản *
              </label>
              <textarea
                id="description"
                v-model="form.description"
                required
                rows="6"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Mô tả chi tiết về bất động sản của bạn: vị trí, thiết kế, tiện ích xung quanh..."
                :disabled="isSubmitting"
              ></textarea>
              <p class="mt-1 text-sm text-gray-500">
                {{ form.description.length }}/1000 ký tự
              </p>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="p-8">
            <div class="flex items-center mb-6">
              <div class="flex items-center justify-center w-8 h-8 mr-3 text-sm font-bold text-white bg-indigo-600 rounded-full">
                6
              </div>
              <h2 class="text-2xl font-bold text-gray-900">Thông tin liên hệ</h2>
            </div>

            <div class="grid gap-6 md:grid-cols-2">
              <div>
                <label for="contactName" class="block mb-2 text-sm font-medium text-gray-700">
                  Tên người liên hệ *
                </label>
                <input
                  id="contactName"
                  v-model="form.contact.name"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  :disabled="isSubmitting"
                />
              </div>

              <div>
                <label for="contactPhone" class="block mb-2 text-sm font-medium text-gray-700">
                  Số điện thoại *
                </label>
                <input
                  id="contactPhone"
                  v-model="form.contact.phone"
                  type="tel"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ví dụ: 0901234567"
                  :disabled="isSubmitting"
                />
              </div>

              <div>
                <label for="contactEmail" class="block mb-2 text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="contactEmail"
                  v-model="form.contact.email"
                  type="email"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ví dụ: contact@example.com"
                  :disabled="isSubmitting"
                />
              </div>

              <div>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="form.contact.isOwner"
                    class="text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    :disabled="isSubmitting"
                  />
                  <span class="ml-2 text-sm text-gray-700">Tôi là chủ sở hữu</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Error Messages -->
          <div v-if="errors.length > 0" class="p-8 border-l-4 border-red-400 bg-red-50">
            <div class="flex">
              <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Có lỗi xảy ra:</h3>
                <ul class="mt-2 text-sm text-red-700 list-disc list-inside">
                  <li v-for="error in errors" :key="error">{{ error }}</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Success Message -->
          <div v-if="showSuccess" class="p-8 border-l-4 border-green-400 bg-green-50">
            <div class="flex">
              <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <div class="ml-3">
                <p class="text-sm font-medium text-green-800">
                  🎉 Đăng tin thành công! Tin của bạn đang được xem xét và sẽ xuất hiện sớm.
                </p>
              </div>
            </div>
          </div>

          <!-- Submit Buttons -->
          <div class="flex items-center justify-between px-8 py-6 bg-gray-50">
            <NuxtLink 
              to="/"
              class="px-6 py-3 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
              :class="{'pointer-events-none opacity-50': isSubmitting}"
            >
              ← Hủy bỏ
            </NuxtLink>

            <div class="flex space-x-4">
              <button
                type="button"
                @click="saveDraft"
                class="px-6 py-3 text-blue-600 transition-colors border border-blue-600 rounded-lg hover:bg-blue-50"
                :disabled="isSubmitting"
              >
                💾 Lưu nháp
              </button>
              
              <button
                type="submit"
                class="px-8 py-3 text-white transition-all duration-200 transform rounded-lg shadow-lg bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                :disabled="isSubmitting || !isFormValid"
              >
                <span v-if="isSubmitting" class="flex items-center">
                  <svg class="w-5 h-5 mr-3 -ml-1 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang đăng tin...
                </span>
                <span v-else>
                  🚀 Đăng tin ngay
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

// Meta
definePageMeta({
  title: 'Đăng tin bất động sản',
  middleware: 'auth' // Require authentication
})

useHead({
  title: 'Đăng tin bất động sản - Chia sẻ BDS của bạn',
  meta: [
    { name: 'description', content: 'Đăng tin bất động sản miễn phí, tiếp cận hàng nghìn khách hàng tiềm năng.' }
  ]
})

// Composables
const router = useRouter()
const authStore = useAuthStore()

// Form state
const form = ref({
  title: '',
  type: '',
  transactionType: '',
  price: '',
  area: '',
  bedrooms: 0,
  bathrooms: 0,
  floors: 1,
  features: [],
  location: {
    city: '',
    district: '',
    ward: '',
    street: '',
    address: ''
  },
  images: [],
  description: '',
  contact: {
    name: authStore.currentUser?.name || '',
    phone: authStore.currentUser?.phone || '',
    email: authStore.currentUser?.email || '',
    isOwner: true
  }
})

// UI state
const isSubmitting = ref(false)
const uploadProgress = ref(0)
const errors = ref([])
const showSuccess = ref(false)
const isDragging = ref(false)

// Available options
const availableFeatures = [
  { value: 'parking', label: '🚗 Chỗ đậu xe' },
  { value: 'elevator', label: '🛗 Thang máy' },
  { value: 'balcony', label: '🌅 Ban công' },
  { value: 'garden', label: '🌳 Sân vườn' },
  { value: 'pool', label: '🏊 Hồ bơi' },
  { value: 'gym', label: '💪 Phòng gym' },
  { value: 'security', label: '🛡️ Bảo vệ 24/7' },
  { value: 'furnished', label: '🛋️ Nội thất' }
]

const districts = {
  'Ho Chi Minh': ['Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 7', 'Bình Thạnh', 'Thủ Đức'],
  'Ha Noi': ['Ba Đình', 'Hoàn Kiếm', 'Hai Bà Trưng', 'Đống Đa', 'Tây Hồ', 'Cầu Giấy', 'Thanh Xuân'],
  'Da Nang': ['Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn', 'Liên Chiểu', 'Cẩm Lệ'],
  'Can Tho': ['Ninh Kiều', 'Ô Môn', 'Bình Thủy', 'Cái Răng', 'Thốt Nốt'],
  'Hai Phong': ['Hồng Bàng', 'Ngô Quyền', 'Lê Chân', 'Hải An', 'Kiến An']
}

const availableDistricts = computed(() => {
  return districts[form.value.location.city] || []
})

// Computed
const isFormValid = computed(() => {
  return form.value.title &&
         form.value.type &&
         form.value.transactionType &&
         form.value.price &&
         form.value.area &&
         form.value.location.city &&
         form.value.location.district &&
         form.value.location.address &&
         form.value.description &&
         form.value.contact.name &&
         form.value.contact.phone &&
         form.value.images.length > 0
})

// Methods
const formatPrice = (price) => {
  if (!price) return ''
  const num = Number(price)
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)} tỷ VND`
  } else if (num >= 1000000) {
    return `${(num / 1000000).toFixed(0)} triệu VND`
  } else {
    return `${num.toLocaleString()} VND`
  }
}

const updateDistricts = () => {
  form.value.location.district = ''
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  addImages(files)
}

const handleDrop = (event) => {
  event.preventDefault()
  isDragging.value = false
  const files = Array.from(event.dataTransfer.files)
  addImages(files)
}

const addImages = (files) => {
  const validFiles = files.filter(file => {
    if (!file.type.startsWith('image/')) {
      errors.value.push(`${file.name} không phải là file ảnh`)
      return false
    }
    if (file.size > 5 * 1024 * 1024) {
      errors.value.push(`${file.name} quá lớn (>5MB)`)
      return false
    }
    return true
  })

  if (form.value.images.length + validFiles.length > 10) {
    errors.value.push('Tối đa 10 ảnh')
    return
  }

  validFiles.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      form.value.images.push({
        file,
        preview: e.target.result,
        name: file.name
      })
    }
    reader.readAsDataURL(file)
  })
}

const removeImage = (index) => {
  form.value.images.splice(index, 1)
}

const validateForm = () => {
  errors.value = []

  if (!form.value.title.trim()) errors.value.push('Vui lòng nhập tiêu đề')
  if (!form.value.type) errors.value.push('Vui lòng chọn loại hình')
  if (!form.value.transactionType) errors.value.push('Vui lòng chọn hình thức')
  if (!form.value.price || form.value.price <= 0) errors.value.push('Vui lòng nhập giá hợp lệ')
  if (!form.value.area || form.value.area <= 0) errors.value.push('Vui lòng nhập diện tích hợp lệ')
  if (!form.value.location.city) errors.value.push('Vui lòng chọn thành phố')
  if (!form.value.location.district) errors.value.push('Vui lòng chọn quận/huyện')
  if (!form.value.location.address.trim()) errors.value.push('Vui lòng nhập địa chỉ chi tiết')
  if (!form.value.description.trim()) errors.value.push('Vui lòng nhập mô tả')
  if (form.value.description.length > 1000) errors.value.push('Mô tả không được quá 1000 ký tự')
  if (!form.value.contact.name.trim()) errors.value.push('Vui lòng nhập tên người liên hệ')
  if (!form.value.contact.phone.trim()) errors.value.push('Vui lòng nhập số điện thoại')
  if (form.value.images.length === 0) errors.value.push('Vui lòng thêm ít nhất 1 ảnh')

  return errors.value.length === 0
}

const uploadImages = async (images) => {
  // Mock image upload - replace with actual API
  const uploadedImages = []
  
  for (let i = 0; i < images.length; i++) {
    const image = images[i]
    uploadProgress.value = Math.round((i / images.length) * 100)
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock uploaded URL
    uploadedImages.push({
      url: image.preview, // In real app, this would be the uploaded URL
      filename: image.name,
      size: image.file.size
    })
  }
  
  uploadProgress.value = 100
  return uploadedImages
}

const handleSubmit = async () => {
  if (isSubmitting.value) return

  console.log('🚀 Form submission started')
  
  if (!validateForm()) {
    console.log('❌ Form validation failed:', errors.value)
    return
  }

  isSubmitting.value = true
  errors.value = []

  try {
    // Upload images first
    console.log('📸 Uploading images...')
    const uploadedImages = await uploadImages(form.value.images)

    // Prepare data for API
    const propertyData = {
      title: form.value.title,
      type: form.value.type,
      transactionType: form.value.transactionType,
      price: Number(form.value.price),
      area: Number(form.value.area),
      bedrooms: Number(form.value.bedrooms),
      bathrooms: Number(form.value.bathrooms),
      floors: Number(form.value.floors),
      features: form.value.features,
      location: form.value.location,
      images: uploadedImages,
      description: form.value.description,
      contact: form.value.contact,
      status: 'pending', // Pending review
      createdBy: authStore.currentUser?.id,
      createdAt: new Date().toISOString()
    }

    console.log('📤 Submitting property data:', propertyData)

    // Mock API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // In real app:
    // const response = await $fetch('/api/properties', {
    //   method: 'POST',
    //   body: propertyData
    // })

    console.log('✅ Property submitted successfully')
    
    showSuccess.value = true
    uploadProgress.value = 0

    // Redirect after success
    setTimeout(() => {
      router.push('/properties')
    }, 3000)

  } catch (error) {
    console.error('❌ Submit error:', error)
    errors.value.push('Có lỗi xảy ra khi đăng tin. Vui lòng thử lại.')
  } finally {
    isSubmitting.value = false
  }
}

const saveDraft = () => {
  // Save to localStorage as draft
  localStorage.setItem('propertyDraft', JSON.stringify(form.value))
  alert('💾 Đã lưu nháp thành công!')
}

// Load draft on mount
onMounted(() => {
  const draft = localStorage.getItem('propertyDraft')
  if (draft) {
    try {
      const draftData = JSON.parse(draft)
      // Merge with current form, keeping user info
      form.value = {
        ...draftData,
        contact: {
          ...draftData.contact,
          name: authStore.currentUser?.name || draftData.contact.name,
          email: authStore.currentUser?.email || draftData.contact.email
        }
      }
      console.log('📄 Draft loaded')
    } catch (error) {
      console.error('Error loading draft:', error)
    }
  }
})

// Clear draft on successful submit
watch(showSuccess, (newValue) => {
  if (newValue) {
    localStorage.removeItem('propertyDraft')
  }
})

// Drag and drop handlers
const handleDragEnter = () => {
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}
</script>
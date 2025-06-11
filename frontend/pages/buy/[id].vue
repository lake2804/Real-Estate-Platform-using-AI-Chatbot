<template>
  <div class="min-h-screen pt-10 bg-gray-50">
    <!-- Breadcrumb -->
    <div class="container px-4 py-2 mx-auto text-sm text-gray-500">
      <span class="hover:text-[#F62E56] cursor-pointer">
        <NuxtLink to="/">Trang chủ</NuxtLink>
      </span>
      <span class="mx-2">/</span>
      <span class="hover:text-[#F62E56] cursor-pointer">
        <NuxtLink to="/buy">Mua</NuxtLink>
      </span>
      <span class="mx-2">/</span>
      <span class="text-gray-700">{{ property?.title || 'Chi tiết' }}</span>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex items-center justify-center min-h-[400px]">
      <div class="text-center">
        <div class="w-16 h-16 mx-auto border-4 border-[#F62E56] border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-lg text-gray-600">Đang tải thông tin...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container px-4 py-12 mx-auto text-center">
      <div class="max-w-md mx-auto">
        <div class="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full">
          <svg class="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
        </div>
        <h1 class="mb-4 text-2xl font-bold text-gray-900">Không tìm thấy bất động sản</h1>
        <p class="mb-8 text-gray-600">Bất động sản bạn đang tìm không tồn tại hoặc đã bị gỡ bỏ.</p>
        <p v-if="isDev" class="mb-4 text-sm text-red-600">Error: {{ error }}</p>
        <NuxtLink
          to="/buy"
          class="px-6 py-3 bg-[#F62E56] text-white rounded-lg hover:bg-[#F62E56]/90 transition"
        >
          ← Quay lại danh sách
        </NuxtLink>
      </div>
    </div>

    <!-- Property Details -->
    <div v-else-if="property" class="container px-4 py-6 mx-auto">
      <!-- Property Header -->
      <div class="mb-8 overflow-hidden bg-white shadow-lg rounded-2xl">
        <div class="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2">
          <!-- Left: Property Images -->
          <div class="space-y-4">
            <!-- Main Image -->
            <div class="relative overflow-hidden rounded-xl h-96">
              <img
                :src="activeImage || '/api/placeholder/800/600'"
                :alt="property?.title"
                class="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                @error="handleImageError"
              />

              <!-- Image Counter -->
              <div v-if="property?.images?.length > 1" class="absolute px-3 py-1 text-sm text-white rounded-full top-4 right-4 bg-black/50">
                {{ currentImageIndex + 1 }} / {{ property?.images.length }}
              </div>
            </div>

            <!-- Image Thumbnails -->
            <div v-if="property?.images?.length > 1" class="flex gap-2 overflow-x-auto">
              <img
                v-for="(image, index) in property?.images"
                :key="index"
                :src="image || '/api/placeholder/150/100'"
                :alt="`${property?.title} - Ảnh ${index + 1}`"
                class="flex-shrink-0 object-cover w-20 h-16 transition-all border-2 rounded-lg cursor-pointer"
                :class="activeImage === image ? 'border-[#F62E56]' : 'border-gray-200 hover:border-gray-400'"
                @click="setActiveImage(image, index)"
                @error="handleImageError"
              />
            </div>
          </div>

          <!-- Right: Property Info -->
          <div class="space-y-6">
            <!-- Title and Price -->
            <div>
              <h1 class="mb-2 text-3xl font-bold text-gray-900">{{ property?.title }}</h1>
              <div class="flex items-baseline gap-2">
                <span class="text-3xl font-bold text-[#F62E56]">{{ formatPrice(property?.price) }}</span>
                <span class="text-gray-500">VND</span>
              </div>
            </div>

            <!-- Location -->
            <div class="flex items-center gap-2 text-gray-600">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
              </svg>
              <span>{{ formatLocation(property?.location) }}</span>
            </div>

            <!-- Property Details Grid -->
            <div class="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900">{{ property?.area || 0 }}</div>
                <div class="text-sm text-gray-500">m² diện tích</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900">{{ property?.bedrooms || 0 }}</div>
                <div class="text-sm text-gray-500">phòng ngủ</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900">{{ property?.bathrooms || 0 }}</div>
                <div class="text-sm text-gray-500">phòng tắm</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900">{{ property?.direction || 'N/A' }}</div>
                <div class="text-sm text-gray-500">hướng</div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="grid grid-cols-2 gap-4">
              <button
                @click="handleContactClick"
                :disabled="isContactLoading || isSelfOwned"
                class="flex items-center justify-center gap-2 px-6 py-3 bg-[#F62E56] text-white font-semibold rounded-xl hover:bg-[#F62E56]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="isContactLoading" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>

                <span v-if="isSelfOwned">
                  Đây là BĐS của bạn
                </span>
                <span v-else-if="isContactLoading">
                  Đang kết nối...
                </span>
                <span v-else>
                  Liên hệ ngay
                </span>
              </button>

              <button
                @click="handleScheduleViewing"
                :disabled="isScheduleLoading || isSelfOwned"
                class="flex items-center justify-center gap-2 px-6 py-3 font-semibold text-gray-700 transition-all bg-gray-100 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="isScheduleLoading" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 9l2 2 4-4"/>
                </svg>
                {{ isScheduleLoading ? 'Đang gửi...' : 'Hẹn xem nhà' }}
              </button>
            </div>

            <!-- Owner Info -->
            <div v-if="property?.owner && !isSelfOwned" class="p-4 border rounded-lg bg-gray-50">
              <h3 class="mb-3 font-semibold text-gray-900">Thông tin chủ sở hữu</h3>
              <div class="flex items-center gap-3">
                <img
                  :src="property?.owner.avatar || '/api/placeholder/60/60'"
                  :alt="property?.owner.fullName"
                  class="object-cover w-12 h-12 rounded-full"
                />
                <div class="flex-1">
                  <div class="font-semibold text-gray-900">{{ property?.owner.fullName }}</div>
                  <div class="flex items-center gap-1 text-sm text-gray-500">
                    <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-9.19-.77L12 2 10.18 8.47 1 9.24l7.46 4.73L5.82 21z"/>
                    </svg>
                    <span>{{ property?.owner.rating || '5.0' }} ({{ property?.owner.reviews || '12' }} đánh giá)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Property Details Sections -->
      <div class="space-y-8">
        <!-- Description -->
        <section class="p-6 bg-white shadow-lg rounded-xl">
          <h2 class="mb-4 text-xl font-bold">Mô tả chi tiết</h2>
          <div class="leading-relaxed text-gray-700 whitespace-pre-line">
            {{ property?.description || 'Chưa có mô tả chi tiết.' }}
          </div>
        </section>

        <!-- Amenities -->
        <section v-if="property?.amenities?.length || property?.interior?.length" class="p-6 bg-white shadow-lg rounded-xl">
          <h2 class="mb-4 text-xl font-bold">Tiện nghi</h2>

          <!-- Interior Features -->
          <div v-if="property?.interior?.length" class="mb-6">
            <h3 class="mb-3 font-semibold">Tiện nghi nội thất</h3>
            <div class="flex flex-wrap gap-3">
              <div v-for="item in property?.interior" :key="item" class="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 rounded-full">
                <span v-if="getIconForAmenity(item)" v-html="getIconForAmenity(item)" class="w-4 h-4"></span>
                <span>{{ item }}</span>
              </div>
            </div>
          </div>

          <!-- General Amenities -->
          <div v-if="property?.amenities?.length" class="mb-6">
            <h3 class="mb-3 font-semibold">Tiện ích chung</h3>
            <div class="flex flex-wrap gap-3">
              <div v-for="item in property?.amenities" :key="item" class="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 rounded-full">
                <span v-if="getIconForAmenity(item)" v-html="getIconForAmenity(item)" class="w-4 h-4"></span>
                <span>{{ item }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Advantages -->
        <section v-if="property?.advantages" class="p-6 bg-white shadow-lg rounded-xl">
          <h2 class="mb-4 text-xl font-bold">Ưu điểm dự án</h2>
          <div class="text-gray-700">
            {{ property?.advantages }}
          </div>
        </section>
      </div>
    </div>

    <!-- Debug Info (Development only) -->
    <div v-if="isDev && property" class="container px-4 py-6 mx-auto">
      <details class="p-4 rounded-lg bg-yellow-50">
        <summary class="font-semibold cursor-pointer">🔧 Debug Info</summary>
        <pre class="mt-2 overflow-auto text-xs">{{ JSON.stringify(property, null, 2) }}</pre>
      </details>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const authStore = useAuthStore()

// SEO
definePageMeta({
  title: 'Chi tiết bất động sản'
})

// ✅ FETCH DATA WITH BETTER ERROR HANDLING
const config = useRuntimeConfig()
const { getPropertyById } = useApi()

const { data: propertyResponse, pending, error } = await useFetch(`/api/properties/${route.params.id}`, {
  server: false,
  default: () => null
})

// ✅ COMPUTED PROPERTY DATA
const property = computed(() => {
  if (propertyResponse.value?.success && propertyResponse.value?.data) {
    return propertyResponse.value.data
  }
  if (propertyResponse.value?.data) {
    return propertyResponse.value.data
  }
  if (propertyResponse.value && propertyResponse.value.title) {
    return propertyResponse.value
  }
  return null
})

// Reactive data
const activeImage = ref('')
const currentImageIndex = ref(0)
const isContactLoading = ref(false)
const isScheduleLoading = ref(false)

// Computed
const isDev = computed(() => process.env.NODE_ENV === 'development')

const isSelfOwned = computed(() => {
  return authStore.currentUser?._id === property?.value?.owner?._id
})

// Methods
const setActiveImage = (image, index) => {
  activeImage.value = image
  currentImageIndex.value = index
}

const handleImageError = (event) => {
  event.target.src = 'https://picsum.photos/600/400?random=' + Math.floor(Math.random() * 1000)
}

const formatPrice = (price) => {
  if (!price) return 'Liên hệ'
  if (price >= 1000000000) {
    return `${(price / 1000000000).toFixed(1).replace('.0', '')} tỷ`
  }
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(0)} triệu`
  }
  return new Intl.NumberFormat('vi-VN').format(price)
}

const formatLocation = (location) => {
  if (!location) return 'Chưa có thông tin'
  
  if (typeof location === 'string') {
    return location
  }
  
  const parts = []
  if (location.address) parts.push(location.address)
  if (location.district) parts.push(location.district)
  if (location.city) parts.push(location.city)
  return parts.join(', ')
}

const getIconForAmenity = (amenity) => {
  const icons = {
    'Điều hòa': '❄️',
    'Tủ lạnh': '🧊',
    'Máy giặt': '👕',
    'TV': '📺',
    'WiFi': '📶',
    'Bãi đỗ xe': '🚗',
    'Hồ bơi': '🏊',
    'Gym': '💪',
    'An ninh 24/7': '🔒',
    'Siêu thị': '🛒',
    'Công viên': '🌳',
    'Trường học': '🏫'
  }
  return icons[amenity] || ''
}

const handleContactClick = async () => {
  if (isSelfOwned.value) return

  isContactLoading.value = true

  try {
    const navigationUrl = `/contact?from=${encodeURIComponent(route.path)}&title=${encodeURIComponent(property?.value?.title || 'Bất động sản')}&propertyId=${property?.value?._id || property?.value?.id}`
    await navigateTo(navigationUrl)
  } catch (error) {
    console.error('❌ Error in handleContactClick:', error)
    alert('Không thể chuyển đến trang liên hệ. Vui lòng thử lại!')
  } finally {
    setTimeout(() => {
      isContactLoading.value = false
    }, 1000)
  }
}

const handleScheduleViewing = async () => {
  if (isSelfOwned.value) return

  isScheduleLoading.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Đã gửi yêu cầu hẹn xem nhà! Chúng tôi sẽ liên hệ với bạn sớm nhất.')
  } catch (error) {
    console.error('Error scheduling viewing:', error)
    alert('Có lỗi xảy ra. Vui lòng thử lại sau.')
  } finally {
    isScheduleLoading.value = false
  }
}

// Initialize active image
watch(property, (newProperty) => {
  if (newProperty?.images?.length) {
    activeImage.value = newProperty.images[0]
    currentImageIndex.value = 0
  } else if (newProperty?.image) {
    activeImage.value = newProperty.image
  }
}, { immediate: true })

// SEO
watch(property, (newProperty) => {
  if (newProperty) {
    useHead({
      title: `${newProperty?.title} - Bán nhà`,
      meta: [
        { name: 'description', content: newProperty?.description || 'Chi tiết bất động sản' }
      ]
    })
  }
}, { immediate: true })
</script>
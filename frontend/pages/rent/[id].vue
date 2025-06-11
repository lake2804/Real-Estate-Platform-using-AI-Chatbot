<template>
  <div class="min-h-screen pt-10 bg-gray-50">
    <!-- Breadcrumb -->
    <div class="container px-4 py-2 mx-auto text-sm text-gray-500">
      <span class="hover:text-[#F62E56] cursor-pointer"><NuxtLink to="/">Trang chủ</NuxtLink></span>
      <span class="mx-2">/</span>
      <span class="hover:text-[#F62E56] cursor-pointer"><NuxtLink to="/rent">Thuê</NuxtLink></span>
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
      <h1 class="mb-4 text-2xl font-bold text-gray-900">Không tìm thấy bất động sản</h1>
      <p class="mb-8 text-gray-600">Bất động sản bạn đang tìm không tồn tại hoặc đã bị gỡ bỏ.</p>
      <NuxtLink to="/rent" class="px-6 py-3 bg-[#F62E56] text-white rounded-lg hover:bg-[#F62E56]/90 transition">
        ← Quay lại danh sách
      </NuxtLink>
    </div>

    <!-- Main Property Info -->
    <section v-else-if="property" class="container grid grid-cols-1 gap-8 px-4 py-6 mx-auto bg-white shadow md:grid-cols-2 rounded-xl">
      <!-- Image Gallery -->
      <div>
        <img :src="activeImage" class="object-cover w-full shadow h-72 md:h-96 rounded-xl" />
        <div class="flex gap-2 mt-4">
          <img
            v-for="(img, idx) in property?.images"
            :key="idx"
            :src="img"
            class="object-cover w-16 h-16 border-2 rounded cursor-pointer"
            :class="activeImage === img ? 'border-[#F62E56]' : 'border-transparent'"
            @click="activeImage = img"
          />
        </div>
      </div>

      <!-- Info -->
      <div class="flex flex-col gap-4">
        <h1 class="text-2xl font-bold text-gray-900 md:text-3xl">{{ property?.title }}</h1>
        <div class="flex items-center gap-2 text-gray-600">
          <svg class="w-5 h-5 text-[#F62E56]" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
          </svg>
          {{ formatLocation(property?.location) }}
        </div>
        <div class="text-3xl font-bold text-[#F62E56]">{{ formatPrice(property?.price) }}</div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-3 mt-2">
          <button
            @click="handleContactClick"
            :disabled="isContactLoading"
            class="flex items-center gap-2 px-6 py-3 rounded bg-[#F62E56] text-white font-semibold hover:bg-[#e0244d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="isContactLoading" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            {{ isContactLoading ? 'Đang kết nối...' : 'Liên hệ ngay' }}
          </button>

          <button
            @click="handleScheduleViewing"
            :disabled="isScheduleLoading"
            class="flex items-center gap-2 px-6 py-3 rounded border border-[#F62E56] text-[#F62E56] font-semibold hover:bg-[#fbe9ef] transition-colors disabled:opacity-50"
          >
            <svg v-if="isScheduleLoading" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 9l2 2 4-4"/>
            </svg>
            {{ isScheduleLoading ? 'Đang gửi...' : 'Hẹn xem nhà' }}
          </button>

          <button
            @click="handleQuickChat"
            class="flex items-center gap-2 px-6 py-3 font-semibold text-gray-700 transition-colors border border-gray-300 rounded hover:bg-gray-100"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-1"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12H5a2 2 0 01-2-2V4a2 2 0 012-2h10a2 2 0 012 2v6a2 2 0 01-2 2h-1l-4 4v-4z"/>
            </svg>
            Nhắn tin
          </button>
        </div>

        <!-- Property Stats -->
        <div class="flex flex-wrap gap-6 mt-4">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-width="2" d="M4 21V7a2 2 0 012-2h12a2 2 0 012 2v14"/>
            </svg>
            <span>{{ property?.bedrooms || 0 }}PN/{{ property?.bathrooms || 0 }}WC</span>
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke-width="2"/>
              <path stroke-width="2" d="M12 6v6l4 2"/>
            </svg>
            <span>{{ property?.area || 0 }} m²</span>
          </div>
          <div v-if="property?.direction" class="flex items-center gap-2">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-width="2" d="M12 2v20m10-10H2"/>
            </svg>
            <span>{{ property?.direction }}</span>
          </div>
        </div>

        <!-- Interior Features -->
        <div v-if="property?.interior?.length || property?.amenities?.length" class="mt-4">
          <h3 class="mb-2 font-semibold">Tiện nghi nội thất</h3>
          <div class="flex flex-wrap gap-3">
            <div v-for="item in property?.interior || property?.amenities || []" :key="item" class="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 rounded-full">
              <span v-if="iconMap[item]" v-html="iconMap[item]" class="w-4 h-4"></span>
              <span>{{ item }}</span>
            </div>
          </div>
        </div>

        <!-- Owner Info -->
        <div v-if="property?.owner" class="p-4 mt-4 border rounded-lg bg-gray-50">
          <h3 class="mb-3 font-semibold text-gray-900">Thông tin chủ sở hữu</h3>
          <div class="flex items-center gap-3">
            <img
              :src="property.owner.avatar || 'https://picsum.photos/60/60'"
              :alt="property.owner.name || property.owner.fullName"
              class="object-cover w-12 h-12 rounded-full"
            />
            <div>
              <p class="font-medium text-gray-900">{{ property.owner.name || property.owner.fullName }}</p>
              <p class="text-sm text-gray-600">{{ property.owner.role || 'Chủ cho thuê' }}</p>
              <div class="flex items-center gap-1 mt-1">
                <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-9.19-.77L12 2 10.18 8.47 1 9.24l7.46 4.73L5.82 21z"/>
                </svg>
                <span class="text-xs text-gray-500">{{ property.owner.rating || '5.0' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Description -->
    <section v-if="property" class="container px-4 py-6 mx-auto mt-6 bg-white shadow rounded-xl">
      <h2 class="mb-2 text-xl font-bold">Mô tả chi tiết</h2>
      <div class="leading-relaxed text-gray-700 whitespace-pre-line">
        {{ property?.description || 'Chưa có mô tả chi tiết.' }}
      </div>
    </section>

    <!-- Advantages -->
    <section v-if="property?.advantages" class="container px-4 py-6 mx-auto mt-6 bg-white shadow rounded-xl">
      <h2 class="mb-2 text-xl font-bold">Ưu điểm dự án</h2>
      <div class="mb-2">
        <span class="font-semibold">Vị trí dự án:</span>
        <span class="text-gray-700">{{ property?.advantages }}</span>
      </div>
      <div class="mb-2">
        <span class="font-semibold">Tiện ích nội khu:</span>
        <ul class="ml-6 text-gray-700 list-disc">
          <li v-for="(item, idx) in projectFacilities" :key="idx">{{ item }}</li>
        </ul>
      </div>
      <div>
        <span class="font-semibold">Thông tin dự án:</span>
        <div class="text-gray-700">{{ projectInfo }}</div>
      </div>
    </section>

    <!-- Related Properties -->
    <section v-if="relatedProperties.length" class="container px-4 py-6 mx-auto mt-6">
      <h2 class="mb-4 text-xl font-bold">Có thể bạn quan tâm</h2>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-4">
        <PropertyCard
          v-for="item in relatedProperties"
          :key="item.id"
          :property="item"
          :isRent="true"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import PropertyCard from '~/components/PropertyCard.vue'
import { ref, watch, computed } from 'vue'

const route = useRoute()

// SEO
definePageMeta({
  title: 'Chi tiết thuê nhà'
})

// ✅ FETCH DATA WITH BETTER ERROR HANDLING  
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
const relatedProperties = ref([])
const activeImage = ref('')
const isContactLoading = ref(false)
const isScheduleLoading = ref(false)

// Load related properties
watch(property, async (val) => {
  if (val) {
    activeImage.value = val.images?.[0] || val.image || 'https://picsum.photos/600/400'

    // Load related properties
    try {
      const response = await $fetch('/api/properties', {
        query: {
          type: 'rent',
          limit: 4
        }
      })

      if (response?.success && response?.data) {
        relatedProperties.value = response.data
          .filter(item => item._id !== val.id && item._id !== val._id)
          .slice(0, 4)
      }
    } catch (error) {
      console.error('Error loading related properties:', error)
    }
  }
}, { immediate: true })

// Helper functions
const formatPrice = (price) => {
  if (!price) return 'Liên hệ'
  return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ'
}

const formatLocation = (location) => {
  if (!location) return 'Chưa cập nhật'
  
  if (typeof location === 'string') {
    return location
  }
  
  const parts = []
  if (location.district) parts.push(location.district)
  if (location.city) parts.push(location.city)
  if (location.address && !parts.length) parts.push(location.address)
  
  return parts.length > 0 ? parts.join(', ') : 'Chưa cập nhật'
}

// Action handlers
const handleContactClick = async () => {
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

const handleQuickChat = () => {
  // Implement chat functionality
  console.log('Quick chat clicked')
}

// Icon map cho tiện nghi nội thất
const iconMap = {
  'Giường': `<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="10" width="18" height="7" rx="2" stroke-width="2"/><path stroke-width="2" d="M21 17V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10"/></svg>`,
  'Tủ lạnh': `<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="6" y="3" width="12" height="18" rx="2" stroke-width="2"/><path stroke-width="2" d="M6 9h12"/></svg>`,
  'Máy giặt': `<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2"/><circle cx="12" cy="12" r="5" stroke-width="2"/></svg>`,
  'Wifi': `<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M5 13a10 10 0 0114 0M8.5 16.5a5 5 0 017 0M12 20h.01"/></svg>`,
  'Tivi': `<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="13" rx="2" stroke-width="2"/><path stroke-width="2" d="M8 2h8"/></svg>`,
  'Máy lạnh': `<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="2" stroke-width="2"/><path stroke-width="2" d="M7 17v2a2 2 0 002 2h6a2 2 0 002-2v-2"/></svg>`,
}

const projectFacilities = [
  'Hồ bơi, phòng tập gym, khuôn viên xanh',
  'Trung tâm mua sắm, cửa hàng tiện lợi 24/24',
  'An ninh 24/7, bãi đậu xe rộng rãi',
  'Khu vui chơi trẻ em, công viên nội khu'
]

const projectInfo = 'Căn hộ Vinhomes Golden River được xây dựng trên khu đất Ba Son ven sông Sài Gòn, ngay trung tâm Quận 1. Khu vực này đã sớm trở thành nơi toạ lạc của những toà nhà văn phòng chọc trời, trung tâm thương mại và những con đường dạo bộ ven sông tuyệt đẹp.'

// SEO
watch(property, (newProperty) => {
  if (newProperty) {
    useHead({
      title: `${newProperty?.title} - Thuê nhà`,
      meta: [
        { name: 'description', content: newProperty?.description || 'Chi tiết bất động sản cho thuê' }
      ]
    })
  }
}, { immediate: true })
</script>
<template>
  <div class="min-h-screen pt-10 bg-gray-50">
    <!-- Breadcrumb -->
    <div class="container px-4 py-2 mx-auto text-sm text-gray-500">
      <span class="hover:text-[#F62E56] cursor-pointer"><NuxtLink to="/">Trang chủ</NuxtLink></span>
      <span class="mx-2">/</span>
      <span class="hover:text-[#F62E56] cursor-pointer"><NuxtLink to="/rent">Thuê</NuxtLink></span>
      <span class="mx-2">/</span>
      <span class="text-gray-700">{{ product?.title }}</span>
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

    <!-- Main Product Info -->
    <section v-else-if="product" class="container grid grid-cols-1 gap-8 px-4 py-6 mx-auto bg-white shadow md:grid-cols-2 rounded-xl">
      <!-- Image Gallery -->
      <div>
        <img :src="activeImage" class="object-cover w-full shadow h-72 md:h-96 rounded-xl" />
        <div class="flex gap-2 mt-4">
          <img
            v-for="(img, idx) in product?.images"
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
        <h1 class="text-2xl font-bold text-gray-900 md:text-3xl">{{ product?.title }}</h1>
        <div class="flex items-center gap-2 text-gray-600">
          <svg class="w-5 h-5 text-[#F62E56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-width="2" d="M17.657 16.657L13.414 12.414a4 4 0 10-1.414 1.414l4.243 4.243a1 1 0 001.414-1.414z"/>
          </svg>
          {{ product?.location }}
        </div>
        <div class="text-3xl font-bold text-[#F62E56]">{{ formatPrice(product?.price) }}</div>
        
        <!-- Action Buttons with Chat Integration -->
        <div class="flex flex-wrap gap-3 mt-2">
          <!-- Contact Button -->
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

          <!-- Schedule Viewing Button -->
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

          <!-- Quick Chat Button -->
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
            <span>{{ product?.rooms || (product?.bedrooms + 'PN/' + product?.bathrooms + 'WC') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke-width="2"/>
              <path stroke-width="2" d="M12 6v6l4 2"/>
            </svg>
            <span>{{ product?.area }} m²</span>
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-width="2" d="M12 2v20m10-10H2"/>
            </svg>
            <span>{{ product?.direction }}</span>
          </div>
        </div>
        
        <!-- Interior Features -->
        <div class="mt-4">
          <h3 class="mb-2 font-semibold">Tiện nghi nội thất</h3>
          <div class="flex flex-wrap gap-3">
            <div v-for="item in product?.interior" :key="item" class="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 rounded-full">
              <span v-if="iconMap[item]" v-html="iconMap[item]" class="w-4 h-4"></span>
              <span>{{ item }}</span>
            </div>
          </div>
        </div>

        <!-- Owner Info -->
        <div v-if="product?.owner" class="p-4 mt-4 border rounded-lg bg-gray-50">
          <h3 class="mb-3 font-semibold text-gray-900">Thông tin chủ sở hữu</h3>
          <div class="flex items-center gap-3">
            <img 
              :src="product.owner.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'" 
              :alt="product.owner.name"
              class="object-cover w-12 h-12 rounded-full"
            />
            <div>
              <p class="font-medium text-gray-900">{{ product.owner.name }}</p>
              <p class="text-sm text-gray-600">{{ product.owner.role || 'Chủ cho thuê' }}</p>
              <div class="flex items-center gap-1 mt-1">
                <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-9.19-.77L12 2 10.18 8.47 1 9.24l7.46 4.73L5.82 21z"/>
                </svg>
                <span class="text-xs text-gray-500">{{ product.owner.rating || 'Chưa có đánh giá' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mô tả chi tiết -->
    <section class="container px-4 py-6 mx-auto mt-6 bg-white shadow rounded-xl">
      <h2 class="mb-2 text-xl font-bold">Mô tả chi tiết</h2>
      <div class="leading-relaxed text-gray-700 whitespace-pre-line">
        {{ product?.description }}
      </div>
    </section>

    <!-- Ưu điểm dự án -->
    <section class="container px-4 py-6 mx-auto mt-6 bg-white shadow rounded-xl">
      <h2 class="mb-2 text-xl font-bold">Ưu điểm dự án</h2>
      <div class="mb-2">
        <span class="font-semibold">Vị trí dự án:</span>
        <span class="text-gray-700">{{ product?.advantages }}</span>
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

    <!-- Gợi ý các căn hộ khác -->
    <section class="container px-4 py-6 mx-auto mt-6">
      <h2 class="mb-4 text-xl font-bold">Có thể bạn quan tâm</h2>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-4">
        <PropertyCard
          v-for="item in relatedProducts"
          :key="item.id"
          :product="item"
          :to="`/${item.type === 'rent' ? 'rent' : 'buy'}/${item.id}`"
          :isRent="item.type === 'rent'"
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
const config = useRuntimeConfig()

// Fetch property data from backend
const { data: propertyResponse, pending, error } = await useFetch(`${config.public.apiBase}/properties/${route.params.id}`)

// Transform property data
const product = computed(() => {
  if (!propertyResponse.value?.success || !propertyResponse.value?.data) return null
  
  const property = propertyResponse.value.data
  return {
    id: property._id,
    title: property.title,
    name: property.name,
    image: property.images?.[0] || '',
    images: property.images || [],
    price: property.price,
    type: property.type,
    location: property.location?.district || property.location?.address || '',
    rooms: `${property.details?.bedrooms || 0}PN/${property.details?.bathrooms || 0}WC`,
    bedrooms: property.details?.bedrooms || 0,
    bathrooms: property.details?.bathrooms || 0,
    area: property.details?.area || 0,
    direction: property.details?.direction || '',
    interior: property.amenities || [],
    description: property.description || '',
    advantages: property.advantages || '',
    views: property.views || 0
  }
})

// Load related properties
const relatedProducts = ref([])
const activeImage = ref('')

watch(product, async (val) => {
  if (val) {
    activeImage.value = val.images?.[0] || val.image || ''
    
    // Load related properties
    try {
      const response = await $fetch(`${config.public.apiBase}/properties`, {
        query: { 
          type: 'sale',
          limit: 4
        }
      })
      
      if (response.success) {
        relatedProducts.value = response.data
          .filter(item => item._id !== val.id)
          .slice(0, 4)
          .map(property => ({
            id: property._id,
            _id: property._id,
            title: property.title,
            name: property.name,
            image: property.images?.[0] || '',
            images: property.images || [],
            price: property.price,
            type: property.type,
            location: property.location?.district || '',
            rooms: `${property.details?.bedrooms || 0}PN/${property.details?.bathrooms || 0}WC`,
            bedrooms: property.details?.bedrooms || 0,
            bathrooms: property.details?.bathrooms || 0,
            area: property.details?.area || 0,
            direction: property.details?.direction || '',
            interior: property.amenities || [],
            description: property.description || '',
            advantages: property.advantages || '',
            featured: property.featured || false,
            views: property.views || 0
          }))
      }
    } catch (error) {
      console.error('Error loading related properties:', error)
    }
  }
}, { immediate: true })

watch(product, (val) => {
  if (val?.images?.length) {
    activeImage.value = val.images[0]
  } else if (val?.image) {
    activeImage.value = val.image
  }
})

// Icon map cho tiện nghi nội thất
const iconMap = {
  'Giường': `<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="10" width="18" height="7" rx="2" stroke-width="2"/><path stroke-width="2" d="M21 17V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10"/></svg>`,
  'Tủ lạnh': `<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="6" y="3" width="12" height="18" rx="2" stroke-width="2"/><path stroke-width="2" d="M6 9h12"/></svg>`,
  'Máy giặt': `<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2"/><circle cx="12" cy="12" r="5" stroke-width="2"/></svg>`,
  'Wifi': `<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M5 13a10 10 0 0114 0M8.5 16.5a5 5 0 017 0M12 20h.01"/></svg>`,
  'Tivi': `<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="13" rx="2" stroke-width="2"/><path stroke-width="2" d="M8 2h8"/></svg>`,
  'Bàn ăn': `<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="10" width="18" height="7" rx="2" stroke-width="2"/><path stroke-width="2" d="M7 10V7a5 5 0 0110 0v3"/></svg>`,
  'Lò vi sóng': `<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="2" stroke-width="2"/><path stroke-width="2" d="M7 11h.01M17 11h.01"/></svg>`,
  'Bồn rửa chén': `<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="2" stroke-width="2"/><path stroke-width="2" d="M7 11h10"/></svg>`,
  'Vòi sen': `<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"/><path stroke-width="2" d="M7 17V7a5 5 0 0110 0v10"/></svg>`,
  'Bồn tắm': `<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="10" width="18" height="7" rx="2" stroke-width="2"/><path stroke-width="2" d="M7 10V7a5 5 0 0110 0v3"/></svg>`,
  'Máy lạnh': `<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="2" stroke-width="2"/><path stroke-width="2" d="M7 17v2a2 2 0 002 2h6a2 2 0 002-2v-2"/></svg>`,
}

function formatPrice(price) {
  if (!price) return ''
  return price.toLocaleString('vi-VN') + ' VNĐ'
}

const projectFacilities = [
  'Hồ bơi, phòng tập gym, khuôn viên xanh',
  'Trung tâm mua sắm, cửa hàng tiện lợi 24/24',
  'An ninh 24/7, bãi đậu xe rộng rãi',
  'Khu vui chơi trẻ em, công viên nội khu'
]

const projectInfo = 'Căn hộ Vinhomes Golden River được xây dựng trên khu đất Ba Son ven sông Sài Gòn, ngay trung tâm Quận 1. Khu vực này đã sớm trở thành nơi toạ lạc của những toà nhà văn phòng chọc trời, trung tâm thương mại và những con đường dạo bộ ven sông tuyệt đẹp.'
</script>
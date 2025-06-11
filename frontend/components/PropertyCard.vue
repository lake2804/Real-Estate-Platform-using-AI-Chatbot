<template>
  <!-- ✅ GUARD CLAUSE - Only render if property exists -->
  <NuxtLink 
    v-if="property && Object.keys(property).length > 0 && canNavigate"
    :to="getPropertyLink()"
    class="block overflow-hidden transition-all duration-300 bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-2 group"
  >
    <!-- Property Image -->
    <div class="relative h-64 overflow-hidden">
      <img
        :src="property?.image || property?.images?.[0] || 'https://picsum.photos/600/400'"
        :alt="property?.title || property?.name || 'Property'"
        class="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
        @error="handleImageError"
      />

      <!-- Type Badge -->
      <div class="absolute top-3 left-3">
        <span class="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-full shadow-lg">
          {{ isRent ? 'Cho thuê' : 'Bán' }}
        </span>
      </div>

      <!-- Featured Badge -->
      <div v-if="property?.featured" class="absolute top-3 right-3">
        <span class="px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded-full shadow-lg">
          Nổi bật
        </span>
      </div>

      <!-- Hover Overlay -->
      <div class="absolute inset-0 transition-opacity duration-300 opacity-0 bg-black/20 group-hover:opacity-100"></div>
      
      <!-- View Details on Hover -->
      <div class="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
        <span class="px-4 py-2 text-sm font-medium text-white transition-all duration-200 transform translate-y-2 rounded-full bg-white/20 backdrop-blur-sm group-hover:translate-y-0">
          {{ isRent ? 'Xem chi tiết cho thuê' : 'Xem chi tiết mua bán' }}
        </span>
      </div>
    </div>

    <!-- Property Info -->
    <div class="p-4">
      <!-- Property Category -->
      <div class="mb-2">
        <span class="text-xs font-medium tracking-wider text-gray-500 uppercase">
          {{ getPropertyCategory() }}
        </span>
      </div>

      <!-- Property Title -->
      <h3 class="mb-3 text-xl font-bold text-gray-900 transition-colors duration-200 group-hover:text-red-500 line-clamp-2">
        {{ property?.title || property?.name || 'Chưa có tiêu đề' }}
      </h3>
      
      <!-- Location -->
      <div class="flex items-center mb-4 text-gray-600">
        <svg class="w-4 h-4 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
        </svg>
        <span class="text-sm">{{ formatLocation(property?.location) }}</span>
      </div>
      
      <!-- Property Stats Grid -->
      <div class="grid grid-cols-2 gap-4 mb-4">
        <!-- Left Column -->
        <div class="space-y-3">
          <div class="flex items-center text-gray-600">
            <svg class="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0"/>
            </svg>
            <span class="text-sm font-medium">{{ property?.bedrooms || 0 }}PN/{{ property?.bathrooms || 0 }}WC</span>
          </div>
          
          <div v-if="property?.direction" class="flex items-center text-gray-600">
            <svg class="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"/>
            </svg>
            <span class="text-sm font-medium">{{ property.direction }}</span>
          </div>
        </div>
        
        <!-- Right Column -->
        <div class="space-y-3">
          <div class="flex items-center text-gray-600">
            <svg class="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4a1 1 0 011-1h4m0 0V1m0 2h2m0 0V1m0 2h4a1 1 0 011 1v4m-1 0H9m12 0v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8"/>
            </svg>
            <span class="text-sm font-medium">{{ formatArea(property?.area || 0) }}m²</span>
          </div>
          
          <div v-if="property?.floor || property?.block" class="flex items-center text-gray-600">
            <svg class="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"/>
            </svg>
            <span class="text-sm font-medium">
              {{ property.floor && `Tầng ${property.floor}` }}
              {{ property.block && `Block ${property.block}` }}
            </span>
          </div>
        </div>
      </div>
      
      <!-- Price Section -->
      <div class="mb-2">
        <span class="text-lg font-bold text-red-500">
          {{ formatPriceDisplay() }}
        </span>
        <span v-if="isRent" class="ml-1 text-sm text-gray-500">/ tháng</span>
      </div>
    </div>
  </NuxtLink>

  <!-- ✅ FALLBACK - Show placeholder when property is invalid -->
  <div 
    v-else
    class="block overflow-hidden transition-shadow duration-300 bg-gray-100 border border-gray-200 rounded-lg shadow-sm cursor-not-allowed"
  >
    <div class="relative h-64 bg-gray-200">
      <div class="flex items-center justify-center h-full">
        <div class="animate-pulse">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
      </div>
    </div>
    <div class="p-4">
      <div class="animate-pulse">
        <div class="h-4 mb-3 bg-gray-300 rounded"></div>
        <div class="w-3/4 h-6 mb-4 bg-gray-300 rounded"></div>
        <div class="w-1/2 h-4 mb-6 bg-gray-300 rounded"></div>
        <div class="h-8 bg-gray-300 rounded"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// ✅ Props with better validation
const props = defineProps({
  property: {
    type: Object,
    required: false,
    default: () => null
  },
  isRent: {
    type: Boolean,
    default: false
  }
})

// ✅ Computed - Check if can navigate
const canNavigate = computed(() => {
  return props.property && (props.property.id || props.property._id)
})

// ✅ Computed - Check if property is valid
const isValidProperty = computed(() => {
  return props.property && Object.keys(props.property).length > 0
})

// ✅ Get property link
const getPropertyLink = () => {
  if (!canNavigate.value) return '#'
  
  const propertyId = props.property.id || props.property._id
  
  if (props.isRent) {
    return `/rent/${propertyId}`
  } else {
    return `/buy/${propertyId}`
  }
}

// ✅ Get property category based on type
const getPropertyCategory = () => {
  if (!props.property) return 'Bất động sản'
  
  const type = props.property.type || 'apartment'
  const categoryMap = {
    apartment: 'Căn hộ chung cư',
    house: 'Nhà riêng',
    villa: 'Biệt thự',
    land: 'Đất nền',
    office: 'Văn phòng',
    shop: 'Shophouse',
    warehouse: 'Kho xưởng'
  }
  
  return categoryMap[type] || 'Căn hộ chung cư'
}

// ✅ Format price display based on rent/sale
const formatPriceDisplay = () => {
  const price = props.property?.price
  if (!price || price === 0) return 'Liên hệ'
  
  return formatPrice(price)
}

// ✅ Navigation function with enhanced validation (now handles entire card click)
const goToProperty = () => {
  // ✅ Prevent navigation if property is invalid
  if (!canNavigate.value) {
    console.warn('⚠️ Cannot navigate - invalid property:', props.property)
    return
  }

  const propertyId = props.property.id || props.property._id
  
  try {
    if (props.isRent) {
      console.log('🏠 Navigating to rent property:', propertyId)
      navigateTo(`/rent/${propertyId}`)
    } else {
      console.log('🏢 Navigating to buy property:', propertyId)
      navigateTo(`/buy/${propertyId}`)
    }
  } catch (error) {
    console.error('❌ Navigation error:', error)
    // ✅ Show user-friendly error without alert popup
    console.warn('Không thể mở chi tiết sản phẩm. Vui lòng thử lại!')
  }
}

// ✅ Helper functions with null checks
const handleImageError = (event) => {
  console.log('🖼️ Image load error, using fallback')
  event.target.src = `https://picsum.photos/600/400?random=${Math.floor(Math.random() * 1000)}`
}

const formatLocation = (location) => {
  if (!location) return 'Chưa cập nhật'
  
  if (typeof location === 'string') {
    return location
  }
  
  // Handle location object
  const parts = []
  if (location.district) parts.push(location.district)
  if (location.city) parts.push(location.city)
  if (location.address && !parts.length) parts.push(location.address)
  
  return parts.length > 0 ? parts.join(', ') : 'Chưa cập nhật'
}

const formatArea = (area) => {
  if (!area || area === 0) return '0'
  return new Intl.NumberFormat('vi-VN').format(area)
}

const formatPrice = (price) => {
  if (!price || price === 0) return 'Liên hệ'
  
  // Handle Vietnamese currency formatting
  if (price >= 1000000000) {
    return `${(price / 1000000000).toFixed(1).replace('.0', '')} tỷ`
  }
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(0)} triệu`
  }
  if (price >= 1000) {
    return `${(price / 1000).toFixed(0)} nghìn`
  }
  
  return new Intl.NumberFormat('vi-VN').format(price)
}

// ✅ Debug logging in development
if (process.env.NODE_ENV === 'development') {
  console.log('🏠 PropertyCard Debug:', {
    hasProperty: !!props.property,
    propertyKeys: props.property ? Object.keys(props.property) : [],
    canNavigate: canNavigate.value,
    isRent: props.isRent,
    link: canNavigate.value ? getPropertyLink() : 'No link'
  })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Loading state animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Enhanced hover effects */
.group:hover {
  transform: translateY(-8px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Smooth backdrop blur effect */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Disable pointer events for invalid properties */
.cursor-not-allowed {
  pointer-events: none;
}
</style>

<template>
  <NuxtLink 
    :to="`/projects/${project._id || project.id}`"
    class="block overflow-hidden transition-all duration-300 bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-2 group"
  >
    <!-- Project Image -->
    <div class="relative h-64 overflow-hidden">
      <img
        :src="project.image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300'"
        :alt="project.title"
        class="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
        @error="handleImageError"
      />
      <!-- Status Badge -->
      <div class="absolute top-3 left-3">
        <span class="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-full shadow-lg">
          Mới bàn giao
        </span>
      </div>
      
      <!-- Hover Overlay -->
      <div class="absolute inset-0 transition-opacity duration-300 opacity-0 bg-black/20 group-hover:opacity-100"></div>
      
      <!-- View Details on Hover -->
      <div class="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
        <span class="px-4 py-2 text-sm font-medium text-white transition-all duration-200 transform translate-y-2 rounded-full bg-white/20 backdrop-blur-sm group-hover:translate-y-0">
          Xem chi tiết dự án
        </span>
      </div>
    </div>

    <!-- Project Info -->
    <div class="p-4">
      <!-- Project Title -->
      <h3 class="mb-3 text-xl font-bold text-gray-900 transition-colors duration-200 group-hover:text-red-500">
        {{ project.title }}
      </h3>
      
      <!-- Location -->
      <div class="flex items-center mb-4 text-gray-600">
        <svg class="w-4 h-4 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
        </svg>
        <span class="text-sm">{{ project.location }}</span>
      </div>
      
      <!-- Project Stats Grid -->
      <div class="grid grid-cols-2 gap-4 mb-4">
        <!-- Left Column -->
        <div class="space-y-3">
          <div class="flex items-center text-gray-600">
            <svg class="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            <span class="text-sm font-medium">{{ project.floors || 12 }} tầng</span>
          </div>
          
          <div class="flex items-center text-gray-600">
            <svg class="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"/>
            </svg>
            <span class="text-sm font-medium">{{ project.blocks || 12 }} block</span>
          </div>
        </div>
        
        <!-- Right Column -->
        <div class="space-y-3">
          <div class="flex items-center text-gray-600">
            <svg class="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4a1 1 0 011-1h4m0 0V1m0 2h2m0 0V1m0 2h4a1 1 0 011 1v4m-1 0H9m12 0v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8"/>
            </svg>
            <span class="text-sm font-medium">{{ formatArea(project.area || 6000) }}m²</span>
          </div>
          
          <div class="flex items-center text-gray-600">
            <svg class="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
            </svg>
            <span class="text-sm font-medium">{{ formatNumber(project.apartments || 1584) }} căn hộ</span>
          </div>
        </div>
      </div>
      
      <!-- Price if available -->
      <div v-if="project.priceFrom" class="mb-4">
        <span class="text-lg font-bold text-red-500">
          Từ {{ formatPrice(project.priceFrom) }}
        </span>
        <span class="ml-1 text-sm text-gray-500">/ căn</span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  project: {
    type: Object,
    required: true
  }
})

// Handle image loading errors
const handleImageError = (event) => {
  event.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300'
}

// Format area number
const formatArea = (area) => {
  if (!area) return '0'
  return new Intl.NumberFormat('vi-VN').format(area)
}

// Format number (apartments, etc.)
const formatNumber = (number) => {
  if (!number) return '0'
  return new Intl.NumberFormat('vi-VN').format(number)
}

// Format price
const formatPrice = (price) => {
  if (!price || price === 0) return 'Liên hệ'
  
  if (price >= 1000000000) {
    return `${(price / 1000000000).toFixed(1)} tỷ`
  } else if (price >= 1000000) {
    return `${(price / 1000000).toFixed(0)} triệu`
  }
  return `${price.toLocaleString('vi-VN')}`
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
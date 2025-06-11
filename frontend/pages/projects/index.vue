<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- Header Section -->
    <div class="bg-white shadow-sm">
      <div class="container px-4 py-16 mx-auto max-w-7xl">
        <div class="text-center">
          <h1 class="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Dự án bất động sản
          </h1>
          <p class="max-w-2xl mx-auto text-xl text-gray-600">
            Khám phá những dự án bất động sản cao cấp với vị trí đắc địa và tiện ích hiện đại
          </p>
        </div>
      </div>
    </div>

    <!-- Filters & Content Section -->
    <div class="container px-4 py-8 mx-auto max-w-7xl">
      <!-- Filters Section -->
      <div class="p-6 mb-8 bg-white shadow-lg rounded-2xl">
        <h2 class="mb-6 text-xl font-bold text-gray-900">Bộ lọc tìm kiếm</h2>
        
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <!-- Location Filter -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700">Khu vực</label>
            <select 
              v-model="filters.location" 
              @change="applyFilters"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Tất cả khu vực</option>
              <option value="Quận 1">Quận 1</option>
              <option value="Quận 2">Quận 2</option>
              <option value="Quận 7">Quận 7</option>
              <option value="Bình Thạnh">Bình Thạnh</option>
              <option value="Thủ Đức">Thủ Đức</option>
            </select>
          </div>
          
          <!-- Status Filter -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700">Trạng thái</label>
            <select 
              v-model="filters.status" 
              @change="applyFilters"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Đang mở bán</option>
              <option value="upcoming">Sắp mở bán</option>
              <option value="completed">Đã hoàn thành</option>
            </select>
          </div>
          
          <!-- Price Range Filter -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700">Khoảng giá</label>
            <select 
              v-model="filters.priceRange" 
              @change="applyFilters"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Tất cả mức giá</option>
              <option value="under-2">Dưới 2 tỷ</option>
              <option value="2-5">2 - 5 tỷ</option>
              <option value="5-10">5 - 10 tỷ</option>
              <option value="above-10">Trên 10 tỷ</option>
            </select>
          </div>
          
          <!-- Sort Filter -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700">Sắp xếp</label>
            <select 
              v-model="filters.sort" 
              @change="applyFilters"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="i in 6" :key="i" class="p-6 bg-white shadow-lg rounded-2xl animate-pulse">
          <div class="h-48 mb-4 bg-gray-300 rounded-lg"></div>
          <div class="w-3/4 h-6 mb-2 bg-gray-300 rounded"></div>
          <div class="w-1/2 h-4 mb-4 bg-gray-300 rounded"></div>
          <div class="grid grid-cols-3 gap-2">
            <div class="h-4 bg-gray-300 rounded"></div>
            <div class="h-4 bg-gray-300 rounded"></div>
            <div class="h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="py-20 text-center">
        <p class="text-red-500">{{ error }}</p>
        <button @click="loadProjects" class="px-4 py-2 mt-4 text-white bg-red-500 rounded">
          Thử lại
        </button>
      </div>

      <!-- Projects Grid -->
      <div v-else>
        <!-- No Results -->
        <div v-if="filteredProjects.length === 0" class="py-20 text-center">
          <div class="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m5 0v-4a1 1 0 011-1h2a1 1 0 011 1v4M7 7h10M7 11h4"/>
            </svg>
          </div>
          <h3 class="mb-2 text-xl font-bold text-gray-900">Không tìm thấy dự án</h3>
          <p class="text-gray-600">Không có dự án nào phù hợp với tiêu chí tìm kiếm của bạn.</p>
        </div>

        <!-- Projects Grid -->
        <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeaturedProjectCard
            v-for="project in filteredProjects"
            :key="project.id || project._id"
            :project="project"
          />
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center mt-12">
        <nav class="flex space-x-2">
          <button
            v-if="currentPage > 1"
            @click="goToPage(currentPage - 1)"
            class="flex items-center px-3 py-2 text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ← Trước
          </button>
          
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'w-10 h-10 rounded-lg border text-sm',
              currentPage === page
                ? 'bg-red-500 text-white border-red-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            ]"
          >{{ page }}</button>
          
          <button
            v-if="currentPage < totalPages"
            @click="goToPage(currentPage + 1)"
            class="flex items-center px-3 py-2 text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Sau →
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import FeaturedProjectCard from '~/components/FeaturedProjectCard.vue'
import { ref, computed, watch, onMounted } from 'vue'

// Meta
definePageMeta({
  title: 'Dự án bất động sản'
})

useHead({
  title: 'Dự án bất động sản - Khám phá những dự án cao cấp',
  meta: [
    { name: 'description', content: 'Khám phá các dự án bất động sản cao cấp với vị trí đắc địa, tiện ích hiện đại và giá cả hợp lý.' }
  ]
})

const { getFeaturedProjects } = useApi()

// State
const projects = ref([])
const pending = ref(true)
const error = ref(null)
const currentPage = ref(1)
const itemsPerPage = 9

const filters = ref({
  location: '',
  status: '',
  priceRange: '',
  sort: 'newest'
})

// Transform project data
const transformProject = (project) => {
  const projectId = project._id || project.id
  
  if (!projectId || typeof projectId === 'object') {
    console.warn('⚠️ Invalid project ID:', projectId, 'for project:', project)
    return null
  }

  return {
    id: String(projectId),
    _id: String(projectId),
    title: project.title || project.name || 'Dự án bất động sản',
    name: project.name || project.title || 'Dự án bất động sản',
    location: project.location?.district ? 
      `${project.location.district}, ${project.location.city}` : 
      (project.location?.address || project.location?.city || 'Chưa cập nhật'),
    image: project.images?.[0] || project.image || 'https://picsum.photos/600/400',
    images: project.images || [],
    priceFrom: Number(project.priceFrom || project.price || 0),
    priceTo: Number(project.priceTo || project.priceFrom || project.price || 0),
    description: project.description || 'Dự án bất động sản cao cấp',
    status: project.status || 'active',
    apartments: Number(project.apartments || project.units || 0),
    floors: Number(project.floors || 0),
    blocks: Number(project.blocks || 0),
    area: Number(project.area || 0),
    completionDate: project.completionDate,
    developer: project.developer || 'Chưa cập nhật',
    featured: Boolean(project.featured),
    createdAt: project.createdAt || new Date().toISOString()
  }
}

// Load projects function
const loadProjects = async () => {
  try {
    pending.value = true
    error.value = null
    
    console.log('[projects/index.vue] loadProjects - Current Filters:', JSON.stringify(filters.value));
    console.log('[projects/index.vue] loadProjects - Calling getFeaturedProjects with filters:', JSON.stringify(filters.value));
    console.log('🔄 Loading featured projects...') // Existing log, can be kept or removed
    
    const response = await getFeaturedProjects(100, filters.value) // Assuming itemsPerPage is 100 for "all"
    console.log('[projects/index.vue] loadProjects - Raw API Response:', JSON.stringify(response));
    
    console.log('📦 Projects API Response:', response) // Existing log
    
    if (response.success && response.data) {
      const transformedProjects = response.data
        .map(transformProject)
        .filter(Boolean)
      projects.value = transformedProjects;
      console.log('[projects/index.vue] loadProjects - Transformed Projects (sample):', JSON.stringify(projects.value.slice(0, 2)));
    } else if (response.data) {
      const transformedProjects = response.data
        .map(transformProject)
        .filter(Boolean)
      projects.value = transformedProjects;
      console.log('[projects/index.vue] loadProjects - Transformed Projects (sample):', JSON.stringify(projects.value.slice(0, 2)));
    } else {
      projects.value = []
    }
    
    console.log(`✅ Loaded ${projects.value.length} valid projects`)
    
  } catch (err) {
    console.error('[projects/index.vue] loadProjects - Caught Error:', JSON.stringify(err.message));
    console.log('[projects/index.vue] loadProjects - Error ref value:', JSON.stringify(error.value));
    console.error('❌ Error loading projects:', err) // Existing log
    error.value = err.message || 'Lỗi khi tải dự án'
    projects.value = []
  } finally {
    pending.value = false
  }
}

// Computed
const filteredProjects = computed(() => {
  let result = [...projects.value]
  
  if (filters.value.location) {
    result = result.filter(p => p.location.includes(filters.value.location))
  }
  
  if (filters.value.status) {
    result = result.filter(p => p.status === filters.value.status)
  }
  
  if (filters.value.priceRange) {
    const range = filters.value.priceRange
    result = result.filter(p => {
      const price = p.priceFrom
      switch (range) {
        case 'under-2':
          return price < 2000000000
        case '2-5':
          return price >= 2000000000 && price <= 5000000000
        case '5-10':
          return price >= 5000000000 && price <= 10000000000
        case 'above-10':
          return price > 10000000000
        default:
          return true
      }
    })
  }
  
  switch (filters.value.sort) {
    case 'price-asc':
      result.sort((a, b) => a.priceFrom - b.priceFrom)
      break
    case 'price-desc':
      result.sort((a, b) => b.priceFrom - a.priceFrom)
      break
    case 'oldest':
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      break
    default:
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      break
  }
  
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return result.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(projects.value.length / itemsPerPage)
})

const visiblePages = computed(() => {
  const pages = []
  const maxPages = Math.min(totalPages.value, 5)
  const start = Math.max(1, currentPage.value - Math.floor(maxPages / 2))
  const end = Math.min(totalPages.value, start + maxPages - 1)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Methods
const applyFilters = () => {
  currentPage.value = 1
}

const goToPage = (page) => {
  if (typeof page === 'number') {
    currentPage.value = page
  }
}

// Initialize
onMounted(() => {
  console.log('🏗️ Projects page mounted')
  loadProjects()
})
</script>

<!-- ✅ NO STYLE SECTION TO AVOID TAILWIND ERRORS -->
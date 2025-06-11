<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Universal Search Bar -->
    <UniversalSearchBar
      initial-type="Mua nhà"
      :show-toggle="true"
      :disable-toggle="true"
      container-class="mt-[100px]"
      max-width="max-w-5xl"
      placeholder="Tìm kiếm căn hộ cần mua..."
      @search="onSearch"
    />

    <!-- Results Section -->
    <div class="container px-4 py-6 mx-auto max-w-7xl">
      <!-- Results Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="text-gray-700 font-inter">
          <span class="font-semibold">{{ totalResults }}</span> kết quả tìm kiếm cho
          <span class="font-semibold text-[#F62E56]">"Mua nhà"</span>
          <span v-if="route.query.keyword" class="ml-2">
            với từ khóa: "<span class="font-semibold text-[#F62E56]">{{ route.query.keyword }}</span>"
          </span>
        </div>
        
        <!-- Sort Options -->
        <div class="flex items-center space-x-4">
          <select 
            v-model="sortBy" 
            @change="loadProperties"
            class="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
          >
            <option value="newest">Mới nhất</option>
            <option value="price-low">Giá thấp đến cao</option>
            <option value="price-high">Giá cao đến thấp</option>
            <option value="area">Diện tích</option>
          </select>
        </div>
      </div>
      
      <!-- Loading State -->
      <div v-if="pending" class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div v-for="n in 8" :key="n" class="overflow-hidden bg-white rounded-lg shadow-sm animate-pulse">
          <div class="h-48 bg-gray-300"></div>
          <div class="p-4">
            <div class="h-4 mb-2 bg-gray-300 rounded"></div>
            <div class="w-3/4 h-4 mb-2 bg-gray-300 rounded"></div>
            <div class="w-1/2 h-6 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="py-20 text-center">
        <div class="max-w-md mx-auto">
          <svg class="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="mb-2 text-lg font-semibold">Lỗi tải dữ liệu!</h3>
          <p class="text-gray-500">{{ error }}</p>
          <button 
            @click="refresh()" 
            class="px-4 py-2 mt-4 text-white bg-red-500 rounded-lg hover:bg-red-600"
          >
            Thử lại
          </button>
        </div>
      </div>
      
      <!-- Results -->
      <div v-else>
        <!-- No Results -->
        <div v-if="filteredProperties.length === 0" class="py-20 text-center">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m5 0v-4a1 1 0 011-1h2a1 1 0 011 1v4M7 7h10M7 11h4"/>
          </svg>
          <h3 class="mb-2 text-xl font-bold text-gray-700">Không tìm thấy sản phẩm!</h3>
          <p class="text-gray-500">Hãy thử thay đổi từ khóa hoặc bộ lọc tìm kiếm.</p>
        </div>
        
        <!-- Properties Grid -->
        <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <PropertyCard
            v-for="property in paginatedProperties"
            :key="property.id || property._id"
            :property="property"
            :isRent="false"
          />
        </div>
      </div>
      
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center mt-8">
        <nav class="flex space-x-2">
          <button
            v-if="currentPage > 1"
            @click="goToPage(currentPage - 1)"
            class="flex items-center px-3 py-2 text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Trước
          </button>
          
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'w-10 h-10 rounded-lg border text-sm font-inter',
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
            Sau
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import PropertyCard from '~/components/PropertyCard.vue'
import UniversalSearchBar from '~/components/UniversalSearchBar.vue'
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// Meta
definePageMeta({
  title: 'Nhà đất bán'
})

useHead({
  title: 'Nhà đất bán - Bất động sản',
  meta: [
    { name: 'description', content: 'Tìm kiếm căn hộ, nhà phố cần mua với giá tốt nhất' }
  ]
})

const { getPropertiesForSale } = useApi()
const route = useRoute()

// ✅ State - BUY PAGE ONLY
const properties = ref([])
const pending = ref(false)
const error = ref(null)
const currentPage = ref(1)
const pageSize = 12
const totalResults = ref(0)
const sortBy = ref('newest')

// ✅ Transform backend data to frontend format - FOR SALE
const transformProperty = (property) => ({
  id: property._id,
  _id: property._id,
  title: property.title,
  name: property.title,
  image: property.images?.[0] || property.image || 'https://picsum.photos/600/400',
  images: property.images || [],
  price: property.price,
  location: property.location?.district ? 
    `${property.location.district}, ${property.location.city}` : 
    (property.location?.address || property.location?.city || ''),
  bedrooms: property.details?.bedrooms || property.bedrooms || 0,
  bathrooms: property.details?.bathrooms || property.bathrooms || 0,
  area: property.details?.area || property.area || 0,
  type: property.type || 'sale', // ✅ SALE TYPE
  category: property.category,
  description: property.description,
  featured: property.featured || false,
  status: property.status,
  createdAt: property.createdAt,
  views: property.views || 0
})

// ✅ Load properties function - FOR SALE
const loadProperties = async () => {
  try {
    console.log('[buy/index.vue] loadProperties - Current Filters:', JSON.stringify(filters));
    pending.value = true
    error.value = null
    
    const filters = {
      page: currentPage.value,
      limit: pageSize,
      sort: sortBy.value,
      ...route.query
    }

    console.log('🔄 Loading SALE properties with filters:', filters)

    const response = await getPropertiesForSale(pageSize, filters) // ✅ FOR SALE
    console.log('[buy/index.vue] loadProperties - Raw API Response:', JSON.stringify(response));
    
    console.log('📦 SALE API Response:', response)

    if (response.success && response.data) {
      properties.value = response.data.map(transformProperty)
      console.log('[buy/index.vue] loadProperties - Transformed Properties:', JSON.stringify(properties.value.slice(0, 2)));
      totalResults.value = response.pagination?.total || response.total || response.data.length
      console.log('[buy/index.vue] loadProperties - Total Results:', totalResults.value);
    } else if (response.data) {
      properties.value = response.data.map(transformProperty)
      console.log('[buy/index.vue] loadProperties - Transformed Properties:', JSON.stringify(properties.value.slice(0, 2)));
      totalResults.value = response.data.length
      console.log('[buy/index.vue] loadProperties - Total Results:', totalResults.value);
    } else {
      throw new Error('No data received from API')
    }
    
    console.log(`✅ Loaded ${properties.value.length} SALE properties`)
    console.log('🏠 SALE Properties data:', properties.value)
    
  } catch (err) {
    console.error('[buy/index.vue] loadProperties - Caught Error:', JSON.stringify(err.message));
    console.log('[buy/index.vue] loadProperties - Error ref value:', JSON.stringify(error.value));
    console.error('❌ Error fetching SALE properties:', err)
    error.value = err.message || 'Lỗi khi tải dữ liệu'
    properties.value = []
    totalResults.value = 0
  } finally {
    pending.value = false
  }
}

// ✅ Computed - SINGLE DECLARATIONS ONLY
const filteredProperties = computed(() => {
  console.log('🔍 Filtering SALE properties, total:', properties.value.length)
  return properties.value
})

const paginatedProperties = computed(() => {
  console.log('📄 Paginating SALE properties:', filteredProperties.value.length)
  return filteredProperties.value
})

const totalPages = computed(() => {
  return Math.ceil(totalResults.value / pageSize)
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

// ✅ Methods
const goToPage = (page) => {
  currentPage.value = page
  loadProperties()
}

const onSearch = (params) => {
  console.log('🔎 SALE search triggered:', params)
  currentPage.value = 1
  loadProperties()
}

const refresh = () => {
  loadProperties()
}

// ✅ Watchers
watch(() => route.query, () => {
  currentPage.value = 1
  loadProperties()
}, { deep: true })

watch(sortBy, () => {
  currentPage.value = 1
  loadProperties()
})

// ✅ Initialize
onMounted(() => {
  console.log('🏠 BUY page mounted')
  loadProperties()
})
</script>
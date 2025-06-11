<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Universal Search Bar -->
    <UniversalSearchBar
      initial-type="Thuê nhà"
      :show-toggle="true"
      :disable-toggle="true"
      container-class="mt-[100px]"
      max-width="max-w-5xl"
      placeholder="Tìm kiếm căn hộ cho thuê..."
      @search="onRentSearch"
    />

    <!-- Results Section -->
    <div class="container px-4 py-6 mx-auto max-w-7xl">
      <!-- Results Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="text-gray-700 font-inter">
          <span class="font-semibold">{{ total }}</span> kết quả tìm kiếm cho
          <span class="font-semibold text-[#F62E56]">"Thuê nhà"</span>
          <span v-if="route.query.keyword" class="ml-2">
            với từ khóa: "<span class="font-semibold text-[#F62E56]">{{ route.query.keyword }}</span>"
          </span>
        </div>
        
        <!-- Sort Options -->
        <div class="flex items-center space-x-4">
          <select 
            v-model="sort" 
            @change="loadRentProperties"
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
      <div v-if="loading" class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
      <div v-else-if="errorMsg" class="py-20 text-center">
        <div class="max-w-md mx-auto">
          <svg class="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="mb-2 text-lg font-semibold">Lỗi tải dữ liệu!</h3>
          <p class="text-gray-500">{{ errorMsg }}</p>
          <button 
            @click="refreshRent()" 
            class="px-4 py-2 mt-4 text-white bg-red-500 rounded-lg hover:bg-red-600"
          >
            Thử lại
          </button>
        </div>
      </div>
      
      <!-- Results -->
      <div v-else>
        <!-- No Results -->
        <div v-if="filteredRentProperties.length === 0" class="py-20 text-center">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m5 0v-4a1 1 0 011-1h2a1 1 0 011 1v4M7 7h10M7 11h4"/>
          </svg>
          <h3 class="mb-2 text-xl font-bold text-gray-700">Không tìm thấy sản phẩm!</h3>
          <p class="text-gray-500">Hãy thử thay đổi từ khóa hoặc bộ lọc tìm kiếm.</p>
        </div>
        
        <!-- Properties Grid -->
        <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <PropertyCard
            v-for="property in paginatedRentProperties"
            :key="property.id || property._id"
            :property="property"
            :isRent="true"
          />
        </div>
      </div>
      
      <!-- Pagination -->
      <div v-if="rentTotalPages > 1" class="flex justify-center mt-8">
        <nav class="flex space-x-2">
          <button
            v-if="page > 1"
            @click="goToRentPage(page - 1)"
            class="flex items-center px-3 py-2 text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Trước
          </button>
          
          <button
            v-for="pageNum in rentVisiblePages"
            :key="pageNum"
            @click="goToRentPage(pageNum)"
            :class="[
              'w-10 h-10 rounded-lg border text-sm font-inter',
              page === pageNum
                ? 'bg-[#F62E56] text-white border-[#F62E56]'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            ]"
          >{{ pageNum }}</button>
          
          <button
            v-if="page < rentTotalPages"
            @click="goToRentPage(page + 1)"
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
  title: 'Nhà đất cho thuê'
})

useHead({
  title: 'Nhà đất cho thuê - Bất động sản',
  meta: [
    { name: 'description', content: 'Tìm kiếm căn hộ, nhà phố cho thuê với giá tốt nhất' }
  ]
})

const { getPropertiesForRent } = useApi()
const route = useRoute()

// ✅ State - RENT PAGE ONLY - RENAMED TO AVOID CONFLICTS
const saleProperties = ref([])
const loading = ref(false)
const errorMsg = ref(null)
const page = ref(1)
const limit = 12
const total = ref(0)
const sort = ref('newest')

// ✅ Transform backend data to frontend format - FOR RENT
const transformRentProperty = (property) => ({
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
  type: property.type || 'rent', // ✅ RENT TYPE
  category: property.category,
  description: property.description,
  featured: property.featured || false,
  status: property.status,
  createdAt: property.createdAt,
  views: property.views || 0
})

// ✅ Load properties function - FOR RENT
const loadRentProperties = async () => {
  try {
    loading.value = true
    errorMsg.value = null
    
    const filters = {
      page: page.value,
      limit: limit,
      sort: sort.value,
      ...route.query
    }
    console.log('[rent/index.vue] loadRentProperties - Current Filters:', JSON.stringify(filters));

    console.log('🔄 Loading RENT properties with filters:', filters)

    const response = await getPropertiesForRent(limit, filters) // ✅ FOR RENT
    console.log('[rent/index.vue] loadRentProperties - Raw API Response:', JSON.stringify(response));
    
    console.log('📦 RENT API Response:', response)

    if (response.success && response.data) {
      saleProperties.value = response.data.map(transformRentProperty)
      console.log('[rent/index.vue] loadRentProperties - Transformed Properties (sample):', JSON.stringify(saleProperties.value.slice(0, 2)));
      total.value = response.pagination?.total || response.total || response.data.length
      console.log('[rent/index.vue] loadRentProperties - Total Results:', total.value);
    } else if (response.data) {
      saleProperties.value = response.data.map(transformRentProperty)
      console.log('[rent/index.vue] loadRentProperties - Transformed Properties (sample):', JSON.stringify(saleProperties.value.slice(0, 2)));
      total.value = response.data.length
      console.log('[rent/index.vue] loadRentProperties - Total Results:', total.value);
    } else {
      throw new Error('No data received from API')
    }
    
    console.log(`✅ Loaded ${saleProperties.value.length} RENT properties`)
    console.log('🏠 RENT Properties data:', saleProperties.value)
    
  } catch (err) {
    console.error('[rent/index.vue] loadRentProperties - Caught Error:', JSON.stringify(err.message));
    console.log('[rent/index.vue] loadRentProperties - Error ref value:', JSON.stringify(errorMsg.value));
    console.error('❌ Error fetching RENT properties:', err)
    errorMsg.value = err.message || 'Lỗi khi tải dữ liệu'
    saleProperties.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// ✅ Computed - UNIQUE NAMES
const filteredRentProperties = computed(() => {
  console.log('🔍 Filtering RENT properties, total:', saleProperties.value.length)
  return saleProperties.value
})

const paginatedRentProperties = computed(() => {
  console.log('📄 Paginating RENT properties:', filteredRentProperties.value.length)
  return filteredRentProperties.value
})

const rentTotalPages = computed(() => {
  return Math.ceil(total.value / limit)
})

const rentVisiblePages = computed(() => {
  const pages = []
  const maxPages = Math.min(rentTotalPages.value, 5)
  const start = Math.max(1, page.value - Math.floor(maxPages / 2))
  const end = Math.min(rentTotalPages.value, start + maxPages - 1)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// ✅ Methods - UNIQUE NAMES
const goToRentPage = (pageNum) => {
  page.value = pageNum
  loadRentProperties()
}

const onRentSearch = (params) => {
  console.log('🔎 RENT search triggered:', params)
  page.value = 1
  loadRentProperties()
}

const refreshRent = () => {
  loadRentProperties()
}

// ✅ Watchers
watch(() => route.query, () => {
  page.value = 1
  loadRentProperties()
}, { deep: true })

watch(sort, () => {
  page.value = 1
  loadRentProperties()
})

// ✅ Initialize
onMounted(() => {
  console.log('🏠 RENT page mounted')
  loadRentProperties()
})
</script>
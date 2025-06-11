<template>
  <div class="overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-sm hover:shadow-md">
    <!-- Property Image -->
    <div class="relative h-48 cursor-pointer" @click="goToProperty">
      <img
        :src="property?.image || 'https://picsum.photos/600/400'"
        :alt="property?.title || property?.name"
        class="object-cover w-full h-full"
        @error="handleImageError"
      />

      <!-- Type Badge -->
      <div class="absolute top-3 left-3">
        <span class="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded">
          {{ isRent ? 'Cho thuê' : 'Bán' }}
        </span>
      </div>

      <!-- Featured Badge -->
      <div v-if="property?.featured" class="absolute top-3 right-3">
        <span class="px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded">
          Nổi bật
        </span>
      </div>
    </div>

    <!-- Property Content -->
    <div class="p-4">
      <!-- Property Title -->
      <h3 class="mb-2 text-lg font-semibold text-gray-900 cursor-pointer line-clamp-2" @click="goToProperty">
        {{ property?.title || property?.name }}
      </h3>

      <!-- Location -->
      <div class="flex items-center mb-3 text-gray-600">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <span class="text-sm">{{ property?.location || 'Chưa cập nhật' }}</span>
      </div>

      <!-- Price -->
      <div class="mb-3">
        <div class="text-xl font-bold text-red-500">
          {{ property?.price }}
          <span v-if="isRent" class="text-sm font-normal text-gray-600">/tháng</span>
        </div>
      </div>

      <!-- Property Details -->
      <div class="flex justify-between mb-4 text-center">
        <div class="flex-1">
          <div class="text-sm font-semibold text-gray-900">{{ property?.bedrooms || 0 }}</div>
          <div class="text-xs text-gray-600">Phòng ngủ</div>
        </div>
        <div class="flex-1">
          <div class="text-sm font-semibold text-gray-900">{{ property?.bathrooms || 0 }}</div>
          <div class="text-xs text-gray-600">Phòng tắm</div>
        </div>
        <div class="flex-1">
          <div class="text-sm font-semibold text-gray-900">{{ property?.area || 0 }}</div>
          <div class="text-xs text-gray-600">m²</div>
        </div>
      </div>

      <!-- Action Button -->
      <button
        @click="goToProperty"
        class="w-full px-4 py-2 text-white transition-colors duration-200 bg-red-500 rounded hover:bg-red-600"
      >
        Xem chi tiết
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import PropertyCard from '~/components/PropertyCard.vue'
import UniversalSearchBar from '~/components/UniversalSearchBar.vue'
import FeaturedProjectCard from '~/components/FeaturedProjectCard.vue'

const props = defineProps({
  property: Object
})

// Meta
definePageMeta({
  title: 'Trang chủ - Bất động sản'
})

useHead({
  title: 'Bất động sản xác thực & tin cậy',
  meta: [
    { name: 'description', content: 'Nền tảng bất động sản uy tín với hàng nghìn sản phẩm chất lượng' }
  ]
})

// ✅ USE REAL API COMPOSABLE
const { getFeaturedProjects, getPropertiesForRent, getPropertiesForSale, getFeaturedNews } = useApi()

// ✅ LOADING STATES
const isLoadingProjects = ref(true)
const isLoadingRentals = ref(true)
const isLoadingSales = ref(true)
const newsLoading = ref(true)
const newsError = ref(null)

// ✅ DATA STORAGE
const projects = ref([])
const rentalProperties = ref([])
const saleProperties = ref([])
const news = ref([])

// Tab states
const activeProjectTab = ref(0)
const activeRentalTab = ref(0)
const activeSaleTab = ref(0)
const activeNewsTab = ref(0)

// ✅ 15 TỈNH THÀNH TRỌNG ĐIỂM
const vietnamCities = [
  'Tất cả',
  'TP.HCM',
  'Hà Nội',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'Biên Hòa',
  'Nha Trang',
  'Hạ Long',
  'Vũng Tàu',
  'Đà Lạt',
  'Huế',
  'Quy Nhơn',
  'Vinh',
  'Buôn Ma Thuột',
  'Thái Nguyên'
]

const projectTabs = [...vietnamCities]
const rentalTabs = [...vietnamCities]
const saleTabs = [...vietnamCities]
const newsTabs = ['Tất cả', 'Thị trường', 'Phân tích', 'Dự án', 'Chính sách', 'Đầu tư']

// ✅ CITY MAPPING FOR FILTERING
const cityMapping = {
  0: null, // Tất cả
  1: ['Ho Chi Minh City', 'TP.HCM', 'Sài Gòn', 'TPHCM', 'Ho Chi Minh', 'HCM'],
  2: ['Ha Noi', 'Hà Nội', 'Hanoi', 'HN'],
  3: ['Da Nang', 'Đà Nẵng', 'Danang', 'DN'],
  4: ['Hai Phong', 'Hải Phòng', 'Haiphong', 'HP'],
  5: ['Can Tho', 'Cần Thơ', 'Cantho', 'CT'],
  6: ['Bien Hoa', 'Biên Hòa', 'Đồng Nai', 'Dong Nai'],
  7: ['Nha Trang', 'Khánh Hòa', 'Khanh Hoa'],
  8: ['Ha Long', 'Hạ Long', 'Quảng Ninh', 'Quang Ninh'],
  9: ['Vung Tau', 'Vũng Tàu', 'Bà Rịa', 'Ba Ria'],
  10: ['Da Lat', 'Đà Lạt', 'Lâm Đồng', 'Lam Dong'],
  11: ['Hue', 'Huế', 'Thừa Thiên Huế', 'Thua Thien Hue'],
  12: ['Quy Nhon', 'Quy Nhơn', 'Bình Định', 'Binh Dinh'],
  13: ['Vinh', 'Nghệ An', 'Nghe An'],
  14: ['Buon Ma Thuot', 'Buôn Ma Thuột', 'Đắk Lắk', 'Dak Lak'],
  15: ['Thai Nguyen', 'Thái Nguyên']
}

// ✅ ENHANCED TRANSFORM FUNCTIONS - ENSURE VALID IDs
const transformProperty = (property) => {
  if (!property?._id && !property?.id) {
    console.warn('⚠️ Property missing ID:', property)
    return null
  }

  return {
    id: String(property?._id || property?.id),
    _id: String(property?._id || property?.id),
    title: property?.title || property?.name || 'Bất động sản',
    name: property?.title || property?.name || 'Bất động sản',
    image: property?.images?.[0] || property?.image || 'https://picsum.photos/600/400',
    images: property?.images || [],
    price: Number(property?.price || 0),
    location: property?.location?.district ?
      `${property?.location.district}, ${property?.location.city}` :
      (property?.location?.address || property?.location?.city || property?.location || 'Chưa cập nhật'),
    type: property?.type || 'sale',
    bedrooms: Number(property?.details?.bedrooms || property?.bedrooms || 0),
    bathrooms: Number(property?.details?.bathrooms || property?.bathrooms || 0),
    area: Number(property?.details?.area || property?.area || 0),
    featured: Boolean(property?.isFeatured || property?.featured),
    status: property?.status || 'active',
    description: property?.description || '',
    views: Number(property?.views || 0),
    createdAt: property?.createdAt,
    publishedAt: property?.publishedAt
  }
}

const transformProject = (project) => {
  if (!project?._id && !project?.id) {
    return null
  }

  return {
    id: String(project._id || project.id),
    _id: String(project._id || project.id),
    title: project.title || project.name || 'Dự án bất động sản',
    name: project.name || project.title || 'Dự án bất động sản',
    image: project.images?.[0]?.url || project.images?.[0] || project.image || 'https://picsum.photos/800/600',
    images: project.images || [],
    priceFrom: Number(project.pricing?.priceFrom || project.priceFrom || 0),
    priceTo: Number(project.pricing?.priceTo || project.priceTo || 0),
    location: project.location?.district ?
      `${project.location.district}, ${project.location.city}` :
      (project.location?.city || project.location?.address || project.location || 'Chưa cập nhật'),
    developer: project.developer?.name || project.developer || 'Chưa cập nhật',
    status: project.status || 'active',
    apartments: Number(project.details?.totalApartments || project.apartments || 0),
    floors: Number(project.details?.floors || project.floors || 0),
    blocks: Number(project.details?.blocks || project.blocks || 0),
    area: Number(project.details?.totalArea || project.area || 0),
    featured: Boolean(project.isFeatured || project.featured),
    description: project.description || 'Dự án bất động sản cao cấp',
    createdAt: project.createdAt
  }
}

const transformNews = (article) => {
  if (!article?._id && !article?.id) {
    console.warn('⚠️ News article missing ID:', article)
    return null
  }

  return {
    id: String(article._id || article.id),
    _id: String(article._id || article.id),
    title: article.title || 'Tin tức bất động sản',
    excerpt: article.excerpt || article.description || '',
    description: article.description || article.excerpt || '',
    content: article.content || '',
    image: article.image || article.thumbnail || 'https://picsum.photos/600/400',
    thumbnail: article.thumbnail || article.image || 'https://picsum.photos/600/400',
    category: article.category || 'Tin tức',
    author: article.author?.fullName || article.author || 'Admin',
    publishedAt: article.publishedAt || article.createdAt,
    createdAt: article.createdAt || article.publishedAt,
    views: Number(article.views || 0),
    readTime: Number(article.readTime || 5),
    tags: article.tags || [],
    featured: Boolean(article.isFeatured || article.featured)
  }
}

// ✅ FIXED: CORRECT API CALLS
const loadFeaturedProjects = async () => {
  try {
    isLoadingProjects.value = true

    // ✅ FIXED: Use correct API method
    const response = await getFeaturedProjects(8)

    if (response?.success && response?.data) {
      const transformedProjects = response.data
        .map(transformProject)
        .filter(Boolean)

      projects.value = transformedProjects
    } else if (response?.data && Array.isArray(response.data)) {
      // Handle direct array response
      const transformedProjects = response.data
        .map(transformProject)
        .filter(Boolean)

      projects.value = transformedProjects
    } else {
      console.warn('⚠️ No projects data received:', response)
      projects.value = []
    }
  } catch (error) {
    console.error('❌ Error loading projects:', error)
    projects.value = []
  } finally {
    isLoadingProjects.value = false
  }
}

const loadRentalProperties = async () => {
  try {
    isLoadingRentals.value = true

    // ✅ FIXED: Use correct API method
    const response = await getPropertiesForRent(12, { featured: 'true' })

    if (response?.success && response?.data) {
      const transformedRentals = response.data
        .map(transformProperty)
        .filter(Boolean)

      rentalProperties.value = transformedRentals
    } else if (response?.data && Array.isArray(response.data)) {
      // Handle direct array response
      const transformedRentals = response.data
        .map(transformProperty)
        .filter(Boolean)

      rentalProperties.value = transformedRentals
    } else {
      console.warn('⚠️ No rental properties data received:', response)
      rentalProperties.value = []
    }
  } catch (error) {
    console.error('❌ Error loading rentals:', error)
    rentalProperties.value = []
  } finally {
    isLoadingRentals.value = false
  }
}

const loadSaleProperties = async () => {
  try {
    isLoadingSales.value = true

    // ✅ FIXED: Use correct API method
    const response = await getPropertiesForSale(12, { featured: 'true' })

    if (response?.success && response?.data) {
      const transformedSales = response.data
        .map(transformProperty)
        .filter(Boolean)

      saleProperties.value = transformedSales
    } else if (response?.data && Array.isArray(response.data)) {
      // Handle direct array response
      const transformedSales = response.data
        .map(transformProperty)
        .filter(Boolean)

      saleProperties.value = transformedSales
    } else {
      console.warn('⚠️ No sale properties data received:', response)
      saleProperties.value = []
    }
  } catch (error) {
    console.error('❌ Error loading sales:', error)
    saleProperties.value = []
  } finally {
    isLoadingSales.value = false
  }
}

const loadFeaturedNews = async () => {
  try {
    newsLoading.value = true
    newsError.value = null

    // ✅ FIXED: Use correct API method
    const response = await getFeaturedNews(6)

    if (response?.success && response?.data) {
      const transformedNews = response.data
        .map(transformNews)
        .filter(Boolean)

      news.value = transformedNews
    } else if (response?.data && Array.isArray(response.data)) {
      // Handle direct array response
      const transformedNews = response.data
        .map(transformNews)
        .filter(Boolean)

      news.value = transformedNews
    } else {
      console.warn('⚠️ No news data received:', response)
      news.value = []
    }
  } catch (error) {
    console.error('❌ Error loading news:', error)
    newsError.value = error.message || 'Không thể tải tin tức'
    news.value = []
  } finally {
    newsLoading.value = false
  }
}

// ✅ ENHANCED FILTER FUNCTION
const filterByCity = (items, tabIndex) => {
  if (tabIndex === 0 || !items.length) return items // Tất cả

  const cityVariants = cityMapping[tabIndex]
  if (!cityVariants) return items

  return items.filter(item => {
    const location = (item.location || '').toLowerCase()
    return cityVariants.some(variant =>
      location.includes(variant.toLowerCase())
    )
  })
}

// ✅ LOAD ALL DATA
const loadHomeData = async () => {

  // Load all data in parallel
  await Promise.all([
    loadFeaturedProjects(),
    loadRentalProperties(),
    loadSaleProperties(),
    loadFeaturedNews()
  ])


}

// ✅ FILTERED DATA COMPUTED
const filteredProjects = computed(() => {
  const filtered = filterByCity(projects.value, activeProjectTab.value)
  return filtered
})

const filteredRentals = computed(() => {
  const filtered = filterByCity(rentalProperties.value, activeRentalTab.value)
  return filtered
})

const filteredSales = computed(() => {
  const filtered = filterByCity(saleProperties.value, activeSaleTab.value)
  return filtered
})

const filteredNews = computed(() => {
  if (activeNewsTab.value === 0) return news.value
  const targetCategory = newsTabs[activeNewsTab.value]
  return news.value.filter(n => n.category === targetCategory)
})

// ✅ STATS COMPUTED
const totalStats = computed(() => ({
  properties: rentalProperties.value.length + saleProperties.value.length,
  news: news.value.length
}))

// ✅ SEARCH HANDLER
const onSearch = (searchData) => {

  const queryParams = new URLSearchParams()
  if (searchData.keyword) queryParams.set('keyword', searchData.keyword)
  if (searchData.location) queryParams.set('location', searchData.location)
  if (searchData.priceRange) queryParams.set('priceRange', searchData.priceRange)

  const queryString = queryParams.toString()

  if (searchData.type === 'rent') {
    navigateTo(`/rent${queryString ? '?' + queryString : ''}`)
  } else {
    navigateTo(`/buy${queryString ? '?' + queryString : ''}`)
  }
}

// ✅ REFRESH FUNCTIONS
const refreshNews = async () => {
  await loadFeaturedNews()
}

const refreshProjects = async () => {
  await loadFeaturedProjects()
}

const refreshProperties = async () => {
  await Promise.all([
    loadRentalProperties(),
    loadSaleProperties()
  ])
}

// ✅ HELPER FUNCTIONS
const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch (error) {
    return ''
  }
}

const handleImageError = (event) => {
  event.target.src = 'https://picsum.photos/600/400?random=' + Math.floor(Math.random() * 1000)
}

// ✅ LOAD DATA ON MOUNT
onMounted(() => {
  loadHomeData()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

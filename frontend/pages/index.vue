<template>
  <div class="flex flex-col gap-8">
    <!-- Hero Section -->
    <section
      class="flex flex-col items-center justify-center w-full pt-6 pb-2 bg-white"
      style="min-height: 600px;"
    >
      <div
        class="flex flex-col items-center justify-between w-full gap-12 px-4 mx-auto mt-20 md:flex-row max-w-7xl"
      >
        <!-- Left: Main Text -->
        <div class="flex flex-col items-center w-full max-w-xl gap-8 md:items-start md:gap-14">
          <div class="flex flex-col w-full gap-1">
            <h1 class="text-3xl font-bold leading-tight text-center text-black md:text-left md:text-5xl font-inter">
              NỀN TẢNG BẤT ĐỘNG SẢN
              <span class="text-[#F62E56]">XÁC THỰC</span>
              <span class="text-black"> & </span>
              <span class="text-[#F62E56]">TIN CẬY</span>
            </h1>
            <p class="mt-2 text-base text-center md:text-lg font-inter text-stone-700 md:text-left">
              Nâng tầm chất lượng cuộc sống
            </p>
          </div>
          <!-- Stats (ẩn trên mobile) -->
          <div class="items-center hidden gap-10 md:flex">
            <div>
              <div class="text-4xl font-medium text-stone-900 font-inter md:text-5xl">{{ totalStats.properties }}+</div>
              <p class="text-base leading-tight font-inter text-stone-700">sản phẩm <br />bất động sản</p>
            </div>
            <div class="w-px h-14 bg-stone-200"></div>
            <div>
              <div class="text-4xl font-medium text-stone-900 font-inter md:text-5xl">{{ totalStats.news }}+</div>
              <p class="text-base leading-tight font-inter text-stone-700">tin tức <br />cập nhật</p>
            </div>
          </div>
        </div>
        <!-- Right: Image -->
        <img
          src="../assets/images/cef3f7e8db9fbab15b0d1a0905b75277e8690064.png"
          alt="Real Estate Hero"
          class="hidden md:block w-[340px] md:w-[420px] lg:w-[480px] xl:w-[552px] h-auto rounded-xl shadow-md"
        />
      </div>
      
      <!-- Universal Search Bar -->
      <UniversalSearchBar
        :show-toggle="true"
        container-class="mt-8 md:mt-12"
        max-width="max-w-5xl"
        placeholder="Tìm kiếm căn hộ, chung cư, nhà phố..."
        @search="onSearch"
      />
      
      <!-- Stats (hiện trên mobile) -->
      <div class="flex items-center justify-center gap-10 mt-6 md:hidden">
        <div>
          <div class="text-2xl font-medium text-stone-900 font-inter">{{ totalStats.properties }}+</div>
          <p class="text-sm leading-tight text-center font-inter text-stone-700">sản phẩm <br />bất động sản</p>
        </div>
        <div class="w-px h-10 bg-stone-200"></div>
        <div>
          <div class="text-2xl font-medium text-stone-900 font-inter">{{ totalStats.news }}+</div>
          <p class="text-sm leading-tight text-center font-inter text-stone-700">tin tức <br />cập nhật</p>
        </div>
      </div>
    </section>

    <!-- Featured Projects Section -->
    <div class="container px-8 py-4 mx-auto max-w-7xl">
      <!-- Title -->
      <h2 class="mb-6 text-[32px] font-bold text-gray-900 font-inter">Dự án nổi bật</h2>

      <!-- Tabs -->
      <div class="flex pb-2 mb-6 overflow-x-auto hide-scrollbar">
        <div class="flex w-full space-x-12 border-b border-stone-200">
          <button
            v-for="(tab, index) in projectTabs"
            :key="index"
            @click="activeProjectTab = index"
            :class=" [
              'pb-3 font-medium transition-colors whitespace-nowrap font-inter',
              activeProjectTab === index
                ? 'text-[#F62E56] border-b-2 border-[#F62E56]'
                : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            {{ tab }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoadingProjects" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="n in 4" :key="n" class="overflow-hidden bg-white rounded-lg shadow-sm animate-pulse">
          <div class="h-48 bg-gray-300"></div>
          <div class="p-4">
            <div class="w-3/4 h-4 mb-2 bg-gray-300 rounded"></div>
            <div class="w-1/2 h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Project Grid -->
      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <FeaturedProjectCard
          v-for="project in filteredProjects"
          :key="project._id || project.id"
          :project="project"
        />
      </div>

      <!-- No Projects Message -->
      <div v-if="!isLoadingProjects && filteredProjects.length === 0" class="py-12 text-center">
        <div class="flex flex-col items-center justify-center">
          <svg class="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m5 0v-4a1 1 0 011-1h2a1 1 0 011 1v4M7 7h10M7 11h4"/>
          </svg>
        </div>
        <h3 class="mb-2 text-xl font-bold text-gray-900">Không tìm thấy dự án</h3>
        <p class="text-gray-600">Không có dự án nào tại {{ projectTabs[activeProjectTab] }}.</p>
      </div>

      <!-- View More Button -->
      <div class="flex justify-center mt-8">
        <NuxtLink
          to="/projects"
          class="px-6 py-2 text-sm font-medium text-white transition-colors bg-red-500 rounded hover:bg-red-600 font-inter"
        >
          Xem thêm →
        </NuxtLink>
      </div>
    </div>

    <!-- Rental Properties Section -->
    <div class="container px-8 py-4 mx-auto max-w-7xl">
      <h2 class="mb-6 text-[32px] font-bold text-gray-900 font-inter">Nhà đất cho thuê</h2>

      <!-- Tabs -->
      <div class="flex pb-2 mb-6 overflow-x-auto hide-scrollbar">
        <div class="flex w-full space-x-12 border-b border-stone-200">
          <button
            v-for="(tab, index) in rentalTabs"
            :key="index"
            @click="activeRentalTab = index"
            :class=" [
              'pb-3 font-medium transition-colors whitespace-nowrap font-inter',
              activeRentalTab === index
                ? 'text-[#F62E56] border-b-2 border-[#F62E56]'
                : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            {{ tab }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoadingRentals" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="n in 4" :key="n" class="overflow-hidden bg-white rounded-lg shadow-sm animate-pulse">
          <div class="h-48 bg-gray-300"></div>
          <div class="p-4">
            <div class="w-3/4 h-4 mb-2 bg-gray-300 rounded"></div>
            <div class="w-1/2 h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Rental Grid -->
      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <PropertyCard
          v-for="rental in filteredRentals"
          :key="rental.id || rental._id"
          :property="rental"
          :isRent="true"
        />
      </div>

      <!-- No Rentals Message -->
      <div v-if="!isLoadingRentals && filteredRentals.length === 0" class="py-12 text-center">
        <h3 class="mb-2 text-lg font-medium text-gray-600">
          Không có nhà đất cho thuê tại {{ rentalTabs[activeRentalTab] }}
        </h3>
        <p class="text-gray-500">Thử chọn khu vực khác hoặc xem tất cả cho thuê.</p>
      </div>

      <!-- View More Button -->
      <div class="flex justify-center mt-8">
        <NuxtLink
          to="/rent"
          class="px-6 py-2 text-sm font-medium text-white transition-colors bg-red-500 rounded hover:bg-red-600 font-inter"
        >
          Xem thêm →
        </NuxtLink>
      </div>
    </div>

    <!-- Sale Properties Section -->
    <div class="container px-8 py-4 mx-auto max-w-7xl">
      <h2 class="mb-6 text-[32px] font-bold text-gray-900 font-inter">Nhà đất bán</h2>

      <!-- Tabs -->
      <div class="flex pb-2 mb-6 overflow-x-auto hide-scrollbar">
        <div class="flex w-full space-x-12 border-b border-stone-200">
          <button
            v-for="(tab, index) in saleTabs"
            :key="index"
            @click="activeSaleTab = index"
            :class=" [
              'pb-3 font-medium transition-colors whitespace-nowrap font-inter',
              activeSaleTab === index
                ? 'text-[#F62E56] border-b-2 border-[#F62E56]'
                : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            {{ tab }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoadingSales" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="n in 4" :key="n" class="overflow-hidden bg-white rounded-lg shadow-sm animate-pulse">
          <div class="h-48 bg-gray-300"></div>
          <div class="p-4">
            <div class="w-3/4 h-4 mb-2 bg-gray-300 rounded"></div>
            <div class="w-1/2 h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Sale Grid -->
      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <PropertyCard
          v-for="sale in filteredSales"
          :key="sale.id || sale._id"
          :property="sale"
          :isRent="false"
        />
      </div>

      <!-- No Sales Message -->
      <div v-if="!isLoadingSales && filteredSales.length === 0" class="py-12 text-center">
        <h3 class="mb-2 text-lg font-medium text-gray-600">
          Không có nhà đất bán tại {{ saleTabs[activeSaleTab] }}
        </h3>
        <p class="text-gray-500">Thử chọn khu vực khác hoặc xem tất cả bán.</p>
      </div>

      <!-- View More Button -->
      <div class="flex justify-center mt-8">
        <NuxtLink
          to="/buy"
          class="px-6 py-2 text-sm font-medium text-white transition-colors bg-red-500 rounded hover:bg-red-600 font-inter"
        >
          Xem thêm →
        </NuxtLink>
      </div>
    </div>

    <!-- News Section -->
    <div class="container px-8 py-4 mx-auto max-w-7xl">
      <h2 class="mb-6 text-[32px] font-bold text-gray-900 font-inter">Tin tức bất động sản</h2>

      <!-- Tabs -->
      <div class="flex pb-2 mb-6 overflow-x-auto hide-scrollbar">
        <div class="flex w-full space-x-12 border-b border-stone-200">
          <button
            v-for="(tab, index) in newsTabs"
            :key="index"
            @click="activeNewsTab = index"
            :class=" [
              'pb-3 font-medium transition-colors whitespace-nowrap font-inter',
              activeNewsTab === index
                ? 'text-[#F62E56] border-b-2 border-[#F62E56]'
                : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            {{ tab }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoadingNews" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="n in 3" :key="n" class="overflow-hidden bg-white rounded-lg shadow-sm animate-pulse">
          <div class="h-48 bg-gray-300"></div>
          <div class="p-4">
            <div class="w-3/4 h-4 mb-2 bg-gray-300 rounded"></div>
            <div class="w-1/2 h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>

      <!-- News Grid -->
      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="article in filteredNews"
          :key="article._id || article.id"
          class="overflow-hidden transition-shadow bg-white rounded-lg shadow-sm hover:shadow-lg"
        >
          <NuxtLink :to="`/news/${article._id || article.id}`" class="block">
            <img
              :src="article.image || article.thumbnail || '/images/news-default.jpg'"
              :alt="article.title"
              class="object-cover w-full h-48"
            />
            <div class="p-6">
              <div class="flex items-center mb-3">
                <span class="px-3 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-full">
                  {{ article.category }}
                </span>
                <span class="ml-auto text-sm text-gray-500">
                  {{ formatDate(article.publishedAt || article.createdAt) }}
                </span>
              </div>
              <h3 class="mb-2 text-lg font-semibold text-gray-900 line-clamp-2 font-inter">
                {{ article.title }}
              </h3>
              <p class="text-sm text-gray-600 line-clamp-2">
                {{ article.excerpt || article.description || truncateText(article.content, 100) }}
              </p>
              <div class="flex items-center justify-between mt-4">
                <span class="text-xs text-gray-500">
                  {{ article.readTime || 5 }} phút đọc
                </span>
                <span class="text-xs text-gray-500">
                  {{ formatNumber(article.views || 0) }} lượt xem
                </span>
              </div>
            </div>
          </NuxtLink>
        </article>
      </div>

      <!-- No News Message -->
      <div v-if="!isLoadingNews && filteredNews.length === 0" class="py-12 text-center">
        <h3 class="mb-2 text-lg font-medium text-gray-600">
          Không có tin tức {{ newsTabs[activeNewsTab] }}
        </h3>
        <p class="text-gray-500">Thử chọn danh mục khác hoặc xem tất cả tin tức.</p>
      </div>

      <!-- View More Button -->
      <div class="flex justify-center mt-8">
        <NuxtLink
          to="/news"
          class="px-6 py-2 text-sm font-medium text-white transition-colors bg-red-500 rounded hover:bg-red-600 font-inter"
        >
          Xem thêm →
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import PropertyCard from '~/components/PropertyCard.vue'
import UniversalSearchBar from '~/components/UniversalSearchBar.vue'
import FeaturedProjectCard from '~/components/FeaturedProjectCard.vue'

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
    id: String(property._id || property.id),
    _id: String(property._id || property.id),
    title: property.title || property.name || 'Bất động sản',
    name: property.title || property.name || 'Bất động sản',
    image: property.images?.[0] || property.image || 'https://picsum.photos/600/400',
    images: property.images || [],
    price: Number(property.price || 0),
    location: property.location?.district ? 
      `${property.location.district}, ${property.location.city}` : 
      (property.location?.address || property.location?.city || property.location || 'Chưa cập nhật'),
    type: property.type || 'sale',
    bedrooms: Number(property.details?.bedrooms || property.bedrooms || 0),
    bathrooms: Number(property.details?.bathrooms || property.bathrooms || 0),
    area: Number(property.details?.area || property.area || 0),
    featured: Boolean(property.isFeatured || property.featured),
    status: property.status || 'active',
    description: property.description || '',
    views: Number(property.views || 0),
    createdAt: property.createdAt,
    publishedAt: property.publishedAt
  }
}

const transformProject = (project) => {
  if (!project?._id && !project?.id) {
    console.warn('⚠️ Project missing ID:', project)
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
    isLoadingProjects.value = true;
    console.log('[index.vue] loadFeaturedProjects - Starting load...');
    const apiUrl = '/projects/featured?limit=8';
    console.log('[index.vue] loadFeaturedProjects - Fetching URL with $api:', apiUrl);
    
    const response = await $api(apiUrl);
    console.log('[index.vue] loadFeaturedProjects - Raw API Response:', JSON.stringify(response));
    
    if (response?.success && response?.data) {
      const transformedProjects = response.data
        .map(transformProject)
        .filter(Boolean);
      projects.value = transformedProjects;
      console.log('[index.vue] loadFeaturedProjects - Transformed Projects (sample):', JSON.stringify(projects.value.slice(0, 2)));
    } else if (response?.data && Array.isArray(response.data)) {
      const transformedProjects = response.data
        .map(transformProject)
        .filter(Boolean);
      projects.value = transformedProjects;
      console.log('[index.vue] loadFeaturedProjects - Transformed Projects from direct array (sample):', JSON.stringify(projects.value.slice(0, 2)));
    } else {
      console.warn('[index.vue] loadFeaturedProjects - No projects data in response:', JSON.stringify(response));
      projects.value = [];
    }
  } catch (error) {
    console.error('[index.vue] loadFeaturedProjects - Caught Error:', error.message, JSON.stringify(error.data));
    projects.value = [];
  } finally {
    isLoadingProjects.value = false;
    console.log('[index.vue] loadFeaturedProjects - Finished load. isLoadingProjects:', isLoadingProjects.value);
  }
};

const loadRentalProperties = async () => {
  try {
    isLoadingRentals.value = true;
    console.log('[index.vue] loadRentalProperties - Starting load...');
    const apiUrl = '/properties?type=rent&limit=12&featured=true';
    console.log('[index.vue] loadRentalProperties - Fetching URL with $api:', apiUrl);
    
    const response = await $api(apiUrl);
    console.log('[index.vue] loadRentalProperties - Raw API Response:', JSON.stringify(response));
    
    if (response?.success && response?.data) {
      const transformedRentals = response.data
        .map(transformProperty)
        .filter(Boolean);
      rentalProperties.value = transformedRentals;
      console.log('[index.vue] loadRentalProperties - Transformed Rental Properties (sample):', JSON.stringify(rentalProperties.value.slice(0, 2)));
    } else if (response?.data && Array.isArray(response.data)) {
      const transformedRentals = response.data
        .map(transformProperty)
        .filter(Boolean);
      rentalProperties.value = transformedRentals;
      console.log('[index.vue] loadRentalProperties - Transformed Rental Properties from direct array (sample):', JSON.stringify(rentalProperties.value.slice(0, 2)));
    } else {
      console.warn('[index.vue] loadRentalProperties - No rental properties data in response:', JSON.stringify(response));
      rentalProperties.value = [];
    }
  } catch (error) {
    console.error('[index.vue] loadRentalProperties - Caught Error:', error.message, JSON.stringify(error.data));
    rentalProperties.value = [];
  } finally {
    isLoadingRentals.value = false;
    console.log('[index.vue] loadRentalProperties - Finished load. isLoadingRentals:', isLoadingRentals.value);
  }
};

const loadSaleProperties = async () => {
  try {
    isLoadingSales.value = true;
    console.log('[index.vue] loadSaleProperties - Starting load...');
    const apiUrl = '/properties?type=sale&limit=12&featured=true';
    console.log('[index.vue] loadSaleProperties - Fetching URL with $api:', apiUrl);
    
    const response = await $api(apiUrl);
    console.log('[index.vue] loadSaleProperties - Raw API Response:', JSON.stringify(response));
    
    if (response?.success && response?.data) {
      const transformedSales = response.data
        .map(transformProperty)
        .filter(Boolean);
      saleProperties.value = transformedSales;
      console.log('[index.vue] loadSaleProperties - Transformed Sale Properties (sample):', JSON.stringify(saleProperties.value.slice(0, 2)));
    } else if (response?.data && Array.isArray(response.data)) {
      const transformedSales = response.data
        .map(transformProperty)
        .filter(Boolean);
      saleProperties.value = transformedSales;
      console.log('[index.vue] loadSaleProperties - Transformed Sale Properties from direct array (sample):', JSON.stringify(saleProperties.value.slice(0, 2)));
    } else {
      console.warn('[index.vue] loadSaleProperties - No sale properties data in response:', JSON.stringify(response));
      saleProperties.value = [];
    }
  } catch (error) {
    console.error('[index.vue] loadSaleProperties - Caught Error:', error.message, JSON.stringify(error.data));
    saleProperties.value = [];
  } finally {
    isLoadingSales.value = false;
    console.log('[index.vue] loadSaleProperties - Finished load. isLoadingSales:', isLoadingSales.value);
  }
};

const loadFeaturedNews = async () => {
  try {
    newsLoading.value = true;
    newsError.value = null;
    console.log('[index.vue] loadFeaturedNews - Starting load...');
    const apiUrl = '/news/featured?limit=6';
    console.log('[index.vue] loadFeaturedNews - Fetching URL with $api:', apiUrl);
    
    const response = await $api(apiUrl);
    console.log('[index.vue] loadFeaturedNews - Raw API Response:', JSON.stringify(response));
    
    if (response?.success && response?.data) {
      const transformedNews = response.data
        .map(transformNews)
        .filter(Boolean);
      news.value = transformedNews;
      console.log('[index.vue] loadFeaturedNews - Transformed News (sample):', JSON.stringify(news.value.slice(0, 2)));
    } else if (response?.data && Array.isArray(response.data)) {
      const transformedNews = response.data
        .map(transformNews)
        .filter(Boolean);
      news.value = transformedNews;
      console.log('[index.vue] loadFeaturedNews - Transformed News from direct array (sample):', JSON.stringify(news.value.slice(0, 2)));
    } else {
      console.warn('[index.vue] loadFeaturedNews - No news data in response:', JSON.stringify(response));
      news.value = [];
    }
  } catch (error) {
    console.error('[index.vue] loadFeaturedNews - Caught Error:', error.message, JSON.stringify(error.data));
    newsError.value = error.message || 'Không thể tải tin tức';
    news.value = [];
  } finally {
    newsLoading.value = false;
    console.log('[index.vue] loadFeaturedNews - Finished load. newsLoading:', newsLoading.value, 'newsError:', newsError.value);
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
  console.log('🚀 Loading homepage data...')
  
  // Load all data in parallel
  await Promise.all([
    loadFeaturedProjects(),
    loadRentalProperties(),
    loadSaleProperties(),
    loadFeaturedNews()
  ])
  
  console.log('✅ Homepage data loaded!')
  console.log('📊 Final counts:', {
    projects: projects.value.length,
    rentals: rentalProperties.value.length,
    sales: saleProperties.value.length,
    news: news.value.length
  })
}

// ✅ FILTERED DATA COMPUTED
const filteredProjects = computed(() => {
  const filtered = filterByCity(projects.value, activeProjectTab.value)
  console.log(`🔍 Filtered projects: ${filtered.length}/${projects.value.length} for tab ${activeProjectTab.value}`)
  return filtered
})

const filteredRentals = computed(() => {
  const filtered = filterByCity(rentalProperties.value, activeRentalTab.value)
  console.log(`🔍 Filtered rentals: ${filtered.length}/${rentalProperties.value.length} for tab ${activeRentalTab.value}`)
  return filtered
})

const filteredSales = computed(() => {
  const filtered = filterByCity(saleProperties.value, activeSaleTab.value)
  console.log(`🔍 Filtered sales: ${filtered.length}/${saleProperties.value.length} for tab ${activeSaleTab.value}`)
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
  console.log('🔍 Search triggered:', searchData)
  
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

<style>
.font-inter {
  font-family: "Inter", sans-serif;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
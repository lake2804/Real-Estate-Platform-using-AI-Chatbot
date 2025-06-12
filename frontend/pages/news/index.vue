<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="py-16 text-white bg-gradient-to-r from-blue-600 to-purple-600">
      <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="mb-4 text-4xl font-bold md:text-5xl">
            📰 Tin Tức Bất Động Sản
          </h1>
          <p class="max-w-3xl mx-auto text-xl opacity-90">
            Cập nhật thông tin mới nhất về thị trường, phân tích xu hướng và hướng dẫn đầu tư
          </p>
        </div>
      </div>
    </section>

    <!-- Filters -->
    <section class="bg-white border-b">
      <div class="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <!-- Category Filter -->
          <div class="flex flex-wrap gap-2">
            <button
              v-for="category in categories"
              :key="category"
              @click="selectedCategory = category"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ category }}
            </button>
          </div>

          <!-- Sort Options -->
          <select 
            v-model="sortBy"
            class="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Mới nhất</option>
            <option value="popular">Phổ biến</option>
            <option value="featured">Nổi bật</option>
          </select>
        </div>
      </div>
    </section>

    <!-- News Grid -->
    <section class="py-12">
      <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <!-- Loading State -->
        <div v-if="pending" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="i in 6" :key="i" class="animate-pulse">
            <div class="mb-4 bg-gray-200 rounded-lg aspect-video"></div>
            <div class="h-4 mb-2 bg-gray-200 rounded"></div>
            <div class="w-3/4 h-3 bg-gray-200 rounded"></div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="py-12 text-center">
          <div class="mb-4 text-red-500">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="mb-2 text-xl font-bold text-gray-900">Có lỗi xảy ra</h3>
          <p class="mb-4 text-gray-600">{{ error }}</p>
          <button 
            @click="loadNews" 
            class="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>

        <!-- News Grid -->
        <div v-else-if="filteredNews.length > 0" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <article 
            v-for="article in paginatedNews" 
            :key="article._id"
            class="overflow-hidden transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg"
          >
            <!-- Article Image -->
            <NuxtLink :to="`/news/${article._id}`" class="block">
              <div class="overflow-hidden bg-gray-200 aspect-video">
                <img 
                  :src="article.thumbnail" 
                  :alt="article.title"
                  class="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
              </div>
            </NuxtLink>

            <!-- Article Content -->
            <div class="p-6">
              <!-- Category Badge -->
              <span class="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2">
                {{ article.category }}
              </span>

              <!-- Title -->
              <NuxtLink :to="`/news/${article._id}`">
                <h3 class="mb-2 text-lg font-bold text-gray-900 transition-colors hover:text-blue-600 line-clamp-2">
                  {{ article.title }}
                </h3>
              </NuxtLink>

              <!-- Summary -->
              <p class="mb-4 text-sm text-gray-600 line-clamp-3">
                {{ article.summary }}
              </p>

              <!-- Meta Info -->
              <div class="flex items-center justify-between text-xs text-gray-500">
                <div class="flex items-center space-x-4">
                  <span>📅 {{ formatDate(article.publishedAt || article.createdAt) }}</span>
                  <span>👁️ {{ article.views || 0 }}</span>
                </div>
                <div v-if="article.isFeatured || article.featured" class="text-yellow-500">
                  ⭐ Nổi bật
                </div>
              </div>
            </div>
          </article>
        </div>

        <!-- Empty State -->
        <div v-else class="py-12 text-center">
          <div class="mb-4 text-gray-400">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
            </svg>
          </div>
          <h3 class="mb-2 text-xl font-bold text-gray-900">Chưa có bài viết nào</h3>
          <p class="text-gray-600">Không tìm thấy bài viết nào phù hợp với tiêu chí của bạn.</p>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center mt-12">
          <nav class="flex space-x-2">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="currentPage = page"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
          </nav>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const { getNews, getNewsCategories } = useNews()

// SEO
useHead({
  title: 'Tin Tức Bất Động Sản - Real Estate Platform',
  meta: [
    { name: 'description', content: 'Cập nhật tin tức mới nhất về thị trường bất động sản, phân tích xu hướng và hướng dẫn đầu tư.' }
  ]
})

// State
const news = ref([])
const categories = ref(['Tất cả', 'Tin tức', 'Phân tích', 'Pháp lý', 'Dự án', 'Đầu tư', 'Hướng dẫn'])
const selectedCategory = ref('Tất cả')
const sortBy = ref('newest')
const currentPage = ref(1)
const itemsPerPage = 9
const pending = ref(true)
const error = ref(null)

// Computed
const filteredNews = computed(() => {
  let filtered = news.value

  // Filter by category
  if (selectedCategory.value !== 'Tất cả') {
    filtered = filtered.filter(article => article.category === selectedCategory.value)
  }

  // Sort
  switch (sortBy.value) {
    case 'popular':
      filtered = filtered.sort((a, b) => (b.views || 0) - (a.views || 0))
      break
    case 'featured':
      filtered = filtered.sort((a, b) => {
        const aFeatured = a.isFeatured || a.featured
        const bFeatured = b.isFeatured || b.featured
        return bFeatured - aFeatured
      })
      break
    default: // newest
      filtered = filtered.sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.createdAt)
        const dateB = new Date(b.publishedAt || b.createdAt)
        return dateB - dateA
      })
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredNews.value.length / itemsPerPage))

const paginatedNews = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredNews.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Methods
const loadNews = async () => {
  try {
    pending.value = true
    error.value = null
    
    const response = await getNews({ limit: 50 })
    
    if (response.success) {
      news.value = response.data
    } else {
      throw new Error(response.error || 'Không thể tải tin tức')
    }
  } catch (err) {
    console.error('❌ Error loading news:', err)
    error.value = err.message
  } finally {
    pending.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Watchers
watch([selectedCategory, sortBy], () => {
  currentPage.value = 1
})

// Initialize
onMounted(() => {
  loadNews()
})
</script>

<style scoped>
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
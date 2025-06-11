<template>
  <div class="min-h-screen pt-12 pb-12 bg-white">
    <div class="flex flex-col gap-10 px-6 pb-0 mx-auto max-w-7xl md:flex-row">
      <!-- Main content -->
      <div class="flex-1 w-full">
        <!-- Loading State -->
        <div v-if="pending" class="animate-pulse">
          <div class="h-64 mb-8 bg-gray-300 rounded-2xl"></div>
          <div class="space-y-4">
            <div v-for="n in 5" :key="n" class="flex gap-4 p-4 bg-gray-100 rounded-xl">
              <div class="w-32 h-24 bg-gray-300 rounded-lg"></div>
              <div class="flex-1 space-y-2">
                <div class="h-4 bg-gray-300 rounded"></div>
                <div class="w-3/4 h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Featured news -->
        <div v-else-if="newsList.length" class="mb-8">
          <NuxtLink :to="`/news/${newsList[0]._id || newsList[0].id}`">
            <div class="relative overflow-hidden transition-shadow bg-white shadow rounded-2xl hover:shadow-lg">
              <img
                :src="newsList[0]?.image || newsList[0]?.thumbnail || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'"
                class="w-full h-[260px] md:h-[340px] object-cover"
                :alt="newsList[0].title"
              />
              <div class="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/60 to-transparent">
                <h2 class="mb-2 text-2xl font-bold text-white md:text-3xl">{{ newsList[0].title }}</h2>
                <div class="flex items-center gap-2 mb-1 text-sm text-white/80">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-width="2" d="M12 8v4l3 3"/>
                    <circle cx="12" cy="12" r="10" stroke-width="2"/>
                  </svg>
                  <span>{{ formatDate(newsList[0].createdAt || newsList[0].publishedAt) }}</span>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- List news -->
        <div class="flex flex-col gap-4">
          <div
            v-for="(item, idx) in visibleNews"
            :key="item._id || item.id"
            class="flex gap-4 p-4 transition-shadow bg-white shadow rounded-xl hover:shadow-lg"
          >
            <img
              :src="item.image || item.thumbnail || 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80'"
              class="flex-shrink-0 object-cover w-32 h-24 rounded-lg"
              :alt="item.title"
            />
            <div class="flex flex-col flex-1">
              <div class="flex items-center gap-2 mb-1 text-xs text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-width="2" d="M12 8v4l3 3"/>
                  <circle cx="12" cy="12" r="10" stroke-width="2"/>
                </svg>
                <span>{{ formatDate(item.createdAt || item.publishedAt) }}</span>
              </div>
              <NuxtLink
                :to="`/news/${item._id || item.id}`"
                class="font-semibold text-[#1C1917] text-base mb-1 hover:text-[#F62E56] line-clamp-2 transition-colors"
              >
                {{ item.title }}
              </NuxtLink>
              <p class="text-sm text-gray-500 line-clamp-2">{{ item.description || item.excerpt }}</p>
            </div>
          </div>
        </div>

        <!-- Xem thêm -->
        <div class="flex justify-center mt-8">
          <button
            class="px-8 py-3 bg-[#F62E56] text-white rounded-lg font-semibold font-inter hover:bg-[#d81b4a] transition"
            @click="loadMore"
            v-if="visibleNews.length < newsList.length - 1"
          >
            Xem thêm
          </button>
        </div>

        <!-- No data state -->
        <div v-if="!pending && !newsList.length" class="py-12 text-center">
          <h3 class="mb-2 text-lg font-medium text-gray-900">Không có tin tức nào</h3>
          <p class="text-gray-600">Hiện tại chưa có tin tức nào được đăng tải.</p>
        </div>
      </div>

      <!-- Sidebar -->
      <aside class="w-full md:w-[320px] flex-shrink-0">
        <div class="p-6 mb-6 bg-white shadow rounded-xl">
          <div class="font-bold text-base mb-4 text-[#1C1917]">Bài viết được xem nhiều nhất</div>
          <ul class="flex flex-col gap-3">
            <li v-for="item in mostViewed" :key="item._id || item.id">
              <NuxtLink
                :to="`/news/${item._id || item.id}`"
                class="text-sm text-[#1C1917] hover:text-[#F62E56] transition line-clamp-2"
              >
                {{ item.title }}
              </NuxtLink>
            </li>
          </ul>
        </div>
        <div class="p-6 bg-white shadow mt-9 rounded-xl">
          <div class="font-bold text-base mb-2 text-[#1C1917]">Tin mới</div>
          <ul class="flex flex-col gap-2">
            <li v-for="item in latestNews" :key="item._id || item.id">
              <NuxtLink
                :to="`/news/${item._id || item.id}`"
                class="text-sm text-[#1C1917] hover:text-[#F62E56] transition line-clamp-1"
              >
                {{ item.title }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Meta
definePageMeta({
  title: 'Tin tức bất động sản'
})

useHead({
  title: 'Tin tức bất động sản - Cập nhật thông tin thị trường',
  meta: [
    { name: 'description', content: 'Tin tức và phân tích thị trường bất động sản mới nhất từ các chuyên gia hàng đầu' }
  ]
})

const { getNews, getFeaturedNews } = useApi()

// State
const news = ref([])
const featuredNews = ref([])
const pending = ref(true)
const error = ref(null)
const visibleCount = ref(5)
const PAGE_SIZE = 5

// ✅ Load news data
const loadNews = async () => {
  try {
    pending.value = true
    error.value = null

    console.log('[news/index.vue] loadNews - Starting load...');
    console.log('🔄 Loading news...') // Existing log

    // Load all news
    const newsResponse = await getNews(100)
    console.log('[news/index.vue] loadNews - Raw API Response (all news):', JSON.stringify(newsResponse));
    if (newsResponse.success && newsResponse.data) {
      news.value = newsResponse.data.map(transformNews)
      console.log('[news/index.vue] loadNews - Transformed News (sample):', JSON.stringify(news.value.slice(0, 2)));
    }

    // Load featured news  
    const featuredResponse = await getFeaturedNews(5)
    // Optional: log featuredResponse if needed, but subtask focuses on all news
    if (featuredResponse.success && featuredResponse.data) {
      featuredNews.value = featuredResponse.data.map(transformNews)
    }
    
    console.log(`✅ Loaded ${news.value.length} news articles, ${featuredNews.value.length} featured`)
    
  } catch (err) {
    console.error('[news/index.vue] loadNews - Caught Error:', JSON.stringify(err.message));
    console.log('[news/index.vue] loadNews - Error ref value:', JSON.stringify(error.value));
    console.error('❌ Error fetching news:', err) // Existing log
    error.value = err.message || 'Lỗi khi tải tin tức'
    news.value = []
    featuredNews.value = []
  } finally {
    pending.value = false
  }
}

// ✅ Transform news data
const transformNews = (article) => ({
  id: article._id,
  _id: article._id,
  title: article.title,
  excerpt: article.excerpt || article.description || '',
  content: article.content,
  image: article.image || article.thumbnail || '',
  category: article.category,
  author: article.author?.fullName || 'Admin',
  publishedAt: article.publishedAt || article.createdAt,
  views: article.views || 0,
  readTime: article.readTime || 5,
  isFeatured: article.isFeatured || false,
  createdAt: article.createdAt
})

// Computed
const newsList = computed(() => {
  return news.value
    .sort((a, b) => new Date(b.createdAt || b.publishedAt) - new Date(a.createdAt || a.publishedAt))
})

const mostViewed = computed(() => {
  return newsList.value
    .filter(item => item.views > 0)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5)
})

const latestNews = computed(() => {
  return newsList.value
    .sort((a, b) => new Date(b.createdAt || b.publishedAt) - new Date(a.createdAt || a.publishedAt))
    .slice(0, 5)
})

const topFeaturedNews = computed(() => {
  return featuredNews.value
    .sort((a, b) => new Date(b.createdAt || b.publishedAt) - new Date(a.createdAt || a.publishedAt))
    .slice(0, 5)
})

const visibleNews = computed(() => newsList.value.slice(1, 1 + visibleCount.value))

// Methods
function loadMore() {
  if (visibleCount.value < newsList.value.length - 1) {
    visibleCount.value += PAGE_SIZE
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'Mới đây'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Mới đây'
    
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffMins < 1) return 'Vừa xong'
    if (diffMins < 60) return `${diffMins} phút trước`
    if (diffHours < 24) return `${diffHours} giờ trước`
    if (diffDays < 7) return `${diffDays} ngày trước`
    
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    return 'Mới đây'
  }
}

// Load data on mount
onMounted(() => {
  loadNews()
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
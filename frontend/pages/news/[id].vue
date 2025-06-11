<template>
  <div class="min-h-screen pt-5 bg-gradient-to-b from-gray-50 to-white">
    <!-- Loading State -->
    <div v-if="pending" class="max-w-4xl px-4 pt-8 pb-12 mx-auto">
      <div class="animate-pulse">
        <!-- Header skeleton -->
        <div class="mb-8">
          <div class="w-32 h-10 mb-6 bg-gray-300 rounded-full"></div>
          <div class="w-full mb-6 bg-gray-300 h-80 rounded-3xl"></div>
          <div class="w-3/4 h-8 mb-4 bg-gray-300 rounded-lg"></div>
          <div class="flex gap-4 mb-6">
            <div class="w-24 h-6 bg-gray-300 rounded-full"></div>
            <div class="w-32 h-6 bg-gray-300 rounded-full"></div>
          </div>
        </div>
        
        <!-- Content skeleton -->
        <div class="space-y-4">
          <div class="w-full h-4 bg-gray-300 rounded"></div>
          <div class="w-full h-4 bg-gray-300 rounded"></div>
          <div class="w-2/3 h-4 bg-gray-300 rounded"></div>
          <div class="w-full h-4 bg-gray-300 rounded"></div>
          <div class="w-4/5 h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Article Content -->
    <article v-else-if="article" class="max-w-4xl px-4 pt-8 pb-12 mx-auto">
      <!-- Header Section -->
      <header class="mb-12">
        <!-- Back Button -->
        <NuxtLink
          to="/news"
          class="inline-flex items-center gap-2 mb-8 px-6 py-3 rounded-full bg-white shadow-lg hover:shadow-xl text-[#F62E56] font-semibold hover:scale-105 transition-all duration-300 border border-[#F62E56]/10"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Quay lại danh sách tin
        </NuxtLink>
        
        <!-- Hero Image -->
        <div class="relative mb-8 overflow-hidden shadow-2xl rounded-3xl">
          <img
            v-if="article.image || article.thumbnail"
            :src="article.image || article.thumbnail"
            :alt="article.title"
            class="object-cover w-full transition-transform duration-700 h-80 md:h-96 hover:scale-105"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          
          <!-- Category Badge -->
          <div v-if="article.category" class="absolute top-6 left-6">
            <span class="px-4 py-2 text-sm font-semibold text-white bg-[#F62E56] rounded-full shadow-lg backdrop-blur-sm">
              {{ article.category }}
            </span>
          </div>
          
          <!-- Featured Badge -->
          <div v-if="article.featured" class="absolute top-6 right-6">
            <span class="px-3 py-1 text-xs font-bold text-[#F62E56] bg-white rounded-full shadow-lg flex items-center gap-1">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              Nổi bật
            </span>
          </div>
        </div>
        
        <!-- Article Title -->
        <h1 class="mb-6 text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl">
          {{ article.title }}
        </h1>
        
        <!-- Article Meta -->
        <div class="flex flex-wrap items-center gap-6 mb-6 text-gray-600">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-[#F62E56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-width="2" d="M12 8v4l3 3"/>
              <circle cx="12" cy="12" r="10" stroke-width="2"/>
            </svg>
            <span class="font-medium">{{ formatDate(article.createdAt || article.publishedAt) }}</span>
          </div>
          
          <div v-if="article.author" class="flex items-center gap-2">
            <svg class="w-5 h-5 text-[#F62E56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <span class="font-medium">{{ article.author }}</span>
          </div>
          
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-[#F62E56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            <span class="font-medium">{{ (article.views || 0) + 1 }} lượt xem</span>
          </div>
        </div>
        
        <!-- Summary -->
        <div v-if="article.excerpt || article.description" class="p-6 bg-gradient-to-r from-[#F62E56]/5 to-[#F62E56]/10 rounded-2xl border-l-4 border-[#F62E56]">
          <p class="text-lg font-medium leading-relaxed text-gray-800 md:text-xl">
            {{ article.excerpt || article.description }}
          </p>
        </div>
      </header>

      <!-- Article Content -->
      <div class="mb-12">
        <div class="prose prose-lg md:prose-xl max-w-none">
          <div v-if="article.content" v-html="article.content" class="article-content"></div>
          <div v-else class="py-8 text-center text-gray-600">
            <p class="text-lg">Nội dung đang được cập nhật...</p>
          </div>
        </div>
      </div>

      <!-- Tags Section -->
      <div v-if="article.tags && article.tags.length" class="mb-12">
        <h3 class="flex items-center gap-2 mb-4 text-xl font-bold text-gray-900">
          <svg class="w-5 h-5 text-[#F62E56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
          </svg>
          Thẻ
        </h3>
        <div class="flex flex-wrap gap-3">
          <span 
            v-for="tag in article.tags" 
            :key="tag"
            class="px-4 py-2 text-sm font-medium bg-white text-gray-700 rounded-full shadow-md hover:shadow-lg hover:bg-[#F62E56] hover:text-white transition-all duration-300 cursor-pointer border border-gray-200"
          >
            #{{ tag }}
          </span>
        </div>
      </div>

      <!-- Social Share Section -->
      <div class="p-6 mb-12 bg-gray-50 rounded-2xl">
        <h3 class="mb-4 text-lg font-bold text-gray-900">Chia sẻ bài viết</h3>
        <div class="flex gap-3">
          <button @click="shareOnFacebook" class="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
          <button @click="shareOnTwitter" class="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-400 rounded-lg hover:bg-blue-500">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
            </svg>
            Twitter
          </button>
          <button @click="copyLink" class="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-gray-600 rounded-lg hover:bg-gray-700">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
            </svg>
            Sao chép link
          </button>
        </div>
      </div>

      <!-- Related Articles -->
      <div v-if="relatedArticles.length" class="pt-12 border-t">
        <div class="flex items-center gap-3 mb-8">
          <div class="w-1 h-8 bg-[#F62E56] rounded-full"></div>
          <h2 class="text-2xl font-bold text-gray-900 md:text-3xl">Tin tức liên quan</h2>
        </div>
        
        <div class="grid gap-6 md:grid-cols-2">
          <NuxtLink
            v-for="item in relatedArticles"
            :key="item._id || item.id"
            :to="`/news/${item._id || item.id}`"
            class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#F62E56]/20"
          >
            <div class="relative overflow-hidden">
              <img
                :src="item.image || item.thumbnail || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'"
                :alt="item.title"
                class="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-110"
              />
              <div class="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/20 to-transparent group-hover:opacity-100"></div>
            </div>
            
            <div class="p-6">
              <div class="flex items-center gap-2 mb-3 text-sm text-gray-500">
                <svg class="w-4 h-4 text-[#F62E56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-width="2" d="M12 8v4l3 3"/>
                  <circle cx="12" cy="12" r="10" stroke-width="2"/>
                </svg>
                {{ formatDate(item.createdAt || item.publishedAt) }}
              </div>
              
              <h3 class="font-bold text-gray-900 group-hover:text-[#F62E56] text-lg mb-2 line-clamp-2 transition-colors duration-300">
                {{ item.title }}
              </h3>
              
              <p v-if="item.excerpt || item.description" class="text-sm text-gray-600 line-clamp-2">
                {{ item.excerpt || item.description }}
              </p>
              
              <div class="flex items-center justify-between mt-4">
                <span class="text-[#F62E56] font-semibold text-sm group-hover:underline">
                  Đọc thêm →
                </span>
                <span v-if="item.views" class="text-xs text-gray-400">
                  {{ item.views }} lượt xem
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </article>

    <!-- Error State -->
    <div v-else class="max-w-4xl px-4 py-20 mx-auto text-center">
      <div class="p-12 bg-white shadow-xl rounded-3xl">
        <div class="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
        </div>
        <h2 class="mb-4 text-2xl font-bold text-gray-900">Không tìm thấy tin tức</h2>
        <p class="mb-8 text-gray-600">Tin tức bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <NuxtLink
          to="/news"
          class="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#F62E56] text-white font-semibold hover:bg-[#F62E56]/90 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Quay lại danh sách tin tức
        </NuxtLink>
      </div>
    </div>

    <!-- Debug info (development only) -->
    <div v-if="isDev" class="max-w-4xl px-4 pb-8 mx-auto">
      <div class="p-6 font-mono text-sm text-white bg-gray-900 rounded-2xl">
        <h3 class="mb-4 text-lg font-bold text-yellow-400">🔧 Debug Info</h3>
        <div class="grid gap-2">
          <div><span class="text-yellow-400">ID:</span> {{ route.params.id }}</div>
          <div><span class="text-yellow-400">API:</span> {{ `${config.public.apiBase}/api/news/${route.params.id}` }}</div>
          <div><span class="text-yellow-400">Pending:</span> {{ pending }}</div>
          <div><span class="text-yellow-400">Error:</span> {{ !!error }}</div>
          <div><span class="text-yellow-400">Article:</span> {{ !!article }}</div>
          <div><span class="text-yellow-400">Title:</span> {{ article?.title || 'None' }}</div>
          <div><span class="text-yellow-400">Available:</span> {{ 
            allNewsData?.success ? allNewsData.data?.length :
            Array.isArray(allNewsData) ? allNewsData.length : 0
          }} news</div>
        </div>
        
        <!-- Test Links -->
        <div v-if="allNewsData?.success && allNewsData.data?.length" class="mt-6">
          <div class="mb-2 text-yellow-400">🔗 Test Links:</div>
          <div class="flex flex-wrap gap-2">
            <NuxtLink 
              v-for="news in allNewsData.data.slice(0, 3)" 
              :key="news._id"
              :to="`/news/${news._id}`"
              class="px-3 py-1 text-xs transition-colors bg-blue-600 rounded hover:bg-blue-700"
            >
              {{ news.title.substring(0, 25) }}...
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// ✅ IMPORT CONFIG FIRST
const config = useRuntimeConfig()
const route = useRoute()
const newsId = route.params.id

// ✅ Check if in development mode
const isDev = config.public.dev || process.env.NODE_ENV === 'development'

console.log('🔍 News detail page loading...')
console.log('📋 Route params:', route.params)
console.log('📋 News ID:', newsId)
console.log('📋 API Base:', config.public.apiBase)

// ✅ FETCH NEWS DATA using useApi composable
const { $api } = useApi()

// Fetch specific article
const { data: articleData, pending, error } = await useFetch(`/api/news/${newsId}`, {
  server: false,
  default: () => null,
  timeout: 10000,
  onRequest({ request }) {
    console.log('🚀 Making article request to:', request)
  },
  onResponse({ response }) {
    console.log('✅ Article response status:', response.status)
    console.log('✅ Article response data:', response._data)
  },
  onResponseError({ response }) {
    console.error('❌ Article API Error:', response.status, response._data)
  }
})

// Fetch all news for debugging and related articles
const { data: allNewsData } = await useFetch('/api/news', {
  server: false,
  default: () => null,
  timeout: 10000,
  onResponse({ response }) {
    console.log('📋 All news response status:', response.status)
    
    if (response._data?.success && response._data?.data) {
      console.log('📋 Available news IDs:', response._data.data.map(item => item._id))
      console.log('📋 Looking for ID:', newsId)
      console.log('📋 ID exists?', response._data.data.some(item => item._id === newsId))
    }
  },
  onResponseError({ response }) {
    console.error('❌ All news API Error:', response.status)
  }
})

// ✅ COMPUTED ARTICLE
const article = computed(() => {
  // Try specific article API response first
  if (articleData.value?.success && articleData.value?.data) {
    console.log('✅ Using specific article API data')
    return articleData.value.data
  }
  
  if (articleData.value?.data) {
    console.log('✅ Using article data (direct)')
    return articleData.value.data
  }
  
  if (articleData.value && articleData.value.title) {
    console.log('✅ Using article data (no wrapper)')
    return articleData.value
  }
  
  // Try to find article in the news list by _id
  if (allNewsData.value?.success && Array.isArray(allNewsData.value?.data)) {
    const foundArticle = allNewsData.value.data.find(item => 
      item._id === newsId || item.id === newsId
    )
    
    if (foundArticle) {
      console.log('✅ Found article in news list:', foundArticle.title)
      return foundArticle
    }
  }
  
  if (Array.isArray(allNewsData.value) && allNewsData.value.length > 0) {
    const foundArticle = allNewsData.value.find(item => 
      item._id === newsId || item.id === newsId
    )
    
    if (foundArticle) {
      console.log('✅ Found article in news array:', foundArticle.title)
      return foundArticle
    }
  }
  
  console.warn('❌ No article found for ID:', newsId)
  return null
})

// ✅ COMPUTED RELATED ARTICLES
const relatedArticles = computed(() => {
  let articles = []
  
  if (allNewsData.value?.success && Array.isArray(allNewsData.value.data)) {
    articles = allNewsData.value.data
  } else if (Array.isArray(allNewsData.value)) {
    articles = allNewsData.value
  }
  
  // Filter out current article and limit to 4
  return articles
    .filter(item => item._id !== newsId)
    .slice(0, 4)
})

// ✅ HELPER FUNCTIONS
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
    
    if (diffMins < 60) {
      return `${diffMins} phút trước`
    } else if (diffHours < 24) {
      return `${diffHours} giờ trước`
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`
    } else {
      return date.toLocaleDateString('vi-VN', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      })
    }
  } catch (error) {
    return 'Mới đây'
  }
}

// ✅ SOCIAL SHARE FUNCTIONS
const shareOnFacebook = () => {
  const url = encodeURIComponent(window.location.href)
  const title = encodeURIComponent(article.value?.title || 'Tin tức')
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
}

const shareOnTwitter = () => {
  const url = encodeURIComponent(window.location.href)
  const title = encodeURIComponent(article.value?.title || 'Tin tức')
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank')
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    // You can add a toast notification here
    console.log('✅ Link copied to clipboard')
  } catch (error) {
    console.error('❌ Failed to copy link:', error)
  }
}

// ✅ SEO
useHead({
  title: () => article.value ? `${article.value.title} - Tin tức` : 'Tin tức',
  meta: [
    {
      name: 'description',
      content: () => article.value?.description || article.value?.excerpt || 'Tin tức bất động sản'
    },
    {
      property: 'og:title',
      content: () => article.value?.title || 'Tin tức'
    },
    {
      property: 'og:description', 
      content: () => article.value?.description || article.value?.excerpt || 'Tin tức bất động sản'
    },
    {
      property: 'og:image',
      content: () => article.value?.image || article.value?.thumbnail || ''
    }
  ]
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Enhanced Article Content Styling */
.article-content {
  color: #1f2937;
  line-height: 1.625;
}

.article-content :deep(h2) {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-top: 2rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(246, 46, 86, 0.2);
}

.article-content :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.article-content :deep(p) {
  margin-bottom: 1rem;
  font-size: 1.125rem;
  line-height: 1.625;
}

.article-content :deep(ul), 
.article-content :deep(ol) {
  margin-bottom: 1.5rem;
  padding-left: 2rem;
}

.article-content :deep(ul) > :deep(li),
.article-content :deep(ol) > :deep(li) {
  margin-bottom: 0.5rem;
  font-size: 1.125rem;
  line-height: 1.625;
}

.article-content :deep(ul li) {
  position: relative;
}

.article-content :deep(ul li::before) {
  content: "•";
  position: absolute;
  left: -1rem;
  color: #F62E56;
  font-weight: 700;
}

.article-content :deep(blockquote) {
  border-left: 4px solid #F62E56;
  padding-left: 1.5rem;
  margin: 1.5rem 0;
  font-style: italic;
  color: #374151;
  background-color: #f9fafb;
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-radius: 0 0.5rem 0.5rem 0;
}

.article-content :deep(img) {
  border-radius: 1rem;
  margin: 2rem 0;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  width: 100%;
}

.article-content :deep(a) {
  color: #F62E56;
  font-weight: 500;
}

.article-content :deep(a:hover) {
  text-decoration: underline;
}

.article-content :deep(strong) {
  font-weight: 700;
  color: #111827;
}

.article-content :deep(em) {
  font-style: italic;
  color: #374151;
}

/* Smooth animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

article {
  animation: fadeInUp 0.6s ease-out;
}
</style>
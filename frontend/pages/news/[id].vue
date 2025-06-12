<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="pending" class="animate-pulse">
      <div class="h-64 bg-gray-200"></div>
      <div class="max-w-4xl px-4 py-8 mx-auto">
        <div class="h-8 mb-4 bg-gray-200 rounded"></div>
        <div class="h-4 mb-2 bg-gray-200 rounded"></div>
        <div class="w-3/4 h-4 bg-gray-200 rounded"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="py-16 text-center">
      <div class="mb-4 text-red-500">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <h1 class="mb-2 text-2xl font-bold text-gray-900">Không tìm thấy bài viết</h1>
      <p class="mb-4 text-gray-600">{{ error }}</p>
      <NuxtLink to="/news" class="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
        Quay lại tin tức
      </NuxtLink>
    </div>

    <!-- Article Content -->
    <article v-else-if="article">
      <!-- Hero Image -->
      <div class="relative h-64 overflow-hidden bg-gray-900 md:h-96">
        <img 
          :src="article.thumbnail" 
          :alt="article.title"
          class="object-cover w-full h-full opacity-80"
        />
        <div class="absolute inset-0 bg-black bg-opacity-40"></div>
        
        <!-- Article Title Overlay -->
        <div class="absolute bottom-0 left-0 right-0 p-6 text-white md:p-8">
          <div class="max-w-4xl mx-auto">
            <!-- Category Badge -->
            <span class="inline-block px-3 py-1 mb-4 text-sm font-semibold text-white bg-blue-600 rounded-full">
              {{ article.category }}
            </span>
            
            <!-- Title -->
            <h1 class="mb-4 text-2xl font-bold md:text-4xl">
              {{ article.title }}
            </h1>
            
            <!-- Meta Info -->
            <div class="flex items-center space-x-6 text-sm opacity-90">
              <span>📅 {{ formatDate(article.publishedAt || article.createdAt) }}</span>
              <span>👁️ {{ article.views || 0 }} lượt xem</span>
              <span v-if="article.author">✍️ {{ article.author.fullName || article.author.name }}</span>
              <span v-if="article.isFeatured || article.featured" class="text-yellow-300">⭐ Nổi bật</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Article Body -->
      <div class="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        <div class="p-6 bg-white rounded-lg shadow-sm md:p-8">
          <!-- Summary -->
          <div v-if="article.summary" class="p-4 mb-8 text-lg font-medium text-gray-700 border-l-4 border-blue-500 rounded-lg bg-blue-50">
            {{ article.summary }}
          </div>

          <!-- Content -->
          <div class="prose prose-lg max-w-none">
            <div v-html="formatContent(article.content)"></div>
          </div>

          <!-- Tags -->
          <div v-if="article.tags && article.tags.length > 0" class="pt-6 mt-8 border-t border-gray-200">
            <h3 class="mb-3 text-sm font-semibold text-gray-500">Tags:</h3>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="tag in article.tags" 
                :key="tag"
                class="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-full"
              >
                #{{ tag }}
              </span>
            </div>
          </div>

          <!-- Social Actions -->
          <div class="flex items-center justify-between pt-6 mt-8 border-t border-gray-200">
            <div class="flex items-center space-x-4">
              <!-- Like Button -->
              <button 
                @click="toggleLike"
                :disabled="likePending"
                class="flex items-center px-4 py-2 space-x-2 transition-colors border rounded-lg hover:bg-gray-50"
                :class="isLiked ? 'text-red-500 border-red-200' : 'text-gray-600 border-gray-200'"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                </svg>
                <span>{{ article.likes || 0 }}</span>
              </button>

              <!-- Share Button -->
              <button 
                @click="shareArticle"
                class="flex items-center px-4 py-2 space-x-2 text-gray-600 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                </svg>
                <span>Chia sẻ</span>
              </button>
            </div>

            <!-- Back to News -->
            <NuxtLink 
              to="/news"
              class="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              <span>Quay lại</span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Related Articles -->
      <section v-if="relatedArticles.length > 0" class="max-w-4xl px-4 pb-16 mx-auto sm:px-6 lg:px-8">
        <h2 class="mb-6 text-2xl font-bold text-gray-900">Bài viết liên quan</h2>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <article 
            v-for="related in relatedArticles" 
            :key="related._id"
            class="overflow-hidden transition-shadow bg-white rounded-lg shadow-sm hover:shadow-md"
          >
            <NuxtLink :to="`/news/${related._id}`">
              <div class="overflow-hidden bg-gray-200 aspect-video">
                <img 
                  :src="related.thumbnail" 
                  :alt="related.title"
                  class="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div class="p-4">
                <h3 class="mb-2 font-semibold text-gray-900 line-clamp-2">
                  {{ related.title }}
                </h3>
                <p class="text-sm text-gray-600 line-clamp-2">
                  {{ related.summary }}
                </p>
              </div>
            </NuxtLink>
          </article>
        </div>
      </section>
    </article>
  </div>
</template>

<script setup>
const route = useRoute()
const { getNewsById, toggleNewsLike, getNews } = useNews()

// State
const article = ref(null)
const relatedArticles = ref([])
const pending = ref(true)
const error = ref(null)
const isLiked = ref(false)
const likePending = ref(false)

// SEO
const updateSEO = () => {
  if (!article.value) return
  
  useHead({
    title: `${article.value.title} - Real Estate Platform`,
    meta: [
      { name: 'description', content: article.value.summary || article.value.seoDescription },
      { property: 'og:title', content: article.value.title },
      { property: 'og:description', content: article.value.summary },
      { property: 'og:image', content: article.value.thumbnail },
      { property: 'og:type', content: 'article' }
    ]
  })
}

// Methods
const loadArticle = async () => {
  try {
    pending.value = true
    error.value = null
    
    const response = await getNewsById(route.params.id)
    
    if (response.success) {
      article.value = response.data
      updateSEO()
      await loadRelatedArticles()
    } else {
      throw new Error(response.error || 'Không thể tải bài viết')
    }
  } catch (err) {
    console.error('❌ Error loading article:', err)
    error.value = err.message
  } finally {
    pending.value = false
  }
}

const loadRelatedArticles = async () => {
  if (!article.value) return
  
  try {
    const response = await getNews({ 
      category: article.value.category,
      limit: 6
    })
    
    if (response.success) {
      relatedArticles.value = response.data
        .filter(a => a._id !== article.value._id)
        .slice(0, 3)
    }
  } catch (err) {
    console.error('❌ Error loading related articles:', err)
  }
}

const toggleLike = async () => {
  if (!article.value || likePending.value) return
  
  try {
    likePending.value = true
    
    const response = await toggleNewsLike(article.value._id)
    
    if (response.success) {
      article.value.likes = response.data.likes
      isLiked.value = response.data.isLiked
    }
  } catch (err) {
    console.error('❌ Error toggling like:', err)
  } finally {
    likePending.value = false
  }
}

const shareArticle = async () => {
  if (!article.value) return
  
  const shareData = {
    title: article.value.title,
    text: article.value.summary,
    url: window.location.href
  }
  
  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch (err) {
      console.log('Share cancelled')
    }
  } else {
    // Fallback - copy URL to clipboard
    try {
      await navigator.clipboard.writeText(window.location.href)
      // Show toast notification (implement toast system)
      console.log('URL copied to clipboard')
    } catch (err) {
      console.error('Could not copy URL')
    }
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

const formatContent = (content) => {
  if (!content) return ''
  
  return content
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
}

// Initialize
onMounted(() => {
  loadArticle()
})

// Watch route changes
watch(() => route.params.id, () => {
  if (route.params.id) {
    loadArticle()
  }
})
</script>
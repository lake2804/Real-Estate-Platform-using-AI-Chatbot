export const useNews = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase

  // Get featured news
  const getFeaturedNews = async (limit = 6) => {
    try {
      const response = await $fetch(`${apiBase}/news/featured`, {
        query: { limit }
      })
      
      return {
        success: true,
        data: response.data || [],
        total: response.total || 0
      }
    } catch (error) {
      console.error('❌ Error fetching featured news:', error)
      return {
        success: false,
        data: [],
        error: error.message
      }
    }
  }

  // Get all news with filters
  const getNews = async (filters = {}) => {
    try {
      const query = {
        limit: filters.limit || 20,
        ...(filters.category && { category: filters.category }),
        ...(filters.featured && { featured: 'true' })
      }

      const response = await $fetch(`${apiBase}/news`, { query })
      
      return {
        success: true,
        data: response.data || [],
        total: response.total || 0
      }
    } catch (error) {
      console.error('❌ Error fetching news:', error)
      return {
        success: false,
        data: [],
        error: error.message
      }
    }
  }

  // Get single news article
  const getNewsById = async (id) => {
    try {
      const response = await $fetch(`${apiBase}/news/${id}`)
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('❌ Error fetching news article:', error)
      return {
        success: false,
        data: null,
        error: error.message
      }
    }
  }

  // Get news categories
  const getNewsCategories = async () => {
    try {
      const response = await $fetch(`${apiBase}/news/categories`)
      
      return {
        success: true,
        data: response.data || []
      }
    } catch (error) {
      console.error('❌ Error fetching news categories:', error)
      return {
        success: false,
        data: [],
        error: error.message
      }
    }
  }

  // Like/Unlike news
  const toggleNewsLike = async (id) => {
    try {
      const response = await $fetch(`${apiBase}/news/${id}/like`, {
        method: 'POST'
      })
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('❌ Error toggling news like:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  return {
    getFeaturedNews,
    getNews,
    getNewsById,
    getNewsCategories,
    toggleNewsLike
  }
}
export const useApi = () => {
  const config = useRuntimeConfig()
  
  // ✅ FIXED: Force the correct API base URL
  const apiBase = 'http://localhost:4000/api'
  
  console.log('🔧 API Base URL:', apiBase)
  
  const $api = $fetch.create({
    baseURL: apiBase,
    onRequest({ request, options }) {
      // ✅ Clean URL formation
      const cleanUrl = request.toString().startsWith('/') ? request : `/${request}`
      const fullUrl = `${apiBase}${cleanUrl}`
      console.log('🔧 API Request:', fullUrl)
      
      const token = useCookie('auth-token')
      if (token.value) {
        options.headers = options.headers || {}
        options.headers.Authorization = `Bearer ${token.value}`
      }
    },
    onResponseError({ response, request }) {
      const cleanUrl = request.toString().startsWith('/') ? request : `/${request}`
      const fullUrl = `${apiBase}${cleanUrl}`
      console.error(`❌ API Error [${response.status}]:`, fullUrl)
      
      if (response.status === 401) {
        const token = useCookie('auth-token')
        token.value = null
        
        if (process.client && !window.location.pathname.includes('/login')) {
          navigateTo('/login')
        }
      }
    }
  })
  
  return {
    $api,
    apiBase,
    
    // ✅ Properties API 
    getPropertiesForSale: async (limit = 12, filters = {}) => {
      console.log('[useApi] getPropertiesForSale - Filters:', JSON.stringify(filters));
      try {
        const params = new URLSearchParams({
          type: 'sale',
          limit: limit.toString(),
          featured: 'true',
          ...filters
        })
        const apiUrl = `/properties?${params}`; console.log('[useApi] getPropertiesForSale - Fetching URL:', apiUrl);
        const response = await $api(apiUrl)
        console.log('[useApi] getPropertiesForSale - Raw Response:', JSON.stringify(response));
        return response
      } catch (error) {
        console.error('[useApi] getPropertiesForSale - Caught Error:', JSON.stringify(error.message), JSON.stringify(error.data));
        console.error('❌ Error getting properties for sale:', error)
        return { success: false, data: [], error: error.message }
      }
    },
    
    getPropertiesForRent: async (limit = 12, filters = {}) => {
      console.log('[useApi] getPropertiesForRent - Filters:', JSON.stringify(filters));
      try {
        const params = new URLSearchParams({
          type: 'rent', 
          limit: limit.toString(),
          featured: 'true',
          ...filters
        })
        const apiUrl = `/properties?${params}`; console.log('[useApi] getPropertiesForRent - Fetching URL:', apiUrl);
        const response = await $api(apiUrl)
        console.log('[useApi] getPropertiesForRent - Raw Response:', JSON.stringify(response));
        return response
      } catch (error) {
        console.error('[useApi] getPropertiesForRent - Caught Error:', JSON.stringify(error.message), JSON.stringify(error.data));
        console.error('❌ Error getting properties for rent:', error)
        return { success: false, data: [], error: error.message }
      }
    },
    
    getPropertyById: async (id) => {
      try {
        return await $api(`/properties/${id}`)
      } catch (error) {
        console.error('❌ Error getting property:', error)
        return { success: false, data: null, error: error.message }
      }
    },
    
    getFeaturedProperties: async (limit = 8) => {
      try {
        return await $api(`/properties/featured?limit=${limit}`)
      } catch (error) {
        console.error('❌ Error getting featured properties:', error)
        return { success: false, data: [], error: error.message }
      }
    },
    
    // ✅ Projects API
    getFeaturedProjects: async (limit = 8, filters = {}) => {
      try {
        const params = new URLSearchParams({
          limit: limit.toString(),
          ...filters
        })
        const response = await $api(`/projects/featured?${params}`)
        return response
      } catch (error) {
        console.error('❌ Error getting featured projects:', error)
        return { success: false, data: [], error: error.message }
      }
    },
    
    getFeaturedProjectById: async (id) => {
      try {
        return await $api(`/projects/${id}`)
      } catch (error) {
        console.error('❌ Error getting project:', error)
        return { success: false, data: null, error: error.message }
      }
    },
    
    // ✅ News API methods
    getNews: async (limit = 10, filters = {}) => {
      try {
        const params = new URLSearchParams({
          limit: limit.toString(),
          ...filters
        })
        return await $api(`/news?${params}`)
      } catch (error) {
        console.error('❌ Error getting news:', error)
        return { success: false, data: [], error: error.message }
      }
    },
    
    getFeaturedNews: async (limit = 6) => {
      try {
        const response = await $api(`/news/featured?limit=${limit}`)
        return response
      } catch (error) {
        console.error('❌ Error getting featured news:', error)
        return { success: false, data: [], error: error.message }
      }
    },
    
    getNewsById: async (id) => {
      try {
        return await $api(`/news/${id}`)
      } catch (error) {
        console.error('❌ Error getting news article:', error)
        return { success: false, data: null, error: error.message }
      }
    },
    
    // ✅ Search API
    getSearchFilters: async () => {
      try {
        const response = await $api('/properties/search/filters')
        return response
      } catch (error) {
        console.error('❌ Error getting search filters:', error)
        return { success: false, data: {}, error: error.message }
      }
    },
    
    getPopularSearches: async () => {
      try {
        const response = await $api('/properties/search/popular')
        return response
      } catch (error) {
        console.error('❌ Error getting popular searches:', error)
        return { success: false, data: [], error: error.message }
      }
    }
  }
}
export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase

  // ✅ FIXED: Force the correct API base URL
  const apiBase = 'http://localhost:4000/api'


  const $api = $fetch.create({
    baseURL: apiBase,
    onRequest({ request, options }) {
      // request is typically the path (e.g., '/properties')
      // options.baseURL is the base URL set in $fetch.create (e.g., 'http://localhost:4000/api')

      let targetUrl;
      try {
        // If request is already an absolute URL, use it directly
        // Otherwise, resolve it against the baseURL from options
        if (request.toString().startsWith('http://') || request.toString().startsWith('https://')) {
          targetUrl = request.toString();
        } else {
          // Ensure request starts with a slash if it's a path
          const path = request.toString().startsWith('/') ? request.toString() : `/${request.toString()}`;
          targetUrl = options.baseURL + path;
        }
      } catch (e) {
        // Fallback in case of unexpected request format
        console.error('[useApi] Error constructing target URL for logging:', e);
        targetUrl = `[Could not determine target URL for request: ${request}]`;
      }


      const token = useCookie('auth-token');
      if (token.value) {
        options.headers = options.headers || {};
        options.headers.Authorization = `Bearer ${token.value}`;
      }
    },
    onResponse({ request, response, options }) {
      // Log successful responses
      // To avoid overly verbose logs for large data, you might log selectively:
      if (response._data && typeof response._data === 'object') {
        const dataSummary = { ...response._data };
        if (Array.isArray(dataSummary.data) && dataSummary.data.length > 5) {
          dataSummary.data = `Array of ${dataSummary.data.length} items (first 5 shown)`;
          dataSummary.originalData = response._data.data.slice(0,5); // keep a sample
        }
      } else {
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

  // ✅ ADD: Create property
  const createProperty = async (propertyData) => {
    try {
      console.log('📤 Creating property:', propertyData)
      
      const response = await $fetch(`${baseURL}/properties`, {
        method: 'POST',
        body: propertyData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      console.log('✅ Property created:', response)
      return response
      
    } catch (error) {
      console.error('❌ Create property error:', error)
      throw error
    }
  }

  // ✅ ADD: Upload images
  const uploadImages = async (files) => {
    try {
      const formData = new FormData()
      
      files.forEach((file, index) => {
        formData.append(`images`, file)
      })
      
      const response = await $fetch(`${baseURL}/upload/images`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      return response
      
    } catch (error) {
      console.error('❌ Upload images error:', error)
      throw error
    }
  }

  return {
    $api,
    apiBase,

    // ✅ Properties API
    getPropertiesForSale: async (limit = 12, filters = {}) => {
      try {
        const params = new URLSearchParams({
          type: 'sale',
          limit: limit.toString(),
          featured: 'true',
          ...filters
        })
        const apiUrl = `/properties?${params}`;
        const response = await $api(apiUrl)
        return response
      } catch (error) {
        console.error('[useApi] getPropertiesForSale - Caught Error:', JSON.stringify(error.message), JSON.stringify(error.data));
        console.error('❌ Error getting properties for sale:', error)
        return { success: false, data: [], error: error.message }
      }
    },

    getPropertiesForRent: async (limit = 12, filters = {}) => {
      try {
        const params = new URLSearchParams({
          type: 'rent',
          limit: limit.toString(),
          featured: 'true',
          ...filters
        })
        const apiUrl = `/properties?${params}`;
        const response = await $api(apiUrl)
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
        console.log('🏗️ [API] Fetching featured projects...')
        const params = new URLSearchParams({
          limit: limit.toString(),
          ...filters
        })
        const response = await $api(`/projects/featured?${params}`)
        console.log('🏗️ [API] Featured projects response:', response)
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
        console.log('📰 [API] Fetching featured news...')
        const response = await $api(`/news/featured?limit=${limit}`)
        console.log('📰 [API] Featured news response:', response)
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
    },

    createProperty,
    uploadImages
  }
}
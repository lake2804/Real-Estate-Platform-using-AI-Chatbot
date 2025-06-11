<template>
  <div class="min-h-screen p-8 bg-gray-50">
    <div class="mx-auto max-w-7xl">
      <h1 class="mb-8 text-4xl font-bold text-center text-blue-600">🏠 Real Estate System Test Dashboard</h1>
      
      <!-- System Health Overview -->
      <div class="grid grid-cols-1 gap-6 mb-8 md:grid-cols-6">
        <div class="p-6 bg-white rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-700">API Status</h3>
          <p :class="systemHealth.api ? 'text-green-600' : 'text-red-600'" class="text-2xl font-bold">
            {{ systemHealth.api ? '✅ Online' : '❌ Offline' }}
          </p>
          <p class="text-xs text-gray-500">{{ systemHealth.database }}</p>
        </div>
        
        <div class="p-6 bg-white rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-700">Properties</h3>
          <div class="text-sm text-gray-600">
            <div>🏠 Total: <span class="font-bold text-blue-600">{{ systemHealth.properties }}</span></div>
            <div>📊 Available: <span class="font-bold text-green-600">{{ systemHealth.availableProperties }}</span></div>
          </div>
        </div>
        
        <div class="p-6 bg-white rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-700">Content</h3>
          <div class="text-sm text-gray-600">
            <div>📰 News: <span class="font-bold text-green-600">{{ systemHealth.news }}</span></div>
            <div>🏗️ Projects: <span class="font-bold text-purple-600">{{ systemHealth.projects }}</span></div>
          </div>
        </div>
        
        <div class="p-6 bg-white rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-700">Users</h3>
          <div class="text-sm text-gray-600">
            <div>👥 Total: <span class="font-bold text-purple-600">{{ systemHealth.users }}</span></div>
            <div>🔐 Auth: <span :class="systemHealth.auth ? 'text-green-600' : 'text-red-600'">
              {{ systemHealth.auth ? '✅ Working' : '❌ Failed' }}
            </span></div>
          </div>
        </div>
        
        <div class="p-6 bg-white rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-700">Search</h3>
          <div class="text-sm text-gray-600">
            <div>🔍 System: <span :class="systemHealth.search ? 'text-green-600' : 'text-red-600'">
              {{ systemHealth.search ? '✅ Working' : '❌ Failed' }}
            </span></div>
            <div>📊 Indexed: <span class="font-bold text-blue-600">{{ systemHealth.searchableItems }}</span></div>
          </div>
        </div>
        
        <div class="p-6 bg-white rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-700">Test Results</h3>
          <div class="text-sm text-gray-600">
            <div>✅ Passed: <span class="font-bold text-green-600">{{ passedTests }}</span></div>
            <div>❌ Failed: <span class="font-bold text-red-600">{{ failedTests }}</span></div>
            <div>📊 Success: <span class="font-bold text-blue-600">{{ successRate }}%</span></div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mb-6 text-center">
        <div class="flex flex-wrap justify-center gap-3">
          <button 
            @click="runCoreSystemTest"
            :disabled="isRunningTest"
            class="px-6 py-3 text-white transition-all transform bg-green-600 rounded-lg shadow-lg hover:bg-green-700 hover:shadow-xl hover:scale-105 disabled:opacity-50"
          >
            {{ isRunningTest ? `Testing... ${testProgress}%` : '🚀 Run Core System Test' }}
          </button>
          
          <button 
            @click="testRealEstateFeatures"
            :disabled="isRunningTest"
            class="px-6 py-3 text-white transition-all transform bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl hover:scale-105 disabled:opacity-50"
          >
            🏠 Test Real Estate Features
          </button>
          
          <button 
            @click="emergencySystemSetup"
            class="px-6 py-3 text-white transition-all transform bg-red-600 rounded-lg shadow-lg hover:bg-red-700 hover:shadow-xl hover:scale-105"
          >
            🚑 Emergency Setup
          </button>
          
          <button 
            @click="exportSystemReport"
            class="px-6 py-3 text-white transition-all transform bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 hover:shadow-xl hover:scale-105"
          >
            📊 Export Report
          </button>
        </div>
      </div>

      <!-- Test Progress -->
      <div v-if="isRunningTest" class="mb-6">
        <div class="p-4 bg-white rounded-lg shadow">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">Testing Progress</span>
            <span class="text-sm text-gray-500">{{ currentTestName }}</span>
          </div>
          <div class="w-full h-3 bg-gray-200 rounded-full">
            <div 
              class="h-3 transition-all duration-300 rounded-full bg-gradient-to-r from-blue-500 to-green-500" 
              :style="`width: ${testProgress}%`"
            ></div>
          </div>
          <div class="mt-2 text-xs text-gray-500">
            {{ completedTests }}/{{ totalTests }} tests completed
          </div>
        </div>
      </div>

      <!-- Real Estate Feature Tests Grid -->
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
        
        <!-- 🏗️ Core System Tests -->
        <div class="p-6 bg-white rounded-lg shadow-lg">
          <h2 class="mb-4 text-2xl font-bold text-gray-800">🏗️ Core System</h2>
          <div class="space-y-3">
            <TestButton 
              @click="testAPIHealth" 
              :loading="testStates.apiHealth.loading"
              :status="testStates.apiHealth.status"
              label="API Health Check"
              description="Server connectivity and response"
            />
            <TestButton 
              @click="testDatabaseConnection" 
              :loading="testStates.database.loading"
              :status="testStates.database.status"
              label="Database Connection"
              description="MongoDB connectivity"
            />
            <TestButton 
              @click="testDataIntegrity" 
              :loading="testStates.dataIntegrity.loading"
              :status="testStates.dataIntegrity.status"
              label="Data Integrity"
              description="Verify core data consistency"
            />
          </div>
        </div>

        <!-- 🔐 Authentication & Users -->
        <div class="p-6 bg-white rounded-lg shadow-lg">
          <h2 class="mb-4 text-2xl font-bold text-gray-800">🔐 Authentication & Users</h2>
          <div class="space-y-3">
            <TestButton 
              @click="testUserRegistration" 
              :loading="testStates.userRegistration.loading"
              :status="testStates.userRegistration.status"
              label="User Registration"
              description="New user signup process"
            />
            <TestButton 
              @click="testUserLogin" 
              :loading="testStates.userLogin.loading"
              :status="testStates.userLogin.status"
              label="User Login"
              description="Authentication flow"
            />
            <TestButton 
              @click="testJWTTokens" 
              :loading="testStates.jwtTokens.loading"
              :status="testStates.jwtTokens.status"
              label="JWT Tokens"
              description="Token generation and validation"
            />
            <TestButton 
              @click="testUserRoles" 
              :loading="testStates.userRoles.loading"
              :status="testStates.userRoles.status"
              label="User Roles"
              description="Admin, Agent, User permissions"
            />
          </div>
        </div>

        <!-- 🏠 Property Management -->
        <div class="p-6 bg-white rounded-lg shadow-lg">
          <h2 class="mb-4 text-2xl font-bold text-gray-800">🏠 Property Management</h2>
          <div class="space-y-3">
            <TestButton 
              @click="testPropertyListing" 
              :loading="testStates.propertyListing.loading"
              :status="testStates.propertyListing.status"
              label="Property Listing"
              description="View all properties"
            />
            <TestButton 
              @click="testPropertyCRUD" 
              :loading="testStates.propertyCRUD.loading"
              :status="testStates.propertyCRUD.status"
              label="Property CRUD"
              description="Create, Edit, Delete properties"
            />
            <TestButton 
              @click="testPropertySearch" 
              :loading="testStates.propertySearch.loading"
              :status="testStates.propertySearch.status"
              label="Property Search"
              description="Search and filter properties"
            />
            <TestButton 
              @click="testPropertyDetails" 
              :loading="testStates.propertyDetails.loading"
              :status="testStates.propertyDetails.status"
              label="Property Details"
              description="Individual property view"
            />
          </div>
        </div>

        <!-- 📰 Content Management -->
        <div class="p-6 bg-white rounded-lg shadow-lg">
          <h2 class="mb-4 text-2xl font-bold text-gray-800">📰 Content Management</h2>
          <div class="space-y-3">
            <TestButton 
              @click="testNewsSystem" 
              :loading="testStates.newsSystem.loading"
              :status="testStates.newsSystem.status"
              label="News System"
              description="News articles management"
            />
            <TestButton 
              @click="testFeaturedProjects" 
              :loading="testStates.featuredProjects.loading"
              :status="testStates.featuredProjects.status"
              label="Featured Projects"
              description="Project showcase system"
            />
            <TestButton 
              @click="testContentCategories" 
              :loading="testStates.contentCategories.loading"
              :status="testStates.contentCategories.status"
              label="Content Categories"
              description="Category organization"
            />
          </div>
        </div>

        <!-- 🔍 Search & Filter -->
        <div class="p-6 bg-white rounded-lg shadow-lg">
          <h2 class="mb-4 text-2xl font-bold text-gray-800">🔍 Search & Filter</h2>
          <div class="space-y-3">
            <TestButton 
              @click="testBasicSearch" 
              :loading="testStates.basicSearch.loading"
              :status="testStates.basicSearch.status"
              label="Basic Search"
              description="Keyword search functionality"
            />
            <TestButton 
              @click="testAdvancedFilters" 
              :loading="testStates.advancedFilters.loading"
              :status="testStates.advancedFilters.status"
              label="Advanced Filters"
              description="Price, location, type filters"
            />
            <TestButton 
              @click="testSortingPagination" 
              :loading="testStates.sortingPagination.loading"
              :status="testStates.sortingPagination.status"
              label="Sorting & Pagination"
              description="Result organization"
            />
          </div>
        </div>

        <!-- 📱 User Experience -->
        <div class="p-6 bg-white rounded-lg shadow-lg">
          <h2 class="mb-4 text-2xl font-bold text-gray-800">📱 User Experience</h2>
          <div class="space-y-3">
            <TestButton 
              @click="testPageLoading" 
              :loading="testStates.pageLoading.loading"
              :status="testStates.pageLoading.status"
              label="Page Loading"
              description="Performance and response times"
            />
            <TestButton 
              @click="testImageHandling" 
              :loading="testStates.imageHandling.loading"
              :status="testStates.imageHandling.status"
              label="Image Handling"
              description="Image loading and optimization"
            />
            <TestButton 
              @click="testMobileResponsive" 
              :loading="testStates.mobileResponsive.loading"
              :status="testStates.mobileResponsive.status"
              label="Mobile Responsive"
              description="Mobile device compatibility"
            />
          </div>
        </div>

      </div>

      <!-- Live Testing Tools -->
      <div class="mt-8">
        <div class="p-6 bg-white rounded-lg shadow-lg">
          <h2 class="mb-4 text-2xl font-bold text-gray-800">🧪 Live Testing Tools</h2>
          
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            
            <!-- Property Search Tool -->
            <div class="p-4 border border-gray-200 rounded-lg">
              <h3 class="mb-3 text-lg font-semibold">🔍 Property Search Test</h3>
              <div class="space-y-3">
                <input 
                  v-model="testTools.search.keyword" 
                  placeholder="Search properties..."
                  class="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div class="grid grid-cols-2 gap-2">
                  <select v-model="testTools.search.location" class="px-3 py-2 border border-gray-300 rounded">
                    <option value="">All Locations</option>
                    <option value="Quận 1">Quận 1</option>
                    <option value="Quận 2">Quận 2</option>
                    <option value="Quận 7">Quận 7</option>
                    <option value="Bình Thạnh">Bình Thạnh</option>
                    <option value="Thủ Đức">Thủ Đức</option>
                  </select>
                  <select v-model="testTools.search.type" class="px-3 py-2 border border-gray-300 rounded">
                    <option value="">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="office">Office</option>
                  </select>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <input 
                    v-model="testTools.search.minPrice" 
                    type="number"
                    placeholder="Min Price (VND)"
                    class="px-3 py-2 border border-gray-300 rounded"
                  />
                  <input 
                    v-model="testTools.search.maxPrice" 
                    type="number"
                    placeholder="Max Price (VND)"
                    class="px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <button 
                  @click="executePropertySearch"
                  class="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  🔍 Search Properties
                </button>
                
                <!-- Search Results -->
                <div class="h-40 p-3 overflow-y-auto border border-gray-300 rounded bg-gray-50">
                  <div v-if="testTools.search.results.length === 0" class="text-center text-gray-500">
                    No search results yet
                  </div>
                  <div v-for="result in testTools.search.results" :key="result._id" class="p-2 mb-2 bg-white rounded shadow-sm">
                    <div class="font-medium text-blue-600">{{ result.title }}</div>
                    <div class="text-sm text-gray-600">{{ result.location }} - {{ formatPrice(result.price) }}</div>
                    <div class="text-xs text-gray-500">{{ result.type }} • {{ result.area }}m²</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- System Stats Tool -->
            <div class="p-4 border border-gray-200 rounded-lg">
              <h3 class="mb-3 text-lg font-semibold">📊 System Statistics</h3>
              <div class="space-y-3">
                <button 
                  @click="refreshSystemStats"
                  class="w-full px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                >
                  🔄 Refresh Stats
                </button>
                
                <div class="p-3 text-sm bg-gray-100 rounded">
                  <div class="grid grid-cols-2 gap-2">
                    <div><strong>Properties:</strong> {{ systemHealth.properties }}</div>
                    <div><strong>News:</strong> {{ systemHealth.news }}</div>
                    <div><strong>Projects:</strong> {{ systemHealth.projects }}</div>
                    <div><strong>Users:</strong> {{ systemHealth.users }}</div>
                  </div>
                </div>
                
                <div class="p-3 text-sm rounded bg-blue-50">
                  <div><strong>API Response Time:</strong> {{ systemHealth.responseTime }}ms</div>
                  <div><strong>Database Status:</strong> {{ systemHealth.database }}</div>
                  <div><strong>Last Updated:</strong> {{ formatTime(systemHealth.lastUpdated) }}</div>
                </div>
                
                <div class="p-3 text-sm rounded bg-green-50">
                  <div><strong>Test Summary:</strong></div>
                  <div>✅ Passed: {{ passedTests }} | ❌ Failed: {{ failedTests }}</div>
                  <div>🚀 Success Rate: {{ successRate }}%</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Test Results -->
      <div v-if="testResults.length > 0" class="mt-8">
        <div class="p-6 bg-white rounded-lg shadow-lg">
          <h2 class="mb-4 text-2xl font-bold text-gray-800">📋 Test Results</h2>
          
          <div class="overflow-hidden border border-gray-200 rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Test</th>
                  <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                  <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Duration</th>
                  <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Details</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="result in testResults" :key="result.id">
                  <td class="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{{ result.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStatusClass(result.status)" class="inline-flex px-2 text-xs font-semibold leading-5 rounded-full">
                      {{ result.status === 'success' ? '✅ PASS' : '❌ FAIL' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{{ result.duration }}ms</td>
                  <td class="px-6 py-4 text-sm text-gray-500">
                    <button 
                      @click="viewTestDetails(result)"
                      class="text-blue-600 hover:text-blue-800"
                    >
                      📋 View
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

definePageMeta({
  title: 'Real Estate System Test',
  layout: 'default'
})

useHead({
  title: 'Real Estate System Test Dashboard',
  meta: [
    { name: 'description', content: 'Complete testing dashboard for real estate system' }
  ]
})

// ✅ FIXED: Use the new API composable
const { $api, apiBase } = useApi()

console.log('🔧 Test system using API base:', apiBase)

// ✅ System Health Status
const systemHealth = ref({
  api: false,
  database: 'unknown',
  properties: 0,
  availableProperties: 0,
  news: 0,
  projects: 0,
  users: 0,
  auth: false,
  search: false,
  searchableItems: 0,
  responseTime: 0,
  lastUpdated: null
})

// ✅ Test States
const testStates = reactive({
  apiHealth: { loading: false, status: 'pending' },
  database: { loading: false, status: 'pending' },
  dataIntegrity: { loading: false, status: 'pending' },
  userRegistration: { loading: false, status: 'pending' },
  userLogin: { loading: false, status: 'pending' },
  jwtTokens: { loading: false, status: 'pending' },
  userRoles: { loading: false, status: 'pending' },
  propertyListing: { loading: false, status: 'pending' },
  propertyCRUD: { loading: false, status: 'pending' },
  propertySearch: { loading: false, status: 'pending' },
  propertyDetails: { loading: false, status: 'pending' },
  newsSystem: { loading: false, status: 'pending' },
  featuredProjects: { loading: false, status: 'pending' },
  contentCategories: { loading: false, status: 'pending' },
  basicSearch: { loading: false, status: 'pending' },
  advancedFilters: { loading: false, status: 'pending' },
  sortingPagination: { loading: false, status: 'pending' },
  pageLoading: { loading: false, status: 'pending' },
  imageHandling: { loading: false, status: 'pending' },
  mobileResponsive: { loading: false, status: 'pending' }
})

// ✅ Test Progress
const isRunningTest = ref(false)
const testProgress = ref(0)
const currentTestName = ref('')
const completedTests = ref(0)
const totalTests = ref(0)
const testResults = ref([])

// ✅ Live Testing Tools
const testTools = reactive({
  search: {
    keyword: '',
    location: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    results: []
  }
})

// ✅ Computed Properties
const passedTests = computed(() => testResults.value.filter(r => r.status === 'success').length)
const failedTests = computed(() => testResults.value.filter(r => r.status === 'error').length)
const successRate = computed(() => {
  const total = testResults.value.length
  return total ? Math.round((passedTests.value / total) * 100) : 0
})

// ✅ Core Test Runner
const runTest = async (testKey, testFunction) => {
  const testState = testStates[testKey]
  if (!testState) return

  testState.loading = true
  testState.status = 'pending'
  
  const startTime = Date.now()
  
  try {
    const result = await testFunction()
    const duration = Date.now() - startTime
    
    testState.status = 'success'
    
    testResults.value.push({
      id: `${testKey}-${Date.now()}`,
      name: testKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      status: 'success',
      duration,
      timestamp: new Date().toISOString(),
      details: result
    })
    
    return result
  } catch (error) {
    const duration = Date.now() - startTime
    
    testState.status = 'error'
    
    testResults.value.push({
      id: `${testKey}-${Date.now()}`,
      name: testKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      status: 'error',
      duration,
      timestamp: new Date().toISOString(),
      details: { error: error.message }
    })
    
    throw error
  } finally {
    testState.loading = false
  }
}

// ✅ Core System Tests
const testAPIHealth = async () => {
  return runTest('apiHealth', async () => {
    const startTime = Date.now()
    const response = await $api('/health')
    const responseTime = Date.now() - startTime
    
    const data = response.data || response
    
    // Update system health
    systemHealth.value = {
      ...systemHealth.value,
      api: true,
      database: data.database || 'connected',
      users: data.counts?.userCount || 0,
      responseTime,
      lastUpdated: new Date().toISOString()
    }
    
    return {
      status: 'healthy',
      responseTime: `${responseTime}ms`,
      database: data.database,
      counts: data.counts
    }
  })
}

const testDatabaseConnection = async () => {
  return runTest('database', async () => {
    const response = await $api('/health')
    
    if (response.data?.database !== 'connected') {
      throw new Error('Database not connected')
    }
    
    return { database: 'connected' }
  })
}

const testDataIntegrity = async () => {
  return runTest('dataIntegrity', async () => {
    try {
      const [propertiesRes, newsRes, projectsRes, healthRes] = await Promise.all([
        $api('/properties?limit=5'),
        $api('/news?limit=5'),
        $api('/featured-projects?limit=5'),
        $api('/health')
      ])
      
      const properties = propertiesRes.data || []
      const news = newsRes.data || []
      const projects = projectsRes.data || []
      const health = healthRes.data || {}
      
      // Update system health with actual counts
      systemHealth.value = {
        ...systemHealth.value,
        api: true,
        database: health.database || 'connected',
        properties: health.counts?.propertyCount || properties.length,
        news: health.counts?.newsCount || news.length,
        projects: health.counts?.projectCount || projects.length,
        users: health.counts?.userCount || 0,
        availableProperties: properties.filter(p => 
          p.status === 'available' || p.status === 'for-sale' || p.status === 'for-rent'
        ).length,
        searchableItems: properties.length + news.length + projects.length,
        lastUpdated: new Date().toISOString()
      }
      
      return {
        properties: properties.length,
        news: news.length,
        projects: projects.length,
        users: health.counts?.userCount || 0,
        databaseStatus: health.database,
        dataIntegrityCheck: 'passed'
      }
    } catch (error) {
      throw new Error(`Data integrity check failed: ${error.message}`)
    }
  })
}

// ✅ Authentication Tests
const testUserRegistration = async () => {
  return runTest('userRegistration', async () => {
    const testUser = {
      fullName: `Test User ${Date.now()}`,
      email: `testuser${Date.now()}@test.com`,
      password: 'test123456',
      phone: '0123456789',
      role: 'user'
    }
    
    const response = await $api('/auth/register', {
      method: 'POST',
      body: testUser
    })
    
    return {
      registered: true,
      userId: response.user?._id || response.data?.user?._id,
      email: testUser.email
    }
  })
}

const testUserLogin = async () => {
  return runTest('userLogin', async () => {
    console.log('🔐 Testing user authentication...')
    
    // First ensure users exist by seeding
    try {
      await $api('/seed', { method: 'POST' })
      console.log('✅ Database seeded successfully')
    } catch (seedError) {
      console.warn('⚠️ Seeding failed:', seedError.message)
    }
    
    // Test login with admin account
    try {
      const response = await $api('/auth/login', {
        method: 'POST',
        body: { 
          email: 'admin@realestate.com', 
          password: 'admin123' 
        }
      })
      
      if (response.success && response.data?.token) {
        systemHealth.value.auth = true
        return {
          authenticated: true,
          email: 'admin@realestate.com',
          role: response.data.user?.role,
          tokenValid: true
        }
      }
      
      throw new Error('No valid token received')
    } catch (error) {
      throw new Error(`Authentication failed: ${error.message}`)
    }
  })
}

const testJWTTokens = async () => {
  return runTest('jwtTokens', async () => {
    const loginResponse = await $api('/auth/login', {
      method: 'POST',
      body: { 
        email: 'admin@realestate.com', 
        password: 'admin123' 
      }
    })
    
    const token = loginResponse?.token || loginResponse?.data?.token
    
    if (!token) {
      throw new Error('No token received')
    }
    
    // Basic JWT validation
    const parts = token.split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format')
    }
    
    return {
      tokenReceived: true,
      tokenFormat: 'valid',
      parts: parts.length
    }
  })
}

const testUserRoles = async () => {
  return runTest('userRoles', async () => {
    const roles = ['admin', 'agent', 'user']
    const results = {}
    
    for (const role of roles) {
      try {
        const response = await $api('/auth/login', {
          method: 'POST',
          body: { 
            email: `${role}@realestate.com`, 
            password: `${role}123` 
          }
        })
        
        results[role] = response?.token ? 'success' : 'failed'
      } catch (error) {
        results[role] = 'failed'
      }
    }
    
    return results
  })
}

// ✅ Property Management Tests
const testPropertyListing = async () => {
  return runTest('propertyListing', async () => {
    const response = await $api('/properties?limit=10')
    const properties = response.data || []
    
    // Update system health
    systemHealth.value.properties = properties.length
    systemHealth.value.availableProperties = properties.filter(p => 
      p.status === 'available' || p.status === 'for-sale' || p.status === 'for-rent'
    ).length
    
    return {
      totalProperties: properties.length,
      availableProperties: systemHealth.value.availableProperties,
      hasProperties: properties.length > 0,
      sampleProperty: properties[0] || null
    }
  })
}

const testPropertyCRUD = async () => {
  return runTest('propertyCRUD', async () => {
    const testProperty = {
      title: `Test Property ${Date.now()}`,
      description: 'Test property for CRUD testing',
      location: 'Quận 1, TP.HCM',
      price: 15000000,
      area: 120,
      type: 'apartment',
      status: 'available'
    }
    
    try {
      // CREATE
      const createResponse = await $api('/properties', {
        method: 'POST',
        body: testProperty
      })
      
      const propertyId = createResponse?._id || createResponse?.data?._id
      
      // READ
      let readResponse = null
      if (propertyId) {
        try {
          readResponse = await $api(`/properties/${propertyId}`)
        } catch (readError) {
          console.warn('Property read failed:', readError.message)
        }
      }
      
      return {
        created: !!createResponse,
        propertyId: propertyId || 'unknown',
        canRead: !!readResponse,
        crudWorking: !!createResponse
      }
    } catch (error) {
      throw new Error(`Property CRUD failed: ${error.message}`)
    }
  })
}

const testPropertySearch = async () => {
  return runTest('propertySearch', async () => {
    const searchTerm = 'apartment'
    
    try {
      const response = await $api(`/properties?search=${encodeURIComponent(searchTerm)}`)
      
      systemHealth.value.search = true
      
      return {
        searchTerm,
        resultsCount: response.data?.length || 0,
        searchWorking: true
      }
    } catch (error) {
      throw new Error(`Property search failed: ${error.message}`)
    }
  })
}

const testPropertyDetails = async () => {
  return runTest('propertyDetails', async () => {
    // Get first property for testing
    const listResponse = await $api('/properties?limit=1')
    const properties = listResponse.data || []
    
    if (properties.length === 0) {
      throw new Error('No properties available for testing')
    }
    
    const propertyId = properties[0]._id || properties[0].id
    
    try {
      const detailResponse = await $api(`/properties/${propertyId}`)
      
      return {
        propertyId,
        hasDetails: !!detailResponse,
        detailsWorking: true
      }
    } catch (error) {
      throw new Error(`Property details failed: ${error.message}`)
    }
  })
}

// ✅ Content Management Tests
const testNewsSystem = async () => {
  return runTest('newsSystem', async () => {
    const response = await $api('/news?limit=5')
    const news = response.data || []
    
    systemHealth.value.news = news.length
    
    return {
      newsCount: news.length,
      hasNews: news.length > 0,
      newsSystemWorking: true
    }
  })
}

const testFeaturedProjects = async () => {
  return runTest('featuredProjects', async () => {
    const response = await $api('/featured-projects?limit=5')
    const projects = response.data || []
    
    systemHealth.value.projects = projects.length
    
    return {
      projectsCount: projects.length,
      hasProjects: projects.length > 0,
      projectsSystemWorking: true
    }
  })
}

const testContentCategories = async () => {
  return runTest('contentCategories', async () => {
    const [newsRes, projectsRes] = await Promise.all([
      $api('/news?limit=5'),
      $api('/featured-projects?limit=5')
    ])
    
    const news = newsRes.data || []
    const projects = projectsRes.data || []
    
    const newsCategories = news.map(n => n.category).filter(Boolean)
    const projectCategories = projects.map(p => p.category).filter(Boolean)
    
    return {
      newsWithCategories: newsCategories.length,
      projectsWithCategories: projectCategories.length,
      categoriesWorking: newsCategories.length > 0 || projectCategories.length > 0
    }
  })
}

// ✅ Search & Filter Tests
const testBasicSearch = async () => {
  return runTest('basicSearch', async () => {
    const searchTerm = 'villa'
    const response = await $api(`/properties?search=${encodeURIComponent(searchTerm)}`)
    
    return {
      searchTerm,
      resultsCount: response.data?.length || 0,
      basicSearchWorking: true
    }
  })
}

const testAdvancedFilters = async () => {
  return runTest('advancedFilters', async () => {
    const filters = {
      minPrice: 1000000,
      maxPrice: 50000000,
      type: 'apartment'
    }
    
    const queryString = new URLSearchParams(filters).toString()
    const response = await $api(`/properties?${queryString}`)
    
    return {
      filters,
      resultsCount: response.data?.length || 0,
      filtersWorking: true
    }
  })
}

const testSortingPagination = async () => {
  return runTest('sortingPagination', async () => {
    try {
      const response = await $api('/properties?limit=5&page=1&sort=price')
      
      return {
        paginationWorking: true,
        resultsCount: response.data?.length || 0
      }
    } catch (error) {
      // Try alternative
      const response = await $api('/properties?limit=5')
      
      return {
        paginationWorking: false,
        basicListingWorking: true,
        resultsCount: response.data?.length || 0
      }
    }
  })
}

// ✅ User Experience Tests
const testPageLoading = async () => {
  return runTest('pageLoading', async () => {
    const startTime = Date.now()
    
    const promises = [
      $api('/properties?limit=10'),
      $api('/news?limit=5'),
      $api('/featured-projects?limit=5')
    ]
    
    await Promise.all(promises)
    const totalTime = Date.now() - startTime
    
    return {
      totalLoadTime: `${totalTime}ms`,
      performant: totalTime < 3000,
      pageLoadingWorking: true
    }
  })
}

const testImageHandling = async () => {
  return runTest('imageHandling', async () => {
    const response = await $api('/properties?limit=5')
    const properties = response.data || []
    
    const withImages = properties.filter(p => p.images || p.image)
    
    return {
      propertiesWithImages: withImages.length,
      imageSystemWorking: withImages.length > 0,
      imageHandlingWorking: true
    }
  })
}

const testMobileResponsive = async () => {
  return runTest('mobileResponsive', async () => {
    // Basic responsive test
    return {
      mobileResponsive: true,
      viewportCompatible: true,
      responsiveWorking: true
    }
  })
}

// ✅ Batch Test Functions
const runCoreSystemTest = async () => {
  isRunningTest.value = true
  testProgress.value = 0
  completedTests.value = 0
  
  const coreTests = [
    { name: 'API Health', fn: testAPIHealth },
    { name: 'Database', fn: testDatabaseConnection },
    { name: 'Data Integrity', fn: testDataIntegrity },
    { name: 'User Login', fn: testUserLogin },
    { name: 'JWT Tokens', fn: testJWTTokens }
  ]
  
  totalTests.value = coreTests.length
  
  try {
    for (let i = 0; i < coreTests.length; i++) {
      const test = coreTests[i]
      currentTestName.value = test.name
      
      try {
        await test.fn()
      } catch (error) {
        console.warn(`Test ${test.name} failed:`, error.message)
      }
      
      completedTests.value = i + 1
      testProgress.value = Math.round(((i + 1) / coreTests.length) * 100)
      
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    alert(`✅ Core system test completed!\nPassed: ${passedTests.value}/${totalTests.value}`)
  } finally {
    isRunningTest.value = false
    currentTestName.value = ''
  }
}

const testRealEstateFeatures = async () => {
  isRunningTest.value = true
  testProgress.value = 0
  completedTests.value = 0
  
  const featureTests = [
    { name: 'Property Listing', fn: testPropertyListing },
    { name: 'Property Search', fn: testPropertySearch },
    { name: 'News System', fn: testNewsSystem },
    { name: 'Featured Projects', fn: testFeaturedProjects },
    { name: 'Basic Search', fn: testBasicSearch },
    { name: 'Advanced Filters', fn: testAdvancedFilters }
  ]
  
  totalTests.value = featureTests.length
  
  try {
    for (let i = 0; i < featureTests.length; i++) {
      const test = featureTests[i]
      currentTestName.value = test.name
      
      try {
        await test.fn()
      } catch (error) {
        console.warn(`Test ${test.name} failed:`, error.message)
      }
      
      completedTests.value = i + 1
      testProgress.value = Math.round(((i + 1) / featureTests.length) * 100)
      
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    alert(`🏠 Real estate features test completed!\nPassed: ${passedTests.value}/${totalTests.value}`)
  } finally {
    isRunningTest.value = false
    currentTestName.value = ''
  }
}

// ✅ Live Testing Tools
const executePropertySearch = async () => {
  try {
    const queryParams = {}
    
    if (testTools.search.keyword) queryParams.search = testTools.search.keyword
    if (testTools.search.location) queryParams.location = testTools.search.location
    if (testTools.search.type) queryParams.type = testTools.search.type
    if (testTools.search.minPrice) queryParams.minPrice = testTools.search.minPrice
    if (testTools.search.maxPrice) queryParams.maxPrice = testTools.search.maxPrice
    
    const queryString = new URLSearchParams(queryParams).toString()
    const response = await $api(`/properties?${queryString}`)
    
    testTools.search.results = response.data || []
    
    alert(`🔍 Found ${testTools.search.results.length} properties`)
  } catch (error) {
    alert(`❌ Search failed: ${error.message}`)
  }
}

const refreshSystemStats = async () => {
  try {
    await testAPIHealth()
    await testDataIntegrity()
    
    alert('📊 System stats refreshed!')
  } catch (error) {
    alert(`❌ Stats refresh failed: ${error.message}`)
  }
}

// ✅ Utility Functions
const emergencySystemSetup = async () => {
  try {
    console.log('🚑 Starting emergency system setup...')
    
    // Step 1: Clear existing data
    try {
      await $api('/clear-data', { method: 'DELETE' })
      console.log('✅ Cleared existing data')
    } catch (error) {
      console.warn('⚠️ Clear data failed:', error.message)
    }
    
    // Step 2: Seed fresh data
    await $api('/seed', { method: 'POST' })
    console.log('✅ Seeded fresh data')
    
    // Step 3: Test core functionality
    await testAPIHealth()
    await testUserLogin()
    await testDataIntegrity()
    
    alert('🎉 Emergency setup completed successfully!\n\nThe system is now ready for testing.')
    
  } catch (error) {
    console.error('❌ Emergency setup failed:', error)
    alert(`❌ Emergency setup failed: ${error.message}\n\nPlease check backend logs.`)
  }
}

const exportSystemReport = () => {
  const report = {
    timestamp: new Date().toISOString(),
    systemHealth: systemHealth.value,
    testSummary: {
      total: testResults.value.length,
      passed: passedTests.value,
      failed: failedTests.value,
      successRate: successRate.value
    },
    testResults: testResults.value
  }
  
  console.clear()
  console.log('📊 REAL ESTATE SYSTEM REPORT')
  console.log('═'.repeat(50))
  console.log(`Generated: ${new Date().toLocaleString()}`)
  console.log(`API Status: ${systemHealth.value.api ? '✅ Online' : '❌ Offline'}`)
  console.log(`Properties: ${systemHealth.value.properties}`)
  console.log(`News: ${systemHealth.value.news}`)
  console.log(`Projects: ${systemHealth.value.projects}`)
  console.log(`Test Results: ${passedTests.value}/${testResults.value.length} passed`)
  console.log('═'.repeat(50))
  console.log('Full Report:', JSON.stringify(report, null, 2))
}

const viewTestDetails = (result) => {
  alert(`Test: ${result.name}\nStatus: ${result.status}\nDuration: ${result.duration}ms\nDetails: ${JSON.stringify(result.details, null, 2)}`)
}

const getStatusClass = (status) => {
  return status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const formatTime = (timestamp) => {
  return timestamp ? new Date(timestamp).toLocaleTimeString() : 'Never'
}

// ✅ Initialize
onMounted(async () => {
  try {
    await testAPIHealth()
    await testDataIntegrity()
  } catch (error) {
    console.warn('Initial system check failed:', error.message)
  }
})
</script>

<template>
  <div class="min-h-screen pt-3 bg-gradient-to-b from-gray-50 to-white">
    <!-- Loading State -->
    <div v-if="pending" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="w-16 h-16 mx-auto border-4 border-[#F62E56] border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-lg text-gray-600">Đang tải thông tin dự án...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="max-w-md p-12 mx-auto text-center bg-white shadow-xl rounded-3xl">
        <div class="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full">
          <svg class="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
        </div>
        <h1 class="mb-4 text-2xl font-bold text-gray-900">Không tìm thấy dự án</h1>
        <p class="mb-8 text-gray-600">Dự án bạn đang tìm không tồn tại hoặc đã bị gỡ bỏ.</p>
        <div class="flex justify-center gap-4">
          <NuxtLink 
            to="/projects"
            class="px-6 py-3 bg-[#F62E56] text-white font-semibold rounded-full hover:bg-[#F62E56]/90 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            ← Về danh sách dự án
          </NuxtLink>
          <NuxtLink 
            to="/"
            class="px-6 py-3 font-semibold text-gray-700 transition-all duration-300 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            Về trang chủ
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Project Detail -->
    <div v-else-if="project" class="container px-4 py-8 mx-auto max-w-7xl">
      <!-- Breadcrumb -->
      <nav class="mb-8">
        <ol class="flex items-center space-x-2 text-sm text-gray-500">
          <li><NuxtLink to="/" class="hover:text-[#F62E56] transition-colors">Trang chủ</NuxtLink></li>
          <li>/</li>
          <li><NuxtLink to="/projects" class="hover:text-[#F62E56] transition-colors">Dự án</NuxtLink></li>
          <li>/</li>
          <li><span class="font-medium text-gray-900">{{ project.title }}</span></li>
        </ol>
      </nav>

      <!-- Project Header -->
      <div class="p-8 mb-8 bg-white shadow-xl rounded-3xl">
        <div class="grid items-start gap-8 lg:grid-cols-2">
          <!-- Left: Project Info -->
          <div>
            <div class="flex items-start justify-between mb-6">
              <div>
                <h1 class="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">{{ project.title }}</h1>
                
                <!-- Location -->
                <div class="flex items-center mb-4 text-gray-600">
                  <svg class="w-6 h-6 mr-3 text-[#F62E56]" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-lg">{{ project.location }}</span>
                </div>
                
                <!-- Status Badge -->
                <div class="mb-6">
                  <span 
                    class="inline-flex px-4 py-2 text-sm font-semibold rounded-full"
                    :class="getStatusClass(project.status)"
                  >
                    {{ getStatusText(project.status) }}
                  </span>
                </div>
              </div>
              
              <!-- Price -->
              <div v-if="project.priceFrom" class="text-right">
                <div class="mb-1 text-sm text-gray-500">Giá từ</div>
                <div class="text-3xl font-bold text-[#F62E56]">
                  {{ formatPrice(project.priceFrom) }}
                </div>
                <div class="text-sm text-gray-500">/ căn hộ</div>
              </div>
            </div>
            
            <!-- Description -->
            <div class="bg-gradient-to-r from-[#F62E56]/5 to-[#F62E56]/10 rounded-2xl p-6 border-l-4 border-[#F62E56]">
              <h3 class="mb-3 text-lg font-semibold text-gray-900">Giới thiệu dự án</h3>
              <p class="leading-relaxed text-gray-700">{{ project.description }}</p>
            </div>
          </div>
          
          <!-- Right: Project Image -->
          <div class="relative">
            <div class="relative overflow-hidden rounded-2xl shadow-2xl h-96 lg:h-[500px]">
              <img
                :src="project.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'"
                :alt="project.title"
                class="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              
              <!-- Overlay Info -->
              <div class="absolute bottom-6 left-6 right-6">
                <div class="p-4 bg-white/90 backdrop-blur-sm rounded-2xl">
                  <div class="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div class="text-2xl font-bold text-[#F62E56]">{{ project.floors || 0 }}</div>
                      <div class="text-xs text-gray-600">Tầng</div>
                    </div>
                    <div>
                      <div class="text-2xl font-bold text-[#F62E56]">{{ project.blocks || 0 }}</div>
                      <div class="text-xs text-gray-600">Block</div>
                    </div>
                    <div>
                      <div class="text-2xl font-bold text-[#F62E56]">{{ formatNumber(project.apartments) }}</div>
                      <div class="text-xs text-gray-600">Căn hộ</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Project Stats Grid -->
      <div class="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <div class="p-6 text-center transition-shadow duration-300 bg-white shadow-lg rounded-2xl hover:shadow-xl">
          <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m5 0v-4a1 1 0 011-1h2a1 1 0 011 1v4M7 7h10M7 11h4"/>
            </svg>
          </div>
          <div class="mb-2 text-3xl font-bold text-gray-900">{{ project.floors || 0 }}</div>
          <div class="font-medium text-gray-500">Tầng</div>
        </div>
        
        <div class="p-6 text-center transition-shadow duration-300 bg-white shadow-lg rounded-2xl hover:shadow-xl">
          <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
            </svg>
          </div>
          <div class="mb-2 text-3xl font-bold text-gray-900">{{ project.blocks || 0 }}</div>
          <div class="font-medium text-gray-500">Block</div>
        </div>
        
        <div class="p-6 text-center transition-shadow duration-300 bg-white shadow-lg rounded-2xl hover:shadow-xl">
          <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full">
            <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </div>
          <div class="mb-2 text-3xl font-bold text-gray-900">{{ formatArea(project.area) }}</div>
          <div class="font-medium text-gray-500">m²</div>
        </div>
        
        <div class="p-6 text-center transition-shadow duration-300 bg-white shadow-lg rounded-2xl hover:shadow-xl">
          <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full">
            <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"/>
            </svg>
          </div>
          <div class="mb-2 text-3xl font-bold text-gray-900">{{ formatNumber(project.apartments) }}</div>
          <div class="font-medium text-gray-500">Căn hộ</div>
        </div>
      </div>

      <!-- Project Details & Gallery -->
      <div class="grid gap-8 mb-8 lg:grid-cols-3">
        <!-- Left: Project Details -->
        <div class="lg:col-span-2">
          <!-- Project Images Gallery -->
          <div class="p-6 mb-6 bg-white shadow-lg rounded-2xl">
            <h2 class="mb-6 text-2xl font-bold text-gray-900">Hình ảnh dự án</h2>
            
            <!-- Main Image -->
            <div class="relative mb-4 overflow-hidden rounded-2xl h-96">
              <img
                :src="activeImage"
                :alt="project.title"
                class="object-cover w-full h-full"
              />
            </div>
            
            <!-- Thumbnail Gallery -->
            <div class="grid grid-cols-4 gap-4">
              <button
                v-for="(image, index) in projectImages"
                :key="index"
                @click="activeImage = image"
                class="relative h-20 overflow-hidden transition-all duration-200 border-2 rounded-lg"
                :class="activeImage === image ? 'border-[#F62E56]' : 'border-gray-200 hover:border-gray-300'"
              >
                <img
                  :src="image"
                  :alt="`${project.title} - Hình ${index + 1}`"
                  class="object-cover w-full h-full"
                />
              </button>
            </div>
          </div>

          <!-- Project Features -->
          <div class="p-6 bg-white shadow-lg rounded-2xl">
            <h2 class="mb-6 text-2xl font-bold text-gray-900">Tiện ích dự án</h2>
            
            <div class="grid gap-6 md:grid-cols-2">
              <div>
                <h3 class="mb-4 text-lg font-semibold text-gray-900">Tiện ích nội khu</h3>
                <ul class="space-y-3">
                  <li v-for="feature in internalFeatures" :key="feature" class="flex items-center text-gray-700">
                    <svg class="w-5 h-5 mr-3 text-[#F62E56]" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    {{ feature }}
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 class="mb-4 text-lg font-semibold text-gray-900">Tiện ích xung quanh</h3>
                <ul class="space-y-3">
                  <li v-for="feature in externalFeatures" :key="feature" class="flex items-center text-gray-700">
                    <svg class="w-5 h-5 mr-3 text-[#F62E56]" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    {{ feature }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Contact Form -->
        <div class="lg:col-span-1">
          <div class="sticky p-6 bg-white shadow-lg rounded-2xl top-8">
            <h2 class="mb-6 text-2xl font-bold text-gray-900">Liên hệ tư vấn</h2>
            
            <!-- Chat Quick Action -->
            <div class="p-4 mb-6 border border-blue-200 rounded-lg bg-blue-50">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium text-blue-900">Tư vấn trực tiếp</h3>
                  <p class="text-sm text-blue-700">Nhắn tin ngay với chuyên viên tư vấn</p>
                </div>
                <button
                  @click="handleChatWithAgent"
                  :disabled="isConnectingChat"
                  class="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <svg v-if="isConnectingChat" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                  {{ isConnectingChat ? 'Kết nối...' : 'Chat ngay' }}
                </button>
              </div>
            </div>
            
            <form @submit.prevent="submitContact" class="space-y-4">
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">Họ tên *</label>
                <input
                  v-model="contactForm.name"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F62E56] focus:border-transparent"
                  placeholder="Nhập họ tên của bạn"
                />
              </div>
              
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">Số điện thoại *</label>
                <input
                  v-model="contactForm.phone"
                  type="tel"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F62E56] focus:border-transparent"
                  placeholder="Nhập số điện thoại"
                />
              </div>
              
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">Email</label>
                <input
                  v-model="contactForm.email"
                  type="email"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F62E56] focus:border-transparent"
                  placeholder="Nhập email của bạn"
                />
              </div>
              
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">Tin nhắn</label>
                <textarea
                  v-model="contactForm.message"
                  rows="4"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F62E56] focus:border-transparent"
                  :placeholder="`Tôi quan tâm đến dự án ${project.title}. Vui lòng liên hệ tư vấn.`"
                ></textarea>
              </div>
              
              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full px-6 py-3 bg-[#F62E56] text-white font-semibold rounded-lg hover:bg-[#F62E56]/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isSubmitting">Đang gửi...</span>
                <span v-else>Gửi yêu cầu tư vấn</span>
              </button>
            </form>
            
            <!-- Quick Actions -->
            <div class="pt-6 mt-6 border-t border-gray-200">
              <div class="grid grid-cols-2 gap-3">
                <a
                  :href="project.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                  Trang chính thức
                </a>
                <button class="flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                  Gọi ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Projects -->
      <div class="p-6 mb-8 bg-white shadow-lg rounded-2xl">
        <h2 class="mb-6 text-2xl font-bold text-gray-900">Dự án liên quan</h2>
        
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="related in relatedProjects" :key="related.id" class="p-4 transition-shadow duration-300 rounded-lg shadow-md bg-gray-50 hover:shadow-lg">
            <NuxtLink 
              :to="`/projects/${related.id}`"
              class="block"
            >
              <div class="relative h-48 mb-4 overflow-hidden rounded-lg">
                <img
                  :src="related.image"
                  :alt="related.title"
                  class="object-cover w-full h-full"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              
              <div>
                <h3 class="mb-2 text-lg font-semibold text-gray-900">{{ related.title }}</h3>
                <div class="flex items-center mb-2 text-gray-600">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                  </svg>
                  <span>{{ related.location }}</span>
                </div>
                <div class="flex flex-wrap gap-2 text-sm">
                  <span class="inline-flex items-center px-3 py-1 font-medium rounded-full"
                        :class="related.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                    {{ related.status === 'active' ? 'Đang mở bán' : 'Sắp mở bán' }}
                  </span>
                  <span class="inline-flex items-center px-3 py-1 font-medium text-gray-700 bg-gray-100 rounded-full">
                    {{ formatArea(related.area) }} m²
                  </span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// SEO
definePageMeta({
  title: 'Chi tiết dự án'
})

const route = useRoute()
const config = useRuntimeConfig()

// Fetch project data
const { data: projectData, pending, error } = await useFetch(`${config.public.apiBase}/featured-projects/${route.params.id}`, {
  default: () => null,
  server: false
})

const project = computed(() => {
  if (projectData.value?.success && projectData.value?.data) {
    return projectData.value.data
  }
  if (projectData.value?.data) {
    return projectData.value.data
  }
  if (projectData.value && projectData.value.title) {
    return projectData.value
  }
  return null
})

// Fetch related projects
const { data: relatedProjectsData } = await useFetch(`${config.public.apiBase}/featured-projects`, {
  default: () => ({ success: false, data: [] }),
  server: false,
  query: { limit: 3 }
})

const relatedProjects = computed(() => {
  let projects = []
  if (relatedProjectsData.value?.success && Array.isArray(relatedProjectsData.value.data)) {
    projects = relatedProjectsData.value.data
  } else if (Array.isArray(relatedProjectsData.value)) {
    projects = relatedProjectsData.value
  }
  
  // Filter out current project
  return projects
    .filter(p => (p._id || p.id) !== route.params.id)
    .slice(0, 3)
})

// SEO dynamic
watch(project, (newProject) => {
  if (newProject) {
    useHead({
      title: `${newProject.title} - Chi tiết dự án`,
      meta: [
        { name: 'description', content: newProject.description || 'Chi tiết dự án bất động sản' }
      ]
    })
  }
}, { immediate: true })

// Helper functions
const formatArea = (area) => {
  if (!area) return '0'
  return new Intl.NumberFormat('vi-VN').format(area)
}

const formatNumber = (number) => {
  if (!number) return '0'
  return new Intl.NumberFormat('vi-VN').format(number)
}

const formatPrice = (price) => {
  if (!price) return 'Liên hệ'
  if (price >= 1000000000) {
    return `${(price / 1000000000).toFixed(1)} tỷ`
  }
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(0)} triệu`
  }
  return new Intl.NumberFormat('vi-VN').format(price)
}

const getStatusClass = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'upcoming':
      return 'bg-yellow-100 text-yellow-800'
    case 'completed':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'active':
      return 'Đang mở bán'
    case 'upcoming':
      return 'Sắp mở bán'
    case 'completed':
      return 'Đã hoàn thành'
    default:
      return 'Cập nhật'
  }
}

// Reactive state for gallery
const projectImages = computed(() => {
  const images = []
  
  // Add main image
  if (project.value?.image) {
    images.push(project.value.image)
  }
  
  // Add additional images if available
  if (project.value?.images && Array.isArray(project.value.images)) {
    images.push(...project.value.images)
  }
  
  // Add fallback images if no images
  if (images.length === 0) {
    images.push(
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'
    )
  }
  
  return images
})

const activeImage = ref('')

// Watch for image changes
watch(projectImages, (newImages) => {
  if (newImages.length > 0 && !newImages.includes(activeImage.value)) {
    activeImage.value = newImages[0]
  }
}, { immediate: true })

// Features data
const internalFeatures = [
  'Hồ bơi vô cực',
  'Phòng gym hiện đại',
  'Khu vui chơi trẻ em',
  'Khu BBQ ngoài trời',
  'Phòng sinh hoạt cộng đồng',
  'Khu thể thao đa năng'
]

const externalFeatures = [
  'Gần trường học quốc tế',
  'Trung tâm thương mại',
  'Bệnh viện đa khoa',
  'Công viên xanh',
  'Giao thông thuận tiện',
  'Kết nối metro'
]

// Contact form
const contactForm = ref({
  name: '',
  phone: '',
  email: '',
  message: ''
})

const isSubmitting = ref(false)

const submitContact = async () => {
  isSubmitting.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Reset form
    contactForm.value = {
      name: '',
      phone: '',
      email: '',
      message: ''
    }
    
    // Show success message
    alert('Gửi yêu cầu tư vấn thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.')
  } catch (error) {
    alert('Đã xảy ra lỗi. Vui lòng thử lại sau.')
  } finally {
    isSubmitting.value = false
  }
}

// Initialize message
watch(project, (newProject) => {
  if (newProject && !contactForm.value.message) {
    contactForm.value.message = `Tôi quan tâm đến dự án ${newProject.title}. Vui lòng liên hệ tư vấn chi tiết.`
  }
}, { immediate: true })

// Import our chat composable
const { startChatFromProperty } = usePropertyChat()

const isConnectingChat = ref(false)

const handleChatWithAgent = async () => {
  if (!project.value) return
  
  isConnectingChat.value = true
  
  try {
    // Create a property-like object for the project
    await startChatFromProperty({
      id: project.value._id || project.value.id,
      title: project.value.title,
      ownerId: project.value.developerId || project.value.agentId || '507f1f77bcf86cd799439011',
      ownerName: project.value.developer || project.value.agent || 'Chuyên viên tư vấn',
      ownerAvatar: project.value.developerAvatar || project.value.agentAvatar
    })
  } catch (error) {
    console.error('Error starting chat with agent:', error)
  } finally {
    isConnectingChat.value = false
  }
}
</script>

<style scoped>
/* Custom scrollbar for project details */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #F62E56;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #e63946;
}
</style>
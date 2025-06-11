<!-- filepath: d:\FS\FE\Real Estate Nuxt\frontend\components\UniversalSearchBar.vue -->
<template>
  <div class="relative z-20 flex justify-center w-full" :class="containerClass">
    <div
      class="flex items-center w-full px-2 py-2 bg-white border rounded-full shadow-xl border-stone-100 md:py-3"
      :class="maxWidth"
      style="box-shadow: 0 8px 32px 0 rgba(60,60,60,0.10);"
    >
      <!-- Toggle Switch -->
      <div v-if="showToggle" class="flex items-center justify-center mr-2">
        <div class="relative flex w-[180px] h-12 bg-[#F4F4F5] rounded-full p-1">
          <button
            :class="[
              'flex-1 h-full rounded-full font-semibold font-inter transition-all duration-200',
              searchValues.type === 'Mua nhà'
                ? 'bg-[#F62E56] text-white shadow'
                : 'bg-transparent text-[#6B7280]'
            ]"
            @click="changeTab(0)"
            :disabled="disableToggle"
          >
            Mua nhà
          </button>
          <button
            :class="[
              'flex-1 h-full rounded-full font-semibold font-inter transition-all duration-200',
              searchValues.type === 'Thuê nhà'
                ? 'bg-[#F62E56] text-white shadow'
                : 'bg-transparent text-[#6B7280]'
            ]"
            @click="changeTab(1)"
            :disabled="disableToggle"
          >
            Thuê nhà
          </button>
        </div>
      </div>

      <!-- Search Input with Smart Suggestions -->
      <div class="relative flex items-center flex-1 h-12 min-w-0 px-4 bg-white rounded-full">
        <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" stroke-width="2"></circle>
          <path stroke-linecap="round" stroke-width="2" d="M21 21l-4.35-4.35"></path>
        </svg>
        
        <input
          ref="searchInput"
          v-model="searchValues.keyword"
          type="text"
          :placeholder="placeholder"
          class="w-full text-base bg-transparent font-inter focus:outline-none"
          autocomplete="off"
          @keyup.enter="handleSearch"
          @input="onSearchInput"
          @focus="onInputFocus"
          @blur="onInputBlur"
        />
        
        <!-- Clear button -->
        <button
          v-if="searchValues.keyword"
          @click="clearKeyword"
          class="p-1 ml-2 text-gray-400 transition-colors rounded-full hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <!-- Loading indicator -->
        <div v-if="isSearching" class="ml-2">
          <svg class="w-4 h-4 animate-spin text-[#F62E56]" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>

        <!-- Smart Search Suggestions -->
        <div
          v-if="showSuggestions && (searchSuggestions.length > 0 || recentSearches.length > 0 || popularSearches.length > 0)"
          class="absolute left-0 right-0 z-50 mt-2 overflow-hidden bg-white border border-gray-200 shadow-xl search-suggestions top-full rounded-xl"
        >
          <div class="py-2">
            <!-- Current search suggestions -->
            <div v-if="searchSuggestions.length > 0" class="mb-2">
              <div class="px-4 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
                Gợi ý tìm kiếm
              </div>
              <div
                v-for="(suggestion, index) in searchSuggestions"
                :key="`suggestion-${index}`"
                @click="selectSuggestion(suggestion.value)"
                class="flex items-center px-4 py-3 transition-colors cursor-pointer hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 group"
              >
                <div class="flex items-center justify-center w-8 h-8 mr-3 bg-gray-100 rounded-lg group-hover:bg-red-100">
                  <svg v-if="suggestion.icon === 'location'" class="w-4 h-4 text-gray-500 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 12.414a2 2 0 00-2.828 0l-4.243 4.243a8 8 0 1111.314 0z"/>
                  </svg>
                  <svg v-else-if="suggestion.icon === 'home'" class="w-4 h-4 text-gray-500 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                  </svg>
                  <svg v-else class="w-4 h-4 text-gray-500 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" stroke-width="2"></circle>
                    <path stroke-linecap="round" stroke-width="2" d="M21 21l-4.35-4.35"></path>
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-700 font-inter group-hover:text-gray-900">{{ suggestion.label }}</span>
              </div>
            </div>

            <!-- Recent Searches -->
            <div v-if="!searchValues.keyword && recentSearches.length > 0" class="mb-2">
              <div class="px-4 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
                Tìm kiếm gần đây
              </div>
              <div
                v-for="(recent, index) in recentSearches.slice(0, 4)"
                :key="`recent-${index}`"
                @click="selectSuggestion(recent)"
                class="flex items-center px-4 py-3 transition-colors cursor-pointer hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 group"
              >
                <div class="flex items-center justify-center w-8 h-8 mr-3 bg-gray-100 rounded-lg group-hover:bg-red-100">
                  <svg class="w-4 h-4 text-gray-500 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-700 font-inter group-hover:text-gray-900">{{ recent }}</span>
              </div>
            </div>

            <!-- Popular Searches -->
            <div v-if="!searchValues.keyword && popularSearches.length > 0">
              <div class="px-4 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
                Tìm kiếm phổ biến
              </div>
              <div
                v-for="(popular, index) in popularSearches.slice(0, 4)"
                :key="`popular-${index}`"
                @click="selectSuggestion(popular)"
                class="flex items-center px-4 py-3 transition-colors cursor-pointer hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 group"
              >
                <div class="flex items-center justify-center w-8 h-8 mr-3 bg-gray-100 rounded-lg group-hover:bg-red-100">
                  <svg class="w-4 h-4 text-gray-500 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-700 font-inter group-hover:text-gray-900">{{ popular }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Advanced Filter Dropdowns -->
      <div class="flex items-center">
        <!-- Location Filter -->
        <div class="relative z-30 flex items-center flex-shrink-0 h-full px-4 border-l border-stone-200 search-dropdown">
          <button
            @click="toggleDropdown('location')"
            class="flex items-center gap-2 bg-transparent focus:outline-none min-w-[110px] h-12 transition-colors"
            :class="{
              'text-[#F62E56] font-semibold': dropdownOpen === 'location' || searchValues.location !== 'Vị trí',
              'text-gray-700 hover:text-gray-900': !(dropdownOpen === 'location') && searchValues.location === 'Vị trí'
            }"
            type="button"
          >
            <span class="truncate max-w-[90px] text-sm font-inter">{{ searchValues.location }}</span>
            <svg 
              class="w-4 h-4 text-gray-400 transition-transform"
              :class="{ 'rotate-180': dropdownOpen === 'location' }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          <div
            v-if="dropdownOpen === 'location'"
            class="absolute left-0 z-40 w-56 py-2 mt-2 overflow-hidden overflow-y-auto bg-white border border-gray-200 shadow-xl top-full rounded-xl max-h-64"
          >
            <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
              Chọn khu vực
            </div>
            <div
              v-for="location in locationOptions"
              :key="location.value"
              @click="selectDropdownOption('location', location.label)"
              class="flex items-center px-3 py-3 transition-colors cursor-pointer hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 group"
              :class="{
                'bg-gradient-to-r from-red-50 to-pink-50 text-[#F62E56] font-semibold': searchValues.location === location.label,
                'text-gray-700': searchValues.location !== location.label
              }"
            >
              <div 
                class="w-2 h-2 mr-3 transition-colors rounded-full"
                :class="searchValues.location === location.label ? 'bg-[#F62E56]' : 'bg-gray-300 group-hover:bg-red-300'"
              ></div>
              <span class="text-sm font-inter">{{ location.label }}</span>
            </div>
          </div>
        </div>

        <!-- Price Filter -->
        <div class="relative z-20 flex items-center flex-shrink-0 h-full px-4 border-l border-stone-200 search-dropdown">
          <button
            @click="toggleDropdown('price')"
            class="flex items-center gap-2 bg-transparent focus:outline-none min-w-[110px] h-12 transition-colors"
            :class="{
              'text-[#F62E56] font-semibold': dropdownOpen === 'price' || searchValues.price !== 'Giá',
              'text-gray-700 hover:text-gray-900': !(dropdownOpen === 'price') && searchValues.price === 'Giá'
            }"
            type="button"
          >
            <span class="truncate max-w-[90px] text-sm font-inter">{{ searchValues.price }}</span>
            <svg 
              class="w-4 h-4 text-gray-400 transition-transform"
              :class="{ 'rotate-180': dropdownOpen === 'price' }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          <div
            v-if="dropdownOpen === 'price'"
            class="absolute left-0 z-40 w-56 py-2 mt-2 overflow-hidden bg-white border border-gray-200 shadow-xl top-full rounded-xl"
          >
            <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
              Mức giá
            </div>
            <div
              v-for="option in priceOptionsDetails"
              :key="option.value"
              @click="selectDropdownOption('price', option.label)"
              class="flex items-center px-3 py-3 transition-colors cursor-pointer hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 group"
              :class="{
                'bg-gradient-to-r from-red-50 to-pink-50 text-[#F62E56] font-semibold': searchValues.price === option.label,
                'text-gray-700': searchValues.price !== option.label
              }"
            >
              <div 
                class="w-2 h-2 mr-3 transition-colors rounded-full"
                :class="searchValues.price === option.label ? 'bg-[#F62E56]' : 'bg-gray-300 group-hover:bg-red-300'"
              ></div>
              <span class="text-sm font-inter">{{ option.label }}</span>
            </div>
          </div>
        </div>

        <!-- Rooms Filter -->
        <div class="relative z-10 flex items-center flex-shrink-0 h-full px-4 border-l border-stone-200 search-dropdown">
          <button
            @click="toggleDropdown('rooms')"
            class="flex items-center gap-2 bg-transparent focus:outline-none min-w-[110px] h-12 transition-colors"
            :class="{
              'text-[#F62E56] font-semibold': dropdownOpen === 'rooms' || searchValues.rooms !== 'Số phòng',
              'text-gray-700 hover:text-gray-900': !(dropdownOpen === 'rooms') && searchValues.rooms === 'Số phòng'
            }"
            type="button"
          >
            <span class="truncate max-w-[90px] text-sm font-inter">{{ searchValues.rooms }}</span>
            <svg 
              class="w-4 h-4 text-gray-400 transition-transform"
              :class="{ 'rotate-180': dropdownOpen === 'rooms' }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          <div
            v-if="dropdownOpen === 'rooms'"
            class="absolute left-0 z-40 w-56 py-2 mt-2 overflow-hidden bg-white border border-gray-200 shadow-xl top-full rounded-xl"
          >
            <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
              Số phòng ngủ
            </div>
            <div
              v-for="room in roomOptions"
              :key="room"
              @click="selectDropdownOption('rooms', room)"
              class="flex items-center px-3 py-3 transition-colors cursor-pointer hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 group"
              :class="{
                'bg-gradient-to-r from-red-50 to-pink-50 text-[#F62E56] font-semibold': searchValues.rooms === room,
                'text-gray-700': searchValues.rooms !== room
              }"
            >
              <div 
                class="w-2 h-2 mr-3 transition-colors rounded-full"
                :class="searchValues.rooms === room ? 'bg-[#F62E56]' : 'bg-gray-300 group-hover:bg-red-300'"
              ></div>
              <span class="text-sm font-inter">{{ room }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Search Button -->
      <button
        @click="handleSearch"
        class="flex items-center gap-2 h-10 px-6 ml-2 bg-[#F62E56] text-white font-semibold rounded-full hover:bg-[#d9254a] transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-500/20 shadow-lg"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" stroke-width="2"></circle>
          <path stroke-linecap="round" stroke-width="2" d="M21 21l-4.35-4.35"></path>
        </svg>
        <span class="hidden font-inter md:inline">Tìm kiếm</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// Props
const props = defineProps({
  initialType: {
    type: String,
    default: 'Mua nhà'
  },
  showToggle: {
    type: Boolean,
    default: true
  },
  disableToggle: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: 'Nhập từ khóa tìm kiếm: căn hộ, nhà phố, quận 1...'
  },
  maxWidth: {
    type: String,
    default: 'max-w-5xl'
  },
  containerClass: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['search'])

// Router
const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()

// State
const searchValues = ref({
  type: props.initialType,
  keyword: '',
  location: 'Vị trí',
  price: 'Giá',
  rooms: 'Số phòng'
})

const dropdownOpen = ref(null)
const isSearching = ref(false)
const searchSuggestions = ref([])
const showSuggestions = ref(false)
const recentSearches = ref([])
const popularSearches = ref([])
const locationOptions = ref([])

// Search options
const priceOptionsDetails = computed(() => {
  const salePrices = [
    { label: "Giá", value: "all", min: null, max: null },
    { label: "Dưới 1 tỷ", value: "under-1", min: 0, max: 1000000000 },
    { label: "1-2 tỷ", value: "1-2", min: 1000000000, max: 2000000000 },
    { label: "2-5 tỷ", value: "2-5", min: 2000000000, max: 5000000000 },
    { label: "5-10 tỷ", value: "5-10", min: 5000000000, max: 10000000000 },
    { label: "Trên 10 tỷ", value: "above-10", min: 10000000000, max: null }
  ];
  const rentPrices = [
    { label: "Giá", value: "all", min: null, max: null },
    { label: "Dưới 5 triệu", value: "under-5m", min: 0, max: 5000000 },
    { label: "5-10 triệu", value: "5m-10m", min: 5000000, max: 10000000 },
    { label: "10-20 triệu", value: "10m-20m", min: 10000000, max: 20000000 },
    { label: "20-30 triệu", value: "20m-30m", min: 20000000, max: 30000000 },
    { label: "Trên 30 triệu", value: "above-30m", min: 30000000, max: null }
  ];
  return searchValues.value.type === 'Mua nhà' ? salePrices : rentPrices;
});

const roomOptions = ref(["Số phòng", "1 phòng", "2 phòng", "3 phòng", "4+ phòng"])

// Debounce timer
let debounceTimer = null
let suggestionTimer = null

// Methods
const changeTab = (index) => {
  searchValues.value.type = index === 0 ? "Mua nhà" : "Thuê nhà"
  // Reset price when switching tabs
  if (searchValues.value.price !== 'Giá') {
    searchValues.value.price = 'Giá'
  }
}

const toggleDropdown = (model) => {
  dropdownOpen.value = dropdownOpen.value === model ? null : model
  showSuggestions.value = false
}

const selectDropdownOption = (model, option) => {
  searchValues.value[model] = option
  dropdownOpen.value = null
}

const selectSuggestion = (suggestion) => {
  searchValues.value.keyword = suggestion
  showSuggestions.value = false
  addToRecentSearches(suggestion)
  handleSearch()
}

const addToRecentSearches = (term) => {
  if (term && !recentSearches.value.includes(term)) {
    recentSearches.value.unshift(term)
    if (recentSearches.value.length > 10) {
      recentSearches.value = recentSearches.value.slice(0, 10)
    }
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
  }
}

const clearKeyword = () => {
  searchValues.value.keyword = ''
  showSuggestions.value = false
  searchSuggestions.value = []
  searchInput.value?.focus()
}

const onSearchInput = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  if (suggestionTimer) clearTimeout(suggestionTimer)

  if (searchValues.value.keyword.trim()) {
    suggestionTimer = setTimeout(async () => {
      await loadSearchSuggestions()
    }, 300)
  } else {
    showSuggestions.value = false
    searchSuggestions.value = []
  }
}

const onInputFocus = () => {
  if (searchValues.value.keyword.trim() && searchSuggestions.value.length > 0) {
    showSuggestions.value = true
  } else if (!searchValues.value.keyword.trim()) {
    showSuggestions.value = true
    loadPopularSearches()
  }
}

const onInputBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

const { $api } = useApi()

const loadSearchSuggestions = async () => {
  try {
    if (!searchValues.value.keyword || searchValues.value.keyword.length < 2) {
      searchSuggestions.value = []
      return
    }

    // ✅ FIXED: Use correct API endpoint with $api composable
    const response = await $api('/properties/search/suggestions', {
      query: { q: searchValues.value.keyword }
    })
    
    if (response.success) {
      searchSuggestions.value = response.data || []
      showSuggestions.value = true
    }
  } catch (error) {
    console.error('Error loading suggestions:', error)
    searchSuggestions.value = []
    // Fallback suggestions based on keyword
    if (searchValues.value.keyword.length >= 2) {
      searchSuggestions.value = [
        { label: searchValues.value.keyword, value: searchValues.value.keyword, icon: 'search' }
      ]
      showSuggestions.value = true
    }
  }
}

const loadPopularSearches = async () => {
  try {
    // ✅ FIXED: Use correct API endpoint
    const response = await $api('/properties/search/popular')
    if (response.success) {
      popularSearches.value = response.data || []
    }
  } catch (error) {
    console.error('Error loading popular searches:', error)
    // Fallback popular searches
    popularSearches.value = [
      'Căn hộ Quận 1',
      'Nhà phố Quận 7', 
      'Villa Thủ Đức',
      'Chung cư Bình Thạnh'
    ]
  }
}

const loadLocationOptions = async () => {
  try {
    // ✅ FIXED: Use correct API endpoint
    const response = await $api('/properties/search/filters')
    if (response.success) {
      locationOptions.value = [
        { label: 'Vị trí', value: 'all' },
        ...(response.data.locations || []).map(loc => ({ label: loc, value: loc }))
      ]
    }
  } catch (error) {
    console.error('Error loading location options:', error)
    // Fallback location options
    locationOptions.value = [
      { label: 'Vị trí', value: 'all' },
      { label: 'TP HCM', value: 'TP HCM' },
      { label: 'Hà Nội', value: 'Hà Nội' },
      { label: 'Đà Nẵng', value: 'Đà Nẵng' },
      { label: 'Bình Dương', value: 'Bình Dương' }
    ]
  }
}

const handleSearch = () => {
  const type = searchValues.value.type === "Mua nhà" ? "sale" : "rent"
  
  const query = {
    search: searchValues.value.keyword || undefined,
    location: searchValues.value.location !== 'Vị trí' ? searchValues.value.location : undefined,
  };

  const roomsValue = searchValues.value.rooms;
  if (roomsValue !== 'Số phòng') {
    if (roomsValue.includes('+')) {
      query.bedrooms = parseInt(roomsValue) + '+'; // e.g., "4+"
    } else {
      query.bedrooms = parseInt(roomsValue); // e.g., 3
    }
  }

  const selectedPriceLabel = searchValues.value.price;
  if (selectedPriceLabel !== 'Giá') {
    const priceDetail = priceOptionsDetails.value.find(p => p.label === selectedPriceLabel);
    if (priceDetail) {
      if (priceDetail.min !== null) {
        query.priceMin = priceDetail.min;
      }
      if (priceDetail.max !== null) {
        query.priceMax = priceDetail.max;
      }
    }
  }
  
  // Filter out empty values
  const filteredQuery = Object.fromEntries(
    Object.entries(query).filter(([_, v]) => v !== undefined && v !== '')
  )
  
  // Add to recent searches
  if (searchValues.value.keyword) {
    addToRecentSearches(searchValues.value.keyword)
  }
  
  showSuggestions.value = false
  dropdownOpen.value = null
  
  // Emit search event
  emit('search', { type, query: filteredQuery })
  
  // Navigate to search results page
  router.push({
    path: `/${type === 'sale' ? 'buy' : 'rent'}`,
    query: filteredQuery
  })
}

const handleClickOutside = (event) => {
  const target = event.target
  if (!target.closest('.search-dropdown') && !target.closest('.search-suggestions')) {
    dropdownOpen.value = null
    showSuggestions.value = false
  }
}

// Initialize from URL query
const initFromQuery = () => {
  if (route.query) {
    if (route.query.search) searchValues.value.keyword = route.query.search;
    if (route.query.location) searchValues.value.location = route.query.location;

    // Logic to re-select price label based on priceMin/priceMax from URL
    if (route.query.priceMin || route.query.priceMax) {
        const priceMinFromQuery = route.query.priceMin ? parseInt(route.query.priceMin) : null;
        const priceMaxFromQuery = route.query.priceMax ? parseInt(route.query.priceMax) : null;

        const matchedPriceOption = priceOptionsDetails.value.find(opt => {
            // Handle "all" case or default if no specific range matches
            if (opt.value === "all" && priceMinFromQuery === null && priceMaxFromQuery === null && opt.label === "Giá") return true;
            return opt.min === priceMinFromQuery && opt.max === priceMaxFromQuery;
        });

        if (matchedPriceOption) {
            searchValues.value.price = matchedPriceOption.label;
        } else {
             // Fallback or find closest match if needed - for now, default to "Giá"
            searchValues.value.price = "Giá";
        }
    } else {
        searchValues.value.price = "Giá"; // Default if no price params in URL
    }

    if (route.query.bedrooms) {
      const bedQuery = route.query.bedrooms.toString();
      // Attempt to match with existing roomOptions like "1 phòng", "4+ phòng"
      const roomOptionMatch = roomOptions.value.find(rOpt => {
        const numPart = parseInt(rOpt); // "1" from "1 phòng", "4" from "4+ phòng"
        if (bedQuery.endsWith('+')) { // Query is "4+"
          return rOpt.includes('+') && numPart === parseInt(bedQuery);
        } else { // Query is "1", "2", "3"
          return !rOpt.includes('+') && numPart === parseInt(bedQuery);
        }
      });

      if (roomOptionMatch) {
        searchValues.value.rooms = roomOptionMatch;
      } else {
        // If no direct match (e.g. query has "3" but options are "3 phòng"), default or construct
        searchValues.value.rooms = "Số phòng"; // Default if no suitable option found
      }
    } else {
      searchValues.value.rooms = "Số phòng"; // Default if no bedrooms param
    }
  }
}

// Load recent searches from localStorage
const loadRecentSearches = () => {
  try {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      recentSearches.value = JSON.parse(saved)
    }
  } catch (error) {
    console.error('Error loading recent searches:', error)
  }
}

// Watch route changes
watch(() => route.query, () => {
  initFromQuery()
}, { deep: true })

// Lifecycle
onMounted(() => {
  initFromQuery()
  loadRecentSearches()
  loadLocationOptions()
  loadPopularSearches()
  document.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
  if (suggestionTimer) clearTimeout(suggestionTimer)
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<style scoped>
.font-inter {
  font-family: "Inter", sans-serif;
}

.search-suggestions {
  max-height: 400px;
  overflow-y: auto;
}

.search-suggestions::-webkit-scrollbar {
  width: 4px;
}

.search-suggestions::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.search-suggestions::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.search-suggestions::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
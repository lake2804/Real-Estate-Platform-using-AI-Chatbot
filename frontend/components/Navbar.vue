<template>
  <nav
    :class="[
      'fixed top-0 left-0 right-0 z-50 w-full bg-white transition-all duration-250 ease-in-out shadow',
      isScrolled ? 'shadow py-2' : 'py-6',
    ]"
  >
    <div
      :class="[
        'flex items-center mx-auto transition-all duration-300 ease-in-out max-w-screen-2xl',
        isScrolled ? 'px-4 md:px-8' : 'px-8 md:px-20',
      ]"
    >
      <!-- Logo -->
      <div
        :class="[
          'flex items-center flex-shrink-0 cursor-pointer home-app-logo transition-all duration-300 ease-in-out',
          isScrolled ? 'scale-90' : 'scale-100',
        ]"
      >
        <NuxtLink to="/" class="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 40 40"
            fill="none"
            class="w-8 h-8"
          >
            <mask
              id="mask0_404_2339"
              style="mask-type: alpha"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="40"
              height="40"
            >
              <rect width="40" height="40" fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0_404_2339)">
              <path
                d="M9.38333 32.8334C8.79444 32.8334 8.29167 32.6268 7.875 32.2136C7.45833 31.8004 7.25 31.2987 7.25 30.7084V27.9167L12.9167 22.8751V32.8334H9.38333ZM14.25 32.8334V27.1667H25.75V32.8334H14.25ZM27.0833 32.8334V21.1883L20.9583 15.7917L25.25 12.0001L32.0417 18.0001C32.2639 18.2223 32.4375 18.4692 32.5625 18.7408C32.6875 19.0124 32.75 19.3018 32.75 19.6088V30.6977C32.75 31.2882 32.5434 31.7917 32.1302 32.2084C31.717 32.6251 31.2153 32.8334 30.625 32.8334H27.0833ZM7.25 26.0834V19.6368C7.25 19.3315 7.3125 19.038 7.4375 18.7561C7.5625 18.4743 7.73611 18.2223 7.95833 18.0001L18.5833 8.58341C18.8056 8.38897 19.0354 8.25008 19.2728 8.16675C19.5102 8.08341 19.7532 8.04175 20.002 8.04175C20.2507 8.04175 20.4931 8.08341 20.7292 8.16675C20.9653 8.25008 21.1944 8.38897 21.4167 8.58341L24.25 11.1251L7.25 26.0834Z"
                fill="#F62E56"
              />
            </g>
          </svg>
          <span
            :class="[
              'text-[#F62E56] font-quicksand font-bold ml-2 transition-all duration-300 ease-in-out',
              isScrolled ? 'text-[20px]' : 'text-[24px]',
            ]"
          >
            Nhàvui
          </span>
        </NuxtLink>
      </div>

      <!-- Navigation Links -->
      <div class="flex items-center justify-center flex-1 gap-10">
        <NuxtLink
          to="/"
          :class="[
            'font-inter font-medium text-[16px] cursor-pointer pb-1 pt-[5px] border-b-2 transition-colors',
            route.path === '/'
              ? 'text-[#F62E56] border-[#F62E56]'
              : 'text-[#1C1917] border-transparent hover:text-[#F62E56]',
          ]"
        >
          Trang chủ
        </NuxtLink>

        <NuxtLink
          to="/buy"
          :class="[
            'font-inter font-medium text-[16px] cursor-pointer pb-1 pt-[5px] border-b-2 transition-colors',
            route.path.startsWith('/buy')
              ? 'text-[#F62E56] border-[#F62E56]'
              : 'text-[#1C1917] border-transparent hover:text-[#F62E56]',
          ]"
        >
          Mua nhà
        </NuxtLink>

        <NuxtLink
          to="/rent"
          :class="[
            'font-inter font-medium text-[16px] cursor-pointer pb-1 pt-[5px] border-b-2 transition-colors',
            route.path.startsWith('/rent')
              ? 'text-[#F62E56] border-[#F62E56]'
              : 'text-[#1C1917] border-transparent hover:text-[#F62E56]',
          ]"
        >
          Thuê nhà
        </NuxtLink>

        <NuxtLink
          to="/projects"
          :class="[
            'font-inter font-medium text-[16px] cursor-pointer pb-1 pt-[5px] border-b-2 transition-colors',
            route.path.startsWith('/projects')
              ? 'text-[#F62E56] border-[#F62E56]'
              : 'text-[#1C1917] border-transparent hover:text-[#F62E56]',
          ]"
        >
          Dự án
        </NuxtLink>

        <NuxtLink
          to="/news"
          :class="[
            'font-inter font-medium text-[16px] cursor-pointer pb-1 pt-[5px] border-b-2 transition-colors',
            route.path.startsWith('/news')
              ? 'text-[#F62E56] border-[#F62E56]'
              : 'text-[#1C1917] border-transparent hover:text-[#F62E56]',
          ]"
        >
          Tin tức
        </NuxtLink>

        <NuxtLink
          to="/contact"
          :class="[
            'font-inter font-medium text-[16px] cursor-pointer pb-1 pt-[5px] border-b-2 transition-colors',
            route.path.startsWith('/contact')
              ? 'text-[#F62E56] border-[#F62E56]'
              : 'text-[#1C1917] border-transparent hover:text-[#F62E56]',
          ]"
        >
          Liên hệ
        </NuxtLink>

        <NuxtLink
          to="/upload"
          :class="[
            'font-inter font-medium text-[16px] cursor-pointer pb-1 pt-[5px] border-b-2 transition-colors',
            route.path === '/upload'
              ? 'text-[#F62E56] border-[#F62E56]'
              : 'text-[#1C1917] border-transparent hover:text-[#F62E56]',
          ]"
        >
          Đăng tin
        </NuxtLink>
      </div>

      <!-- Authentication/Profile -->
      <div class="relative flex items-center flex-shrink-0 gap-6 ml-8">
        <!-- Show login/register when NOT authenticated -->
        <template v-if="!isAuthenticated">

          <!-- Login Button -->
          <NuxtLink
            to="/login"
            class="py-[10px] flex items-center justify-center text-center font-inter font-medium text-[16px] text-[#F62E56] cursor-pointer hover:underline transition-all duration-200"
          >
            Đăng nhập
          </NuxtLink>

          <div class="w-px h-6 bg-[#E4E4E7]"></div>

          <!-- Register Button -->
          <NuxtLink
            to="/register"
            class="py-[10px] flex items-center justify-center text-center px-6 bg-[#F62E56] rounded-lg text-white font-inter font-medium text-[16px] cursor-pointer hover:bg-[#F62E56]/90 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Đăng ký
          </NuxtLink>
        </template>

        <!-- Show profile when authenticated -->
        <template v-else>

          <!-- Profile Dropdown -->
          <div class="relative">
            <button
              ref="profileBtn"
              @click="toggleDropdown"
              class="flex items-center gap-2 px-3 py-2 rounded-full border border-[#E4E4E7] bg-white shadow-sm hover:shadow transition min-w-[140px]"
            >
              <img
                :src="currentUser.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'"
                class="object-cover w-8 h-8 border rounded-full"
                alt="avatar"
              />
              <span
                class="font-medium text-[#1C1917] truncate max-w-[80px] md:max-w-[140px] lg:max-w-[220px]"
              >
                {{ currentUser.name || currentUser.email }}
              </span>
              <svg
                class="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
              <span
                v-if="currentUser.role === 'admin'"
                class="ml-2 px-2 py-0.5 rounded-full border border-[#F62E56] text-[#F62E56] text-xs font-semibold flex items-center gap-1"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#F62E56"
                    stroke-width="2"
                  />
                  <path stroke="#F62E56" stroke-width="2" d="M8 12h8" />
                </svg>
                Admin
              </span>
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="showDropdown"
              ref="dropdownMenu"
              class="absolute right-0 z-50 w-64 mt-2 bg-white border border-gray-100 shadow-xl rounded-xl"
            >
              <div class="flex items-center gap-3 px-5 py-4 border-b">
                <img
                  :src="currentUser.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'"
                  class="object-cover w-10 h-10 border rounded-full"
                  alt="avatar"
                />
                <div>
                  <div class="font-semibold text-[#1C1917]">
                    {{ currentUser.name }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ currentUser.email }}
                  </div>
                </div>
              </div>
              <ul class="py-2">
                <li>
                  <NuxtLink
                    to="/profile"
                    class="flex items-center gap-2 px-5 py-2 hover:bg-[#fce6ec] transition text-[#1C1917]"
                    @click="showDropdown = false"
                  >
                    <svg
                      class="w-5 h-5 text-[#F62E56]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Hồ sơ cá nhân
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink
                    to="/profile?tab=liked"
                    class="flex items-center gap-2 px-5 py-2 hover:bg-[#fce6ec] transition text-[#1C1917]"
                    @click="showDropdown = false"
                  >
                    <svg
                      class="w-5 h-5 text-[#F62E56]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Danh sách yêu thích
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink
                    to="/profile?tab=myproducts"
                    class="flex items-center gap-2 px-5 py-2 hover:bg-[#fce6ec] transition text-[#1C1917]"
                    @click="showDropdown = false"
                  >
                    <svg
                      class="w-5 h-5 text-[#F62E56]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m5 0v-4a1 1 0 011-1h2a1 1 0 011 1v4M7 7h10M7 11h4" />
                    </svg>
                    Tin đăng của tôi
                  </NuxtLink>
                </li>
                <li v-if="currentUser.role === 'admin'">
                  <NuxtLink
                    to="/admin"
                    class="flex items-center gap-2 px-5 py-2 hover:bg-[#fce6ec] transition text-[#1C1917]"
                    @click="showDropdown = false"
                  >
                    <svg
                      class="w-5 h-5 text-[#F62E56]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Quản trị hệ thống
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink
                    to="/settings"
                    class="flex items-center gap-2 px-5 py-2 hover:bg-[#fce6ec] transition text-[#1C1917]"
                    @click="showDropdown = false"
                  >
                    <svg
                      class="w-5 h-5 text-[#F62E56]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Cài đặt
                  </NuxtLink>
                </li>
              </ul>
              <div class="border-t">
                <button
                  @click="logout"
                  class="flex items-center gap-2 px-5 py-3 w-full text-left text-[#F62E56] font-semibold hover:bg-[#fce6ec] transition"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "~/stores/auth";

// ✅ FIX: Use auth store properly
const authStore = useAuthStore();
const currentUser = computed(() => authStore.currentUser);
const isAuthenticated = computed(() => authStore.isAuthenticated);

const isScrolled = ref(false);
const showDropdown = ref(false);
const showDebug = ref(true); // Set to false in production
const router = useRouter();
const route = useRoute();
const profileBtn = ref(null);
const dropdownMenu = ref(null);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 2;
};

function logout() {
  console.log('🚪 Navbar logout clicked');
  authStore.logout();
  showDropdown.value = false;
  router.push('/');
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function handleClickOutside(e) {
  if (
    showDropdown.value &&
    profileBtn.value &&
    !profileBtn.value.contains(e.target) &&
    (!dropdownMenu.value || !dropdownMenu.value.contains(e.target))
  ) {
    showDropdown.value = false;
  }
}

onMounted(() => {
  // ✅ FIX: Initialize auth when navbar mounts
  console.log('🔄 Navbar mounted, initializing auth...');
  authStore.initAuth();
  
  window.addEventListener("scroll", handleScroll);
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  document.removeEventListener("click", handleClickOutside);
});

// ✅ FIX: Watch auth changes for debugging
watch([isAuthenticated, currentUser], ([auth, user]) => {
  console.log('🔍 Navbar auth state changed:', { 
    isAuthenticated: auth, 
    user: user?.name || user?.email || 'None' 
  });
}, { immediate: true });
</script>

<style scoped>
/* Không cần thêm gì nếu đã dùng TailwindCSS đúng như trên */
</style>

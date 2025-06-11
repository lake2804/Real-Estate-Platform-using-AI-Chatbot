<template>
  <div class="min-h-screen pt-6 bg-gray-50">
    <div class="container px-4 py-8 mx-auto max-w-7xl">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
        <p class="mt-2 text-gray-600">Quản lý thông tin tài khoản và cài đặt của bạn</p>
      </div>

      <div v-if="currentUser" class="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <!-- Sidebar Navigation -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm">
            <!-- User Info Header -->
            <div class="p-6 border-b">
              <div class="flex items-center">
                <div class="relative">
                  <img
                    :src="currentUser.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'"
                    class="object-cover w-16 h-16 rounded-full"
                    alt="Avatar"
                  />
                  <button class="absolute bottom-0 right-0 w-6 h-6 bg-[#F62E56] rounded-full flex items-center justify-center text-white text-xs hover:bg-[#F62E56]/90 transition">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-gray-900">{{ currentUser.name }}</h3>
                  <p class="text-sm text-gray-500">{{ currentUser.email }}</p>
                  <span v-if="currentUser.role === 'admin'" class="inline-flex items-center px-2 py-1 mt-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clip-rule="evenodd" />
                    </svg>
                    Admin
                  </span>
                </div>
              </div>
            </div>

            <!-- Navigation Menu -->
            <nav class="p-2">
              <button
                v-for="tab in availableTabs"
                :key="tab.key"
                @click="currentTab = tab.key"
                :class="[
                  'w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors',
                  currentTab === tab.key
                    ? 'bg-[#F62E56] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                ]"
              >
                <component :is="tab.icon" class="w-5 h-5 mr-3" />
                {{ tab.label }}
              </button>
            </nav>
          </div>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-3">
          <div class="bg-white rounded-lg shadow-sm">
            <!-- Account Info Tab -->
            <div v-if="currentTab === 'info'" class="p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-semibold text-gray-900">Thông tin tài khoản</h2>
                <button
                  @click="editMode = !editMode"
                  class="px-4 py-2 text-sm font-medium text-[#F62E56] bg-[#F62E56]/10 rounded-lg hover:bg-[#F62E56]/20 transition"
                >
                  {{ editMode ? 'Hủy' : 'Chỉnh sửa' }}
                </button>
              </div>

              <form @submit.prevent="updateProfile" class="space-y-6">
                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label class="block mb-2 text-sm font-medium text-gray-700">Họ và tên</label>
                    <input
                      v-model="profileForm.name"
                      :disabled="!editMode"
                      type="text"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F62E56] focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label class="block mb-2 text-sm font-medium text-gray-700">Email</label>
                    <input
                      v-model="profileForm.email"
                      :disabled="!editMode"
                      type="email"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F62E56] focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label class="block mb-2 text-sm font-medium text-gray-700">Số điện thoại</label>
                    <input
                      v-model="profileForm.phone"
                      :disabled="!editMode"
                      type="tel"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F62E56] focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label class="block mb-2 text-sm font-medium text-gray-700">Ngày sinh</label>
                    <input
                      v-model="profileForm.birthday"
                      :disabled="!editMode"
                      type="date"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F62E56] focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>
                
                <div>
                  <label class="block mb-2 text-sm font-medium text-gray-700">Địa chỉ</label>
                  <textarea
                    v-model="profileForm.address"
                    :disabled="!editMode"
                    rows="3"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F62E56] focus:border-transparent disabled:bg-gray-50"
                  ></textarea>
                </div>

                <div v-if="editMode" class="flex justify-end space-x-4">
                  <button
                    type="button"
                    @click="editMode = false"
                    class="px-6 py-2 text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    :disabled="isUpdating"
                    class="px-6 py-2 bg-[#F62E56] text-white rounded-lg hover:bg-[#F62E56]/90 transition disabled:opacity-50"
                  >
                    {{ isUpdating ? 'Đang cập nhật...' : 'Lưu thay đổi' }}
                  </button>
                </div>
              </form>
            </div>

            <!-- Favorites Tab -->
            <div v-else-if="currentTab === 'favorites'" class="p-6">
              <h2 class="mb-6 text-xl font-semibold text-gray-900">Danh sách yêu thích</h2>
              
              <div v-if="favoriteProperties.length" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div
                  v-for="property in favoriteProperties"
                  :key="property.id"
                  class="relative transition bg-white border rounded-lg shadow-sm hover:shadow-md"
                >
                  <button
                    @click="removeFavorite(property.id)"
                    class="absolute z-10 flex items-center justify-center w-8 h-8 text-white transition bg-red-500 rounded-full top-2 right-2 hover:bg-red-600"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  <PropertyCard
                    :product="property"
                    :to="`/${property.type === 'rent' ? 'rent' : 'buy'}/${property.id}`"
                    :isRent="property.type === 'rent'"
                  />
                </div>
              </div>
              
              <div v-else class="py-12 text-center">
                <svg class="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h3 class="mb-2 text-lg font-medium text-gray-900">Chưa có bất động sản yêu thích</h3>
                <p class="mb-6 text-gray-500">Hãy tìm kiếm và lưu những căn hộ bạn quan tâm</p>
                <NuxtLink to="/buy" class="inline-flex items-center px-4 py-2 bg-[#F62E56] text-white rounded-lg hover:bg-[#F62E56]/90 transition">
                  Khám phá ngay
                </NuxtLink>
              </div>
            </div>

            <!-- My Listings Tab -->
            <div v-else-if="currentTab === 'listings'" class="p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-semibold text-gray-900">Tin đăng của tôi</h2>
                <button
                  @click="showCreateModal = true"
                  class="px-4 py-2 bg-[#F62E56] text-white rounded-lg hover:bg-[#F62E56]/90 transition"
                >
                  + Đăng tin mới
                </button>
              </div>

              <div v-if="userListings.length" class="space-y-4">
                <div
                  v-for="listing in userListings"
                  :key="listing.id"
                  class="p-4 transition border rounded-lg hover:shadow-sm"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                      <img
                        :src="listing.image || 'https://picsum.photos/100/100'"
                        class="object-cover w-16 h-16 rounded-lg"
                        alt=""
                      />
                      <div>
                        <h3 class="font-semibold text-gray-900">{{ listing.title }}</h3>
                        <p class="text-sm text-gray-500">{{ listing.location }}</p>
                        <div class="flex items-center mt-1">
                          <span
                            :class="[
                              'px-2 py-1 text-xs rounded-full',
                              listing.status === 'active' ? 'bg-green-100 text-green-800' :
                              listing.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            ]"
                          >
                            {{ getStatusText(listing.status) }}
                          </span>
                          <span class="ml-2 text-sm text-gray-500">{{ listing.views }} lượt xem</span>
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <button
                        @click="editListing(listing.id)"
                        class="px-3 py-1 text-sm text-[#F62E56] bg-[#F62E56]/10 rounded hover:bg-[#F62E56]/20 transition"
                      >
                        Sửa
                      </button>
                      <button
                        @click="deleteListing(listing.id)"
                        class="px-3 py-1 text-sm text-red-600 transition rounded bg-red-50 hover:bg-red-100"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-else class="py-12 text-center">
                <svg class="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m5 0v-4a1 1 0 011-1h2a1 1 0 011 1v4M7 7h10M7 11h4" />
                </svg>
                <h3 class="mb-2 text-lg font-medium text-gray-900">Chưa có tin đăng nào</h3>
                <p class="mb-6 text-gray-500">Đăng tin để rao bán hoặc cho thuê bất động sản của bạn</p>
                <button
                  @click="showCreateModal = true"
                  class="inline-flex items-center px-4 py-2 bg-[#F62E56] text-white rounded-lg hover:bg-[#F62E56]/90 transition"
                >
                  Đăng tin đầu tiên
                </button>
              </div>
            </div>

            <!-- Admin Tabs -->
            <template v-if="currentUser.role === 'admin'">
              <!-- Admin Dashboard -->
              <div v-if="currentTab === 'admin-dashboard'" class="p-6">
                <h2 class="mb-6 text-xl font-semibold text-gray-900">Bảng điều khiển Admin</h2>
                
                <div class="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
                  <div class="p-6 text-white rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-blue-100">Tổng người dùng</p>
                        <p class="text-2xl font-bold">{{ adminStats.totalUsers }}</p>
                      </div>
                      <div class="p-3 bg-blue-400 rounded-full">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div class="p-6 text-white rounded-lg bg-gradient-to-r from-green-500 to-green-600">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-green-100">Tin đăng hoạt động</p>
                        <p class="text-2xl font-bold">{{ adminStats.activeListings }}</p>
                      </div>
                      <div class="p-3 bg-green-400 rounded-full">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m5 0v-4a1 1 0 011-1h2a1 1 0 011 1v4M7 7h10M7 11h4" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div class="p-6 text-white rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-yellow-100">Chờ phê duyệt</p>
                        <p class="text-2xl font-bold">{{ adminStats.pendingListings }}</p>
                      </div>
                      <div class="p-3 bg-yellow-400 rounded-full">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div class="p-6 text-white rounded-lg bg-gradient-to-r from-purple-500 to-purple-600">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-purple-100">Doanh thu tháng</p>
                        <p class="text-2xl font-bold">{{ formatCurrency(adminStats.monthlyRevenue) }}</p>
                      </div>
                      <div class="p-3 bg-purple-400 rounded-full">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Recent Activities -->
                <div class="p-6 rounded-lg bg-gray-50">
                  <h3 class="mb-4 text-lg font-semibold text-gray-900">Hoạt động gần đây</h3>
                  <div class="space-y-3">
                    <div v-for="activity in recentActivities" :key="activity.id" class="flex items-center p-3 bg-white rounded-lg">
                      <div class="flex-shrink-0">
                        <div class="w-8 h-8 bg-[#F62E56] rounded-full flex items-center justify-center">
                          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-medium text-gray-900">{{ activity.message }}</p>
                        <p class="text-sm text-gray-500">{{ activity.time }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- User Management -->
              <div v-if="currentTab === 'users'" class="p-6">
                <h2 class="mb-6 text-xl font-semibold text-gray-900">Quản lý người dùng</h2>
                
                <div class="mb-4">
                  <input
                    v-model="userSearchQuery"
                    type="text"
                    placeholder="Tìm kiếm người dùng..."
                    class="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F62E56] focus:border-transparent"
                  />
                </div>

                <div class="overflow-x-auto">
                  <table class="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Người dùng</th>
                        <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Vai trò</th>
                        <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Trạng thái</th>
                        <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Ngày tham gia</th>
                        <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Hành động</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                      <tr v-for="user in filteredUsers" :key="user.id">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <img class="w-10 h-10 rounded-full" :src="user.avatar" alt="">
                            <div class="ml-4">
                              <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                              <div class="text-sm text-gray-500">{{ user.email }}</div>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="inline-flex px-2 text-xs font-semibold leading-5 rounded-full" :class="user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'">
                            {{ user.role === 'admin' ? 'Admin' : 'User' }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="inline-flex px-2 text-xs font-semibold leading-5 rounded-full" :class="user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                            {{ user.status === 'active' ? 'Hoạt động' : 'Khóa' }}
                          </span>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {{ formatDate(user.createdAt) }}
                        </td>
                        <td class="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                          <button
                            @click="toggleUserStatus(user.id)"
                            :class="[
                              'px-3 py-1 rounded text-xs',
                              user.status === 'active' 
                                ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                            ]"
                          >
                            {{ user.status === 'active' ? 'Khóa' : 'Mở khóa' }}
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </template>

            <!-- Settings Tab -->
            <div v-else-if="currentTab === 'settings'" class="p-6">
              <h2 class="mb-6 text-xl font-semibold text-gray-900">Cài đặt</h2>
              
              <div class="space-y-6">
                <!-- Notification Settings -->
                <div class="pb-6 border-b">
                  <h3 class="mb-4 text-lg font-medium text-gray-900">Thông báo</h3>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <label class="text-sm font-medium text-gray-700">Email thông báo</label>
                        <p class="text-sm text-gray-500">Nhận thông báo qua email về tin đăng mới</p>
                      </div>
                      <button
                        @click="settings.emailNotifications = !settings.emailNotifications"
                        :class="[
                          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#F62E56] focus:ring-offset-2',
                          settings.emailNotifications ? 'bg-[#F62E56]' : 'bg-gray-200'
                        ]"
                      >
                        <span
                          :class="[
                            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                            settings.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                          ]"
                        ></span>
                      </button>
                    </div>
                    
                    <div class="flex items-center justify-between">
                      <div>
                        <label class="text-sm font-medium text-gray-700">SMS thông báo</label>
                        <p class="text-sm text-gray-500">Nhận thông báo qua SMS về các cơ hội quan trọng</p>
                      </div>
                      <button
                        @click="settings.smsNotifications = !settings.smsNotifications"
                        :class="[
                          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#F62E56] focus:ring-offset-2',
                          settings.smsNotifications ? 'bg-[#F62E56]' : 'bg-gray-200'
                        ]"
                      >
                        <span
                          :class="[
                            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                            settings.smsNotifications ? 'translate-x-5' : 'translate-x-0'
                          ]"
                        ></span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Privacy Settings -->
                <div class="pb-6 border-b">
                  <h3 class="mb-4 text-lg font-medium text-gray-900">Quyền riêng tư</h3>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <label class="text-sm font-medium text-gray-700">Hiển thị profile công khai</label>
                        <p class="text-sm text-gray-500">Cho phép người khác xem thông tin cơ bản của bạn</p>
                      </div>
                      <button
                        @click="settings.publicProfile = !settings.publicProfile"
                        :class="[
                          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#F62E56] focus:ring-offset-2',
                          settings.publicProfile ? 'bg-[#F62E56]' : 'bg-gray-200'
                        ]"
                      >
                        <span
                          :class="[
                            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                            settings.publicProfile ? 'translate-x-5' : 'translate-x-0'
                          ]"
                        ></span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Change Password -->
                <div>
                  <h3 class="mb-4 text-lg font-medium text-gray-900">Đổi mật khẩu</h3>
                  <form @submit.prevent="changePassword" class="max-w-md space-y-4">
                    <div>
                      <label class="block mb-2 text-sm font-medium text-gray-700">Mật khẩu hiện tại</label>
                      <input
                        v-model="passwordForm.current"
                        type="password"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F62E56] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label class="block mb-2 text-sm font-medium text-gray-700">Mật khẩu mới</label>
                      <input
                        v-model="passwordForm.new"
                        type="password"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F62E56] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label class="block mb-2 text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
                      <input
                        v-model="passwordForm.confirm"
                        type="password"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F62E56] focus:border-transparent"
                      />
                    </div>
                    <button
                      type="submit"
                      :disabled="isChangingPassword"
                      class="px-6 py-2 bg-[#F62E56] text-white rounded-lg hover:bg-[#F62E56]/90 transition disabled:opacity-50"
                    >
                      {{ isChangingPassword ? 'Đang cập nhật...' : 'Đổi mật khẩu' }}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Not Logged In State -->
      <div v-else class="flex items-center justify-center min-h-[400px]">
        <div class="text-center">
          <svg class="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h2 class="mb-2 text-xl font-semibold text-gray-900">Vui lòng đăng nhập</h2>
          <p class="mb-6 text-gray-500">Bạn cần đăng nhập để xem thông tin hồ sơ</p>
          <NuxtLink
            to="/login"
            class="inline-flex items-center px-6 py-3 bg-[#F62E56] text-white rounded-lg hover:bg-[#F62E56]/90 transition"
          >
            Đăng nhập ngay
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Create Listing Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-black bg-opacity-50" @click="showCreateModal = false"></div>
        <div class="relative w-full max-w-md p-6 bg-white rounded-lg">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Đăng tin mới</h3>
            <button @click="showCreateModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p class="mb-6 text-gray-600">Chức năng đăng tin sẽ được cập nhật trong phiên bản tiếp theo.</p>
          <div class="flex justify-end">
            <button
              @click="showCreateModal = false"
              class="px-4 py-2 text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import PropertyCard from '~/components/PropertyCard.vue'

definePageMeta({
  middleware: 'auth' // Require authentication
})

useHead({
  title: 'Hồ sơ cá nhân - Bất động sản',
  meta: [
    { name: 'description', content: 'Quản lý thông tin tài khoản và tin đăng bất động sản của bạn' }
  ]
})

const authStore = useAuthStore()
const currentUser = computed(() => authStore.currentUser)

// Tab management
const currentTab = ref('info')

// Form states
const editMode = ref(false)
const isUpdating = ref(false)
const isChangingPassword = ref(false)

// Modals
const showCreateModal = ref(false)

// Search
const userSearchQuery = ref('')

// Profile form
const profileForm = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  birthday: ''
})

// Password form
const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
})

// Settings
const settings = ref({
  emailNotifications: true,
  smsNotifications: false,
  publicProfile: true
})

// Mock data
const favoriteProperties = ref([
  {
    id: 1,
    title: 'Căn hộ Vinhomes Central Park',
    type: 'rent',
    price: 15000000,
    location: 'Quận 1, TP.HCM',
    image: 'https://picsum.photos/300/200?random=1'
  },
  {
    id: 2,
    title: 'Nhà phố Thảo Điền',
    type: 'sale',
    price: 8500000000,
    location: 'Quận 2, TP.HCM',
    image: 'https://picsum.photos/300/200?random=2'
  }
])

const userListings = ref([
  {
    id: 1,
    title: 'Căn hộ 2PN tại Landmark 81',
    location: 'Quận 1, TP.HCM',
    status: 'active',
    views: 234,
    image: 'https://picsum.photos/100/100?random=3'
  },
  {
    id: 2,
    title: 'Nhà phố 3 tầng Quận 7',
    location: 'Quận 7, TP.HCM',
    status: 'pending',
    views: 89,
    image: 'https://picsum.photos/100/100?random=4'
  }
])

const adminStats = ref({
  totalUsers: 1248,
  activeListings: 567,
  pendingListings: 23,
  monthlyRevenue: 125000000
})

const allUsers = ref([
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    role: 'user',
    status: 'active',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    createdAt: '2023-01-15'
  },
  {
    id: 2,
    name: 'Trần Thị B',
    email: 'tranthib@email.com',
    role: 'user',
    status: 'active',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    createdAt: '2023-02-20'
  },
  {
    id: 3,
    name: 'Admin System',
    email: 'admin@realestate.com',
    role: 'admin',
    status: 'active',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    createdAt: '2022-12-01'
  }
])

const recentActivities = ref([
  { id: 1, message: 'Người dùng mới đăng ký: Nguyễn Văn C', time: '5 phút trước' },
  { id: 2, message: 'Tin đăng mới được phê duyệt: Căn hộ Vinhomes', time: '15 phút trước' },
  { id: 3, message: 'Báo cáo từ người dùng về tin đăng #123', time: '1 giờ trước' },
  { id: 4, message: 'Thanh toán thành công: Gói Premium User', time: '2 giờ trước' }
])

// Computed
const availableTabs = computed(() => {
  const baseTabs = [
    { 
      key: 'info', 
      label: 'Thông tin tài khoản',
      icon: 'svg'  // You can replace with actual icon components
    },
    { 
      key: 'favorites', 
      label: 'Danh sách yêu thích',
      icon: 'svg'
    },
    { 
      key: 'listings', 
      label: 'Tin đăng của tôi',
      icon: 'svg'
    },
    { 
      key: 'settings', 
      label: 'Cài đặt',
      icon: 'svg'
    }
  ]

  if (currentUser.value?.role === 'admin') {
    baseTabs.splice(3, 0, 
      { 
        key: 'admin-dashboard', 
        label: 'Dashboard Admin',
        icon: 'svg'
      },
      { 
        key: 'users', 
        label: 'Quản lý người dùng',
        icon: 'svg'
      }
    )
  }

  return baseTabs
})

const filteredUsers = computed(() => {
  if (!userSearchQuery.value) return allUsers.value
  
  return allUsers.value.filter(user => 
    user.name.toLowerCase().includes(userSearchQuery.value.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchQuery.value.toLowerCase())
  )
})

// Methods
const initializeProfileForm = () => {
  if (currentUser.value) {
    profileForm.value = {
      name: currentUser.value.name || '',
      email: currentUser.value.email || '',
      phone: currentUser.value.phone || '',
      address: currentUser.value.address || '',
      birthday: currentUser.value.birthday || ''
    }
  }
}

const updateProfile = async () => {
  try {
    isUpdating.value = true
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update user in store
    authStore.user = {
      ...authStore.user,
      ...profileForm.value
    }
    
    editMode.value = false
    alert('Cập nhật thông tin thành công!')
  } catch (error) {
    alert('Có lỗi xảy ra. Vui lòng thử lại!')
  } finally {
    isUpdating.value = false
  }
}

const changePassword = async () => {
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    alert('Mật khẩu xác nhận không khớp!')
    return
  }

  try {
    isChangingPassword.value = true
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    passwordForm.value = { current: '', new: '', confirm: '' }
    alert('Đổi mật khẩu thành công!')
  } catch (error) {
    alert('Có lỗi xảy ra. Vui lòng thử lại!')
  } finally {
    isChangingPassword.value = false
  }
}

const removeFavorite = (propertyId) => {
  favoriteProperties.value = favoriteProperties.value.filter(p => p.id !== propertyId)
  alert('Đã xóa khỏi danh sách yêu thích!')
}

const editListing = (listingId) => {
  alert(`Chỉnh sửa tin đăng #${listingId} - Tính năng sẽ được cập nhật!`)
}

const deleteListing = (listingId) => {
  if (confirm('Bạn có chắc muốn xóa tin đăng này?')) {
    userListings.value = userListings.value.filter(l => l.id !== listingId)
    alert('Đã xóa tin đăng!')
  }
}

const toggleUserStatus = (userId) => {
  const user = allUsers.value.find(u => u.id === userId)
  if (user) {
    user.status = user.status === 'active' ? 'blocked' : 'active'
    alert(`Đã ${user.status === 'active' ? 'mở khóa' : 'khóa'} người dùng: ${user.name}`)
  }
}

const getStatusText = (status) => {
  const statusMap = {
    active: 'Đang hoạt động',
    pending: 'Chờ phê duyệt',
    rejected: 'Bị từ chối',
    expired: 'Hết hạn'
  }
  return statusMap[status] || status
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

// Lifecycle
onMounted(() => {
  initializeProfileForm()
})

// Watch user changes
watch(currentUser, (newUser) => {
  if (newUser) {
    initializeProfileForm()
  }
}, { immediate: true })
</script>
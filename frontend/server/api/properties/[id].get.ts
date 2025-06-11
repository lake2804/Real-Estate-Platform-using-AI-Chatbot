export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  
  try {
    console.log('Fetching property by ID:', id)
    
    const response = await $fetch(`${config.public.apiBase}/properties/${id}`, {
      timeout: 10000
    })
    
    return response
    
  } catch (error) {
    console.error('Property Detail API Error:', error)
    
    // Fallback to demo data
    const demoProperties = [
      {
        id: "1",
        _id: "1",
        title: "Căn hộ Vinhomes Central Park",
        name: "Vinhomes Central Park",
        location: "Bình Thạnh, TP.HCM",
        price: 3500000000,
        bedrooms: 2,
        bathrooms: 2,
        area: 80,
        image: "https://picsum.photos/400/300?random=1",
        images: [
          "https://picsum.photos/800/600?random=1",
          "https://picsum.photos/800/600?random=11",
          "https://picsum.photos/800/600?random=21",
          "https://picsum.photos/800/600?random=31"
        ],
        type: "sale",
        featured: true,
        status: "available",
        description: "Căn hộ cao cấp với view sông tuyệt đẹp, nội thất đầy đủ",
        amenities: ["Hồ bơi", "Gym", "Parking", "Security 24/7"],
        interior: ["Giường", "Tủ lạnh", "Máy giặt", "Tivi", "Máy lạnh"],
        advantages: "Vị trí đắc địa, gần trung tâm thành phố",
        rooms: "2PN/2WC",
        views: 156
      },
      {
        id: "2",
        _id: "2",
        title: "Chung cư Masteri Thảo Điền",
        name: "Masteri Thảo Điền",
        location: "Quận 2, TP.HCM",
        price: 2800000000,
        bedrooms: 1,
        bathrooms: 1,
        area: 65,
        image: "https://picsum.photos/400/300?random=2",
        images: [
          "https://picsum.photos/800/600?random=2",
          "https://picsum.photos/800/600?random=12",
          "https://picsum.photos/800/600?random=22",
          "https://picsum.photos/800/600?random=32"
        ],
        type: "sale",
        featured: true,
        status: "available",
        description: "Căn hộ 1 phòng ngủ, thiết kế hiện đại, gần trung tâm",
        amenities: ["Hồ bơi", "Thang máy", "Parking", "Siêu thị"],
        interior: ["Giường", "Tủ lạnh", "Tivi", "Máy lạnh"],
        advantages: "Gần trường học và bệnh viện",
        rooms: "1PN/1WC",
        views: 89
      }
    ]
    
    const property = demoProperties.find(item => item.id === id)
    
    if (!property) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Property not found'
      })
    }
    
    return {
      success: true,
      data: property,
      fallback: true
    }
  }
})
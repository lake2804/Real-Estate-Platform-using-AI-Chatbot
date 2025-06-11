export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  
  try {
    console.log('Fetching featured properties from backend')
    
    const response = await $fetch(`${config.public.apiBase}/properties/featured`, {
      query,
      timeout: 10000
    })
    
    console.log('Featured properties received:', response?.data?.length || 0)
    return response
    
  } catch (error) {
    console.error('Featured Properties API Error:', error)
    
    // Fallback to demo data
    const demoFeaturedData = [
      {
        id: 1,
        _id: "1",
        title: "Vinhomes Central Park",
        name: "Vinhomes Central Park",
        location: "Bình Thạnh, TP.HCM",
        price: 3500000000,
        bedrooms: 2,
        bathrooms: 2,
        area: 80,
        image: "https://picsum.photos/400/300?random=1",
        images: ["https://picsum.photos/400/300?random=1"],
        type: "sale",
        featured: true,
        status: "available",
        rooms: "2PN/2WC"
      },
      {
        id: 2,
        _id: "2",
        title: "Masteri Thảo Điền",
        name: "Masteri Thảo Điền",
        location: "Quận 2, TP.HCM",
        price: 2800000000,
        bedrooms: 1,
        bathrooms: 1,
        area: 65,
        image: "https://picsum.photos/400/300?random=2",
        images: ["https://picsum.photos/400/300?random=2"],
        type: "sale",
        featured: true,
        status: "available",
        rooms: "1PN/1WC"
      },
      {
        id: 3,
        _id: "3",
        title: "Saigon Pearl",
        name: "Saigon Pearl",
        location: "Bình Thạnh, TP.HCM",
        price: 4200000000,
        bedrooms: 3,
        bathrooms: 2,
        area: 95,
        image: "https://picsum.photos/400/300?random=3",
        images: ["https://picsum.photos/400/300?random=3"],
        type: "sale",
        featured: true,
        status: "available",
        rooms: "3PN/2WC"
      },
      {
        id: 4,
        _id: "4",
        title: "Landmark 81",
        name: "Landmark 81",
        location: "Bình Thạnh, TP.HCM",
        price: 5500000000,
        bedrooms: 3,
        bathrooms: 3,
        area: 120,
        image: "https://picsum.photos/400/300?random=4",
        images: ["https://picsum.photos/400/300?random=4"],
        type: "sale",
        featured: true,
        status: "available",
        rooms: "3PN/3WC"
      },
      // Add more demo properties...
      ...Array.from({ length: 4 }, (_, i) => ({
        id: i + 5,
        _id: String(i + 5),
        title: `Dự án cao cấp ${i + 5}`,
        name: `Project ${i + 5}`,
        location: `Quận ${Math.floor(Math.random() * 12) + 1}, TP.HCM`,
        price: Math.floor(Math.random() * 3000000000) + 2000000000,
        bedrooms: Math.floor(Math.random() * 3) + 1,
        bathrooms: Math.floor(Math.random() * 3) + 1,
        area: Math.floor(Math.random() * 50) + 70,
        image: `https://picsum.photos/400/300?random=${i + 5}`,
        images: [`https://picsum.photos/400/300?random=${i + 5}`],
        type: "sale",
        featured: true,
        status: "available",
        rooms: `${Math.floor(Math.random() * 3) + 1}PN/${Math.floor(Math.random() * 3) + 1}WC`
      }))
    ]
    
    const limit = parseInt(query.limit as string) || 8
    const limitedData = demoFeaturedData.slice(0, limit)
    
    return {
      success: true,
      data: limitedData,
      fallback: true
    }
  }
})
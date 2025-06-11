export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  
  try {
    console.log('Fetching properties from backend:', `${config.public.apiBase}/properties`)
    
    const response = await $fetch(`${config.public.apiBase}/properties`, {
      query,
      timeout: 10000
    })
    
    console.log('Backend response:', response?.data?.length || 0, 'properties')
    return response
    
  } catch (error) {
    console.error('API Error:', error)
    
    // Fallback to demo data if backend fails
    const demoData = [
      {
        id: 1,
        _id: "1",
        title: "Căn hộ Vinhomes Central Park",
        name: "Vinhomes Central Park",
        location: "Bình Thạnh, TP.HCM",
        price: query.type === 'rent' ? 15000000 : 3500000000,
        bedrooms: 2,
        bathrooms: 2,
        area: 80,
        image: "https://picsum.photos/400/300?random=1",
        images: ["https://picsum.photos/400/300?random=1"],
        type: query.type || "sale",
        featured: true,
        status: "available",
        rooms: "2PN/2WC"
      },
      {
        id: 2,
        _id: "2",
        title: "Chung cư Masteri Thảo Điền",
        name: "Masteri Thảo Điền",
        location: "Quận 2, TP.HCM",
        price: query.type === 'rent' ? 12000000 : 2800000000,
        bedrooms: 1,
        bathrooms: 1,
        area: 65,
        image: "https://picsum.photos/400/300?random=2",
        images: ["https://picsum.photos/400/300?random=2"],
        type: query.type || "sale",
        featured: true,
        status: "available",
        rooms: "1PN/1WC"
      },
      // More demo data
      ...Array.from({ length: 10 }, (_, i) => ({
        id: i + 3,
        _id: String(i + 3),
        title: `${query.type === 'rent' ? 'Căn hộ cho thuê' : 'Căn hộ bán'} ${i + 3}`,
        name: `Property ${i + 3}`,
        location: `Quận ${Math.floor(Math.random() * 12) + 1}, TP.HCM`,
        price: query.type === 'rent' 
          ? Math.floor(Math.random() * 30000000) + 5000000
          : Math.floor(Math.random() * 5000000000) + 1000000000,
        bedrooms: Math.floor(Math.random() * 3) + 1,
        bathrooms: Math.floor(Math.random() * 3) + 1,
        area: Math.floor(Math.random() * 100) + 50,
        image: `https://picsum.photos/400/300?random=${i + 3}`,
        images: [`https://picsum.photos/400/300?random=${i + 3}`],
        type: query.type || "sale",
        featured: Math.random() > 0.7,
        status: "available",
        rooms: `${Math.floor(Math.random() * 3) + 1}PN/${Math.floor(Math.random() * 3) + 1}WC`
      }))
    ]
    
    let filteredData = demoData
    
    // Apply filters
    if (query.type) {
      filteredData = filteredData.filter(item => item.type === query.type)
    }
    
    if (query.keyword) {
      const keyword = query.keyword.toLowerCase()
      filteredData = filteredData.filter(item => 
        item.title.toLowerCase().includes(keyword) ||
        item.location.toLowerCase().includes(keyword)
      )
    }
    
    // Apply pagination
    const page = parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 12
    const start = (page - 1) * limit
    const end = start + limit
    
    const paginatedData = filteredData.slice(start, end)
    
    return {
      success: true,
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: filteredData.length,
        pages: Math.ceil(filteredData.length / limit)
      },
      fallback: true
    }
  }
})
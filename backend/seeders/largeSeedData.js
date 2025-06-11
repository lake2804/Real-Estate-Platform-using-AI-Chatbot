const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })

// Import models với đúng extension
const User = require('../models/User.cjs')
const Property = require('../models/Property.cjs')
const News = require('../models/News.cjs')
const FeaturedProject = require('../models/FeaturedProject.cjs')

// 15 tỉnh thành trọng điểm
const provinces = [
  {
    name: 'Ho Chi Minh City',
    districts: ['District 1', 'District 2', 'District 3', 'District 7', 'District 9', 'Thu Duc', 'Binh Thanh', 'Phu Nhuan'],
    coordinates: [106.6297, 10.8231],
    priceMultiplier: 1.0
  },
  {
    name: 'Hanoi',
    districts: ['Hoan Kiem', 'Ba Dinh', 'Dong Da', 'Hai Ba Trung', 'Cau Giay', 'Thanh Xuan', 'Tay Ho', 'Long Bien'],
    coordinates: [105.8542, 21.0285],
    priceMultiplier: 0.9
  },
  {
    name: 'Da Nang',
    districts: ['Hai Chau', 'Thanh Khe', 'Son Tra', 'Ngu Hanh Son', 'Lien Chieu', 'Cam Le'],
    coordinates: [108.2022, 16.0544],
    priceMultiplier: 0.6
  },
  {
    name: 'Hai Phong',
    districts: ['Hong Bang', 'Ngo Quyen', 'Le Chan', 'Hai An', 'Kien An', 'Do Son'],
    coordinates: [106.6881, 20.8648],
    priceMultiplier: 0.5
  },
  {
    name: 'Can Tho',
    districts: ['Ninh Kieu', 'Binh Thuy', 'Cai Rang', 'O Mon', 'Thot Not'],
    coordinates: [105.7851, 10.0452],
    priceMultiplier: 0.4
  },
  {
    name: 'Binh Duong',
    districts: ['Thu Dau Mot', 'Di An', 'Thuan An', 'Ben Cat', 'Tan Uyen'],
    coordinates: [106.7700, 10.9804],
    priceMultiplier: 0.7
  },
  {
    name: 'Dong Nai',
    districts: ['Bien Hoa', 'Long Thanh', 'Nhon Trach', 'Vinh Cuu', 'Trang Bom'],
    coordinates: [107.0684, 10.9599],
    priceMultiplier: 0.6
  },
  {
    name: 'Ba Ria Vung Tau',
    districts: ['Vung Tau', 'Ba Ria', 'Long Dien', 'Dat Do', 'Con Dao'],
    coordinates: [107.0840, 10.4113],
    priceMultiplier: 0.8
  },
  {
    name: 'Khanh Hoa',
    districts: ['Nha Trang', 'Cam Ranh', 'Van Ninh', 'Ninh Hoa', 'Cam Lam'],
    coordinates: [109.1967, 12.2585],
    priceMultiplier: 0.65
  },
  {
    name: 'Quang Nam',
    districts: ['Hoi An', 'Tam Ky', 'Dien Ban', 'Thang Binh', 'Que Son'],
    coordinates: [108.3380, 15.5394],
    priceMultiplier: 0.45
  },
  {
    name: 'Lam Dong',
    districts: ['Da Lat', 'Bao Loc', 'Di Linh', 'Duc Trong', 'Lam Ha'],
    coordinates: [108.4265, 11.9404],
    priceMultiplier: 0.55
  },
  {
    name: 'Tien Giang',
    districts: ['My Tho', 'Go Cong', 'Cai Be', 'Chau Thanh', 'Cho Gao'],
    coordinates: [106.3600, 10.3500],
    priceMultiplier: 0.35
  },
  {
    name: 'Long An',
    districts: ['Tan An', 'Thu Thua', 'Ben Luc', 'Can Duoc', 'Can Giuoc'],
    coordinates: [106.4167, 10.5364],
    priceMultiplier: 0.4
  },
  {
    name: 'An Giang',
    districts: ['Long Xuyen', 'Chau Doc', 'Tan Chau', 'Tinh Bien', 'Tri Ton'],
    coordinates: [105.4368, 10.3833],
    priceMultiplier: 0.3
  },
  {
    name: 'Kien Giang',
    districts: ['Rach Gia', 'Ha Tien', 'Phu Quoc', 'Kien Luong', 'Hon Dat'],
    coordinates: [105.0808, 10.0128],
    priceMultiplier: 0.35
  }
]

const propertyTypes = ['apartment', 'house', 'villa', 'townhouse', 'commercial', 'land']
const listingTypes = ['for-sale', 'for-rent']

// Generate random data helpers
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)]
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const getRandomPrice = (basePrice, multiplier) => Math.floor((basePrice * multiplier * (0.8 + Math.random() * 0.4)) / 1000000) * 1000000

// Sample property titles and descriptions
const propertyTitles = {
  apartment: [
    'Modern Apartment with City View',
    'Luxury Apartment in Prime Location',
    'Cozy Apartment Near Downtown',
    'Brand New Apartment Complex',
    'Serviced Apartment with Amenities'
  ],
  house: [
    'Beautiful Family House',
    'Traditional House with Garden',
    'Renovated House in Quiet Area',
    'Spacious House with Parking',
    'Corner House with Large Yard'
  ],
  villa: [
    'Luxury Villa with Pool',
    'Modern Villa with Smart Home',
    'Garden Villa in Gated Community',
    'Beachfront Villa Resort Style',
    'Mountain View Villa Retreat'
  ],
  townhouse: [
    'Modern Townhouse Complex',
    'Row House in New Development',
    'Shophouse with Business Potential',
    'Connected Townhouse Community',
    'Multi-level Townhouse Design'
  ],
  commercial: [
    'Prime Commercial Space',
    'Retail Shop in Shopping District',
    'Office Building Investment',
    'Restaurant Space Available',
    'Warehouse and Logistics Center'
  ],
  land: [
    'Development Land Opportunity',
    'Agricultural Land with Potential',
    'Residential Plot Ready to Build',
    'Commercial Land Highway Access',
    'Investment Land Future Growth'
  ]
}

const amenitiesList = [
  'Swimming Pool', 'Gym', 'Parking', 'Security', 'Elevator', 'Balcony',
  'Garden', 'Playground', 'Tennis Court', 'BBQ Area', 'Concierge',
  'Rooftop Terrace', 'Meeting Room', 'Library', 'Spa', 'Sauna',
  'Children Area', 'Pet Area', 'Storage', 'Laundry', 'Backup Generator'
]

// Generate users - sửa để match với User schema
function generateUsers(count = 100) {
  const users = []
  const roles = ['user', 'agent', 'admin']
  
  for (let i = 0; i < count; i++) {
    users.push({
      fullName: `User ${i + 1}`, // Sửa từ name thành fullName
      email: `user${i + 1}@example.com`,
      password: 'password123',
      role: i < 5 ? 'admin' : (i < 20 ? 'agent' : 'user'),
      phone: `+8490${String(i).padStart(7, '0')}`,
      avatar: `https://i.pravatar.cc/150?img=${(i % 50) + 1}`
    })
  }
  
  return users
}

// Generate properties - sửa để match với Property.cjs schema
function generateProperties(count = 2000) {
  const properties = []
  
  for (let i = 0; i < count; i++) {
    const province = getRandomElement(provinces)
    const district = getRandomElement(province.districts)
    const propertyType = getRandomElement(['apartment', 'house', 'villa', 'townhouse', 'land'])
    const listingType = getRandomElement(['sale', 'rent'])
    
    // Base prices
    let basePrice
    if (listingType === 'rent') {
      basePrice = {
        apartment: getRandomNumber(8, 50) * 1000000,
        house: getRandomNumber(15, 80) * 1000000,
        villa: getRandomNumber(50, 200) * 1000000,
        townhouse: getRandomNumber(20, 60) * 1000000,
        land: getRandomNumber(5, 30) * 1000000
      }[propertyType]
    } else {
      basePrice = {
        apartment: getRandomNumber(2, 15) * 1000000000,
        house: getRandomNumber(3, 25) * 1000000000,
        villa: getRandomNumber(10, 80) * 1000000000,
        townhouse: getRandomNumber(4, 20) * 1000000000,
        land: getRandomNumber(1, 30) * 1000000000
      }[propertyType]
    }
    
    const finalPrice = getRandomPrice(basePrice, province.priceMultiplier)
    const area = getRandomNumber(30, 500)
    const bedrooms = propertyType === 'land' ? 0 : getRandomNumber(1, 6)
    const bathrooms = propertyType === 'land' ? 0 : getRandomNumber(1, bedrooms + 1)
    
    // Random coordinates around province center
    const lat = province.coordinates[1] + (Math.random() - 0.5) * 0.1
    const lng = province.coordinates[0] + (Math.random() - 0.5) * 0.1
    
    properties.push({
      title: `${getRandomElement(propertyTitles[propertyType] || propertyTitles.apartment)} in ${district}`,
      description: generatePropertyDescription(propertyType, province.name, district),
      price: finalPrice,
      location: {
        address: `${getRandomNumber(1, 999)} Street ${i + 1}, ${district}, ${province.name}`,
        district: district,
        city: province.name,
        coordinates: {
          lat: lat,
          lng: lng
        }
      },
      type: listingType,
      category: propertyType,
      area: area,
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      images: generatePropertyImages(propertyType),
      amenities: getRandomAmenities(),
      features: generatePropertyFeatures(propertyType),
      yearBuilt: getRandomNumber(2010, 2024),
      furnished: Math.random() > 0.5,
      isFeatured: Math.random() > 0.8,
      status: getRandomElement(['available', 'sold', 'rented']),
      views: getRandomNumber(10, 1000),
      // ✅ Thêm field owner (required)
      owner: `agent${getRandomNumber(1, 20)}@example.com`, // Tạo email agent giả
      // Hoặc có thể dùng ObjectId giả:
      // owner: new mongoose.Types.ObjectId(),
      
      // Thêm các field khác nếu cần
      contactInfo: {
        name: `Agent ${getRandomNumber(1, 20)}`,
        phone: `+8490${String(getRandomNumber(1000000, 9999999))}`
      }
    })
  }
  
  return properties
}

function generatePropertyDescription(propertyType, city, district) {
  const descriptions = {
    apartment: `Modern apartment located in the heart of ${district}, ${city}. Features contemporary design with high-quality finishes and excellent connectivity to major business districts.`,
    house: `Spacious family house in ${district}, ${city}. Perfect for families seeking comfortable living with easy access to schools, hospitals, and shopping centers.`,
    villa: `Luxury villa in prestigious ${district}, ${city}. Offering privacy, elegance, and premium amenities in a secured community environment.`,
    townhouse: `Contemporary townhouse in developing ${district}, ${city}. Ideal for young families and professionals seeking modern living with community facilities.`,
    commercial: `Prime commercial property in busy ${district}, ${city}. Excellent location for business operations with high foot traffic and visibility.`,
    land: `Development land opportunity in growing ${district}, ${city}. Strategic location with future development potential and good infrastructure access.`
  }
  
  return descriptions[propertyType]
}

function generatePropertyImages(propertyType) {
  const imageCategories = {
    apartment: [
      'photo-1522708323590-d24dbb6b0267',
      'photo-1502672260266-1c1ef2d93688',
      'photo-1560448204-e02f11c3d0e2',
      'photo-1484154218962-a197022b5858'
    ],
    house: [
      'photo-1568605114967-8130f3a36994',
      'photo-1582268611958-ebfd161ef9cf',
      'photo-1449824913935-59a10b8d2000',
      'photo-1518780664697-55e3ad937233'
    ],
    villa: [
      'photo-1613977257363-707ba9348227',
      'photo-1600596542815-ffad4c1539a9',
      'photo-1600607687939-ce8a6c25118c',
      'photo-1600566753190-17f0baa2a6c3'
    ],
    townhouse: [
      'photo-1570129477492-45c003edd2be',
      'photo-1588880331179-bc9b93a8cb5e',
      'photo-1605276374104-dee2a0ed3cd6',
      'photo-1615875605825-5eb9bb5d52ac'
    ],
    commercial: [
      'photo-1486406146926-c627a92ad1ab',
      'photo-1497366216548-37526070297c',
      'photo-1560472354-b33ff0c44a43',
      'photo-1541746972996-4e0b0f93e586'
    ],
    land: [
      'photo-1500382017468-9049fed747ef',
      'photo-1586023492125-27b2c045efd7',
      'photo-1441974231531-c6227db76b6e',
      'photo-1562113530-57ba8cea70a9'
    ]
  }
  
  const category = imageCategories[propertyType] || imageCategories.apartment
  const imageCount = getRandomNumber(3, 6)
  const selectedImages = []
  
  for (let i = 0; i < imageCount; i++) {
    const randomImage = getRandomElement(category)
    selectedImages.push(`https://images.unsplash.com/${randomImage}?w=800&h=600&fit=crop`)
  }
  
  return selectedImages
}

function getRandomAmenities() {
  const count = getRandomNumber(3, 8)
  const selected = []
  const shuffled = [...amenitiesList].sort(() => Math.random() - 0.5)
  
  for (let i = 0; i < count; i++) {
    selected.push(shuffled[i])
  }
  
  return selected
}

function generatePropertyFeatures(propertyType) {
  const commonFeatures = ['Air Conditioning', 'Internet Ready', 'Cable TV Ready']
  const specificFeatures = {
    apartment: ['High Floor', 'City View', 'Balcony Access'],
    house: ['Private Garden', 'Garage', 'Separate Entrance'],
    villa: ['Private Pool', 'Wine Cellar', 'Guest House'],
    townhouse: ['Shared Facilities', 'Community Garden', 'Visitor Parking'],
    commercial: ['Loading Dock', 'Office Space', 'Retail Frontage'],
    land: ['Corner Lot', 'Water Access', 'Development Ready']
  }
  
  return [...commonFeatures, ...(specificFeatures[propertyType] || [])]
}

// ✅ Thêm function generateNewsContent bị thiếu
function generateNewsContent(title, provinceName, category) {
  const contentTemplates = {
    'Thị trường': `Thị trường bất động sản tại ${provinceName} đang có những diễn biến tích cực. Theo các chuyên gia, đây là thời điểm thuận lợi cho các nhà đầu tư tìm hiểu và đưa ra quyết định. Các khu vực trung tâm vẫn duy trì mức giá ổn định với thanh khoản tốt.`,
    
    'Phân tích': `Phân tích chuyên sâu về ${title} cho thấy những xu hướng đáng chú ý. Dữ liệu từ ${provinceName} chỉ ra rằng segment này đang có sự tăng trưởng ổn định. Các yếu tố như hạ tầng, quy hoạch và chính sách đều tác động tích cực.`,
    
    'Pháp lý': `Những thay đổi về mặt pháp lý tại ${provinceName} đang tạo ra các cơ hội mới cho thị trường. ${title} mang đến cái nhìn toàn diện về các quy định hiện hành và tương lai. Nhà đầu tư cần nắm vững các thông tin này để đưa ra quyết định đúng đắn.`,
    
    'Dự án': `${title} tại ${provinceName} đang thu hút sự quan tâm lớn từ cộng đồng đầu tư. Với vị trí đắc địa và thiết kế hiện đại, dự án hứa hẹn mang lại giá trị tốt trong tương lai. Tiến độ xây dựng đang được thực hiện theo đúng kế hoạch.`,
    
    'Tin tức': `Tin tức mới nhất về ${title} tại ${provinceName} cho thấy những phát triển đáng khích lệ. Thông tin từ các nguồn uy tín xác nhận xu hướng tích cực của khu vực này. Đây là thời điểm thích hợp để cập nhật các thông tin quan trọng.`
  }
  
  const baseContent = contentTemplates[category] || contentTemplates['Tin tức']
  
  return `${baseContent}\n\nCác chuyên gia dự báo rằng ${provinceName} sẽ tiếp tục là điểm sáng trong bản đồ bất động sản quốc gia. Với những lợi thế về địa lý, hạ tầng và chính sách, khu vực này hứa hẹn mang lại nhiều cơ hội đầu tư hấp dẫn.\n\nNhà đầu tư nên theo dõi sát các diễn biến để nắm bắt thời cơ thuận lợi nhất.`
}

// Generate news articles - FIX author field với ObjectId
function generateNews(count = 200) {
  const news = []
  const categories = ['Thị trường', 'Phân tích', 'Pháp lý', 'Dự án', 'Tin tức']
  
  const newsTitles = [
    'Thị trường bất động sản 2025',
    'Cơ hội đầu tư tại các thành phố lớn',
    'Dự án nhà ở mới phát triển',
    'Thay đổi luật bất động sản',
    'Xu hướng xây dựng bền vững'
  ]
  
  for (let i = 0; i < count; i++) {
    const province = getRandomElement(provinces)
    const category = getRandomElement(categories)
    const title = `${getRandomElement(newsTitles)} - ${province.name}`
    const publishedAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    
    news.push({
      title: title,
      content: generateNewsContent(title, province.name, category),
      category: category,
      // ✅ Fix author - sử dụng ObjectId thay vì string
      author: new mongoose.Types.ObjectId(), // Random ObjectId
      // Hoặc nếu muốn reference đến user thực tế:
      // author: userIds[getRandomNumber(0, userIds.length - 1)],
      
      // Optional fields
      excerpt: `Phân tích mới nhất về thị trường bất động sản tại ${province.name} với các xu hướng và cơ hội đầu tư.`,
      tags: ['bat-dong-san', 'dau-tu', 'thi-truong'],
      image: `https://picsum.photos/800/500?random=${i + 800}`,
      isFeatured: Math.random() > 0.8,
      isPublished: true,
      views: getRandomNumber(50, 5000),
      readTime: getRandomNumber(3, 12),
      publishedAt: publishedAt,
      createdAt: publishedAt,
      updatedAt: publishedAt
    })
  }
  
  return news
}

// Generate featured projects - FIX với đúng enum values từ schema
function generateFeaturedProjects(count = 150) {
  const projects = []
  const developers = ['Vingroup', 'CapitaLand', 'Novaland', 'Vinhomes', 'Gamuda Land']
  const projectTypes = ['residential', 'commercial', 'mixed-use']
  
  // ✅ Fix status values - sử dụng ĐÚNG enum values từ schema
  const validStatuses = ['planning', 'under-construction', 'completed', 'selling']
  
  for (let i = 0; i < count; i++) {
    const province = getRandomElement(provinces)
    const district = getRandomElement(province.districts)
    const developerName = getRandomElement(developers)
    const projectType = getRandomElement(projectTypes)
    const status = getRandomElement(validStatuses) // ✅ Sử dụng đúng enum values
    
    const startDate = new Date(Date.now() - Math.random() * 1095 * 24 * 60 * 60 * 1000)
    const completionDate = new Date(startDate.getTime() + (getRandomNumber(365, 1460) * 24 * 60 * 60 * 1000))
    const createdDate = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
    
    projects.push({
      title: `${developerName} ${district} Project`,
      description: generateProjectDescription(projectType, district, province.name),
      location: {
        city: province.name,
        district: district,
        address: `${getRandomNumber(1, 999)} Street, ${district}, ${province.name}`,
        coordinates: {
          lat: province.coordinates[1] + (Math.random() - 0.5) * 0.05,
          lng: province.coordinates[0] + (Math.random() - 0.5) * 0.05
        }
      },
      developer: {
        name: developerName,
        contact: `info@${developerName.toLowerCase()}.com`,
        phone: `+8490${String(getRandomNumber(1000000, 9999999))}`
      },
      projectType: projectType,
      status: status, // ✅ Now using correct enum values
      pricing: {
        priceFrom: getRandomPrice(2000000000, province.priceMultiplier * 0.8),
        priceTo: getRandomPrice(10000000000, province.priceMultiplier * 1.2)
      },
      totalUnits: getRandomNumber(100, 2000),
      availableUnits: status === 'completed' ? 0 : getRandomNumber(10, 500),
      images: [
        {
          url: `https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop`,
          caption: 'Project exterior view',
          isPrimary: true
        },
        {
          url: `https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop`,
          caption: 'Interior design',
          isPrimary: false
        },
        {
          url: `https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop`,
          caption: 'Amenities area',
          isPrimary: false
        }
      ],
      amenities: getRandomAmenities(),
      highlights: generateProjectHighlights(projectType),
      isFeatured: Math.random() > 0.7,
      startDate: startDate,
      completionDate: completionDate,
      createdAt: createdDate,
      updatedAt: createdDate
    })
  }
  
  return projects
}

function generateProjectDescription(projectType, district, provinceName) {
  const descriptions = {
    residential: `Premier residential development in ${district}, ${provinceName}. Offering modern homes with world-class amenities and sustainable living solutions for contemporary families.`,
    commercial: `Strategic commercial development in ${district}, ${provinceName}. Designed to meet growing business demands with flexible spaces and premium facilities.`,
    'mixed-use': `Integrated mixed-use development in ${district}, ${provinceName}. Combining residential, commercial, and recreational spaces for a complete urban lifestyle.`,
    industrial: `Modern industrial development in ${district}, ${provinceName}. State-of-the-art facilities designed for manufacturing and logistics operations.`
  }
  
  return descriptions[projectType]
}

function generateProjectImages() {
  const projectImages = [
    'photo-1545324418-cc1a3fa10c00',
    'photo-1613490493576-7fde63acd811',
    'photo-1600607687920-4e2a09cf159d',
    'photo-1600566753051-d9865c527cd4'
  ]
  
  return projectImages.map(img => `https://images.unsplash.com/${img}?w=800&h=600&fit=crop`)
}

function generateProjectHighlights(projectType) {
  const highlights = {
    residential: ['Family-friendly community', 'Green spaces and parks', 'Modern security systems', 'Convenient transportation'],
    commercial: ['Prime business location', 'Flexible office spaces', 'Advanced infrastructure', 'Parking facilities'],
    'mixed-use': ['Integrated lifestyle', 'Diverse amenities', 'Sustainable design', 'Connected community'],
    industrial: ['Strategic location', 'Modern facilities', 'Efficient logistics', 'Environmental compliance']
  }
  
  return highlights[projectType] || highlights.residential
}

// Main seed function - với error handling riêng biệt
async function seedDatabase() {
  try {
    console.log('🌱 Starting large-scale database seeding...')
    
    // Connect to MongoDB Atlas
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate'
    console.log('📡 Connecting to MongoDB Atlas...')
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMs: 30000,
      retryWrites: true,
      w: 'majority'
    })
    
    console.log('✅ Connected to MongoDB Atlas successfully!')
    console.log('🗄️ Database:', mongoose.connection.db.databaseName)

    // Clear existing data
    console.log('🧹 Clearing existing data...')
    await Promise.all([
      User.deleteMany({}),
      Property.deleteMany({}),
      News.deleteMany({}),
      FeaturedProject.deleteMany({})
    ])
    console.log('✅ Cleared existing data')

    // Users và Properties (đã hoạt động)
    console.log('👥 Generating and inserting users...')
    const users = generateUsers(100)
    const insertedUsers = await User.insertMany(users, { ordered: false })
    console.log(`✅ Inserted ${insertedUsers.length} users`)

    const userIds = insertedUsers.map(user => user._id)
    const agentIds = insertedUsers.filter(user => user.role === 'agent' || user.role === 'admin').map(user => user._id)

    console.log('🏠 Generating and inserting properties...')
    const properties = generatePropertiesWithOwners(2000, agentIds.length > 0 ? agentIds : userIds)
    
    const batchSize = 100
    let insertedCount = 0
    for (let i = 0; i < properties.length; i += batchSize) {
      const batch = properties.slice(i, i + batchSize)
      await Property.insertMany(batch, { ordered: false })
      insertedCount += batch.length
      console.log(`   📍 Inserted ${insertedCount}/${properties.length} properties`)
    }
    console.log(`✅ Inserted ${properties.length} properties`)

    // News - pass userIds để sử dụng làm author
    try {
      console.log('📰 Generating and inserting news articles...')
      const news = generateNewsWithAuthors(200, userIds) // ✅ Pass userIds
      
      const insertedNews = await News.insertMany(news, { ordered: false })
      console.log(`✅ Inserted ${insertedNews.length} news articles`)
      
    } catch (newsError) {
      console.error('❌ News seeding failed:', newsError.message)
    }

    // Projects - với error handling chi tiết
    try {
      console.log('🏗️ Generating and inserting featured projects...')
      const projects = generateFeaturedProjects(150)
      
      // Test single project first
      console.log('🧪 Testing single project insert...')
      const testProject = projects[0]
      console.log('Sample project data:', JSON.stringify(testProject, null, 2))
      
      const singleProjectResult = await FeaturedProject.create(testProject)
      console.log('✅ Single project test successful:', singleProjectResult._id)
      
      // Delete test project
      await FeaturedProject.findByIdAndDelete(singleProjectResult._id)
      
      // Insert all projects
      const insertedProjects = await FeaturedProject.insertMany(projects, { ordered: false })
      console.log(`✅ Inserted ${insertedProjects.length} featured projects`)
      
    } catch (projectError) {
      console.error('❌ Project seeding failed:', projectError.message)
      console.error('Project error details:', projectError)
      
      if (projectError.errors) {
        Object.keys(projectError.errors).forEach(field => {
          console.error(`  Field '${field}': ${projectError.errors[field].message}`)
        })
      }
    }

    // Final verification
    console.log('\n🔍 Final verification...')
    const [finalUserCount, finalPropertyCount, finalNewsCount, finalProjectCount] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      News.countDocuments(),
      FeaturedProject.countDocuments()
    ])

    console.log('\n📊 Final Seeding Summary:')
    console.log(`   Users: ${finalUserCount}`)
    console.log(`   Properties: ${finalPropertyCount}`)
    console.log(`   News Articles: ${finalNewsCount}`)
    console.log(`   Featured Projects: ${finalProjectCount}`)
    console.log(`   Total Records: ${finalUserCount + finalPropertyCount + finalNewsCount + finalProjectCount}`)
    
    if (finalNewsCount === 0) {
      console.warn('⚠️ WARNING: No news articles were inserted!')
    }
    
    if (finalProjectCount === 0) {
      console.warn('⚠️ WARNING: No featured projects were inserted!')
    }
    
    console.log('\n🎉 Large-scale database seeding completed!')
    await mongoose.disconnect()
    console.log('📡 Disconnected from MongoDB Atlas')
    
  } catch (error) {
    console.error('❌ Seeding error:', error)
    process.exit(1)
  }
}

// Tạo hàm mới để generate properties với owners thực tế
function generatePropertiesWithOwners(count = 2000, ownerIds = []) {
  const properties = []
  
  for (let i = 0; i < count; i++) {
    const province = getRandomElement(provinces)
    const district = getRandomElement(province.districts)
    const propertyType = getRandomElement(['apartment', 'house', 'villa', 'townhouse', 'land'])
    const listingType = getRandomElement(['sale', 'rent'])
    
    // Base prices
    let basePrice
    if (listingType === 'rent') {
      basePrice = {
        apartment: getRandomNumber(8, 50) * 1000000,
        house: getRandomNumber(15, 80) * 1000000,
        villa: getRandomNumber(50, 200) * 1000000,
        townhouse: getRandomNumber(20, 60) * 1000000,
        land: getRandomNumber(5, 30) * 1000000
      }[propertyType]
    } else {
      basePrice = {
        apartment: getRandomNumber(2, 15) * 1000000000,
        house: getRandomNumber(3, 25) * 1000000000,
        villa: getRandomNumber(10, 80) * 1000000000,
        townhouse: getRandomNumber(4, 20) * 1000000000,
        land: getRandomNumber(1, 30) * 1000000000
      }[propertyType]
    }
    
    const finalPrice = getRandomPrice(basePrice, province.priceMultiplier)
    const area = getRandomNumber(30, 500)
    const bedrooms = propertyType === 'land' ? 0 : getRandomNumber(1, 6)
    const bathrooms = propertyType === 'land' ? 0 : getRandomNumber(1, bedrooms + 1)
    
    // Random coordinates around province center
    const lat = province.coordinates[1] + (Math.random() - 0.5) * 0.1
    const lng = province.coordinates[0] + (Math.random() - 0.5) * 0.1
    
    // Chọn random owner từ danh sách user IDs
    const ownerId = ownerIds.length > 0 ? getRandomElement(ownerIds) : new mongoose.Types.ObjectId()
    
    properties.push({
      title: `${getRandomElement(propertyTitles[propertyType] || propertyTitles.apartment)} in ${district}`,
      description: generatePropertyDescription(propertyType, province.name, district),
      price: finalPrice,
      location: {
        address: `${getRandomNumber(1, 999)} Street ${i + 1}, ${district}, ${province.name}`,
        district: district,
        city: province.name,
        coordinates: {
          lat: lat,
          lng: lng
        }
      },
      type: listingType,
      category: propertyType,
      area: area,
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      images: generatePropertyImages(propertyType),
      amenities: getRandomAmenities(),
      features: generatePropertyFeatures(propertyType),
      yearBuilt: getRandomNumber(2010, 2024),
      furnished: Math.random() > 0.5,
      isFeatured: Math.random() > 0.8,
      status: getRandomElement(['available', 'sold', 'rented']),
      views: getRandomNumber(10, 1000),
      // ✅ Sử dụng ObjectId thực tế từ users đã tạo
      owner: ownerId,
      
      // Thêm các field khác nếu cần
      contactInfo: {
        name: `Agent ${getRandomNumber(1, 20)}`,
        phone: `+8490${String(getRandomNumber(1000000, 9999999))}`
      }
    })
  }
  
  return properties
}

// Cập nhật seedDatabase function để pass userIds cho News
async function seedDatabase() {
  try {
    console.log('🌱 Starting large-scale database seeding...')
    
    // Connect to MongoDB Atlas
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate'
    console.log('📡 Connecting to MongoDB Atlas...')
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMs: 30000,
      retryWrites: true,
      w: 'majority'
    })
    
    console.log('✅ Connected to MongoDB Atlas successfully!')
    console.log('🗄️ Database:', mongoose.connection.db.databaseName)

    // Clear existing data
    console.log('🧹 Clearing existing data...')
    await Promise.all([
      User.deleteMany({}),
      Property.deleteMany({}),
      News.deleteMany({}),
      FeaturedProject.deleteMany({})
    ])
    console.log('✅ Cleared existing data')

    // Users và Properties (đã hoạt động)
    console.log('👥 Generating and inserting users...')
    const users = generateUsers(100)
    const insertedUsers = await User.insertMany(users, { ordered: false })
    console.log(`✅ Inserted ${insertedUsers.length} users`)

    const userIds = insertedUsers.map(user => user._id)
    const agentIds = insertedUsers.filter(user => user.role === 'agent' || user.role === 'admin').map(user => user._id)

    console.log('🏠 Generating and inserting properties...')
    const properties = generatePropertiesWithOwners(2000, agentIds.length > 0 ? agentIds : userIds)
    
    const batchSize = 100
    let insertedCount = 0
    for (let i = 0; i < properties.length; i += batchSize) {
      const batch = properties.slice(i, i + batchSize)
      await Property.insertMany(batch, { ordered: false })
      insertedCount += batch.length
      console.log(`   📍 Inserted ${insertedCount}/${properties.length} properties`)
    }
    console.log(`✅ Inserted ${properties.length} properties`)

    // News - pass userIds để sử dụng làm author
    try {
      console.log('📰 Generating and inserting news articles...')
      const news = generateNewsWithAuthors(200, userIds) // ✅ Pass userIds
      
      const insertedNews = await News.insertMany(news, { ordered: false })
      console.log(`✅ Inserted ${insertedNews.length} news articles`)
      
    } catch (newsError) {
      console.error('❌ News seeding failed:', newsError.message)
    }

    // Projects - với error handling chi tiết
    try {
      console.log('🏗️ Generating and inserting featured projects...')
      const projects = generateFeaturedProjects(150)
      
      // Test single project first
      console.log('🧪 Testing single project insert...')
      const testProject = projects[0]
      console.log('Sample project data:', JSON.stringify(testProject, null, 2))
      
      const singleProjectResult = await FeaturedProject.create(testProject)
      console.log('✅ Single project test successful:', singleProjectResult._id)
      
      // Delete test project
      await FeaturedProject.findByIdAndDelete(singleProjectResult._id)
      
      // Insert all projects
      const insertedProjects = await FeaturedProject.insertMany(projects, { ordered: false })
      console.log(`✅ Inserted ${insertedProjects.length} featured projects`)
      
    } catch (projectError) {
      console.error('❌ Project seeding failed:', projectError.message)
      console.error('Project error details:', projectError)
      
      if (projectError.errors) {
        Object.keys(projectError.errors).forEach(field => {
          console.error(`  Field '${field}': ${projectError.errors[field].message}`)
        })
      }
    }

    // Final verification
    console.log('\n🔍 Final verification...')
    const [finalUserCount, finalPropertyCount, finalNewsCount, finalProjectCount] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      News.countDocuments(),
      FeaturedProject.countDocuments()
    ])

    console.log('\n📊 Final Seeding Summary:')
    console.log(`   Users: ${finalUserCount}`)
    console.log(`   Properties: ${finalPropertyCount}`)
    console.log(`   News Articles: ${finalNewsCount}`)
    console.log(`   Featured Projects: ${finalProjectCount}`)
    console.log(`   Total Records: ${finalUserCount + finalPropertyCount + finalNewsCount + finalProjectCount}`)
    
    if (finalNewsCount === 0) {
      console.warn('⚠️ WARNING: No news articles were inserted!')
    }
    
    if (finalProjectCount === 0) {
      console.warn('⚠️ WARNING: No featured projects were inserted!')
    }
    
    console.log('\n🎉 Large-scale database seeding completed!')
    await mongoose.disconnect()
    console.log('📡 Disconnected from MongoDB Atlas')
    
  } catch (error) {
    console.error('❌ Seeding error:', error)
    process.exit(1)
  }
}

// Tạo function mới để generate news với real author IDs
function generateNewsWithAuthors(count = 200, authorIds = []) {
  const news = []
  const categories = ['Thị trường', 'Phân tích', 'Pháp lý', 'Dự án', 'Tin tức']
  
  const newsTitles = [
    'Thị trường bất động sản 2025',
    'Cơ hội đầu tư tại các thành phố lớn',
    'Dự án nhà ở mới phát triển',
    'Thay đổi luật bất động sản',
    'Xu hướng xây dựng bền vững'
  ]
  
  for (let i = 0; i < count; i++) {
    const province = getRandomElement(provinces)
    const category = getRandomElement(categories)
    const title = `${getRandomElement(newsTitles)} - ${province.name}`
    const publishedAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    
    // Chọn random author từ userIds
    const authorId = authorIds.length > 0 ? getRandomElement(authorIds) : new mongoose.Types.ObjectId()
    
    news.push({
      title: title,
      content: generateNewsContent(title, province.name, category),
      category: category,
      author: authorId, // ✅ Real user ObjectId
      excerpt: `Phân tích mới nhất về thị trường bất động sản tại ${province.name} với các xu hướng và cơ hội đầu tư.`,
      tags: ['bat-dong-san', 'dau-tu', 'thi-truong'],
      image: `https://picsum.photos/800/500?random=${i + 800}`,
      isFeatured: Math.random() > 0.8,
      isPublished: true,
      views: getRandomNumber(50, 5000),
      readTime: getRandomNumber(3, 12),
      publishedAt: publishedAt,
      createdAt: publishedAt,
      updatedAt: publishedAt
    })
  }
  
  return news
}

// Cập nhật module exports
module.exports = { 
  seedDatabase, 
  generateUsers, 
  generateProperties, 
  generatePropertiesWithOwners,
  generateNews, 
  generateFeaturedProjects 
}

// ✅ Thêm phần này ở cuối file
if (require.main === module) {
  console.log('🚀 Running seed script directly...')
  seedDatabase()
    .then(() => {
      console.log('🎯 Direct seed script completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Direct seed script failed:', error)
      process.exit(1)
    })
}
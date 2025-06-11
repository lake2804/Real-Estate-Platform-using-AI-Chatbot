const express = require('express')
const router = express.Router()

// Corrected User import, other .cjs models are as per their original naming
const User = require('../models/User.js')
const Property = require('../models/Property.cjs')
const FeaturedProject = require('../models/FeaturedProject.cjs')
const News = require('../models/News.cjs')

// POST /api/seed/run - Run database seeder
router.post('/run', async (req, res) => {
  try {
    console.log('🌱 Starting database seeding...')
    
    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Property.deleteMany({}),
      FeaturedProject.deleteMany({}),
      News.deleteMany({})
    ])
    
    console.log('🗑️ Cleared existing data')

    // Seed Users
    const users = await User.insertMany([
      {
        fullName: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
        phone: '0901234567',
        isActive: true,
        emailVerified: true
      },
      {
        fullName: 'Agent Nguyễn Văn A',
        email: 'agent1@example.com',
        password: 'password123',
        role: 'agent',
        phone: '0902345678',
        isActive: true,
        emailVerified: true
      },
      {
        fullName: 'User Trần Thị B',
        email: 'user1@example.com',
        password: 'password123',
        role: 'user',
        phone: '0903456789',
        isActive: true,
        emailVerified: true
      }
    ])

    console.log(`✅ Seeded ${users.length} users`)

    // ✅ Seed Properties - FIXED based on schema
    const properties = []
    for (let i = 1; i <= 50; i++) {
      properties.push({
        title: `Căn hộ cao cấp ${i}`,
        description: `Mô tả chi tiết căn hộ số ${i} với đầy đủ tiện nghi hiện đại.`,
        price: Math.floor(Math.random() * 10000000000) + 1000000000,
        
        // ✅ FIXED: Based on schema structure
        location: {
          address: `Địa chỉ ${i}, Quận ${Math.floor(Math.random() * 12) + 1}`,
          district: `Quận ${Math.floor(Math.random() * 12) + 1}`,
          city: Math.random() > 0.5 ? 'TP.HCM' : 'Hà Nội',
          coordinates: {
            lat: 10.7 + Math.random() * 0.1,
            lng: 106.7 + Math.random() * 0.1
          }
        },
        
        // ✅ FIXED: Use valid enum values
        type: Math.random() > 0.5 ? 'sale' : 'rent',
        category: ['apartment', 'house', 'villa', 'townhouse', 'studio', 'penthouse'][Math.floor(Math.random() * 6)],
        
        // ✅ FIXED: Details object based on schema
        details: {
          area: Math.floor(Math.random() * 200) + 50,
          bedrooms: Math.floor(Math.random() * 4) + 1,
          bathrooms: Math.floor(Math.random() * 3) + 1,
          floors: Math.floor(Math.random() * 3) + 1,
          parking: Math.random() > 0.5,
          balcony: Math.random() > 0.7,
          direction: ['North', 'South', 'East', 'West'][Math.floor(Math.random() * 4)]
        },
        
        // ✅ Also add these fields directly (schema has both)
        area: Math.floor(Math.random() * 200) + 50,
        bedrooms: Math.floor(Math.random() * 4) + 1,
        bathrooms: Math.floor(Math.random() * 3) + 1,
        
        // ✅ FIXED: Images as simple string array
        images: [
          `https://picsum.photos/800/600?random=${i}`,
          `https://picsum.photos/800/600?random=${i + 100}`,
          `https://picsum.photos/800/600?random=${i + 200}`
        ],
        
        // ✅ Single image field
        image: `https://picsum.photos/800/600?random=${i}`,
        
        features: ['Điều hòa', 'Tủ lạnh', 'Máy giặt', 'WiFi', 'Bảo vệ 24/7'],
        amenities: ['Hồ bơi', 'Gym', 'Thang máy', 'Bảo vệ 24/7'],
        
        // ✅ CRITICAL: Set featured flags
        isFeatured: i <= 25,
        featured: i <= 25,
        isActive: true,
        // ✅ FIXED: Use valid enum values for status
        status: ['available', 'sold', 'rented', 'pending'][Math.floor(Math.random() * 4)],
        views: Math.floor(Math.random() * 1000),
        propertyType: ['apartment', 'house', 'villa'][Math.floor(Math.random() * 3)],
        
        owner: users[Math.floor(Math.random() * users.length)]._id,
        agent: users[1]._id, // Agent user
        
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      })
    }

    const createdProperties = await Property.insertMany(properties)
    console.log(`✅ Seeded ${createdProperties.length} properties (${createdProperties.filter(p => p.isFeatured).length} featured)`)

    // ✅ Seed FeaturedProjects - SIMPLIFIED APPROACH
    const projects = []
    for (let i = 1; i <= 20; i++) {
      projects.push({
        title: `Dự án ${i}`,
        name: `Dự án bất động sản ${i}`,
        description: `Mô tả chi tiết dự án bất động sản số ${i} với đầy đủ tiện ích hiện đại.`,
        
        // ✅ Location structure
        location: {
          city: Math.random() > 0.5 ? 'TP.HCM' : 'Hà Nội',
          district: `Quận ${Math.floor(Math.random() * 12) + 1}`,
          address: `Địa chỉ dự án ${i}`,
          coordinates: {
            lat: 10.7 + Math.random() * 0.1,
            lng: 106.7 + Math.random() * 0.1
          }
        },
        
        // ✅ Pricing structure
        pricing: {
          priceFrom: Math.floor(Math.random() * 5000000000) + 1000000000,
          priceTo: Math.floor(Math.random() * 10000000000) + 5000000000
        },
        
        // ✅ Direct price fields
        price: Math.floor(Math.random() * 8000000000) + 2000000000,
        priceFrom: Math.floor(Math.random() * 5000000000) + 1000000000,
        priceTo: Math.floor(Math.random() * 10000000000) + 5000000000,
        
        // ✅ Developer structure
        developer: {
          name: `Chủ đầu tư ${i}`,
          description: `Công ty phát triển bất động sản uy tín ${i}`
        },
        
        // ✅ Details structure
        details: {
          totalArea: Math.floor(Math.random() * 100000) + 10000,
          floors: Math.floor(Math.random() * 50) + 10,
          blocks: Math.floor(Math.random() * 10) + 2,
          totalApartments: Math.floor(Math.random() * 500) + 100
        },
        
        apartments: Math.floor(Math.random() * 500) + 100,
        area: Math.floor(Math.random() * 100000) + 10000,
        
        // ✅ ONLY use single image field
        image: `https://picsum.photos/1200/800?random=${i + 500}`,
        
        amenities: ['Hồ bơi', 'Gym', 'Sân chơi trẻ em', 'Siêu thị', 'Bến xe'],
        
        // ✅ Valid enum status
        status: ['planning', 'under-construction', 'completed', 'selling'][Math.floor(Math.random() * 4)],
        
        // ✅ Featured flags
        isFeatured: i <= 12,
        featured: i <= 12,
        views: Math.floor(Math.random() * 2000),
        
        createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      })
    }

    const createdProjects = await FeaturedProject.insertMany(projects)
    console.log(`✅ Seeded ${createdProjects.length} projects (${createdProjects.filter(p => p.isFeatured).length} featured)`)

    // ✅ Seed News - FIXED with correct category enum
    const newsArticles = []
    for (let i = 1; i <= 30; i++) {
      newsArticles.push({
        title: `Tin tức bất động sản ${i}`,
        content: `Nội dung chi tiết của bài viết tin tức bất động sản số ${i}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
        excerpt: `Tóm tắt nội dung bài viết số ${i}`,
        description: `Mô tả ngắn gọn về bài viết số ${i}`,
        
        // ✅ FIXED: Use actual valid enum values from schema
        category: ['Thị trường', 'Phân tích', 'Pháp lý', 'Dự án', 'Tin tức', 'market-update', 'investment-tips', 'legal-news'][Math.floor(Math.random() * 8)],
        tags: ['bat-dong-san', 'dau-tu', 'thi-truong'],
        
        // ✅ Image fields
        image: `https://picsum.photos/800/500?random=${i + 800}`,
        thumbnail: `https://picsum.photos/400/300?random=${i + 900}`,
        
        // ✅ CRITICAL: Set featured and published flags
        isFeatured: i <= 15,
        isPublished: true,
        views: Math.floor(Math.random() * 5000),
        likes: Math.floor(Math.random() * 100),
        readTime: Math.floor(Math.random() * 10) + 3,
        
        author: users[Math.floor(Math.random() * users.length)]._id,
        publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      })
    }

    const createdNews = await News.insertMany(newsArticles)
    console.log(`✅ Seeded ${createdNews.length} news articles (${createdNews.filter(n => n.isFeatured).length} featured)`)

    // Final summary
    const summary = {
      users: users.length,
      properties: {
        total: createdProperties.length,
        featured: createdProperties.filter(p => p.isFeatured).length,
        sale: createdProperties.filter(p => p.type === 'sale').length,
        rent: createdProperties.filter(p => p.type === 'rent').length
      },
      projects: {
        total: createdProjects.length,
        featured: createdProjects.filter(p => p.isFeatured).length
      },
      news: {
        total: createdNews.length,
        featured: createdNews.filter(n => n.isFeatured).length
      }
    }

    console.log('🎉 Database seeding completed successfully!', summary)

    res.json({
      success: true,
      message: 'Database seeded successfully',
      data: summary
    })

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to seed database',
      error: error.message
    })
  }
})

// GET /api/seed/status - Get seeding status
router.get('/status', async (req, res) => {
  try {
    const [userCount, propertyCount, projectCount, newsCount] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      FeaturedProject.countDocuments(),
      News.countDocuments()
    ])

    res.json({
      success: true,
      data: {
        users: userCount,
        properties: propertyCount,
        projects: projectCount,
        news: newsCount,
        hasData: userCount > 0 || propertyCount > 0 || projectCount > 0 || newsCount > 0
      }
    })
  } catch (error) {
    console.error('❌ Error getting seed status:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get seed status',
      error: error.message
    })
  }
})

module.exports = router
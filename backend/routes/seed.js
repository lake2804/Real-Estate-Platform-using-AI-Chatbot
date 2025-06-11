const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const router = express.Router()

console.log('🔧 Creating models for seeding...')

// ✅ User schema
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'agent', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

// ✅ Property schema  
const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    enum: ['apartment', 'house', 'villa', 'townhouse'],
    required: true
  },
  status: {
    type: String,
    enum: ['for-sale', 'for-rent', 'available'],
    default: 'available'
  },
  location: {
    address: String,
    district: String,
    city: String
  },
  details: {
    area: Number,
    bedrooms: Number,
    bathrooms: Number
  },
  images: [String],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// ✅ News schema
const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Thị trường', 'Phân tích', 'Pháp lý', 'Dự án', 'Tin tức']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  publishedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// ✅ FeaturedProject schema
const featuredProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    url: { type: String, required: true },
    isPrimary: { type: Boolean, default: false }
  }],
  location: {
    city: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    }
  },
  pricing: {
    priceFrom: {
      type: Number,
      required: true,
      min: 0
    }
  },
  developer: {
    name: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['planning', 'under-construction', 'completed', 'selling', 'sold-out'],
    default: 'selling'
  },
  isFeatured: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// ✅ Create models
const User = mongoose.models.User || mongoose.model('User', userSchema)
const Property = mongoose.models.Property || mongoose.model('Property', propertySchema)
const News = mongoose.models.News || mongoose.model('News', newsSchema)
const FeaturedProject = mongoose.models.FeaturedProject || mongoose.model('FeaturedProject', featuredProjectSchema)

console.log('✅ All seeder models created')

// @desc    Seed database
// @route   POST /api/seed
// @access  Public
router.post('/', async (req, res) => {
  try {
    console.log('🌱 Starting database seeding...')

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Property.deleteMany({}),
      News.deleteMany({}),
      FeaturedProject.deleteMany({})
    ])
    console.log('✅ Cleared existing data')

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12)
    const admin = await User.create({
      fullName: 'Admin User',
      email: 'admin@test.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      emailVerified: true
    })
    console.log('✅ Created admin user')

    // Create properties
    const properties = []
    for (let i = 1; i <= 30; i++) {
      properties.push({
        title: `Beautiful Property ${i}`,
        description: `This is a wonderful property located in the heart of the city. Property ${i} offers modern amenities and great connectivity.`,
        price: Math.floor(Math.random() * 10 + 1) * 1000000000, // 1-10 billion VND
        type: ['apartment', 'house', 'villa', 'townhouse'][Math.floor(Math.random() * 4)],
        status: ['for-sale', 'for-rent', 'available'][Math.floor(Math.random() * 3)],
        location: {
          address: `${i} Main Street`,
          district: `District ${i % 12 + 1}`,
          city: ['Ho Chi Minh City', 'Ha Noi', 'Da Nang'][Math.floor(Math.random() * 3)]
        },
        details: {
          area: Math.floor(Math.random() * 200) + 50, // 50-250 sqm
          bedrooms: Math.floor(Math.random() * 4) + 1, // 1-4 bedrooms
          bathrooms: Math.floor(Math.random() * 3) + 1 // 1-3 bathrooms
        },
        images: [
          `https://picsum.photos/800/600?random=${i}`,
          `https://picsum.photos/800/600?random=${i + 100}`,
          `https://picsum.photos/800/600?random=${i + 200}`
        ],
        owner: admin._id,
        isActive: true,
        views: Math.floor(Math.random() * 100)
      })
    }

    const createdProperties = await Property.create(properties)
    console.log(`✅ Created ${createdProperties.length} properties`)

    // Create news
    const newsArticles = []
    for (let i = 1; i <= 15; i++) {
      newsArticles.push({
        title: `Real Estate News ${i}`,
        content: `This is the content for news article ${i}. It contains important information about the real estate market trends and developments.`,
        category: ['Thị trường', 'Phân tích', 'Pháp lý', 'Dự án', 'Tin tức'][Math.floor(Math.random() * 5)],
        author: admin._id,
        isPublished: true,
        views: Math.floor(Math.random() * 500),
        publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
      })
    }

    const createdNews = await News.create(newsArticles)
    console.log(`✅ Created ${createdNews.length} news articles`)

    // Create featured projects
    const projects = []
    for (let i = 1; i <= 8; i++) {
      projects.push({
        title: `Premium Project ${i}`,
        description: `This is a premium real estate project offering luxury living spaces in prime locations. Project ${i} features world-class amenities and modern architecture.`,
        images: [
          { url: `https://picsum.photos/800/600?random=${i + 300}`, isPrimary: true },
          { url: `https://picsum.photos/800/600?random=${i + 400}`, isPrimary: false },
          { url: `https://picsum.photos/800/600?random=${i + 500}`, isPrimary: false }
        ],
        location: {
          city: ['Ho Chi Minh City', 'Ha Noi', 'Da Nang'][Math.floor(Math.random() * 3)],
          district: `District ${i % 10 + 1}`
        },
        pricing: {
          priceFrom: Math.floor(Math.random() * 5 + 2) * 1000000000 // 2-7 billion VND
        },
        developer: {
          name: `Developer Company ${i}`
        },
        status: ['selling', 'under-construction', 'completed'][Math.floor(Math.random() * 3)],
        isFeatured: true,
        views: Math.floor(Math.random() * 200)
      })
    }

    const createdProjects = await FeaturedProject.create(projects)
    console.log(`✅ Created ${createdProjects.length} featured projects`)

    const result = {
      users: 1,
      properties: createdProperties.length,
      news: createdNews.length,
      projects: createdProjects.length
    }

    console.log('✅ Database seeding completed successfully')

    res.json({
      success: true,
      message: 'Database seeded successfully',
      data: result
    })

  } catch (error) {
    console.error('❌ Seeding error:', error)
    res.status(500).json({
      success: false,
      message: 'Seeding failed',
      error: error.message
    })
  }
})

module.exports = router
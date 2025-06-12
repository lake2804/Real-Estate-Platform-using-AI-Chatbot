const mongoose = require('mongoose')

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Vui lòng nhập tiêu đề'],
    trim: true,
    maxlength: [200, 'Tiêu đề không được quá 200 ký tự']
  },
  description: {
    type: String,
    required: [true, 'Vui lòng nhập mô tả'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Vui lòng nhập giá'],
    min: [0, 'Giá không được âm']
  },
  location: {
    address: { type: String, trim: true },
    district: { type: String, trim: true },
    city: { type: String, trim: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  type: {
    type: String,
    enum: ['sale', 'rent'],
    required: true
  },
  category: {
    type: String,
    enum: ['apartment', 'house', 'villa', 'townhouse', 'studio', 'penthouse', 'office', 'land'],
    required: true
  },
  
  // ✅ Thông tin chi tiết căn hộ/nhà
  details: {
    bedrooms: {
      type: String, // "2PN/2WC", "3PN/3WC", etc.
      default: '1PN/1WC'
    },
    area: { 
      type: Number, 
      min: 0,
      required: true 
    },
    bathrooms: { type: Number, min: 0 },
    floors: { type: Number, min: 0 },
    parking: { type: Boolean, default: false },
    balcony: { type: Boolean, default: false },
    direction: { 
      type: String,
      enum: ['Đông', 'Tây', 'Nam', 'Bắc', 'Đông Nam', 'Đông Bắc', 'Tây Nam', 'Tây Bắc', '']
    },
    position: {
      type: String, // "Block B", "Tòa A", etc.
      default: ''
    },
    floor: {
      type: Number, // tầng số
      min: 1
    }
  },

  // ✅ Nội thất chi tiết
  furniture: {
    hasBasicFurniture: { type: Boolean, default: false },
    hasKitchen: { type: Boolean, default: false }, 
    hasAirConditioner: { type: Boolean, default: false },
    hasWashingMachine: { type: Boolean, default: false },
    hasRefrigerator: { type: Boolean, default: false },
    hasTV: { type: Boolean, default: false },
    hasBed: { type: Boolean, default: false },
    hasDiningTable: { type: Boolean, default: false },
    hasWifi: { type: Boolean, default: false },
    hasMicrowave: { type: Boolean, default: false }
  },

  // ✅ Ưu điểm dự án
  projectAdvantages: {
    location: [String], // Vị trí địa lý, giao thông
    facilities: [String], // Tiện ích nội khu  
    amenities: [String] // Tiện ích kèm theo
  },

  // ✅ Thông tin dự án
  project: {
    name: { type: String, default: '' },
    developer: { type: String, default: '' },
    totalUnits: Number,
    yearBuilt: Number,
    handoverYear: Number
  },

  images: [{
    type: String
  }],
  image: {
    type: String
  },
  features: [{
    type: String
  }],
  amenities: [{
    type: String
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // ✅ Thông tin liên hệ
  contactInfo: {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: String
  },

  isFeatured: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'rented', 'pending'],
    default: 'available'
  },
  views: {
    type: Number,
    default: 0
  },
  propertyType: {
    type: String,
    default: 'Căn hộ'
  },
  // Copy details to root for compatibility
  area: { type: Number },
  bedrooms: { type: Number },
  bathrooms: { type: Number }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// ✅ Virtual for formatted price
propertySchema.virtual('formattedPrice').get(function() {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(this.price)
})

// Indexes for better performance
propertySchema.index({ type: 1, isActive: 1 })
propertySchema.index({ 'location.city': 1, 'location.district': 1 })
propertySchema.index({ price: 1 })
propertySchema.index({ featured: 1, isFeatured: 1 })
propertySchema.index({ createdAt: -1 })

// Virtual for formatted location
propertySchema.virtual('formattedLocation').get(function() {
  if (!this.location) return ''
  const { address, district, city } = this.location
  return [address, district, city].filter(Boolean).join(', ')
})

// Pre-save middleware
propertySchema.pre('save', function(next) {
  // Set image from first images if not set
  if (!this.image && this.images && this.images.length > 0) {
    this.image = this.images[0]
  }
  
  // Copy details to root level for compatibility
  if (this.details) {
    if (this.details.area && !this.area) this.area = this.details.area
    if (this.details.bedrooms !== undefined && !this.bedrooms) this.bedrooms = this.details.bedrooms
    if (this.details.bathrooms !== undefined && !this.bathrooms) this.bathrooms = this.details.bathrooms
  }
  
  next()
})

// ✅ Export with proper check to avoid recompilation
module.exports = mongoose.models.Property || mongoose.model('Property', propertySchema)
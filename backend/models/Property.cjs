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
  details: {
    area: { type: Number, min: 0 },
    bedrooms: { type: Number, min: 0 },
    bathrooms: { type: Number, min: 0 },
    floors: { type: Number, min: 0 },
    parking: { type: Boolean, default: false },
    balcony: { type: Boolean, default: false },
    direction: { type: String }
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
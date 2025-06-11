const mongoose = require('mongoose')

const featuredProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Vui lòng nhập tiêu đề dự án'],
    trim: true,
    maxlength: [200, 'Tiêu đề không được quá 200 ký tự']
  },
  name: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Vui lòng nhập mô tả dự án'],
    trim: true
  },
  images: [{
    url: { type: String },
    alt: { type: String },
    isPrimary: { type: Boolean, default: false }
  }],
  image: {
    type: String
  },
  location: {
    city: { type: String, required: true },
    district: { type: String, required: true },
    address: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  pricing: {
    priceFrom: { type: Number, required: true },
    priceTo: { type: Number }
  },
  price: { type: Number },
  priceFrom: { type: Number },
  priceTo: { type: Number },
  developer: {
    name: { type: String, required: true },
    description: { type: String }
  },
  details: {
    totalArea: { type: Number },
    floors: { type: Number },
    blocks: { type: Number },
    totalApartments: { type: Number }
  },
  apartments: { type: Number },
  area: { type: Number },
  amenities: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['planning', 'under-construction', 'completed', 'selling'],
    default: 'planning'
  },
  isFeatured: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes
featuredProjectSchema.index({ 'location.city': 1 })
featuredProjectSchema.index({ status: 1 })
featuredProjectSchema.index({ isFeatured: 1 })

module.exports = mongoose.models.FeaturedProject || mongoose.model('FeaturedProject', featuredProjectSchema)
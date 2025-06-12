const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tiêu đề là bắt buộc'],
    maxlength: [200, 'Tiêu đề không được quá 200 ký tự'],
    trim: true
  },
  
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  
  content: {
    type: String,
    required: [true, 'Nội dung là bắt buộc']
  },
  
  summary: {
    type: String,
    required: [true, 'Tóm tắt là bắt buộc'],
    maxlength: [500, 'Tóm tắt không được quá 500 ký tự']
  },
  
  category: {
    type: String,
    required: true,
    enum: [
      'Tin tức',        // Market news
      'Phân tích',      // Market analysis  
      'Pháp lý',        // Legal guide
      'Dự án',          // Project review
      'Đầu tư',         // Investment tips
      'Hướng dẫn'       // Buying guide
    ]
  },
  
  tags: [{
    type: String,
    trim: true
  }],
  
  thumbnail: {
    type: String,
    required: [true, 'Ảnh đại diện là bắt buộc']
  },
  
  images: [{
    url: String,
    caption: String,
    alt: String
  }],
  
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  
  isPublished: {
    type: Boolean,
    default: true
  },
  
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  featured: {
    type: Boolean,
    default: false
  },
  
  publishedAt: {
    type: Date,
    default: Date.now
  },
  
  views: {
    type: Number,
    default: 0
  },
  
  likes: {
    type: Number,
    default: 0
  },
  
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  seoTitle: {
    type: String,
    maxlength: 60
  },
  
  seoDescription: {
    type: String,
    maxlength: 160
  },
  
  relatedProperties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  }]
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-save middleware
newsSchema.pre('save', function(next) {
  // Sync fields
  this.isPublished = this.status === 'published';
  
  if (this.isFeatured && !this.featured) {
    this.featured = this.isFeatured;
  }
  if (this.featured && !this.isFeatured) {
    this.isFeatured = this.featured;
  }
  
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  // Generate slug from title
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  
  next();
});

// Indexes
newsSchema.index({ slug: 1 });
newsSchema.index({ category: 1, isPublished: 1 });
newsSchema.index({ publishedAt: -1 });
newsSchema.index({ isFeatured: -1, publishedAt: -1 });

module.exports = mongoose.model('News', newsSchema);
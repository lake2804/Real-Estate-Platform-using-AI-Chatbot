const mongoose = require('mongoose')

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Vui lòng nhập tiêu đề'],
    trim: true,
    maxlength: [200, 'Tiêu đề không được quá 200 ký tự']
  },
  content: {
    type: String,
    required: [true, 'Vui lòng nhập nội dung']
  },
  excerpt: {
    type: String,
    trim: true,
    maxlength: [500, 'Tóm tắt không được quá 500 ký tự']
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Thị trường', 'Phân tích', 'Pháp lý', 'Dự án', 'Tin tức', 'market-update', 'investment-tips', 'legal-news']
  },
  tags: [{
    type: String,
    trim: true
  }],
  image: {
    type: String
  },
  thumbnail: {
    type: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  readTime: {
    type: Number,
    default: 5
  },
  publishedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes
newsSchema.index({ category: 1, isPublished: 1 })
newsSchema.index({ isFeatured: 1 })
newsSchema.index({ publishedAt: -1 })

module.exports = mongoose.models.News || mongoose.model('News', newsSchema)
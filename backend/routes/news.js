const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const newsController = require('../controllers/news.controller');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/admin');

// Validation rules
const newsValidation = [
  body('title').notEmpty().withMessage('Tiêu đề là bắt buộc'),
  body('content').notEmpty().withMessage('Nội dung là bắt buộc'),
  body('summary').notEmpty().withMessage('Tóm tắt là bắt buộc'),
  body('category').isIn([
    'Tin tức', 'Phân tích', 'Pháp lý', 'Dự án', 'Đầu tư', 'Hướng dẫn'
  ]).withMessage('Chuyên mục không hợp lệ'),
  body('thumbnail').isURL().withMessage('Link ảnh không hợp lệ')
];

// ===== PUBLIC ROUTES =====
// GET /api/news/featured - Get featured news
router.get('/featured', newsController.getFeaturedNews);

// GET /api/news/categories - Get categories
router.get('/categories', newsController.getCategories);

// GET /api/news - Get all news with filters
router.get('/', newsController.getAllNews);

// GET /api/news/:id - Get single news article
router.get('/:id', newsController.getNewsById);

// ===== PRIVATE ROUTES =====
// POST /api/news - Create news (Admin/Editor only)
router.post('/', auth, adminAuth, newsValidation, newsController.createNews);

// PUT /api/news/:id - Update news
router.put('/:id', auth, newsValidation, newsController.updateNews);

// DELETE /api/news/:id - Delete news
router.delete('/:id', auth, newsController.deleteNews);

// POST /api/news/:id/like - Like/Unlike news
router.post('/:id/like', auth, newsController.toggleLike);

module.exports = router;
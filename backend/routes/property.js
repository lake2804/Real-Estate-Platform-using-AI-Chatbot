import express from 'express';
import {
  getAllProperties,
  getFeaturedProperties,
  getPropertyById
} from '../controllers/property.controller.js';

const router = express.Router();

// Public routes
router.get('/', getAllProperties);
router.get('/featured', getFeaturedProperties);
router.get('/:id', getPropertyById);

module.exports =  router;
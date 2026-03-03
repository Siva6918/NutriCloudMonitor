import express from 'express';
import {
  getAllProducts,
  getProductById,
  getCategories,
} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getAllProducts);
router.get('/categories', protect, getCategories);
router.get('/:id', protect, getProductById);

export default router;

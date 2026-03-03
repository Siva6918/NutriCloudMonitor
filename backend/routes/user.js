import express from 'express';
import {
  getUserProfile,
  updateProfile,
  calculateBMIAndGetDiet,
  getDietRecommendations,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateProfile);
router.post('/bmi', protect, calculateBMIAndGetDiet);
router.get('/diet-recommendations', protect, getDietRecommendations);

export default router;

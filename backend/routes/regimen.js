import express from 'express';
import { protect } from '../middleware/auth.js';
import { getTodayRegimen, markRegimenComplete } from '../controllers/regimenController.js';

const router = express.Router();

router.get('/', protect, getTodayRegimen);
router.patch('/:id/complete', protect, markRegimenComplete);

export default router;

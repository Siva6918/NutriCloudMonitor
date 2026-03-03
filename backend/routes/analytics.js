import express from 'express';
import { trackNavigation } from '../controllers/analyticsController.js';
import { optionalAuth } from '../middleware/auth.js';

// We optionally authenticate, but typically clickstream comes from anyone (logged in or not)
// So we won't strictly apply authMiddleware, or we can use an optional auth middleware if
// we want to track user IDs when present. For simplicity, just an open POST.
// Wait, we need to extract req.user if present. Let's create an optional auth middleware
// or just handle it as an open route for now, relying on cookies/token if needed.
// Actually, tracking is open.
const router = express.Router();

router.post('/track-navigation', optionalAuth, trackNavigation);

export default router;

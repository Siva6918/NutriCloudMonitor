import express from 'express';
import rateLimit from 'express-rate-limit';
import { signup, login } from '../controllers/authController.js';

const router = express.Router();

// Rate limiter specifically for login route to protect against brute force
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 20, // Limit each IP to 20 login requests per windowMs
    message: { message: 'Too many login attempts from this IP, please try again after 15 minutes.' }
});

router.post('/signup', signup);
router.post('/login', loginLimiter, login);

export default router;

// cherus-backend/routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// --- Rate Limiter Configurations ---
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 login requests per windowMs
    message: { success: false, message: 'Too many login attempts from this IP, please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
    // skipSuccessfulRequests: true //  only count failed attempts towards rate limit
});

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 registration attempts per hour
    message: { success: false, message: 'Too many accounts created from this IP, please try again after an hour.' },
    standardHeaders: true,
    legacyHeaders: false,
});
// --- End Rate Limiter Configurations ---


// User Registration Route (POST /api/auth/register)
router.post('/register',registerLimiter, authController.register);


// User Login Route (POST /api/auth/login)
router.post('/login', loginLimiter, authController.login);

module.exports = router;
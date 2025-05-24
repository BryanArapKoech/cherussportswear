// cherus-backend/routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// User Registration Route (POST /api/auth/register)
router.post('/register', authController.register);


// User Login Route (POST /api/auth/login)
router.post('/login', authController.login);

module.exports = router;
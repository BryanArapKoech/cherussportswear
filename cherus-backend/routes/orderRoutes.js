const express = require('express');
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../middleware/authMiddleware'); // Import middleware

const router = express.Router();

// Route to create a new order and initiate payment (currently only M-Pesa)
router.post('/create-order', verifyToken, orderController.createOrder);

// Add other order-related routes here later (e.g., GET /orders/:id)

module.exports = router;
const express = require('express');
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../middleware/authMiddleware'); // Import middleware

const router = express.Router();

// Route to create a new order and initiate payment (currently only M-Pesa)
router.post('/create-order', verifyToken, orderController.createOrder);

// GET /api/orders/:orderId/status - Check the status of an order.
router.get('/:orderId/status', orderController.getOrderStatus);

module.exports = router;
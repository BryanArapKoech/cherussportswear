const express = require('express');
const orderController = require('../controllers/orderController');
// Add validation middleware later if needed: const { validateOrder } = require('../middleware/validators');

const router = express.Router();

// Route to create a new order and initiate payment (currently only M-Pesa)
router.post('/create-order', /* validateOrder, */ orderController.createOrder);

// Add other order-related routes here later (e.g., GET /orders/:id)

module.exports = router;
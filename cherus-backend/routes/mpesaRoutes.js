const express = require('express');
const router = express.Router();
const mpesaController = require('../controllers/mpesaController');



// M-Pesa STK Push Callback URL (must match .env and Safaricom portal registration)
router.post('/stk-callback', mpesaController.handleStkCallback);

// Optional: Route to query STK push status
// router.get('/query-status/:checkoutRequestId', mpesaController.queryStkStatus);

module.exports = router;
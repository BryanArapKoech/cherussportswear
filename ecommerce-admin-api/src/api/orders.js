// src/api/orders.js
const express = require('express');
const db = require('../config/database');
const authorize = require('../middleware/authorize');
const router = express.Router();

// GET /api/orders - List all orders
router.get('/', authorize('read:orders'), async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, customer_id, order_date, status, total_amount FROM orders ORDER BY order_date DESC');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
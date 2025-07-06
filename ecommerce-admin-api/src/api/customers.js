// src/api/customers.js
const express = require('express');
const db = require('../config/database');
const authorize = require('../middleware/authorize');
const router = express.Router();

// GET /api/customers - List all customers
router.get('/', authorize('read:customers'), async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, name, email FROM customers ORDER BY id ASC');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
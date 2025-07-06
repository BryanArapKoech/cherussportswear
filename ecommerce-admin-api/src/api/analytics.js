// src/api/analytics.js
const express = require('express');
const db = require('../config/database');
const authorize = require('../middleware/authorize');
const router = express.Router();

// GET /api/analytics/kpis - Get Key Performance Indicators
router.get('/kpis', authorize('read:analytics'), async (req, res) => {
  try {
    // We run multiple queries in parallel for efficiency
    const kpiQueries = [
      db.query("SELECT COUNT(*) FROM customers"), // Total Customers
      db.query("SELECT SUM(total_amount) FROM orders WHERE status = 'delivered'"), // Total Revenue
      db.query("SELECT COUNT(*) FROM orders"), // Total Orders
      db.query("SELECT AVG(total_amount) FROM orders WHERE status = 'delivered'") // Average Order Value
    ];

    const [
      totalCustomersRes,
      totalRevenueRes,
      totalOrdersRes,
      avgOrderValueRes
    ] = await Promise.all(kpiQueries);

    const kpis = {
      total_customers: parseInt(totalCustomersRes.rows[0].count, 10),
      total_revenue: parseFloat(totalRevenueRes.rows[0].sum) || 0,
      total_orders: parseInt(totalOrdersRes.rows[0].count, 10),
      average_order_value: parseFloat(avgOrderValueRes.rows[0].avg) || 0
    };

    res.status(200).json(kpis);
  } catch (error) {
    console.error("KPIs error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
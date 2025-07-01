// src/api/admin.js

const express = require('express');
const db = require('../config/database');


const router = express.Router();

router.get('/profile/me', async (req, res) => {
  try {
    const { admin_id } = req.admin;
    const { rows } = await db.query('SELECT id, email, role_id, created_at FROM admins WHERE id = $1', [admin_id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json(rows[0]);

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
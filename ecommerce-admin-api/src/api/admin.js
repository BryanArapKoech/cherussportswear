// src/api/admin.js

const express = require('express');
const db = require('../config/database');

const router = express.Router();

router.get('/me', async (req, res) => {
  try {
    const { admin_id } = req.admin;

   
    const sqlQuery = 'SELECT id, email, role_id FROM admins WHERE id = $1';
    const values = [admin_id];
    
    const { rows } = await db.query(sqlQuery, values);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
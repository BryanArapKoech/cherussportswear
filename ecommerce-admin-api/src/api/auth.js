// src/api/auth.js

const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { comparePassword } = require('../utils/password');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find admin by email
    const { rows } = await db.query('SELECT * FROM admins WHERE email = $1', [email]);
    const admin = rows[0];

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' }); // User not found
    }


    


// --- LOGS FOR VALIDATION ---
    console.log('--- Password Comparison Details ---');
    console.log('Password from Request:', `'${password}'`);
    console.log('Hashed Password from DB:', `'${admin.password_hash}'`);
    console.log('---------------------------------');
    // --- END OF LOGS ---




    // Compare password
    const isMatch = await comparePassword(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' }); // Wrong password
    }

    // Generate JWT
    const payload = { admin_id: admin.id, role_id: admin.role_id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
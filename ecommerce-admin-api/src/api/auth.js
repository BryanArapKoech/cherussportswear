// src/api/auth.js

const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { comparePassword } = require('../utils/password');
const { logAction } = require('../utils/audit');
const speakeasy = require('speakeasy'); 

const router = express.Router();

// LOGIN ENDPOINT
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const { rows } = await db.query('SELECT * FROM admins WHERE email = $1', [email]);
    const admin = rows[0];
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await comparePassword(password, admin.password_hash);
    if (!isMatch) {
      await logAction(admin.id, 'login_fail_password', { ip_address: req.ip });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // --- LOGIC ---
    if (admin.mfa_secret) {
      // MFA is enabled. Issue a short-lived temporary token.
      const mfaPayload = { admin_id: admin.id, mfa_required: true };
      const mfaToken = jwt.sign(mfaPayload, process.env.JWT_SECRET, { expiresIn: '5m' });
      
      await logAction(admin.id, 'login_success_password_mfa_required', { ip_address: req.ip });
      return res.status(200).json({ mfa_required: true, mfa_token: mfaToken });
    }

    // MFA is not enabled. Issue a full-access token immediately.
    const payload = { admin_id: admin.id, role_id: admin.role_id, email: admin.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    await logAction(admin.id, 'login_success_no_mfa', { ip_address: req.ip });
    res.status(200).json({ token });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// NEW MFA LOGIN ENDPOINT
router.post('/login-mfa', async (req, res) => {
  try {
    const { mfa_token, totp_code } = req.body;

    if (!mfa_token || !totp_code) {
      return res.status(400).json({ message: 'MFA token and TOTP code are required.' });
    }

    let mfaPayload;
    try {
      mfaPayload = jwt.verify(mfa_token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired MFA token.' });
    }
    
    const { rows } = await db.query('SELECT * FROM admins WHERE id = $1', [mfaPayload.admin_id]);
    const admin = rows[0];

    if (!admin || !admin.mfa_secret) {
        return res.status(401).json({ message: 'MFA not enabled or user not found.' });
    }

    const isVerified = speakeasy.totp.verify({
      secret: admin.mfa_secret,
      encoding: 'base32',
      token: totp_code,
      window: 1
    });

    if (!isVerified) {
      return res.status(401).json({ message: 'Invalid TOTP code.' });
    }

    const finalPayload = { admin_id: admin.id, role_id: admin.role_id, email: admin.email };
    const finalToken = jwt.sign(finalPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    await logAction(admin.id, 'login_mfa_success', { ip_address: req.ip });
    res.status(200).json({ token: finalToken });

  } catch (error) {
    console.error('MFA login error:', error);
    res.status(500).json({ message: 'Server error during MFA login' });
  }
});


module.exports = router;
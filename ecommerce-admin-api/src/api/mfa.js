// src/api/mfa.js

const express = require('express');
const speakeasy = require('speakeasy');
const db = require('../config/database');
const { logAction } = require('../utils/audit');

const router = express.Router();

// This endpoint is for an already-logged-in user to start the MFA setup process.
router.post('/setup', async (req, res) => {
  try {
    const { admin_id } = req.admin;

    // Generate a new secret for the user
    const secret = speakeasy.generateSecret({
      name: `EcommerceAdmin (${req.admin.email})` // This label will appear in the authenticator app
    });

    // We do NOT save the secret to the DB yet. 
    // It's temporarily stored on the client side until the user verifies a token.
    // This prevents users from being locked out if they fail to scan the QR code.

    // The 'otpauth_url' is the data the QR code will contain.
    res.status(200).json({
      secret: secret.base32,
      qr_code_url: secret.otpauth_url
    });

  } catch (error) {
    console.error('MFA setup error:', error);
    res.status(500).json({ message: 'Server error during MFA setup' });
  }
});

// The user sends the secret (that they got from /setup) and a TOTP token from their app.
router.post('/verify', async (req, res) => {
  try {
    const { admin_id } = req.admin;
    const { secret, token } = req.body;

    if (!secret || !token) {
      return res.status(400).json({ message: 'MFA secret and token are required.' });
    }

    // Verify the token the user provided against the secret
    const isVerified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token
    });

    if (!isVerified) {
      return res.status(401).json({ message: 'Invalid MFA token. Please try again.' });
    }

    // If verification is successful, save the secret to the user's record in the database.
    await db.query('UPDATE admins SET mfa_secret = $1 WHERE id = $2', [secret, admin_id]);

    // Log this important security event
    await logAction(admin_id, 'mfa_enabled', { ip_address: req.ip });

    res.status(200).json({ message: 'MFA has been enabled successfully.' });

  } catch (error) {
    console.error('MFA verification error:', error);
    res.status(500).json({ message: 'Server error during MFA verification' });
  }
});

module.exports = router;
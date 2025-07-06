// src/api/settings.js
const express = require('express');
const db = require('../config/database');
const authorize = require('../middleware/authorize');
const { logAction } = require('../utils/audit');
const router = express.Router();

// GET /api/settings - Get all application settings
router.get('/', authorize('read:settings'), async (req, res) => {
  try {
    const { rows } = await db.query('SELECT key, value FROM settings');
    // Convert the array of {key, value} objects into a single settings object
    const settings = rows.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
    res.status(200).json(settings);
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/settings - Update one or more settings
router.post('/', authorize('write:settings'), async (req, res) => {
  const settingsToUpdate = req.body;
  if (!settingsToUpdate || Object.keys(settingsToUpdate).length === 0) {
    return res.status(400).json({ message: 'No settings provided to update.' });
  }

  const client = await db.pool.connect(); // Get a client from the pool for a transaction
  try {
    await client.query('BEGIN'); // Start the transaction

    for (const key in settingsToUpdate) {
      const value = settingsToUpdate[key];
      // Note: We use JSON.stringify because the 'value' column is JSONB
      // This correctly handles numbers, booleans, and strings.
      await client.query(
        'UPDATE settings SET value = $1, updated_at = NOW() WHERE key = $2',
        [JSON.stringify(value), key]
      );
    }
    
    await client.query('COMMIT'); // Commit the transaction if all updates succeed

    await logAction(req.admin.admin_id, 'update_settings', {
        ip_address: req.ip,
        details: { updated_keys: Object.keys(settingsToUpdate) }
    });

    res.status(200).json({ message: 'Settings updated successfully.' });
  } catch (error) {
    await client.query('ROLLBACK'); // If any update fails, roll back all changes
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release(); // IMPORTANT: Release the client back to the pool
  }
});

module.exports = router;
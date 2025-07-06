// src/api/content.js
const express = require('express');
const db = require('../config/database');
const authorize = require('../middleware/authorize');
const { logAction } = require('../utils/audit');
const router = express.Router();

// GET /api/content/:slug - Get a specific content page
router.get('/:slug', authorize('read:content'), async (req, res) => {
  try {
    const { slug } = req.params;
    const { rows } = await db.query('SELECT * FROM marketing_content WHERE slug = $1', [slug]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Content not found.' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/content/:slug - Update a content page
router.put('/:slug', authorize('write:content'), async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, body_html } = req.body;
    if (!title || !body_html) {
      return res.status(400).json({ message: 'Title and body_html are required.' });
    }
    const { rows } = await db.query(
      'UPDATE marketing_content SET title = $1, body_html = $2, updated_at = NOW() WHERE slug = $3 RETURNING *',
      [title, body_html, slug]
    );
    if (rows.length === 0) {
      // If the content doesn't exist, we can create it instead (upsert logic)
      const { rows: newRows } = await db.query(
          'INSERT INTO marketing_content (slug, title, body_html) VALUES ($1, $2, $3) RETURNING *',
          [slug, title, body_html]
      );
      await logAction(req.admin.admin_id, 'create_content', {
          target_resource: 'marketing_content',
          ip_address: req.ip,
          details: { slug: slug, new_title: newRows[0].title }
      });
      return res.status(201).json(newRows[0]);
    }
    
    await logAction(req.admin.admin_id, 'update_content', {
        target_resource: 'marketing_content',
        ip_address: req.ip,
        details: { slug: slug, new_title: title }
    });
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
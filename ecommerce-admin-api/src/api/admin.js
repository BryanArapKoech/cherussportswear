// src/api/admin.js

const express = require('express');
const db = require('../config/database');
const router = express.Router();

// Import middleware and utilities
const authorize = require('../middleware/authorize');
const { hashPassword } = require('../utils/password');
const { adminCreationRules, validate } = require('../middleware/validators');
const { logAction } = require('../utils/audit'); 

// Get the logged-in user's own profile
router.get('/profile/me', async (req, res) => {
  try {
    const { admin_id } = req.admin;
    const { rows } = await db.query('SELECT id, email, role_id, created_at FROM admins WHERE id = $1', [admin_id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Admin not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- Admin Management Routes ---

// 1. Create a new admin user
router.post('/users', authorize('create:admins'), adminCreationRules(), validate,
async (req, res) => {
  try {
    const { email, password, role_id } = req.body;
    const hashedPassword = await hashPassword(password);
    
    const { rows } = await db.query(
      'INSERT INTO admins (email, password_hash, role_id) VALUES ($1, $2, $3) RETURNING *',
      [email, hashedPassword, role_id]
    );
    const newAdmin = rows[0]; // Capture the newly created admin

    // --- AUDIT LOG ---
    await logAction(req.admin.admin_id, 'create_admin', {
      target_resource: 'admins',
      target_id: newAdmin.id,
      ip_address: req.ip,
      details: { created_email: newAdmin.email, assigned_role: newAdmin.role_id }
    });

    res.status(201).json(newAdmin);
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ message: 'Email already exists' });
    if (error.code === '23503') return res.status(400).json({ message: 'Invalid role_id' });
    console.error("Create admin error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 2. Get a list of all admin users
router.get('/users', authorize('read:admins'), async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, email, role_id, created_at FROM admins');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 3. Update an admin's role
router.put('/users/:id/role', authorize('update:admins'), async (req, res) => {
  try {
    const targetAdminId = req.params.id; // Define the target ID
    const { role_id } = req.body;
    if (!role_id) return res.status(400).json({ message: 'role_id is required' });

    const { rows } = await db.query('UPDATE admins SET role_id = $1 WHERE id = $2 RETURNING *', [role_id, targetAdminId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Admin not found' });

    // --- AUDIT LOG ---
    await logAction(req.admin.admin_id, 'update_admin_role', {
        target_resource: 'admins',
        target_id: parseInt(targetAdminId),
        ip_address: req.ip,
        details: { new_role_id: role_id }
    });

    res.status(200).json({ message: 'Admin role updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 4. Delete an admin user
router.delete('/users/:id', authorize('delete:admins'), async (req, res) => {
  try {
    const targetAdminId = req.params.id; // Define the target ID
    if (parseInt(targetAdminId, 10) === req.admin.admin_id) {
        return res.status(400).json({ message: 'You cannot delete your own account.' });
    }
    const { rowCount } = await db.query('DELETE FROM admins WHERE id = $1', [targetAdminId]);
    if (rowCount === 0) return res.status(404).json({ message: 'Admin not found' });

    // --- AUDIT LOG ---
    await logAction(req.admin.admin_id, 'delete_admin', {
        target_resource: 'admins',
        target_id: parseInt(targetAdminId),
        ip_address: req.ip
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
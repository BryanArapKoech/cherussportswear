// src/api/products.js

const express = require('express');
const db = require('../config/database');
const { logAction } = require('../utils/audit');
const authorize = require('../middleware/authorize');

const router = express.Router();

// GET /api/products - List all products
// Protected by RBAC: Requires 'read:products' permission.
router.get('/', authorize('read:products'), async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM products ORDER BY id ASC');
    res.status(200).json(rows);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/products/:id - Get a single product by ID
router.get('/:id', authorize('read:products'), async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM products WHERE id = $1', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(`Error fetching product ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});


// POST /api/products - Create a new product
// Protected by RBAC: Requires 'write:products' permission.
router.post('/', authorize('write:products'), async (req, res) => {
  try {
    const { name, description, price, sku, inventory_count } = req.body;
    // Basic validation to ensure required fields are present
    if (!name || price === undefined || !sku) {
        return res.status(400).json({ message: 'Name, price, and SKU are required.' });
    }
    const { rows } = await db.query(
      'INSERT INTO products (name, description, price, sku, inventory_count) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, price, sku, inventory_count || 0]
    );
    const newProduct = rows[0];

    // Log the creation action
    await logAction(req.admin.admin_id, 'create_product', {
        target_resource: 'products',
        target_id: newProduct.id,
        ip_address: req.ip,
        details: { name: newProduct.name, sku: newProduct.sku }
    });
    res.status(201).json(newProduct);
  } catch (error) {
    if (error.code === '23505') { // Handles unique_violation for the SKU
        return res.status(409).json({ message: 'SKU already exists.' });
    }
    console.error("Create product error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/products/:id - Update an existing product
// Protected by RBAC: Requires 'write:products' permission.
router.put('/:id', authorize('write:products'), async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, description, price, inventory_count } = req.body;
        const { rows } = await db.query(
            'UPDATE products SET name = $1, description = $2, price = $3, inventory_count = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
            [name, description, price, inventory_count, productId]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        // Log the update action
        await logAction(req.admin.admin_id, 'update_product', {
            target_resource: 'products',
            target_id: parseInt(productId),
            ip_address: req.ip,
            details: { changes: req.body }
        });
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("Update product error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/products/:id - Delete a product
// Protected by RBAC: Requires 'write:products' permission.
router.delete('/:id', authorize('write:products'), async (req, res) => {
    try {
        const productId = req.params.id;
        const { rowCount } = await db.query('DELETE FROM products WHERE id = $1', [productId]);
        if (rowCount === 0) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        // Log the delete action
        await logAction(req.admin.admin_id, 'delete_product', {
            target_resource: 'products',
            target_id: parseInt(productId),
            ip_address: req.ip
        });
        res.status(204).send();
    } catch (error) {
        console.error("Delete product error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
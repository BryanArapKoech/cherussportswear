const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

// GET /api/products - Fetch products with optional filtering/sorting/pagination
router.get('/', productController.getAllProducts);

// Add GET /api/products/:id later for single product view

module.exports = router;
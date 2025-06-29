// src/api/products.js

const express = require('express');
const router = express.Router();

// This route will be protected by both authentication and authorization
router.post('/', (req, res) => {
  // If the request gets this far, it means the user is authorized.
  res.status(201).json({ message: 'Product created successfully' });
});

module.exports = router;
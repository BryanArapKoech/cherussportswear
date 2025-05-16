const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
// router.post('/', productController.createProduct); // For admin later

module.exports = router;
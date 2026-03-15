const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Routes publiques
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Routes admin (à protéger avec middleware d'authentification)
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.put('/market-prices/update', productController.updateMarketPrices);

module.exports = router;

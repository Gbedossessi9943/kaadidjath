const express = require('express');
const router = express.Router();

// Importer les contrôleurs mock
const productController = require('../controllers/mockProductController');
const orderController = require('../controllers/mockOrderController');
const userController = require('../controllers/mockUserController');
const { auth } = require('../middleware/auth');

// Routes produits
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);
router.put('/products/market-prices/update', productController.updateMarketPrices);

// Routes commandes
router.post('/orders', orderController.createOrder);
router.get('/orders', orderController.getOrders);
router.get('/orders/:id', orderController.getOrderById);
router.put('/orders/:id/status', orderController.updateOrderStatus);
router.put('/orders/:id/cancel', orderController.cancelOrder);
router.put('/orders/:id/payment', orderController.confirmPayment);

// Routes utilisateurs
router.post('/users/register', userController.register);
router.post('/users/login', userController.login);
router.get('/users/profile', auth, userController.getProfile);
router.put('/users/profile', auth, userController.updateProfile);
router.post('/users/addresses', auth, userController.addAddress);
router.get('/users', userController.getUsers);

// Route de test
router.get('/test', (req, res) => {
  res.json({ message: 'API Kadidjath fonctionne!', timestamp: new Date() });
});

module.exports = router;

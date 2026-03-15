const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Routes publiques
router.post('/', orderController.createOrder);
router.get('/:id', orderController.getOrderById);

// Routes admin (à protéger avec middleware d'authentification)
router.get('/', orderController.getOrders);
router.put('/:id/status', orderController.updateOrderStatus);
router.put('/:id/cancel', orderController.cancelOrder);
router.put('/:id/payment', orderController.confirmPayment);

module.exports = router;

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');

// Routes publiques
router.post('/register', userController.register);
router.post('/login', userController.login);

// Routes protégées
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.post('/addresses', auth, userController.addAddress);

// Routes admin
router.get('/', userController.getUsers);

module.exports = router;

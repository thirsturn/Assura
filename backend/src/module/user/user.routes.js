const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { verifyToken } = require('../../middleware/auth.middleware');

router.post('/create', userController.createUser);
router.get('/', userController.getAllUsers);

// Get current user profile
router.get('/profile', verifyToken, userController.getCurrentUser);

// Update current user profile
router.put('/profile', verifyToken, userController.updateProfile);

module.exports = router;
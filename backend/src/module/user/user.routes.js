const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { verifyToken } = require('../../middleware/auth.middleware');

router.post('/create', verifyToken, userController.createUser);
router.get('/', verifyToken, userController.getAllUsers);

// Get current user profile
router.get('/profile', verifyToken, userController.getCurrentUser);

// Update current user profile
router.put('/profile', verifyToken, userController.updateProfile);

// Update user by ID (Admin)
router.put('/:id', verifyToken, userController.updateUser);

// Search users
router.get('/search', verifyToken, userController.searchUsers);

module.exports = router;
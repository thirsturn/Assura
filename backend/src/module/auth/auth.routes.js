const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { verifyToken } = require('../../middleware/auth.middleware');

console.log("authController exports:", Object.keys(authController));

router.post('/login', authController.login);

// Only add routes if functions exist
if (authController.verify) {
    router.get('/verify', verifyToken, authController.verify);
}

if (authController.refreshToken) {
    router.post('/refresh', authController.refreshToken);
}

module.exports = router;

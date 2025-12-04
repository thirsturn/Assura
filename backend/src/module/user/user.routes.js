const express = require('express');
const router = express.Router();
const userController = require('./user.controller');

router.post('/create', userController.createUser);
router.get('/', userController.getAllUsers);

module.exports = router;
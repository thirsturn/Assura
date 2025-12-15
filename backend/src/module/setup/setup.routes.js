const express = require('express');
const router = express.Router();
const setupController = require('./setup.controller');

// WARNING: Remove or protect this route in production!
router.post('/seed', setupController.seedDatabase);

module.exports = router;
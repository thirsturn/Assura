const express = require('express');
const router = express.Router();
const lookupController = require('../controllers/lookup.controller');

// GET routes
router.get('/products', lookupController.getProducts);
router.get('/statuses', lookupController.getStatuses);
router.get('/locations', lookupController.getLocations);
router.get('/departments', lookupController.getDepartments);
router.get('/suppliers', lookupController.getSuppliers);

// POST routes
router.post('/products', lookupController.createProduct);
router.post('/statuses', lookupController.createStatus);
router.post('/locations', lookupController.createLocation);
router.post('/departments', lookupController.createDepartment);
router.post('/suppliers', lookupController.createSupplier);

module.exports = router;
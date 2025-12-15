const Lookup = require('./lookup.model');

exports.getProducts = async (req, res) => {
  try {
    const products = await Lookup.getProducts();
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStatuses = async (req, res) => {
  try {
    const statuses = await Lookup.getStatuses();
    res.json({ success: true, data: statuses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLocations = async (req, res) => {
  try {
    const locations = await Lookup.getLocations();
    res.json({ success: true, data: locations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDepartments = async (req, res) => {
  try {
    const departments = await Lookup.getDepartments();
    res.json({ success: true, data: departments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await Lookup.getSuppliers();
    res.json({ success: true, data: suppliers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create methods
exports.createProduct = async (req, res) => {
  try {
    const id = await Lookup.createProduct(req.body);
    res.status(201).json({ success: true, data: { id, ...req.body } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createStatus = async (req, res) => {
  try {
    const id = await Lookup.createStatus(req.body);
    res.status(201).json({ success: true, data: { id, ...req.body } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createLocation = async (req, res) => {
  try {
    const id = await Lookup.createLocation(req.body);
    res.status(201).json({ success: true, data: { id, ...req.body } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createDepartment = async (req, res) => {
  try {
    const id = await Lookup.createDepartment(req.body);
    res.status(201).json({ success: true, data: { id, ...req.body } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createSupplier = async (req, res) => {
  try {
    const id = await Lookup.createSupplier(req.body);
    res.status(201).json({ success: true, data: { id, ...req.body } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
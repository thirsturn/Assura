const pool = require('../../../config/db.config');

class Lookup {
  static async getProducts() {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY name');
    return rows;
  }

  static async getStatuses() {
    const [rows] = await pool.query('SELECT * FROM statuses ORDER BY name');
    return rows;
  }

  static async getLocations() {
    const [rows] = await pool.query('SELECT * FROM locations ORDER BY name');
    return rows;
  }

  static async getDepartments() {
    const [rows] = await pool.query('SELECT * FROM departments ORDER BY name');
    return rows;
  }

  static async getSuppliers() {
    const [rows] = await pool.query('SELECT * FROM suppliers ORDER BY name');
    return rows;
  }

  // Create methods
  static async createProduct(data) {
    const [result] = await pool.query('INSERT INTO products (name, description, manufacturer) VALUES (?, ?, ?)',
      [data.name, data.description, data.manufacturer]);
    return result.insertId;
  }

  static async createStatus(data) {
    const [result] = await pool.query('INSERT INTO statuses (name, color) VALUES (?, ?)',
      [data.name, data.color]);
    return result.insertId;
  }

  static async createLocation(data) {
    const [result] = await pool.query('INSERT INTO locations (name, address, city, country) VALUES (?, ?, ?, ?)',
      [data.name, data.address, data.city, data.country]);
    return result.insertId;
  }

  static async createDepartment(data) {
    const [result] = await pool.query('INSERT INTO departments (name, description) VALUES (?, ?)',
      [data.name, data.description]);
    return result.insertId;
  }

  static async createSupplier(data) {
    const [result] = await pool.query('INSERT INTO suppliers (name, contact_person, email, phone, address) VALUES (?, ?, ?, ?, ?)',
      [data.name, data.contact_person, data.email, data.phone, data.address]);
    return result.insertId;
  }
}

module.exports = Lookup;
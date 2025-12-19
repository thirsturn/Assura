const pool = require('../../../config/db.config');

class Asset {
  static async create(assetData) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        `INSERT INTO assets 
        (asset_id, asset_name, serial_number, product_id, status_id,
         purchase_cost, currency, warranty_expiration_date, order_number, 
         schedule_audit, notes, image_path, qr_code_path) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          assetData.asset_id,
          assetData.asset_name || null,
          assetData.serial_number || null,
          assetData.product_id || null,
          assetData.status_id || null,
          assetData.division_id || null,
          assetData.supplier_id || null,
          assetData.purchase_date || null,
          assetData.purchase_cost || null,
          assetData.currency || 'USD',
          assetData.warranty_expiration_date || null,
          assetData.order_number || null,
          assetData.schedule_audit || null,
          assetData.notes || null,
          assetData.image_path || null,
          assetData.qr_code_path || null
        ]
      );
      return result.insertId;
    } finally {
      connection.release();
    }
  }

  static async findAll(filters = {}) {
    let query = `
      SELECT a.*, 
             p.name as product_name,
             s.name as status_name, s.color as status_color,
             d.divisionName as division_name,
             sup.name as supplier_name
      FROM assets a
      LEFT JOIN products p ON a.product_id = p.id
      LEFT JOIN statuses s ON a.status_id = s.id
      LEFT JOIN division d ON a.division_id = d.divisionID
      LEFT JOIN suppliers sup ON a.supplier_id = sup.id
      WHERE 1=1
    `;

    const params = [];

    if (filters.status_id) {
      query += ' AND a.status_id = ?';
      params.push(filters.status_id);
    }

    if (filters.search) {
      query += ' AND (a.asset_id LIKE ? OR a.asset_name LIKE ? OR a.serial_number LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY a.created_at DESC';

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT a.*, 
              p.name as product_name, p.manufacturer,
              s.name as status_name, s.color as status_color,
              l.name as location_name, l.address as location_address,
              d.divisionName as division_name,
              sup.name as supplier_name, sup.contact_person, sup.email as supplier_email
       FROM assets a
       LEFT JOIN products p ON a.product_id = p.id
       LEFT JOIN statuses s ON a.status_id = s.id
       LEFT JOIN division d ON a.division_id = d.divisionID
       LEFT JOIN suppliers sup ON a.supplier_id = sup.id
       WHERE a.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async update(id, assetData) {
    const fields = [];
    const values = [];

    Object.keys(assetData).forEach(key => {
      if (assetData[key] !== undefined && key !== 'id') {
        fields.push(`${key} = ?`);
        values.push(assetData[key]);
      }
    });

    if (fields.length === 0) return false;

    values.push(id);
    const query = `UPDATE assets SET ${fields.join(', ')} WHERE id = ?`;

    const [result] = await pool.query(query, values);
    return result.affectedRows > 0;
  }

  static async updateQRPath(id, qrPath) {
    const [result] = await pool.query(
      'UPDATE assets SET qr_code_path = ? WHERE id = ?',
      [qrPath, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM assets WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async getStats() {
    const [stats] = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN s.name = 'Ready to Deploy' THEN 1 ELSE 0 END) as available,
        SUM(CASE WHEN s.name = 'Deployed' THEN 1 ELSE 0 END) as deployed
      FROM assets a
      LEFT JOIN statuses s ON a.status_id = s.id
    `);
    return stats[0];
  }
}

module.exports = Asset;
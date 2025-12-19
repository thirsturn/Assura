const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '91967910',
    database: process.env.DB_NAME || 'assuradb_fams',
    multipleStatements: true
};

async function fixDb() {
    let connection;
    try {
        console.log('Connecting to database:', dbConfig.database);
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected!');

        // Check if division table exists
        const [tables] = await connection.query("SHOW TABLES LIKE 'division'");
        if (tables.length === 0) {
            console.error('CRITICAL ERROR: "division" table does not exist! Cannot create assets table.');
            // Try to read and run user_scema.sql ONLY for division? 
            // Or just fail and let us know.
            return;
        } else {
            console.log('"division" table exists.');
        }

        console.log('Reading assets schema file...');
        const assetsSchemaPath = path.join(__dirname, 'database', 'assets_schema.sql');
        const assetsSchemaSql = await fs.readFile(assetsSchemaPath, 'utf8');

        console.log('Recreating assets table...');
        await connection.query('DROP TABLE IF EXISTS assets');
        await connection.query(assetsSchemaSql);

        console.log('Assets table recreated successfully!');

        // Verify assets table
        const [assetsTable] = await connection.query("SHOW TABLES LIKE 'assets'");
        if (assetsTable.length > 0) {
            console.log('VERIFICATION SUCCESS: "assets" table found in database.');
            const [columns] = await connection.query("SHOW COLUMNS FROM assets");
            console.log('Assets table columns:', columns.map(c => c.Field).join(', '));
        } else {
            console.error('VERIFICATION FAILED: "assets" table was NOT found after creation attempt.');
        }

    } catch (error) {
        console.error('Database fix failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

fixDb();

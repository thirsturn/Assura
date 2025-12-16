const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '91967910',
    database: process.env.DB_NAME || 'assuradb_fams'
};

async function cleanupDivisions() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected!');

        console.log('Deleting unwanted divisions...');
        const [result] = await connection.query(
            "DELETE FROM division WHERE divisionName IN ('IT', 'HR', 'Finance', 'Operations', 'Sales', 'Marketing')"
        );

        console.log(`Deleted ${result.affectedRows} rows.`);

    } catch (error) {
        console.error('Cleanup failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

cleanupDivisions();

const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '91967910',
    database: process.env.DB_NAME || 'assuradb_fams'
};

async function checkTables() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query('SHOW TABLES');
        console.log('Tables in database:');
        console.table(rows);
    } catch (error) {
        console.error('Error checking tables:', error);
    } finally {
        if (connection) await connection.end();
    }
}

checkTables();

const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '91967910',
    database: process.env.DB_NAME || 'assuradb_fams'
};

async function checkData() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        const tables = ['products', 'statuses', 'division', 'suppliers'];

        for (const table of tables) {
            const [rows] = await connection.query(`SELECT COUNT(*) as count FROM ${table}`);
            console.log(`Table '${table}' has ${rows[0].count} rows.`);
            if (rows[0].count > 0) {
                const [sample] = await connection.query(`SELECT * FROM ${table} LIMIT 1`);
                console.log(`Sample from '${table}':`, sample[0]);
            } else {
                console.log(`WARNING: Table '${table}' is EMPTY.`);
            }
        }

    } catch (error) {
        console.error('Error checking data:', error);
    } finally {
        if (connection) await connection.end();
    }
}

checkData();

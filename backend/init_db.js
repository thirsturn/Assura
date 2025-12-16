const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '91967910',
    database: process.env.DB_NAME || 'assuradb_fams',
    multipleStatements: true // Enable multiple statements for running the schema file
};

async function initDb() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected!');

        console.log('Reading schema files...');
        const userSchemaPath = path.join(__dirname, 'database', 'user_scema.sql');
        const assetsSchemaPath = path.join(__dirname, 'database', 'assets_schema.sql');

        const userSchemaSql = await fs.readFile(userSchemaPath, 'utf8');
        const assetsSchemaSql = await fs.readFile(assetsSchemaPath, 'utf8');

        console.log('Cleaning up obsolete tables...');
        await connection.query('DROP TABLE IF EXISTS assets'); // Drop assets to ensure correct FK recreation
        await connection.query('DROP TABLE IF EXISTS divisions');
        await connection.query('DROP TABLE IF EXISTS departments');

        console.log('Executing user schema script...');
        await connection.query(userSchemaSql);

        console.log('Executing assets schema script...');
        await connection.query(assetsSchemaSql);

        console.log('Database initialized successfully!');

    } catch (error) {
        console.error('Database initialization failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

initDb();

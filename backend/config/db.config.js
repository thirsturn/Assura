const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool(
    {
        host:process.env.DB_HOST || 'localhost',
        user:process.env.DB_USER || 'root',
        password:process.env.DB_PASSWORD || '91967910',
        database:process.env.DB_NAME || 'assuradb_fams',
        queueLimit: 0,
        waitForConnections:true,
        connectionLimit:10
    }
);

// test the connection
(async () => {
    try{
        const connection = await pool.getConnection();
        console.log("Database connected successfully");
        connection.release();
    }catch(err){
        console.error("Database connection failed:", err);
    }
}) ();

module.exports = pool;
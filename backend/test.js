const pool = require('./src/config/database');

pool.getConnection()
  .then(conn => {
    console.log('✅ Connected to DB via test script');
    conn.release();
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ DB connection failed in test script:', err.message);
    process.exit(1);
  });

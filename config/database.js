const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test connection on startup
pool.query('SELECT NOW()')
  .then(result => {
    console.log('✅ Successfully connected to Supabase PostgreSQL database!');
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
  });

module.exports = pool;
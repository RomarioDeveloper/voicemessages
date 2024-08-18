const { Pool } = require('pg');

// Конфигурация базы данных PostgreSQL
const pool = new Pool({
  user: 'your-username',
  host: 'localhost',
  database: 'voicechat',
  password: 'your-password',
  port: 5432,
});

module.exports = pool;

const { Pool } = require('pg');

const db = new Pool({
	host: 'localhost',
	user: 'postgres',
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	port: process.env.DB_PORT,
});

console.log('PostgreSQL is connected...');

module.exports = { db };

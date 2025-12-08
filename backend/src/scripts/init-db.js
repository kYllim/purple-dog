const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables if .env exists (mainly for local dev outside docker)
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Use connection string from env or default
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/purple_dog';

const pool = new Pool({
    connectionString,
});

async function initDb() {
    const client = await pool.connect();
    try {
        console.log('Connecting to database...');

        // Read SQL file
        const sqlPath = path.join(__dirname, '../db/init.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Executing initialization script...');
        await client.query(sql);

        console.log('Database initialized successfully!');
    } catch (err) {
        console.error('Error initializing database:', err);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

initDb();

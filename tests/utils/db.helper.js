const mysql = require('mysql2/promise');
require('dotenv').config();
require('../test.config');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 0
});

// Clean test database tables before tests
async function resetDatabase() {
    const connection = await pool.getConnection();
    try {
        await connection.query('TRUNCATE TABLE notes');
        console.log('Test database reset completed');
    } catch (err) {
        console.error('Error resetting test database:', err);
        throw err;
    } finally {
        connection.release();
    }
}

// Insert test data
async function seedTestData() {
    const connection = await pool.getConnection();
    try {
        await connection.query(
            'INSERT INTO notes (filename, markdown_content) VALUES (?, ?)',
            ['test-note.md', '# Test Note\n\nThis is a test note.']
        );
        console.log('Test data seeded');
    } catch (err) {
        console.error('Error seeding test data:', err);
        throw err;
    } finally {
        connection.release();
    }
}

module.exports = {
    pool,
    resetDatabase,
    seedTestData
};

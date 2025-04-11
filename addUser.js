const bcrypt = require('bcrypt');
const { Pool } = require('pg');

// PostgreSQL setup
const pool = new Pool({
    user: 'postgres',            // Your PostgreSQL username
    host: 'localhost',           // Host, usually localhost
    database: 'website-login',   // Your database name (replace with your actual database)
    password: '123456',          // Your PostgreSQL password
    port: 5432,                  // Default PostgreSQL port
});

async function addUser(userId, password) {
    try {
        // Generate a hashed password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the user into the Users table
        const result = await pool.query(
            'INSERT INTO Users (user_id, password_ha) VALUES ($1, $2) RETURNING *',
            [userId, hashedPassword]
        );

        console.log(`User added:`, result.rows[0]);
    } catch (err) {
        console.error('Error inserting user:', err);
    } finally {
        pool.end();
    }
}

// Replace 'testuser' and 'testpassword' with the desired user ID and password
addUser('testuser', 'testpassword');

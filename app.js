const express = require('express');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const cors = require('cors');

// Create Express app
const app = express();
app.use(express.json()); // For parsing JSON requests
app.use(cors()); // Enable CORS for frontend-backend communication

// Set up PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'website-login',
  password: '123456',
  port: 5432,
});

// Login route to check user credentials
app.post('/login', async (req, res) => {
    const { user_id, password } = req.body;

    try {
      const result = await pool.query('SELECT * FROM "Users" WHERE user_id = $1', [user_id]);
      const user = result.rows[0];

      if (!user) {
        console.log('User not found');
        return res.status(400).json({ message: 'User not found' });
      }

      // Check if password matches using bcrypt
      const match = await bcrypt.compare(password, user.password_hash);

      if (match) {
        console.log('Login successful');
        return res.status(200).json({ redirectUrl: 'http://127.0.0.1:5501/index.html' });
      } else {
        console.log('Incorrect password');
        return res.status(400).json({ message: 'Incorrect password' });
      }
    } catch (err) {
      console.error('Error during login:', err);
      res.status(500).json({ message: 'Server error during login' });
    }
  });

// Start the Express server
app.listen(5501, () => {
  console.log('Server is running on port 5501');
});

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const authRoutes = require('./routes/authRoutes');
const objetRoutes = require('./routes/objetRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/api', objetRoutes);
// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Health check
app.get('/health', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ status: 'ok', time: result.rows[0].now });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

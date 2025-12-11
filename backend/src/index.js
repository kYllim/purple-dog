const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const objectsRoutes = require('./routes/objectsRoutes');
const objetsRoutes = require('./routes/objetsRoutes');
const { startCronJobs } = require('./services/cronService');
const sseService = require('./services/sseService');


const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/events', sseService.subscribe);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/objects', objectsRoutes);
app.use('/objets', objetsRoutes);


// Database connection
const pool = require('./db/index');

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
    startCronJobs();
});
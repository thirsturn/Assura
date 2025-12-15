const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/module/auth/auth.routes');
const userRoutes = require('./src/module/user/user.routes');
const setupRoutes = require('./src/module/setup/setup.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/setup', setupRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
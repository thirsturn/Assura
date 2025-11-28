const express = require('express');
const cors = require('cors');

require('dotenv').config();

// import database configuration
const authRoutes = require('./src/module/auth/auth.routes');
// const userRoutes = require('./src/module/user/user.routes');

const app = express();
const port = process.env.PORT || 3000;

// MIddlewares
// enable CORS
app.use(cors());

// parse JSON requests
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Assura is running...');
});

// start server
app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
})
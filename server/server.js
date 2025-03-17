const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: './.env' });

const app = express();
const PORT = process.env.PORT || 3000;

//server_functions
const { handleRegisterRequest, handleLoginRequest, verifyPassword, profileSelection } = require('../server/server_functions');

// Enable CORS for all routes
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Create a connection pool
global.pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT || 3306 // Default MySQL port
});

console.log(process.env.PASSWORD)

app.post('/register', async (req, res) => {
    const [result, message] = await handleRegisterRequest(req.body.username, req.body.email, req.body.password);
    return res.json({ success: result, message: message });
});

app.post('/login', async (req, res) => {
    const [result, message] = await handleLoginRequest(req.body.identifier, req.body.password);
    return res.json({ success: result, message: message });
});

// Define endpoint to return a JSON object
app.post('/profile', async (req, res) => {
    const [result, message] = await profileSelection(req.body.username);
    return res.json({ success: result, message: message });
});

//Always make put this at bottom
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

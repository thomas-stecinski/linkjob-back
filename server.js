const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const router = require('./routes/router'); 
const cookieParser = require('cookie-parser');

dotenv.config();

// Configure CORS
app.use(cors({
    origin: 'http://localhost:3000', // URL de votre frontend
    credentials: true, // Permet l'envoi des cookies
}));

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api', router);

// Database Connection
mongoose
    .connect(process.env.DB_URL)
    .then(() => {
        console.log('Connection has been established successfully');
    })
    .catch((error) => {
        console.error('Unable to connect to the database: ', error);
    });

// Start the server
app.listen(8000, () => {
    console.log('Server is running on port 8000');
});

const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const router = require('./routes/router'); 
const cookieParser = require('cookie-parser');
const session = require('express-session'); // Importer express-session
const MongoStore = require('connect-mongo'); // Importer connect-mongo

dotenv.config();

// Configure CORS
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? [process.env.FRONTEND_URL, 'http://localhost:3000']
        : 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware de session
app.use(session({
    secret: process.env.JWT_SECRET, // Utilise le même secret que pour les JWT
    resave: false, // Ne resauvegarde pas la session si elle n'a pas été modifiée
    saveUninitialized: false, // Ne sauvegarde pas les sessions non initialisées
    store: MongoStore.create({
        mongoUrl: process.env.DB_URL, // URL de votre base de données MongoDB
        collectionName: 'sessions', // Nom de la collection pour stocker les sessions
    }),
    cookie: {
        maxAge: 1000 * 60 * 60, // Expiration des cookies (1 heure)
        httpOnly: true, // Empêche l'accès côté client
        secure: process.env.NODE_ENV === 'production', // Active le mode sécurisé en production
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
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

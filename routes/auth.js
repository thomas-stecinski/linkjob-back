const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
    // Logique d'inscription
    res.send('User registered');
});

router.post('/login', (req, res) => {
    // Logique de connexion
    res.send('User logged in');
});

module.exports = router;

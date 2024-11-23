const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authmiddleware');

router.post('/add-recommendation', authMiddleware, (req, res) => {
    // Logique pour ajouter une recommandation
    res.send('Recommendation added');
});

router.delete('/delete-recommendation', authMiddleware, (req, res) => {
    // Logique pour supprimer une recommandation
    res.send('Recommendation deleted');
});

module.exports = router;

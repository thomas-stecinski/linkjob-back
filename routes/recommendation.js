const express = require('express');
const router = express.Router();

router.post('/add-recommendation', (req, res) => {
    // Logique pour ajouter une recommandation
    res.send('Recommendation added');
});

router.delete('/delete-recommendation', (req, res) => {
    // Logique pour supprimer une recommandation
    res.send('Recommendation deleted');
});

module.exports = router;

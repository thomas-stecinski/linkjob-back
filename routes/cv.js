const express = require('express');
const router = express.Router();

router.post('/create-cv', (req, res) => {
    // Logique pour créer un CV
    res.send('CV created');
});

router.put('/update-cv', (req, res) => {
    // Logique pour mettre à jour un CV
    res.send('CV updated');
});

router.delete('/delete-cv', (req, res) => {
    // Logique pour supprimer un CV
    res.send('CV deleted');
});

router.get('/get-cv', (req, res) => {
    // Logique pour récupérer tous les CV
    res.send('List of CVs');
});

router.get('/get-cv/:iduser', (req, res) => {
    const userId = req.params.iduser;
    // Logique pour récupérer le CV d’un utilisateur spécifique
    res.send(`CV of user ${userId}`);
});

module.exports = router;

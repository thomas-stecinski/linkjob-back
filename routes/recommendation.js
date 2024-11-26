const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authmiddleware');
const {
  getRecommendations,
  addRecommendation,
  deleteRecommendation, // Ajoutez cette ligne pour inclure la fonction delete
} = require('../controllers/recommendation');

// Route pour récupérer les recommandations
router.get('/:cvid/recommendations', authMiddleware, getRecommendations);

// Route pour ajouter une recommandation
router.post('/add-recommendation', authMiddleware, addRecommendation);

// Route pour supprimer une recommandation
router.delete('/delete/:id', authMiddleware, deleteRecommendation);


module.exports = router;

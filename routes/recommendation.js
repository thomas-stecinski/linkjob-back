const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authmiddleware');
const {
  getRecommendations,
  addRecommendation,
  deleteRecommendation,
  editRecommendation, // Ajout de la fonction d'édition
} = require('../controllers/recommendation');

// Route pour récupérer les recommandations
router.get('/:cvid/recommendations', authMiddleware, getRecommendations);

// Route pour ajouter une recommandation
router.post('/add-recommendation', authMiddleware, addRecommendation);

// Route pour supprimer une recommandation
router.delete('/delete/:id', authMiddleware, deleteRecommendation);

// Route pour modifier une recommandation
router.put('/edit/:id', authMiddleware, editRecommendation);

module.exports = router;

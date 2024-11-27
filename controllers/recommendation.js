const Recommendation = require('../models/recommendation');
const { v4: uuidv4 } = require('uuid');

exports.addRecommendation = async (req, res) => {
    const { cvid, text } = req.body;

    if (!cvid || !text) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    const commentatorid = req.user?.userid; // Utilisateur connecté
    const userID = req.user?.userid; // Stockez l'ID utilisateur

    if (!userID) {
        return res.status(403).json({ message: 'Utilisateur non authentifié.' });
    }

    try {
        const statusid = process.env.STATUS_PUBLIC_ID; // Statut "Public"

        // Créer la recommandation
        const recommendation = await Recommendation.create({
            commentatorid,
            userID, // Stockez l'utilisateur
            cvid,
            text,
            statusid,
        });

        // Populer les informations utilisateur (firstname, lastname)
        const populatedRecommendation = await recommendation.populate('userID', 'firstname lastname email');

        res.status(201).json({ success: true, recommendation: populatedRecommendation });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la recommandation :', error);
        res.status(500).json({ message: 'Erreur interne.' });
    }
};



exports.deleteRecommendation = async (req, res) => {
    const { id } = req.params;

    try {
        const recommendation = await Recommendation.findById(id);

        if (!recommendation) {
            return res.status(404).json({ success: false, message: 'Recommandation introuvable.' });
        }

        if (recommendation.userID.toString() !== req.user.userid) {
            return res.status(403).json({ success: false, message: 'Vous n\'êtes pas autorisé à supprimer cette recommandation.' });
        }

        await Recommendation.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Recommandation supprimée avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la recommandation :', error);
        res.status(500).json({ success: false, message: 'Erreur interne.' });
    }
};

exports.getRecommendations = async (req, res) => {
    const { cvid } = req.params;

    try {
        const recommendations = await Recommendation.find({ cvid })
            .populate('userID', 'firstname lastname email') // Charger les informations utilisateur depuis userID
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, recommendations });
    } catch (error) {
        console.error('Erreur lors de la récupération des recommandations :', error);
        res.status(500).json({ message: 'Erreur interne.' });
    }
};





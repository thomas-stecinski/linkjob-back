const Recommendation = require('../models/recommendation'); // Modèle Recommendation
const mongoose = require('mongoose'); // Nécessaire pour manipuler ObjectId

exports.deleteRecommendation = async (req, res) => {
    const { id } = req.params; // ID de la recommandation

    try {
        // Vérifiez que l'ID de la recommandation est valide
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de recommandation invalide.',
            });
        }

        // Trouver et supprimer la recommandation
        const recommendation = await Recommendation.findByIdAndDelete(id);

        if (!recommendation) {
            return res.status(404).json({
                success: false,
                message: 'Recommandation introuvable.',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Recommandation supprimée avec succès.',
        });
    } catch (error) {
        console.error('Erreur lors de la suppression de la recommandation :', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur interne.',
        });
    }
};

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

exports.editRecommendation = async (req, res) => {
    const { id } = req.params; // ID de la recommandation
    const { text } = req.body; // Nouveau texte

    try {
        // Vérifiez que l'ID est valide
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de recommandation invalide.',
            });
        }

        // Trouver la recommandation par son ID
        const recommendation = await Recommendation.findById(id);

        if (!recommendation) {
            return res.status(404).json({
                success: false,
                message: 'Recommandation introuvable.',
            });
        }

        // Mettre à jour le texte de la recommandation
        recommendation.text = text;
        await recommendation.save();

        return res.status(200).json({
            success: true,
            message: 'Recommandation mise à jour avec succès.',
            recommendation,
        });
    } catch (error) {
        console.error('Erreur lors de la modification de la recommandation :', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur interne.',
        });
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
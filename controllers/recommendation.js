const Recommendation = require('../models/recommendation');
const { v4: uuidv4 } = require('uuid');

exports.addRecommendation = async (req, res) => {
    const { cvid, text } = req.body;
    const commentatorid = req.user?.userid || uuidv4();
    const firstname = req.user?.firstname || "Anonyme";
    const lastname = req.user?.lastname || "";

    if (!commentatorid || !cvid || !text) {
        return res.status(400).json({ success: false, message: "Tous les champs sont requis." });
    }

    try {
        const statusid = process.env.STATUS_PUBLIC_ID; // Exemple : statut "Public"
        const recommendation = await Recommendation.create({
            commentatorid,
            firstname,
            lastname,
            cvid,
            authorid: req.user?.userid || commentatorid,
            text,
            statusid,
        });

        res.status(201).json({ success: true, recommendation });
    } catch (error) {
        console.error("Erreur lors de l'ajout de la recommandation :", error);
        res.status(500).json({ success: false, message: "Erreur interne." });
    }
};

exports.deleteRecommendation = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Vérifiez que la recommandation existe
      const recommendation = await Recommendation.findById(id);
      if (!recommendation) {
        return res.status(404).json({ success: false, message: "Recommandation introuvable." });
      }
  
      // Vérifiez l'autorisation (l'utilisateur doit être l'auteur)
      if (recommendation.commentatorid.toString() !== req.user.userid) {
        return res.status(403).json({ success: false, message: "Vous n'êtes pas autorisé à supprimer cette recommandation." });
      }
  
      // Supprimez la recommandation
      await Recommendation.findByIdAndDelete(id);
      res.status(200).json({ success: true, message: "Recommandation supprimée avec succès." });
    } catch (error) {
      console.error("Erreur lors de la suppression de la recommandation :", error);
      res.status(500).json({ success: false, message: "Erreur interne." });
    }
  };
  
  
  

exports.getRecommendations = async (req, res) => {
    const { cvid } = req.params;

    try {
        const recommendations = await Recommendation.find({ cvid })
            .populate('commentatorid', 'name') // Récupère les infos du commentateur
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, recommendations });
    } catch (error) {
        console.error('Erreur lors de la récupération des recommandations :', error);
        res.status(500).json({ success: false, message: 'Erreur interne.' });
    }
};

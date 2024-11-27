const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentification requise.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Décodage du token
        req.user = decoded; // Ajout des données utilisateur à req.user
        next();
    } catch (error) {
        console.error('Erreur JWT :', error.message);
        return res.status(403).json({ message: 'Token invalide ou expiré.' });
    }
};

module.exports = authMiddleware;

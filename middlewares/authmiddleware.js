const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authentification requise.' });
        }

        const token = authHeader.split(' ')[1];
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        
        const userid = decoded._id || decoded.id || decoded.userid;
        
        if (!userid) {
            console.error('No user ID found in token:', decoded);
            return res.status(401).json({ message: 'Token invalide: ID utilisateur manquant.' });
        }

        if (!mongoose.Types.ObjectId.isValid(userid)) {
            console.error('Invalid ObjectId:', userid);
            return res.status(401).json({ message: 'Token invalide: ID utilisateur invalide.' });
        }

        req.user = decoded;
        
        if (['POST', 'PUT'].includes(req.method)) {
            req.body.userid = userid;
            console.log('Request method:', req.method);
            console.log('Setting userid in body to:', userid);
            console.log('Request body after setting userid:', req.body);
        }
        
        next();
    } catch (error) {
        console.error('Auth Error:', error.message);
        console.error('Full error:', error);
        return res.status(401).json({ message: 'Token invalide ou expiré.' });
    }
};

module.exports = authMiddleware;


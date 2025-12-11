const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

/**
 * Middleware pour vérifier le token JWT et authentifier l'utilisateur
 */
const authenticateToken = (req, res, next) => {
    // Récupérer le token depuis le header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ error: 'Token manquant. Authentification requise.' });
    }

    try {
        // Vérifier et décoder le token
        const decoded = jwt.verify(token, SECRET_KEY);
        
        // Ajouter les informations de l'utilisateur à la requête
        req.user = {
            id: decoded.id,
            role: decoded.role
        };
        
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expiré' });
        }
        return res.status(403).json({ error: 'Token invalide' });
    }
};

module.exports = { authenticateToken };

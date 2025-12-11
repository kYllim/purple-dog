const jwt = require('jsonwebtoken');

const CLE_SECRETE = process.env.JWT_SECRET || 'supersecretkey';

const authMiddleware = (req, res, next) => {
    try {
        const enteteAuth = req.headers.authorization;
        if (!enteteAuth) {
            return res.status(401).json({ erreur: 'Token manquant' });
        }

        const token = enteteAuth.split(' ')[1];
        if (!token) {
            return res.status(401).json({ erreur: 'Format du token invalide' });
        }

        const decode = jwt.verify(token, CLE_SECRETE);
        req.utilisateur = decode;

        next();
    } catch (erreur) {
        console.error('Erreur authentification:', erreur.message);
        return res.status(401).json({ erreur: 'Token invalide ou expiré' });
    }
};

module.exports = authMiddleware;

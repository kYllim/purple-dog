const jwt = require('jsonwebtoken');

const CLE_SECRETE = process.env.JWT_SECRET || 'supersecretkey';

const estAdmin = (req, res, next) => {
    try {
        const enteteAuth = req.headers.authorization;
        if (!enteteAuth) {
            return res.status(401).json({ erreur: 'Token manquant' });
        }

        const token = enteteAuth.split(' ')[1];
        const decode = jwt.verify(token, CLE_SECRETE);

        if (decode.role !== 'ADMIN') {
            return res.status(403).json({ erreur: 'Accès refusé. Réservé aux administrateurs.' });
        }

        req.utilisateur = decode;
        next();
    } catch (erreur) {
        return res.status(401).json({ erreur: 'Token invalide' });
    }
};

module.exports = estAdmin;
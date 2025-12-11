const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';



const authenticateToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 
    if (!token) {
        return res.status(401).json({ error: 'Token manquant. Authentification requise.' });
    }

    try {
    
        const decoded = jwt.verify(token, SECRET_KEY);
        
  
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


const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
   
        req.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = {
            id: decoded.id,
            role: decoded.role
        };
        next();
    } catch (error) {
  
        req.user = null;
        next();
    }
};

module.exports = { authenticateToken, optionalAuth };

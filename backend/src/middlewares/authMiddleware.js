const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ erreur: "Token manquant" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ erreur: "Token invalide" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Le controller attend req.utilisateur.id
    req.utilisateur = {
      id: decoded.id,
      role: decoded.role
    };

    next();

  } catch (error) {
    console.error("Erreur authMiddleware :", error);
    return res.status(401).json({ erreur: "Token invalide ou expiré" });
  }
};

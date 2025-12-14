const pool = require("../db/index");

const ajouterFavori = async (req, res) => {
    try {
        const { objetId } = req.body;
        const userId = req.user.id;

        if (!objetId) return res.status(400).json({ error: "L'ID de l'objet est requis" });

        await pool.query(
            `INSERT INTO favoris (utilisateur_id, objet_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [userId, objetId]
        );

        res.json({ message: "Ajouté aux favoris" });
    } catch (error) {
        console.error("Erreur ajout favori", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

const retirerFavori = async (req, res) => {
    try {
        const { objetId } = req.params;
        const userId = req.user.id;

        await pool.query(
            `DELETE FROM favoris WHERE utilisateur_id = $1 AND objet_id = $2`,
            [userId, objetId]
        );

        res.json({ message: "Retiré des favoris" });
    } catch (error) {
        console.error("Erreur retrait favori", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

const obtenirFavoris = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT o.*, 
              o.titre, o.photos_urls, o.prix_depart, o.prix_souhaite, o.prix_achat_immediat 
       FROM favoris f
       JOIN objets o ON f.objet_id = o.id
       WHERE f.utilisateur_id = $1
       ORDER BY f.cree_le DESC`,
            [userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Erreur récupération favoris", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

const estFavori = async (req, res) => {
    try {
        const { objetId } = req.params;
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT 1 FROM favoris WHERE utilisateur_id = $1 AND objet_id = $2`,
            [userId, objetId]
        );

        res.json({ isFavorite: result.rowCount > 0 });
    } catch (error) {
        console.error("Erreur check favori", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
}

module.exports = {
    ajouterFavori,
    retirerFavori,
    obtenirFavoris,
    estFavori
};

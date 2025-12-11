const pool = require("../db/index");

const listerTout = async (req, res) => {
    try {
        const requete = `
            SELECT o.id, o.titre, o.prix_souhaite, o.prix_depart, o.prix_achat_immediat, o.statut, o.photos_urls, o.cree_le,
                   u.email as vendeur_email,
                   c.nom as categorie_nom
            FROM objets o
            JOIN utilisateurs u ON o.vendeur_id = u.id
            LEFT JOIN categories c ON o.categorie_id = c.id
            ORDER BY o.cree_le DESC
        `;
        const resultat = await pool.query(requete);
        res.json(resultat.rows);
    } catch (erreur) {
        console.error(erreur);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

const supprimer = async (req, res) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;

        await client.query('BEGIN');

        const verifEnchere = await client.query('SELECT id FROM encheres WHERE objet_id = $1', [id]);
        if (verifEnchere.rows.length > 0) {
            const verifOffres = await client.query('SELECT count(*) FROM encheres_offres WHERE enchere_id = $1', [verifEnchere.rows[0].id]);
            if (parseInt(verifOffres.rows[0].count) > 0) {
                await client.query('ROLLBACK');
                return res.status(400).json({ error: "Impossible de supprimer un objet avec des enchères actives. Admin: veuillez annuler les enchères manuellement d'abord (non implémenté)." });
            }
        }

        await client.query('DELETE FROM objets WHERE id = $1', [id]);

        await client.query('COMMIT');
        res.json({ message: "Objet supprimé par l'administrateur" });

    } catch (erreur) {
        await client.query('ROLLBACK');
        console.error(erreur);
        res.status(500).json({ error: "Erreur serveur" });
    } finally {
        client.release();
    }
};

module.exports = {
    listerTout,
    supprimer
};

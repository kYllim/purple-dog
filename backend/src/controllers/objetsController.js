const pool = require("../db/index");

const getCategories = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, nom FROM categories");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const getUserObjects = async (req, res) => {
  try {
    let userId = req.params.userId;

    // Fix pour le dev: si userId vaut "1" (mock frontend), on prend le vrai UUID en base
    if (userId === '1') {
      const userRes = await pool.query('SELECT id FROM UTILISATEURS LIMIT 1');
      if (userRes.rowCount > 0) {
        userId = userRes.rows[0].id;
      }
    }

    const result = await pool.query(
      "SELECT * FROM objets WHERE vendeur_id = $1 ORDER BY cree_le DESC",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const createObjet = async (req, res) => {
  try {
    const {
      titre,
      description,
      categorie_id,
      dimensions,
      poids_kg,
      photos_urls,
      documents_urls,
      type_vente,
      prix_souhaite,
      prix_depart,
      prix_achat_immediat,
      vendeur_id
    } = req.body;

    let finalVendeurId = vendeur_id;

    if (!finalVendeurId || finalVendeurId === 1 || finalVendeurId === '1') {
      // Fallback: Récupérer le premier utilisateur trouvé (pour le dev)
      const userRes = await pool.query('SELECT id FROM UTILISATEURS LIMIT 1');
      if (userRes.rowCount > 0) {
        finalVendeurId = userRes.rows[0].id;
      } else {
        throw new Error("Aucun utilisateur trouvé pour vendeur_id");
      }
    }

    const result = await pool.query(
      `INSERT INTO objets(
        vendeur_id,
        categorie_id,
        titre,
        description,
        dimensions,
        poids_kg,
        photos_urls,
        documents_urls,
        type_vente,
        prix_souhaite,
        prix_depart,
        prix_achat_immediat,
        statut,
        cree_le,
        mis_a_jour_le
      ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'BROUILLON', NOW(), NOW())
      RETURNING *`,
      [
        finalVendeurId,
        categorie_id,
        titre,
        description,
        dimensions,
        poids_kg === "" ? null : poids_kg,
        photos_urls,
        documents_urls,
        type_vente,
        prix_souhaite === "" ? null : prix_souhaite,
        prix_depart === "" ? null : prix_depart,
        prix_achat_immediat === "" ? null : prix_achat_immediat
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

module.exports = {
  getCategories,
  createObjet,
  getUserObjects
};

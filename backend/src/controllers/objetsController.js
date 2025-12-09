import pool from "../db/index.js";

export const getCategories = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, nom FROM categories");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const createObjet = async (req, res) => {
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
      prix_achat_immediat
    } = req.body;

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
        1, // pour l'instant on met un id de particulier mocké
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
        prix_achat_immediat
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

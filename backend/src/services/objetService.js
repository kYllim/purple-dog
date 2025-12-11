const { Pool } = require("pg");
const pool = require('../db/db');

exports.creerObjet = async (data, userId) => {
    const {
        titre, description, categorie_id, type_vente,
        prix_souhaite, prix_depart, prix_reserve, prix_achat_immediat,
        vente_rapide_active, dimensions, poids_kg,
        photos_urls, documents_urls
    } = data;

    const result = await pool.query(
        `INSERT INTO OBJETS (
            vendeur_id, titre, description, categorie_id, type_vente,
            prix_souhaite, prix_depart, prix_reserve, prix_achat_immediat,
            vente_rapide_active, dimensions, poids_kg, photos_urls, documents_urls
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
        RETURNING *`,
        [
            userId, titre, description, categorie_id, type_vente,
            prix_souhaite || null, prix_depart || null, prix_reserve || null, prix_achat_immediat || null,
            vente_rapide_active || false, dimensions || null, poids_kg || null,
            photos_urls || [], documents_urls || []
        ]
    );

    return result.rows[0];
};

exports.supprimerObjet = async (id, userId) => {
    const res = await pool.query(
        "DELETE FROM OBJETS WHERE id = $1 AND vendeur_id = $2 RETURNING id",
        [id, userId]
    );
    return res.rows.length > 0;
};

exports.listerObjets = async (filters = {}) => {
    let query = `SELECT * FROM OBJETS WHERE 1=1`;
    const params = [];

    if (filters.categorie_id) {
        params.push(filters.categorie_id);
        query += ` AND categorie_id = $${params.length}`;
    }
    if (filters.type_vente) {
        params.push(filters.type_vente);
        query += ` AND type_vente = $${params.length}`;
    }
    if (filters.query) {
        params.push(`%${filters.query}%`);
        query += ` AND titre ILIKE $${params.length}`;
    }

    const res = await pool.query(query, params);
    return res.rows;
};

exports.getObjet = async (id) => {
    const res = await pool.query("SELECT * FROM OBJETS WHERE id = $1", [id]);
    return res.rows[0];
};

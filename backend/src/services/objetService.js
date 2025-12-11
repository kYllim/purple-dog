const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

exports.creerObjet = async (data, userId) => {
    const {
        titre, description, categorie, type_vente,
        prix_souhaite, prix_depart, prix_achat_immediat,
        photos, documents
    } = data;

    const result = await pool.query(
        `INSERT INTO OBJETS (
            utilisateur_id, titre, description, categorie, type_vente,
            prix_souhaite, prix_depart, prix_achat_immediat,
            photos, documents
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING *`,
        [
            userId, titre, description, categorie, type_vente,
            prix_souhaite, prix_depart, prix_achat_immediat,
            photos || null, documents || null
        ]
    );

    return result.rows[0];
};

exports.listerObjets = async (filters = {}) => {
    let query = `SELECT * FROM OBJETS WHERE 1=1`;
    const params = [];

    if (filters.categorie) {
        params.push(filters.categorie);
        query += ` AND categorie = $${params.length}`;
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

exports.supprimerObjet = async (id, userId) => {
    const res = await pool.query(
        "DELETE FROM OBJETS WHERE id = $1 AND utilisateur_id = $2 RETURNING id",
        [id, userId]
    );
    return res.rows.length > 0;
};

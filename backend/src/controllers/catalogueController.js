const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Récupérer tous les objets en vente avec les informations des favoris
exports.getObjets = async (req, res) => {
    try {
        const { utilisateur_id } = req.query;
        
        let query = `
            SELECT 
                o.id,
                o.titre,
                o.description as description_courte,
                CAST(COALESCE(o.prix_achat_immediat, 0) AS FLOAT) as montant_principal,
                CAST(COALESCE(o.prix_souhaite, 0) AS FLOAT) as prix_souhaite,
                o.type_vente,
                o.statut as statut_vente,
                o.photos_urls[1] as image,
                o.cree_le,
                (CASE WHEN f.utilisateur_id IS NOT NULL THEN true ELSE false END) as "isFavorite"
            FROM OBJETS o
            LEFT JOIN FAVORIS f ON o.id = f.objet_id 
                AND f.utilisateur_id = $1
            WHERE o.statut = 'PUBLIE'
            ORDER BY o.cree_le DESC
        `;
        
        const result = await pool.query(query, [utilisateur_id || null]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Récupérer les détails d'un objet
exports.getObjetById = async (req, res) => {
    try {
        const { id } = req.params;
        const { utilisateur_id } = req.query;
        
        const query = `
            SELECT 
                o.id,
                o.titre,
                o.description,
                CAST(COALESCE(o.prix_achat_immediat, 0) AS FLOAT) as prix_achat_immediat,
                CAST(COALESCE(o.prix_souhaite, 0) AS FLOAT) as prix_souhaite,
                o.type_vente,
                o.statut as statut_vente,
                o.photos_urls,
                o.vendeur_id,
                (CASE WHEN f.utilisateur_id IS NOT NULL THEN true ELSE false END) as "isFavorite"
            FROM OBJETS o
            LEFT JOIN FAVORIS f ON o.id = f.objet_id 
                AND f.utilisateur_id = $2
            WHERE o.id = $1
        `;
        
        const result = await pool.query(query, [id, utilisateur_id || null]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Objet non trouvé' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Récupérer les favoris d'un utilisateur
exports.getFavorites = async (req, res) => {
    try {
        const { utilisateur_id } = req.params;
        
        const query = `
            SELECT 
                o.id,
                o.titre,
                o.description as description_courte,
                CAST(COALESCE(o.prix_achat_immediat, e.prix_actuel, o.prix_souhaite, 0) AS FLOAT) as montant_principal,
                o.type_vente,
                o.statut as statut_vente,
                o.photos_urls[1] as image,
                (CASE WHEN f.utilisateur_id IS NOT NULL THEN true ELSE false END) as "isFavorite"
            FROM OBJETS o
            LEFT JOIN FAVORIS f ON o.id = f.objet_id AND f.utilisateur_id = $1
            LEFT JOIN ENCHERES e ON o.id = e.objet_id
            WHERE f.utilisateur_id = $1
            ORDER BY o.cree_le DESC
        `;
        
        const result = await pool.query(query, [utilisateur_id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Récupérer les propositions d'achat rapide
exports.getOffres = async (req, res) => {
    try {
        const { utilisateur_id } = req.params;
        
        const query = `
            SELECT 
                o.id,
                o.titre,
                o.description as description_courte,
                CAST(oa.montant AS FLOAT) as montant_principal,
                CAST(COALESCE(o.prix_souhaite, 0) AS FLOAT) as prix_souhaite,
                o.type_vente,
                o.statut as statut_vente,
                o.photos_urls[1] as image,
                (CASE WHEN f.utilisateur_id IS NOT NULL THEN true ELSE false END) as "isFavorite"
            FROM OBJETS o
            INNER JOIN OFFRES_ACHAT oa ON o.id = oa.objet_id
            LEFT JOIN FAVORIS f ON o.id = f.objet_id AND f.utilisateur_id = $1
            WHERE oa.acheteur_id = $1 AND o.type_vente = 'INSTANTANE'
            ORDER BY oa.cree_le DESC
        `;
        
        const result = await pool.query(query, [utilisateur_id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Récupérer les enchères participées
exports.getEncheres = async (req, res) => {
    try {
        const { utilisateur_id } = req.params;
        
        const query = `
            SELECT 
                o.id,
                o.titre,
                o.description as description_courte,
                CAST(e.prix_actuel AS FLOAT) as montant_principal,
                CAST(COALESCE(o.prix_souhaite, 0) AS FLOAT) as prix_souhaite,
                o.type_vente,
                o.statut as statut_vente,
                COALESCE(o.photos_urls[1], '') as image,
                (CASE WHEN f.utilisateur_id IS NOT NULL THEN true ELSE false END) as "isFavorite"
            FROM OBJETS o
            INNER JOIN ENCHERES e ON o.id = e.objet_id
            INNER JOIN ENCHERES_OFFRES eo ON e.id = eo.enchere_id
            LEFT JOIN FAVORIS f ON o.id = f.objet_id AND f.utilisateur_id = $1
            WHERE eo.encherisseur_id = $1 
                AND e.statut = 'ACTIVE'
            GROUP BY o.id, o.titre, o.description, e.prix_actuel, o.prix_souhaite, o.type_vente, o.statut, o.photos_urls, f.utilisateur_id
            ORDER BY MAX(eo.cree_le) DESC
        `;
        
        const result = await pool.query(query, [utilisateur_id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Récupérer les enchères perdues
exports.getEncheresperdues = async (req, res) => {
    try {
        const { utilisateur_id } = req.params;
        
        const query = `
            SELECT 
                o.id,
                o.titre,
                o.description as description_courte,
                CAST(e.prix_actuel AS FLOAT) as montant_principal,
                CAST(COALESCE(o.prix_souhaite, 0) AS FLOAT) as prix_souhaite,
                o.type_vente,
                o.statut as statut_vente,
                COALESCE(o.photos_urls[1], '') as image,
                (CASE WHEN f.utilisateur_id IS NOT NULL THEN true ELSE false END) as "isFavorite"
            FROM OBJETS o
            INNER JOIN ENCHERES e ON o.id = e.objet_id
            INNER JOIN ENCHERES_OFFRES eo ON e.id = eo.enchere_id
            LEFT JOIN FAVORIS f ON o.id = f.objet_id AND f.utilisateur_id = $1
            WHERE eo.encherisseur_id = $1 
                AND e.statut = 'TERMINEE'
                AND o.id NOT IN (
                    SELECT objet_id FROM COMMANDES c 
                    WHERE c.acheteur_id = $1 AND c.objet_id = o.id
                )
            GROUP BY o.id, o.titre, o.description, e.prix_actuel, e.date_fin, o.prix_souhaite, o.type_vente, o.statut, o.photos_urls, f.utilisateur_id
            ORDER BY e.date_fin DESC
        `;
        
        const result = await pool.query(query, [utilisateur_id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Récupérer les achats (commandes payées)
exports.getAchats = async (req, res) => {
    try {
        const { utilisateur_id } = req.params;
        
        const query = `
            SELECT 
                o.id,
                o.titre,
                o.description as description_courte,
                CAST(c.montant_total AS FLOAT) as montant_principal,
                CAST(COALESCE(o.prix_souhaite, 0) AS FLOAT) as prix_souhaite,
                o.type_vente,
                'VENDU' as statut_vente,
                o.photos_urls[1] as image,
                (CASE WHEN f.utilisateur_id IS NOT NULL THEN true ELSE false END) as "isFavorite"
            FROM OBJETS o
            INNER JOIN COMMANDES c ON o.id = c.objet_id
            LEFT JOIN FAVORIS f ON o.id = f.objet_id AND f.utilisateur_id = $1
            WHERE c.acheteur_id = $1 AND c.statut_paiement = 'PAYE'
            ORDER BY c.cree_le DESC
        `;
        
        const result = await pool.query(query, [utilisateur_id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Ajouter/Retirer un favori
exports.toggleFavorite = async (req, res) => {
    try {
        const { utilisateur_id, objet_id } = req.body;
        
        const checkQuery = 'SELECT * FROM FAVORIS WHERE utilisateur_id = $1 AND objet_id = $2';
        const checkResult = await pool.query(checkQuery, [utilisateur_id, objet_id]);
        
        if (checkResult.rows.length > 0) {
            await pool.query(
                'DELETE FROM FAVORIS WHERE utilisateur_id = $1 AND objet_id = $2',
                [utilisateur_id, objet_id]
            );
            res.json({ message: 'Favori supprimé', isFavorite: false });
        } else {
            await pool.query(
                'INSERT INTO FAVORIS (utilisateur_id, objet_id) VALUES ($1, $2)',
                [utilisateur_id, objet_id]
            );
            res.json({ message: 'Favori ajouté', isFavorite: true });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
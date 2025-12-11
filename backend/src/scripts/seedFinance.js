require('dotenv').config({ path: '../../.env' }); // Adjust path if needed, assuming run from src/scripts
const { Pool } = require('pg');

// Manually setting connection string if dotenv fails or for simplicity in this context
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/purple_dog';

const pool = new Pool({
    connectionString,
});

const seedFinance = async () => {
    try {
        console.log('🌱 Extension des données pour la Finance...');

        // 1. Récupérer des IDs existants pour Vendeurs, Acheteurs, Objets
        const usersRes = await pool.query(`SELECT id FROM UTILISATEURS LIMIT 10`);
        const objetsRes = await pool.query(`SELECT id, vendeur_id, prix_souhaite FROM OBJETS WHERE statut = 'PUBLIE' LIMIT 10`);

        if (usersRes.rows.length < 2) {
            console.log('❌ Pas assez d\'utilisateurs. Exécutez d\'abord le seed principal.');
            process.exit(1);
        }

        if (objetsRes.rows.length === 0) {
            console.log('⚠️ Pas d\'objets trouvés. Création d\'objets mock...');
            // Créer un objet fictif si nécessaire (simplification)
        }

        const transporteursRes = await pool.query(`SELECT id FROM TRANSPORTEURS LIMIT 1`);
        let transporteurId;
        if (transporteursRes.rows.length > 0) {
            transporteurId = transporteursRes.rows[0].id;
        } else {
            const trans = await pool.query(`INSERT INTO TRANSPORTEURS (nom) VALUES ('DHL') RETURNING id`);
            transporteurId = trans.rows[0].id;
        }

        const buyers = usersRes.rows;
        const sellers = usersRes.rows; // Simplified: anyone can be any role for mocking
        const items = objetsRes.rows;

        // 2. Générer 50 commandes passées
        const commissions = [];

        for (let i = 0; i < 50; i++) {
            // Random choice
            const buyer = buyers[Math.floor(Math.random() * buyers.length)];
            // Ensure seller is different from buyer if possible, else distinct
            const item = items.length > 0 ? items[Math.floor(Math.random() * items.length)] : null;
            const sellerId = item ? item.vendeur_id : sellers[Math.floor(Math.random() * sellers.length)].id;

            // Mock Item ID if no real items (should use real ones ideally for JOINs)
            const objectId = item ? item.id : null;

            if (!objectId) continue; // Skip if no items to link

            const price = Math.floor(Math.random() * 500) + 50; // 50 - 550 EUR
            const commAcheteur = (price * 0.03).toFixed(2);
            const commVendeur = (price * 0.02).toFixed(2);
            const shipping = 15.00;
            const total = (price + parseFloat(commAcheteur) + shipping).toFixed(2);

            // Random Date in last 30 days
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 30));

            const query = `
            INSERT INTO COMMANDES (
                objet_id, acheteur_id, vendeur_id, transporteur_id,
                montant_total, commission_acheteur, commission_vendeur, frais_livraison,
                statut_paiement, statut_livraison, cree_le
            ) VALUES (
                $1, $2, $3, $4,
                $5, $6, $7, $8,
                'PAYE', 'LIVRE', $9
            )
        `;

            const values = [
                objectId, buyer.id, sellerId, transporteurId,
                total, commAcheteur, commVendeur, shipping,
                date
            ];

            await pool.query(query, values);
        }

        console.log('✅ 50 transactions financières ajoutées avec succès.');

    } catch (err) {
        console.error('Erreur seeding finance:', err);
    } finally {
        await pool.end();
    }
};

seedFinance();

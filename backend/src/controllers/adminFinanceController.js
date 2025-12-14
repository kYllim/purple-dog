const pool = require('../db');

exports.getFinanceStats = async (req, res) => {
    try {
        // 1. Statistiques Globales
        const statsQuery = `
            SELECT 
                COALESCE(SUM(montant_total), 0) as total_volume,
                COALESCE(SUM(commission_acheteur), 0) as total_comm_acheteur,
                COALESCE(SUM(commission_vendeur), 0) as total_comm_vendeur,
                COUNT(*) as total_transactions
            FROM COMMANDES
            WHERE statut_paiement = 'PAYE'
        `;

        const statsResult = await pool.query(statsQuery);
        const globalStats = statsResult.rows[0];

        // Calcul du revenu total (somme des commissions)
        const totalRevenue = parseFloat(globalStats.total_comm_acheteur) + parseFloat(globalStats.total_comm_vendeur);

        // 2. Liste des dernières transactions (50)
        const transactionsQuery = `
            SELECT 
                c.id,
                c.cree_le as date,
                c.montant_total,
                c.commission_acheteur,
                c.commission_vendeur,
                c.statut_paiement,
                o.titre as objet_titre,
                v.email as vendeur_email,
                a.email as acheteur_email
            FROM COMMANDES c
            JOIN OBJETS o ON c.objet_id = o.id
            JOIN UTILISATEURS v ON c.vendeur_id = v.id
            JOIN UTILISATEURS a ON c.acheteur_id = a.id
            ORDER BY c.cree_le DESC
            LIMIT 50
        `;

        const transactionsResult = await pool.query(transactionsQuery);

        res.json({
            stats: {
                total_volume: parseFloat(globalStats.total_volume),
                total_comm_acheteur: parseFloat(globalStats.total_comm_acheteur),
                total_comm_vendeur: parseFloat(globalStats.total_comm_vendeur),
                total_revenue: totalRevenue,
                total_transactions: parseInt(globalStats.total_transactions)
            },
            transactions: transactionsResult.rows
        });

    } catch (error) {
        console.error('Erreur récupération finance:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des données financières' });
    }
};

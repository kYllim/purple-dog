const pool = require("../db/index");
const emailService = require("./emailService");

const processPayment = async (client, commandId, userId, amount) => {
    await client.query(`
        UPDATE commandes 
        SET statut_paiement = 'PAYE', stripe_payment_intent_id = 'pi_mock_123456789'
        WHERE id = $1
    `, [commandId]);
    return true;
};

const checkExpiredAuctions = async () => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const result = await client.query(`
            SELECT id, objet_id, prix_actuel 
            FROM encheres 
            WHERE statut = 'ACTIVE' AND date_fin < NOW()
            FOR UPDATE SKIP LOCKED
        `);

        for (const auction of result.rows) {
            console.log(`Clôture de l'enchère ${auction.id} (Objet ${auction.objet_id})`);

            const winnerRes = await client.query(`
                SELECT encherisseur_id, u.email, montant_max_auto, cree_le
                FROM encheres_offres eo
                JOIN utilisateurs u ON eo.encherisseur_id = u.id
                WHERE enchere_id = $1
                ORDER BY montant_max_auto DESC, cree_le ASC
                LIMIT 1
            `, [auction.id]);

            const hasWinner = winnerRes.rows.length > 0;
            let newObjectStatus = 'CLOS';

            if (hasWinner) {
                newObjectStatus = 'VENDU';
                const winner = winnerRes.rows[0];
                const finalPrice = auction.prix_actuel;

                const object = (await client.query('SELECT vendeur_id, titre FROM objets WHERE id = $1', [auction.objet_id])).rows[0];

                const cmdRes = await client.query(`
                    INSERT INTO commandes (
                        objet_id, acheteur_id, vendeur_id, montant_total, statut_paiement, statut_livraison
                    ) VALUES ($1, $2, $3, $4, 'EN_ATTENTE', 'EN_ATTENTE')
                    RETURNING id
                `, [auction.objet_id, winner.encherisseur_id, object.vendeur_id, finalPrice]);

                const commandId = cmdRes.rows[0].id;

                await processPayment(client, commandId, winner.encherisseur_id, finalPrice);

                await emailService.sendAuctionWinEmail(winner.email, object.titre, finalPrice);
            }

            await client.query(`
                UPDATE encheres 
                SET statut = 'TERMINEE' 
                WHERE id = $1
            `, [auction.id]);

            await client.query(`
                UPDATE objets 
                SET statut = $1, mis_a_jour_le = NOW() 
                WHERE id = $2
            `, [newObjectStatus, auction.objet_id]);

            const sseService = require('../services/sseService');
            sseService.broadcast('auction_end', {
                objetId: auction.objet_id,
                statut: newObjectStatus
            });
        }

        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Erreur dans le planificateur:", err);
    } finally {
        client.release();
    }
};

const startCronJobs = () => {
    setInterval(checkExpiredAuctions, 60 * 1000);
    console.log("Planificateur démarré : Exécution chaque minute.");
};

module.exports = { startCronJobs };

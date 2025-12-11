const Stripe = require('stripe');
const pool = require('../db/index');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
    const { objetId } = req.body;
    const userId = req.user.id; // User buying

    try {
        // 1. Fetch object & verify availability
        const result = await pool.query('SELECT * FROM objets WHERE id = $1', [objetId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Objet non trouvé" });
        }
        const objet = result.rows[0];

        if (objet.statut !== 'PUBLIE') {
            return res.status(400).json({ error: "Cet objet n'est plus disponible." });
        }

        // 2. Logic for Instant Buy
        if (objet.type_vente !== 'INSTANTANE' && objet.type_vente !== 'ACHAT_IMMEDIAT') {
            // Note: Enum says 'INSTANTANE' but some mocks used 'ACHAT_IMMEDIAT'. Handling both.
            // If strictly 'ENCHERE', reject (unless 'vente_rapide_active' logic exists, but let's stick to simple first)
            if (objet.type_vente === 'ENCHERE') {
                return res.status(400).json({ error: "Cet objet est aux enchères." });
            }
        }

        let price = objet.prix_achat_immediat || objet.prix_souhaite;
        if (!price) {
            return res.status(400).json({ error: "Prix non défini." });
        }

        // 3. Create Stripe Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: objet.titre,
                            description: objet.description ? objet.description.substring(0, 100) : 'Achat Purple Dog',
                            images: objet.photos_urls && objet.photos_urls.length > 0 ? [objet.photos_urls[0]] : [],
                        },
                        unit_amount: Math.round(price * 100), // cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/paiement/succes?session_id={CHECKOUT_SESSION_ID}&objet_id=${objetId}`,
            cancel_url: `${process.env.FRONTEND_URL}/paiement/annule`,
            metadata: {
                objetId: objetId,
                buyerId: userId,
                type: 'DIRECT_BUY'
            }
        });

        res.json({ url: session.url });

    } catch (error) {
        console.error('Stripe Error:', error);
        res.status(500).json({ error: "Erreur lors de la création de la session de paiement." });
    }
};

const handlePaymentSuccess = async (req, res) => {
    // SECURITY WARNING: In production, use Webhooks.
    // This endpoint is for dev/demo to manually confirm status after frontend redirect.
    const { objetId, sessionId } = req.body;

    // Verify session
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status === 'paid') {
            const client = await pool.connect();
            try {
                await client.query('BEGIN');
                // Mark object as SOLD (VENDU)
                const updateRes = await client.query("UPDATE objets SET statut = 'VENDU' WHERE id = $1 RETURNING vendeur_id, prix_achat_immediat, prix_souhaite", [objetId]);

                // Create ORDER record
                const objet = updateRes.rows[0];
                const montant = objet.prix_achat_immediat || objet.prix_souhaite;

                // Retrieve buyer ID from session metadata
                const buyerId = session.metadata.buyerId || req.user.id; // safer to use session metadata if webhook context, but here immediate callback

                await client.query(`
                    INSERT INTO commandes (objet_id, acheteur_id, vendeur_id, montant_total, statut_paiement, statut_livraison, stripe_payment_intent_id)
                    VALUES ($1, $2, $3, $4, 'PAYE', 'EN_ATTENTE', $5)
                `, [objetId, buyerId, objet.vendeur_id, montant, session.payment_intent]);

                await client.query('COMMIT');
                res.json({ success: true });
            } catch (e) {
                await client.query('ROLLBACK');
                console.error(e);
                res.status(500).json({ error: "Db Error" });
            } finally {
                client.release();
            }
        } else {
            res.status(400).json({ error: "Paiement non confirmé" });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Validation Error" });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const query = `
            SELECT c.*, o.titre as objet_titre, o.photos_urls, o.description
            FROM commandes c
            JOIN objets o ON c.objet_id = o.id
            WHERE c.acheteur_id = $1
            ORDER BY c.cree_le DESC
        `;
        const result = await pool.query(query, [userId]);

        // Parse dates and photos if needed (pg auto handles dates, photos is array)
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur récupération commandes" });
    }
};

module.exports = {
    createCheckoutSession,
    handlePaymentSuccess,
    getMyOrders
};

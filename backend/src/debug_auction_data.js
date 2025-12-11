const pool = require('./db');

async function debugAuction() {
    try {
        const res = await pool.query("SELECT * FROM encheres WHERE prix_actuel = 9700 LIMIT 1");
        if (res.rows.length === 0) {
            console.log("No auction found at 9700");
            return;
        }
        const auction = res.rows[0];
        console.log("--- AUCTION ---");
        console.log(JSON.stringify(auction, null, 2));

        console.log("Current Price:", auction.prix_actuel);

        const countRes = await pool.query(`SELECT count(*) FROM encheres_offres WHERE enchere_id = $1 AND montant_max_auto >= 9700`, [auction.id]);
        console.log("Bids >= 9700:", countRes.rows[0].count);

        const leaderRes = await pool.query(`
            SELECT encherisseur_id, montant_max_auto, cree_le
            FROM encheres_offres
            WHERE enchere_id = $1
            ORDER BY montant_max_auto DESC, cree_le ASC
            LIMIT 1
        `, [auction.id]);

        if (leaderRes.rows.length > 0) {
            console.log("Calculated Leader:", leaderRes.rows[0]);
        } else {
            console.log("No leader found");
        }
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

debugAuction();

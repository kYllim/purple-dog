const pool = require("../db/index");

const getPasEnchere = (currentPrice) => {
  if (currentPrice < 100) return 10;
  if (currentPrice < 500) return 50;
  return 100;
};

const checkSolvency = async (userId, estimatedAmount) => {
  return true;
};

const getCategories = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, nom FROM categories");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const getObjetById = async (req, res) => {
  try {
    const { id } = req.params;
    // BUT simplest way: Let's join the leader info.

    // Actually, 'req.utilisateur' is only present if authMiddleware is used. 
    // Since this is a public route, we might not have it. 
    // Strategy: Return the "leader_id" in the response. The frontend can compare with its stored user ID.

    const query = `
            SELECT o.*, 
                   c.nom as categorie_nom,
                   e.id as enchere_id, e.date_fin as enchere_fin, e.prix_actuel as enchere_prix_actuel, e.statut as enchere_statut,
                   (
                      SELECT encherisseur_id
                      FROM encheres_offres eo
                      WHERE eo.enchere_id = e.id
                      ORDER BY montant_max_auto DESC, cree_le ASC
                      LIMIT 1
                   ) as leader_id
            FROM objets o
            LEFT JOIN categories c ON o.categorie_id = c.id
            LEFT JOIN encheres e ON o.id = e.objet_id
            WHERE o.id = $1
        `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Objet non trouvé" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const createObjet = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

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

    const vendeur_id = req.utilisateur ? req.utilisateur.id : null;
    const effectiveVendeurId = vendeur_id || (req.body.vendeur_id);

    if (!effectiveVendeurId) {
      throw new Error("Vendeur non identifié");
    }

    const insertObjetQuery = `
      INSERT INTO objets(
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
      ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'PUBLIE', NOW(), NOW())
      RETURNING *
    `;

    const objetResult = await client.query(insertObjetQuery, [
      effectiveVendeurId,
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
    ]);

    const newObjet = objetResult.rows[0];

    if (type_vente === 'ENCHERE') {
      const dateDebut = new Date();
      const dateFin = new Date(dateDebut);
      dateFin.setDate(dateFin.getDate() + 7);

      const insertEnchereQuery = `
            INSERT INTO encheres(
                objet_id,
                date_debut,
                date_fin,
                prix_actuel,
                pas_enchere_min,
                statut
            ) VALUES ($1, $2, $3, $4, $5, 'ACTIVE')
            RETURNING *
        `;

      const startPrice = prix_depart || 0;
      await client.query(insertEnchereQuery, [
        newObjet.id,
        dateDebut,
        dateFin,
        startPrice,
        getPasEnchere(startPrice)
      ]);
    }

    await client.query('COMMIT');
    res.status(201).json(newObjet);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: "Erreur serveur: " + err.message });
  } finally {
    client.release();
  }
};

const placeBid = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { montant, montant_max_auto } = req.body;
    const encherisseur_id = req.utilisateur.id;

    if (req.utilisateur.role !== 'PRO') {
      return res.status(403).json({ error: "Seuls les professionnels peuvent enchérir." });
    }

    // Basic input validation/parsing
    const userBid = parseFloat(montant);
    const myMax = montant_max_auto ? parseFloat(montant_max_auto) : userBid;

    // Detect Hard Bid: if montant_max_auto is missing, it's a manual bid -> Price = Bid
    const isHardBid = !montant_max_auto;

    const solvable = await checkSolvency(encherisseur_id, myMax);
    if (!solvable) {
      return res.status(402).json({ error: "Paiement refusé. Veuillez vérifier votre moyen de paiement." });
    }

    await client.query('BEGIN');

    // 1. Lock the auction row (via objet_id) to serialize bids
    const enchereRes = await client.query(
      `SELECT e.*, o.vendeur_id 
       FROM encheres e 
       JOIN objets o ON e.objet_id = o.id
       WHERE e.objet_id = $1 FOR UPDATE`,
      [id]
    );

    if (enchereRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: "Enchère non trouvée" });
    }

    const enchere = enchereRes.rows[0];

    // Status / Date Checks
    if (enchere.statut !== 'ACTIVE' && enchere.statut !== 'EN_COURS') {
      // Note: Depending on seed, status might be ACTIVE or EN_COURS. Using both for safety.
      // Although strict check is better if enum is clear.
    }

    // Check Date
    if (new Date() > new Date(enchere.date_fin)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: "L'enchère est terminée" });
    }

    if (enchere.vendeur_id === encherisseur_id) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: "Vous ne pouvez pas enchérir sur votre propre objet" });
    }

    const currentPrice = parseFloat(enchere.prix_actuel);
    const pas = parseFloat(enchere.pas_enchere_min);

    // Calculate Minimum Acceptable Bid
    // If no bids yet: min = start_price (or currentPrice if start_price used as current)
    // If bids exist: min = currentPrice + pas
    const countRes = await client.query('SELECT count(*) FROM encheres_offres WHERE enchere_id = $1', [enchere.id]);
    const bidCount = parseInt(countRes.rows[0].count);

    // Check if user is ALREADY the leader
    const leaderRes = await client.query(`
        SELECT encherisseur_id FROM encheres_offres 
        WHERE enchere_id = $1 
        ORDER BY montant_max_auto DESC, cree_le ASC 
        LIMIT 1
    `, [enchere.id]);
    const currentLeaderId = leaderRes.rows.length > 0 ? leaderRes.rows[0].encherisseur_id : null;
    const isAlreadyLeader = currentLeaderId === encherisseur_id;

    let minReq = currentPrice + pas;
    if (bidCount === 0) {
      minReq = currentPrice;
    } else if (isAlreadyLeader) {
      // If already leading, allow defensive bid (raising max without raising current price step)
      minReq = currentPrice;
    }

    if (userBid < minReq) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: `Offre insuffisante. Minimum: ${minReq} €` });
    }

    // 2. Insert Offer
    await client.query(
      `INSERT INTO encheres_offres (enchere_id, encherisseur_id, montant, montant_max_auto, cree_le)
       VALUES ($1, $2, $3, $4, NOW())`,
      [enchere.id, encherisseur_id, userBid, myMax]
    );

    // Re-evaluate current price based on all bids (including the new one)
    const topBiddersRes = await client.query(`
            SELECT encherisseur_id, MAX(montant_max_auto) as max_bid, MIN(cree_le) as earliest_bid
            FROM encheres_offres
            WHERE enchere_id = $1
            GROUP BY encherisseur_id
            ORDER BY max_bid DESC, earliest_bid ASC
            LIMIT 2
      `, [enchere.id]);

    const topBidders = topBiddersRes.rows;
    let calculatedNewPrice = currentPrice; // Initialize with current price

    if (topBidders.length === 1) {
      // Sole bidder. Price stays at current (Start Price) or whatever it was.
      // We do NOT jump to userBid (Second Price Auctino logic).
      calculatedNewPrice = currentPrice;
    } else if (topBidders.length >= 2) {
      const leader = topBidders[0];
      const challenger = topBidders[1];

      const leaderMax = parseFloat(leader.max_bid);
      const challengerMax = parseFloat(challenger.max_bid);
      const step = getPasEnchere(challengerMax); // Step based on challenger's max bid

      let tempCalculatedPrice = challengerMax + step;
      if (tempCalculatedPrice > leaderMax) {
        tempCalculatedPrice = leaderMax;
      }
      calculatedNewPrice = tempCalculatedPrice;
    }

    // 3. Update Auction Price and Date
    let newDateFin = new Date(enchere.date_fin);
    const now = new Date();
    const diffMinutes = (newDateFin.getTime() - now.getTime()) / 60000;

    if (diffMinutes < 60) { // If less than 60 minutes remaining
      newDateFin = new Date(now.getTime() + 10 * 60000); // Extend by 10 minutes from now
    }

    // HARD BID OVERRIDE: If user explicitly bid X (not auto), and X > CalcP, set Price = X.
    if (isHardBid && userBid > calculatedNewPrice) {
      calculatedNewPrice = userBid;
    }

    // Prevent Price Decrease (should not happen, but safe check)
    if (calculatedNewPrice < currentPrice) calculatedNewPrice = currentPrice;

    await client.query(
      `UPDATE encheres SET prix_actuel = $1, date_fin = $2, pas_enchere_min = $3 WHERE id = $4`,
      [calculatedNewPrice, newDateFin, getPasEnchere(calculatedNewPrice), enchere.id]
    );

    await client.query('COMMIT');

    // Determine actual leader to broadcast
    const actualLeaderId = topBidders.length > 0 ? topBidders[0].encherisseur_id : encherisseur_id;

    const sseService = require('../services/sseService');
    sseService.broadcast('bid_update', {
      objetId: id,
      nouveauPrix: calculatedNewPrice,
      nouvelleFin: newDateFin,
      encherisseurId: actualLeaderId // Send the REAL leader, not just the bidder
    });
    res.json({
      message: "Enchère prise en compte",
      nouveau_prix: calculatedNewPrice,
      fin: newDateFin
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
};

const makeOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const { montant } = req.body;
    const acheteur_id = req.utilisateur.id;
    if (req.utilisateur.role !== 'PRO') {
      return res.status(403).json({ error: "Seuls les professionnels peuvent faire des offres." });
    }

    const objectQuery = `SELECT * FROM objets WHERE id = $1`;
    const objRes = await pool.query(objectQuery, [id]);

    if (objRes.rows.length === 0) return res.status(404).json({ error: "Objet non trouvé" });
    const objet = objRes.rows[0];

    if (objet.vendeur_id === acheteur_id) return res.status(400).json({ error: "Impossible de faire une offre sur votre objet" });

    const insertQuery = `
            INSERT INTO offres_achat(objet_id, acheteur_id, montant, statut)
            VALUES($1, $2, $3, 'EN_ATTENTE')
            RETURNING *
      `;
    const result = await pool.query(insertQuery, [id, acheteur_id, montant]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};


const getMyParticipatedAuctions = async (req, res) => {
  try {
    const userId = req.utilisateur.id;

    // Retrieve all auctions where the user has placed at least one bid.
    // We also determine who the current leader is to set 'is_winning'.
    // The leader is determined by MAX(montant_max_auto) then MIN(cree_le).
    const query = `
            SELECT DISTINCT ON(e.id)
                e.id,
      e.date_fin,
      e.prix_actuel,
      e.statut,
      o.id as objet_id,
      o.titre,
      o.photos_urls,
      o.categorie_id,
      c.nom as categorie_nom,
      (
        SELECT encherisseur_id
                    FROM encheres_offres eo_rank
                    WHERE eo_rank.enchere_id = e.id
                    ORDER BY montant_max_auto DESC, cree_le ASC
                    LIMIT 1
    ) as leader_id
            FROM encheres e
            JOIN encheres_offres eo ON e.id = eo.enchere_id
            JOIN objets o ON e.objet_id = o.id
            LEFT JOIN categories c ON o.categorie_id = c.id
            WHERE eo.encherisseur_id = $1
            ORDER BY e.id, e.date_fin ASC
      `;

    const result = await pool.query(query, [userId]);

    const auctions = result.rows.map(row => ({
      ...row,
      is_winning: row.leader_id === userId,
      photo_principale: row.photos_urls && row.photos_urls.length > 0 ? row.photos_urls[0] : null
    }));

    res.json(auctions);

  } catch (err) {
    console.error("Erreur getMyParticipatedAuctions", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

module.exports = {
  getCategories,
  createObjet,
  placeBid,
  makeOffer,
  getObjetById,
  getMyParticipatedAuctions
};

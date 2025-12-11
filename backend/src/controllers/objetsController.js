const pool = require("../db/index");

const obtenirPasEnchere = (prixActuel) => {
  if (prixActuel < 100) return 10;
  if (prixActuel < 500) return 50;
  return 100;
};

const verifierSolvabilite = async (userId, montantEstime) => {
  return true;
};

const obtenirCategories = async (req, res) => {
  try {
    const resultat = await pool.query("SELECT id, nom FROM categories");
    res.json(resultat.rows);
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const obtenirObjetsUtilisateur = async (req, res) => {
  try {
    let userId = req.params.userId;

    if (userId === '1') {
      const userRes = await pool.query('SELECT id FROM UTILISATEURS LIMIT 1');
      if (userRes.rowCount > 0) {
        userId = userRes.rows[0].id;
      }
    }

    const resultat = await pool.query(
      "SELECT * FROM objets WHERE vendeur_id = $1 ORDER BY cree_le DESC",
      [userId]
    );
    res.json(resultat.rows);
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const obtenirObjetParId = async (req, res) => {
  try {
    const { id } = req.params;

    const requete = `
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
    const resultat = await pool.query(requete, [id]);

    if (resultat.rows.length === 0) {
      return res.status(404).json({ error: "Objet non trouvé" });
    }

    res.json(resultat.rows[0]);
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const creerObjet = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const photos = req.files['photos'] || [];
    const documents = req.files['documents'] || [];

    if (photos.length < 2) {
      throw new Error("Il faut au moins 2 photos pour valider l'annonce.");
    }

    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;
    const urlsPhotos = photos.map(fichier => baseUrl + fichier.filename);
    const urlsDocuments = documents.map(fichier => baseUrl + fichier.filename);

    const {
      titre,
      description,
      categorie_id,
      dimensions,
      poids_kg,
      type_vente,
      prix_souhaite,
      prix_depart,
      prix_achat_immediat,
      vendeur_id
    } = req.body;

    let idVendeurFinal = vendeur_id || (req.user ? req.user.id : null);

    if (!idVendeurFinal || idVendeurFinal === '1') {
      const userRes = await pool.query('SELECT id FROM UTILISATEURS LIMIT 1');
      if (userRes.rowCount > 0) idVendeurFinal = userRes.rows[0].id;
    }

    let dimensionsParsees = dimensions;
    if (typeof dimensions === 'string') {
      try {
        dimensionsParsees = JSON.parse(dimensions);
      } catch (e) {
        dimensionsParsees = null;
      }
    }

    const requeteInsertionObjet = `
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

    const resultatObjet = await client.query(requeteInsertionObjet, [
      idVendeurFinal,
      categorie_id,
      titre,
      description,
      dimensionsParsees,
      poids_kg || null,
      urlsPhotos,
      urlsDocuments,
      type_vente,
      prix_souhaite || null,
      prix_depart || null,
      prix_achat_immediat || null
    ]);

    const nouvelObjet = resultatObjet.rows[0];

    if (type_vente === 'ENCHERE') {
      const dateDebut = new Date();
      const dateFin = new Date(dateDebut);
      dateFin.setDate(dateFin.getDate() + 7);

      const prixDepart = prix_depart || 0;

      await client.query(`
            INSERT INTO encheres(
                objet_id, date_debut, date_fin, prix_actuel, pas_enchere_min, statut
            ) VALUES ($1, $2, $3, $4, $5, 'ACTIVE')
      `, [
        nouvelObjet.id,
        dateDebut,
        dateFin,
        prixDepart,
        obtenirPasEnchere(prixDepart)
      ]);
    }

    await client.query('COMMIT');
    res.status(201).json(nouvelObjet);

  } catch (erreur) {
    await client.query('ROLLBACK');
    console.error(erreur);
    res.status(500).json({ error: "Erreur serveur: " + erreur.message });
  } finally {
    client.release();
  }
};

const placerEnchere = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { montant, montant_max_auto } = req.body;
    const idEncherisseur = req.user.id;

    if (req.user.role !== 'PRO') {
      return res.status(403).json({ error: "Seuls les professionnels peuvent enchérir." });
    }

    const enchereUtilisateur = parseFloat(montant);
    const maxPerso = montant_max_auto ? parseFloat(montant_max_auto) : enchereUtilisateur;
    const estOffreFerme = !montant_max_auto;

    const solvable = await verifierSolvabilite(idEncherisseur, maxPerso);
    if (!solvable) {
      return res.status(402).json({ error: "Paiement refusé. Veuillez vérifier votre moyen de paiement." });
    }

    await client.query('BEGIN');

    const resultatEnchere = await client.query(
      `SELECT e.*, o.vendeur_id 
       FROM encheres e 
       JOIN objets o ON e.objet_id = o.id
       WHERE e.objet_id = $1 FOR UPDATE`,
      [id]
    );

    if (resultatEnchere.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: "Enchère non trouvée" });
    }

    const enchere = resultatEnchere.rows[0];

    if (enchere.statut !== 'ACTIVE' && enchere.statut !== 'EN_COURS') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: "L'enchère n'est pas active" });
    }

    if (new Date() > new Date(enchere.date_fin)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: "L'enchère est terminée" });
    }

    if (enchere.vendeur_id === idEncherisseur) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: "Vous ne pouvez pas enchérir sur votre propre objet" });
    }

    const prixActuel = parseFloat(enchere.prix_actuel);
    const pas = parseFloat(enchere.pas_enchere_min);

    const resultatCompte = await client.query('SELECT count(*) FROM encheres_offres WHERE enchere_id = $1', [enchere.id]);
    const nombreEncheres = parseInt(resultatCompte.rows[0].count);

    const resultatLeader = await client.query(`
        SELECT encherisseur_id FROM encheres_offres 
        WHERE enchere_id = $1 
        ORDER BY montant_max_auto DESC, cree_le ASC 
        LIMIT 1
    `, [enchere.id]);
    const idLeaderActuel = resultatLeader.rows.length > 0 ? resultatLeader.rows[0].encherisseur_id : null;
    const estDejaLeader = idLeaderActuel === idEncherisseur;

    let minimumRequis = prixActuel + pas;
    if (nombreEncheres === 0) {
      minimumRequis = prixActuel;
    } else if (estDejaLeader) {
      minimumRequis = prixActuel;
    }

    if (enchereUtilisateur < minimumRequis) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: `Offre insuffisante. Minimum: ${minimumRequis} €` });
    }

    await client.query(
      `INSERT INTO encheres_offres (enchere_id, encherisseur_id, montant, montant_max_auto, cree_le)
       VALUES ($1, $2, $3, $4, NOW())`,
      [enchere.id, idEncherisseur, enchereUtilisateur, maxPerso]
    );

    const resultatTopEncherisseurs = await client.query(`
            SELECT encherisseur_id, MAX(montant_max_auto) as max_bid, MIN(cree_le) as earliest_bid
            FROM encheres_offres
            WHERE enchere_id = $1
            GROUP BY encherisseur_id
            ORDER BY max_bid DESC, earliest_bid ASC
            LIMIT 2
      `, [enchere.id]);

    const topEncherisseurs = resultatTopEncherisseurs.rows;
    let nouveauPrixCalcule = prixActuel;

    if (topEncherisseurs.length === 1) {
      nouveauPrixCalcule = prixActuel;
    } else if (topEncherisseurs.length >= 2) {
      const leader = topEncherisseurs[0];
      const challenger = topEncherisseurs[1];

      const leaderMax = parseFloat(leader.max_bid);
      const challengerMax = parseFloat(challenger.max_bid);
      const pasChallenger = obtenirPasEnchere(challengerMax);

      let prixTemp = challengerMax + pasChallenger;
      if (prixTemp > leaderMax) {
        prixTemp = leaderMax;
      }
      nouveauPrixCalcule = prixTemp;
    }

    let nouvelleDateFin = new Date(enchere.date_fin);
    const maintenant = new Date();
    const diffMinutes = (nouvelleDateFin.getTime() - maintenant.getTime()) / 60000;

    if (diffMinutes < 60) {
      nouvelleDateFin = new Date(nouvelleDateFin.getTime() + 10 * 60000);
    }

    if (estOffreFerme && enchereUtilisateur > nouveauPrixCalcule) {
      nouveauPrixCalcule = enchereUtilisateur;
    }

    if (nouveauPrixCalcule < prixActuel) nouveauPrixCalcule = prixActuel;

    await client.query(
      `UPDATE encheres SET prix_actuel = $1, date_fin = $2, pas_enchere_min = $3 WHERE id = $4`,
      [nouveauPrixCalcule, nouvelleDateFin, obtenirPasEnchere(nouveauPrixCalcule), enchere.id]
    );

    await client.query('COMMIT');

    const idLeaderReel = topEncherisseurs.length > 0 ? topEncherisseurs[0].encherisseur_id : idEncherisseur;

    const sseService = require('../services/sseService');
    sseService.broadcast('bid_update', {
      objetId: id,
      nouveauPrix: nouveauPrixCalcule,
      nouvelleFin: nouvelleDateFin,
      encherisseurId: idLeaderReel
    });
    res.json({
      message: "Enchère prise en compte",
      nouveau_prix: nouveauPrixCalcule,
      fin: nouvelleDateFin
    });

  } catch (erreur) {
    await client.query('ROLLBACK');
    console.error(erreur);
    res.status(400).json({ error: erreur.message });
  } finally {
    client.release();
  }
};

const faireOffre = async (req, res) => {
  try {
    const { id } = req.params;
    const { montant } = req.body;
    const idAcheteur = req.user.id;
    if (req.user.role !== 'PRO') {
      return res.status(403).json({ error: "Seuls les professionnels peuvent faire des offres." });
    }

    const requeteObjet = `SELECT * FROM objets WHERE id = $1`;
    const resultatObj = await pool.query(requeteObjet, [id]);

    if (resultatObj.rows.length === 0) return res.status(404).json({ error: "Objet non trouvé" });
    const objet = resultatObj.rows[0];

    if (objet.vendeur_id === idAcheteur) return res.status(400).json({ error: "Impossible de faire une offre sur votre objet" });

    const requeteInsertion = `
            INSERT INTO offres_achat(objet_id, acheteur_id, montant, statut)
            VALUES($1, $2, $3, 'EN_ATTENTE')
            RETURNING *
      `;
    const resultat = await pool.query(requeteInsertion, [id, idAcheteur, montant]);

    res.status(201).json(resultat.rows[0]);
  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const obtenirMesEncheresParticipees = async (req, res) => {
  try {
    const userId = req.user.id;

    const requete = `
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

    const resultat = await pool.query(requete, [userId]);

    const encheres = resultat.rows.map(ligne => ({
      ...ligne,
      is_winning: ligne.leader_id === userId,
      photo_principale: ligne.photos_urls && ligne.photos_urls.length > 0 ? ligne.photos_urls[0] : null
    }));

    res.json(encheres);

  } catch (erreur) {
    console.error("Erreur obtenirMesEncheresParticipees", erreur);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const obtenirTousLesObjets = async (req, res) => {
  try {
    const { page = 1, limit = 10, prix_min, prix_max, categorie_id, type_vente } = req.query;
    const limitInt = parseInt(limit) || 10;
    const pageInt = parseInt(page) || 1;
    const offset = (pageInt - 1) * limitInt;

    const parametres = [];
    let requete = `
      SELECT o.*, c.nom as categorie_nom, 
             e.prix_actuel as enchere_prix, e.date_fin as enchere_fin
      FROM objets o
      LEFT JOIN categories c ON o.categorie_id = c.id
      LEFT JOIN encheres e ON o.id = e.objet_id AND o.type_vente = 'ENCHERE'
      WHERE o.statut = 'PUBLIE'
    `;

    if (categorie_id) {
      parametres.push(categorie_id);
      requete += ` AND o.categorie_id = $${parametres.length}`;
    }

    if (type_vente) {
      parametres.push(type_vente);
      requete += ` AND o.type_vente = $${parametres.length}`;
    }

    requete += ` ORDER BY o.cree_le DESC LIMIT $${parametres.length + 1} OFFSET $${parametres.length + 2}`;
    parametres.push(limitInt, offset);

    const resultat = await pool.query(requete, parametres);

    const resultatCompte = await pool.query('SELECT COUNT(*) FROM objets WHERE statut = \'PUBLIE\'');
    const total = parseInt(resultatCompte.rows[0].count);

    res.json({
      data: resultat.rows,
      meta: {
        total,
        page: pageInt,
        limit: limitInt,
        pages: Math.ceil(total / limitInt)
      }
    });

  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const mettreAJourObjet = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { titre, description, prix_souhaite, dimensions, poids_kg, existing_photos } = req.body;
    const userId = req.user.id;

    console.log("---------------- DEBUG UPDATE OBJET ----------------");
    console.log("Body:", req.body);
    console.log("Files:", req.files);
    console.log("Existing Photos Raw:", existing_photos);

    // 1. Vérifier la propriété (avec FOR UPDATE pour verrouiller)
    await client.query('BEGIN');
    const verification = await client.query('SELECT vendeur_id, photos_urls FROM objets WHERE id = $1 FOR UPDATE', [id]);

    // Note: Verification fields might differ if schema changed, assume 'vendeur_id' from previous view
    const checkQuery = await client.query('SELECT vendeur_id, photos_urls FROM objets WHERE id = $1', [id]);

    if (checkQuery.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: "Objet inconnu" });
    }

    const currentObj = checkQuery.rows[0];

    if (currentObj.vendeur_id !== userId) {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: "Vous n'êtes pas le propriétaire" });
    }

    // 2. Gérer les photos
    // existing_photos est envoyé comme string JSON par le front (FormData)
    let finalPhotos = [];
    if (existing_photos) {
      try {
        finalPhotos = JSON.parse(existing_photos);
        if (!Array.isArray(finalPhotos)) finalPhotos = [];
      } catch (e) {
        finalPhotos = [];
      }
    }

    // Ajouter les nouvelles photos
    if (req.files && req.files['photos']) {
      const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;
      const newPhotos = req.files['photos'].map(f => baseUrl + f.filename);
      finalPhotos = [...finalPhotos, ...newPhotos];
    }

    // Si aucune photo finale (cas rare si on supprime tout), on peut decider de garder l'ancienne ou autoriser vide (ici on autorise)

    // 3. Parser dimensions
    let finalDimensions = dimensions;
    if (typeof dimensions === 'string') {
      try {
        finalDimensions = JSON.parse(dimensions);
      } catch (e) {
        finalDimensions = null;
      }
    }

    // 4. Update
    const requeteMiseAJour = `
            UPDATE objets 
            SET titre = COALESCE($1, titre),
                description = COALESCE($2, description),
                prix_souhaite = COALESCE($3, prix_souhaite),
                dimensions = $4,
                poids_kg = $5,
                photos_urls = $6,
                mis_a_jour_le = NOW()
            WHERE id = $7
            RETURNING *
        `;

    const resultat = await client.query(requeteMiseAJour, [
      titre,
      description,
      prix_souhaite,
      finalDimensions,
      poids_kg,
      finalPhotos,
      id
    ]);

    await client.query('COMMIT');
    res.json(resultat.rows[0]);

  } catch (erreur) {
    await client.query('ROLLBACK');
    console.error(erreur);
    res.status(500).json({ error: "Erreur serveur" });
  } finally {
    client.release();
  }
};

const supprimerObjet = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const verification = await client.query('SELECT * FROM objets WHERE id = $1', [id]);
    if (verification.rows.length === 0) return res.status(404).json({ error: "Objet inconnu" });

    const objet = verification.rows[0];

    if (objet.vendeur_id !== userId) {
      return res.status(403).json({ error: "Non autorisé" });
    }

    if (objet.type_vente === 'ENCHERE') {
      const resultatEnchere = await client.query('SELECT id FROM encheres WHERE objet_id = $1', [id]);
      if (resultatEnchere.rows.length > 0) {
        const resultatOffres = await client.query('SELECT count(*) FROM encheres_offres WHERE enchere_id = $1', [resultatEnchere.rows[0].id]);
        if (parseInt(resultatOffres.rows[0].count) > 0) {
          return res.status(400).json({ error: "Impossible de supprimer: des enchères sont déjà placées." });
        }
      }
    }

    await client.query('DELETE FROM objets WHERE id = $1', [id]);
    res.json({ message: "Objet supprimé" });

  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ error: "Erreur serveur" });
  } finally {
    client.release();
  }
};

module.exports = {
  obtenirCategories,
  obtenirObjetsUtilisateur,
  obtenirObjetParId,
  creerObjet,
  placerEnchere,
  faireOffre,
  obtenirMesEncheresParticipees,
  obtenirTousLesObjets,
  mettreAJourObjet,
  supprimerObjet
};

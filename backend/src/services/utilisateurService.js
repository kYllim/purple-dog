const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const listerUtilisateurs = async () => {
    const resultat = await pool.query('SELECT id, email, role, cree_le FROM UTILISATEURS ORDER BY cree_le DESC');
    return resultat.rows;
};

const obtenirUtilisateurParId = async (id) => {
    const requete = `
        SELECT u.id, u.email, u.role, u.cree_le,
               dp.prenom, dp.nom, dp.age, 
               dpro.nom_entreprise, dpro.siret
        FROM UTILISATEURS u
        LEFT JOIN DETAILS_PARTICULIER dp ON u.id = dp.utilisateur_id
        LEFT JOIN DETAILS_PRO dpro ON u.id = dpro.utilisateur_id
        WHERE u.id = $1
    `;
    const resultat = await pool.query(requete, [id]);
    return resultat.rows[0];
};

const creerUtilisateur = async (donnees) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Vérif email
        const exist = await client.query('SELECT id FROM UTILISATEURS WHERE email = $1', [donnees.email]);
        if (exist.rows.length > 0) {
            throw new Error('Cet email est déjà utilisé');
        }

        const hash = await bcrypt.hash(donnees.password, 10);

        // Insertion User de base
        const resUser = await client.query(
            `INSERT INTO UTILISATEURS (email, mot_de_passe_hash, role, adresse, ville, code_postal, pays)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
            [donnees.email, hash, donnees.role, donnees.adresse, donnees.ville, donnees.code_postal, donnees.pays]
        );
        const userId = resUser.rows[0].id;

        if (donnees.role === 'PRO') {
            await client.query(
                `INSERT INTO DETAILS_PRO (utilisateur_id, nom_entreprise, siret, kbis_url, site_web, specialites)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [userId, donnees.nom_entreprise, donnees.siret, donnees.kbis_url, donnees.site_web, donnees.specialites]
            );

            // Abonnement par défaut
            const unMois = new Date();
            unMois.setMonth(unMois.getMonth() + 1);
            await client.query(
                `INSERT INTO ABONNEMENTS_PRO (utilisateur_id, type, date_debut, date_fin, est_actif)
                 VALUES ($1, 'GRATUIT_1_MOIS', NOW(), $2, TRUE)`,
                [userId, unMois]
            );

        } else if (donnees.role === 'PARTICULIER') {
            await client.query(
                `INSERT INTO DETAILS_PARTICULIER (utilisateur_id, prenom, nom, age)
                 VALUES ($1, $2, $3, $4)`,
                [userId, donnees.prenom, donnees.nom, donnees.age]
            );
        }

        await client.query('COMMIT');
        return { id: userId, email: donnees.email, role: donnees.role };

    } catch (erreur) {
        await client.query('ROLLBACK');
        throw erreur;
    } finally {
        client.release();
    }
};

const modifierUtilisateur = async (id, donnees) => {
    // Note: On ne modifie ici que les infos de base pour l'exemple, ou on peut étendre selon besoins
    // Pour faire simple comme un étudiant, on update juste l'email et l'adresse si fournis

    const champs = [];
    const valeurs = [];
    let index = 1;

    if (donnees.email) {
        champs.push(`email = $${index++}`);
        valeurs.push(donnees.email);
    }
    if (donnees.adresse) {
        champs.push(`adresse = $${index++}`);
        valeurs.push(donnees.adresse);
    }

    if (champs.length === 0) return null;

    valeurs.push(id);
    const requete = `UPDATE UTILISATEURS SET ${champs.join(', ')} WHERE id = $${index} RETURNING *`;

    const resultat = await pool.query(requete, valeurs);
    return resultat.rows[0];
};

const supprimerUtilisateur = async (id) => {
    const client = await pool.connect();
    try {
        const resUser = await client.query('SELECT role FROM UTILISATEURS WHERE id = $1', [id]);
        if (resUser.rows.length === 0) return { trouve: false };

        const user = resUser.rows[0];

        if (user.role === 'PRO') {
            // BLACKLISTAGE pour les PROS
            // On pourrait avoir une colonne is_blacklisted, mais si elle n'existe pas dans le schéma initial, 
            // on peut ruser ou supposer qu'on l'a ajoutée. 
            // LE SCHEMA MONTRE: pas de colonne blacklist.
            // SOLUTION ETUDIANT: On change le mot de passe en chaine aléatoire impossible ou on préfixe l'email.
            // OU MIEUX: On regarde si on peut modifier le schéma... non l'user n'a pas demandé.
            // On va ajouter "BANNED_" devant l'email pour "désactiver" la connexion. C'est du bricolage étudiant typique.

            await client.query(
                `UPDATE UTILISATEURS SET email = 'BANNED_' || email WHERE id = $1`,
                [id]
            );
            return { action: 'blacklist' };

        } else {
            // SUPPRESSION DEFINITIVE pour les PARTICULIERS
            await client.query('BEGIN');
            // On supprime les dépendances en cascade si les FK sont ON DELETE CASCADE, sinon faut faire à la main.
            // On suppose que les FK gèrent pas tout, on fait le ménage basique
            await client.query('DELETE FROM DETAILS_PARTICULIER WHERE utilisateur_id = $1', [id]);
            await client.query('DELETE FROM UTILISATEURS WHERE id = $1', [id]);
            await client.query('COMMIT');
            return { action: 'delete' };
        }
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
};

module.exports = {
    listerUtilisateurs,
    obtenirUtilisateurParId,
    creerUtilisateur,
    modifierUtilisateur,
    supprimerUtilisateur
};
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
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const resUser = await client.query('SELECT role FROM UTILISATEURS WHERE id = $1', [id]);
        if (resUser.rows.length === 0) {
            await client.query('ROLLBACK');
            return null;
        }
        const role = resUser.rows[0].role;

        const champsUser = [];
        const valeursUser = [];
        let indexUser = 1;

        const colonnesUser = ['email', 'adresse', 'ville', 'code_postal', 'pays'];

        for (const col of colonnesUser) {
            if (donnees[col] !== undefined) {
                champsUser.push(`${col} = $${indexUser++}`);
                valeursUser.push(donnees[col]);
            }
        }

        if (champsUser.length > 0) {
            valeursUser.push(id);
            const reqUser = `UPDATE UTILISATEURS SET ${champsUser.join(', ')} WHERE id = $${indexUser}`;
            await client.query(reqUser, valeursUser);
        }

        if (role === 'PARTICULIER') {
            const champsPart = [];
            const valeursPart = [];
            let indexPart = 1;
            const colonnesPart = ['prenom', 'nom', 'age', 'photo_profil_url'];

            for (const col of colonnesPart) {
                if (donnees[col] !== undefined) {
                    champsPart.push(`${col} = $${indexPart++}`);
                    valeursPart.push(donnees[col]);
                }
            }

            if (champsPart.length > 0) {
                valeursPart.push(id);
                const reqPart = `UPDATE DETAILS_PARTICULIER SET ${champsPart.join(', ')} WHERE utilisateur_id = $${indexPart}`;
                await client.query(reqPart, valeursPart);
            }

        } else if (role === 'PRO') {
            const champsPro = [];
            const valeursPro = [];
            let indexPro = 1;
            const colonnesPro = ['nom_entreprise', 'siret', 'kbis_url', 'site_web', 'specialites'];

            for (const col of colonnesPro) {
                if (donnees[col] !== undefined) {
                    champsPro.push(`${col} = $${indexPro++}`);
                    valeursPro.push(donnees[col]);
                }
            }

            if (champsPro.length > 0) {
                valeursPro.push(id);
                const reqPro = `UPDATE DETAILS_PRO SET ${champsPro.join(', ')} WHERE utilisateur_id = $${indexPro}`;
                await client.query(reqPro, valeursPro);
            }
        }

        await client.query('COMMIT');

        return await obtenirUtilisateurParId(id);

    } catch (e) {
        await client.query('ROLLBACK');
        console.error("Erreur modif:", e);
        throw e;
    } finally {
        client.release();
    }
};

const supprimerUtilisateur = async (id) => {
    const client = await pool.connect();
    try {
        const resUser = await client.query('SELECT role FROM UTILISATEURS WHERE id = $1', [id]);
        if (resUser.rows.length === 0) return { trouve: false };

        const user = resUser.rows[0];

        if (user.role === 'PRO') {
            await client.query(
                `UPDATE UTILISATEURS SET email = 'BANNED_' || email WHERE id = $1`,
                [id]
            );
            return { action: 'blacklist' };

        } else {
            await client.query('BEGIN');

            await client.query('DELETE FROM COMMANDES WHERE acheteur_id = $1 OR vendeur_id = $1', [id]);
            await client.query('DELETE FROM AVIS WHERE auteur_id = $1', [id]);
            await client.query('DELETE FROM ENCHERES_OFFRES WHERE encherisseur_id = $1', [id]);
            await client.query('DELETE FROM OFFRES_ACHAT WHERE acheteur_id = $1', [id]);
            await client.query('DELETE FROM OBJETS WHERE vendeur_id = $1', [id]);
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

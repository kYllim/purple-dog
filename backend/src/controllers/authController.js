const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const { z } = require('zod');
const crypto = require('crypto');
const emailService = require('../services/emailService');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

// Générer un token aléatoire
const generateToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

const schemaPro = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    company_name: z.string().min(1),
    siret: z.string().min(9),
    kbis_url: z.string().optional(),
    site_web: z.string().optional(),
    specialites: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    zip_code: z.string().optional(),
    country: z.string().optional(),
});

const schemaParticulier = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    age: z.number().min(18),
    address: z.string().optional(),
    city: z.string().optional(),
    zip_code: z.string().optional(),
    country: z.string().optional(),
});

const schemaLogin = z.object({
    email: z.string().email(),
    password: z.string(),
});

exports.registerPro = async (req, res) => {
    try {
        const d = schemaPro.parse(req.body);
        const { email, password, company_name, siret, kbis_url, site_web, specialites, address, city, zip_code, country } = d;

        const exist = await pool.query('SELECT id FROM UTILISATEURS WHERE email = $1', [email]);
        if (exist.rows.length > 0) return res.status(400).json({ error: 'Email pris' });

        const hash = await bcrypt.hash(password, 10);
        const client = await pool.connect();

        try {
            await client.query('BEGIN');
            const userRes = await client.query(
                `INSERT INTO UTILISATEURS (email, mot_de_passe_hash, role, adresse, ville, code_postal, pays)
                 VALUES ($1, $2, 'PRO', $3, $4, $5, $6) RETURNING id`,
                [email, hash, address, city, zip_code, country]
            );
            const uid = userRes.rows[0].id;

            await client.query(
                `INSERT INTO DETAILS_PRO (utilisateur_id, nom_entreprise, siret, kbis_url, site_web, specialites)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [uid, company_name, siret, kbis_url, site_web, specialites]
            );

            const unMois = new Date();
            unMois.setMonth(unMois.getMonth() + 1);

            await client.query(
                `INSERT INTO ABONNEMENTS_PRO (utilisateur_id, type, date_debut, date_fin, est_actif)
                 VALUES ($1, 'GRATUIT_1_MOIS', NOW(), $2, TRUE)`,
                [uid, unMois]
            );

            // Générer token de vérification d'email
            const verificationToken = generateToken();
            const verificationExpire = new Date();
            verificationExpire.setHours(verificationExpire.getHours() + 24); // 24h

            await client.query(
                `UPDATE UTILISATEURS SET token_verification = $1, token_verification_expire = $2 WHERE id = $3`,
                [verificationToken, verificationExpire, uid]
            );

            await client.query('COMMIT');

            // Envoyer l'email de vérification
            try {
                await emailService.sendVerificationEmail(email, verificationToken);
            } catch (emailError) {
                console.error('Erreur envoi email:', emailError);
                // On ne bloque pas l'inscription si l'email échoue
            }

            const token = jwt.sign({ id: uid, role: 'PRO' }, SECRET_KEY, { expiresIn: '24h' });
            res.status(201).json({ message: 'Compte Pro créé. Vérifiez votre email.', token, userId: uid });
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    } catch (e) {
        if (e instanceof z.ZodError) return res.status(400).json({ error: e.errors });
        console.error(e);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.registerIndividual = async (req, res) => {
    try {
        const d = schemaParticulier.parse(req.body);
        const { email, password, first_name, last_name, age, address, city, zip_code, country } = d;

        const exist = await pool.query('SELECT id FROM UTILISATEURS WHERE email = $1', [email]);
        if (exist.rows.length > 0) return res.status(400).json({ error: 'Email pris' });

        const hash = await bcrypt.hash(password, 10);
        const client = await pool.connect();

        try {
            await client.query('BEGIN');
            const userRes = await client.query(
                `INSERT INTO UTILISATEURS (email, mot_de_passe_hash, role, adresse, ville, code_postal, pays)
                 VALUES ($1, $2, 'PARTICULIER', $3, $4, $5, $6) RETURNING id`,
                [email, hash, address, city, zip_code, country]
            );
            const uid = userRes.rows[0].id;

            await client.query(
                `INSERT INTO DETAILS_PARTICULIER (utilisateur_id, prenom, nom, age)
                 VALUES ($1, $2, $3, $4)`,
                [uid, first_name, last_name, age]
            );

            // Générer token de vérification d'email
            const verificationToken = generateToken();
            const verificationExpire = new Date();
            verificationExpire.setHours(verificationExpire.getHours() + 24); // 24h

            await client.query(
                `UPDATE UTILISATEURS SET token_verification = $1, token_verification_expire = $2 WHERE id = $3`,
                [verificationToken, verificationExpire, uid]
            );

            await client.query('COMMIT');

            // Envoyer l'email de vérification
            try {
                await emailService.sendVerificationEmail(email, verificationToken);
            } catch (emailError) {
                console.error('Erreur envoi email:', emailError);
                // On ne bloque pas l'inscription si l'email échoue
            }

            const token = jwt.sign({ id: uid, role: 'PARTICULIER' }, SECRET_KEY, { expiresIn: '24h' });
            res.status(201).json({ message: 'Compte Particulier créé. Vérifiez votre email.', token, userId: uid });
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    } catch (e) {
        if (e instanceof z.ZodError) return res.status(400).json({ error: e.errors });
        console.error(e);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.login = async (req, res) => {
    try {
        const d = schemaLogin.parse(req.body);
        const { email, password } = d;

        const resDb = await pool.query('SELECT * FROM UTILISATEURS WHERE email = $1', [email]);
        if (resDb.rows.length === 0) return res.status(401).json({ error: 'Identifiants invalides' });

        const user = resDb.rows[0];
        const valid = await bcrypt.compare(password, user.mot_de_passe_hash);
        if (!valid) return res.status(401).json({ error: 'Identifiants invalides' });

        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ message: 'Connexion réussie', token, userId: user.id, role: user.role, emailVerified: user.email_verifie });
    } catch (e) {
        if (e instanceof z.ZodError) return res.status(400).json({ error: e.errors });
        console.error(e);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Vérifier l'email avec le token
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ error: 'Token manquant' });
        }

        const result = await pool.query(
            'SELECT * FROM UTILISATEURS WHERE token_verification = $1',
            [token]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Token invalide' });
        }

        const user = result.rows[0];

        // Vérifier si le token a expiré
        if (new Date() > new Date(user.token_verification_expire)) {
            return res.status(400).json({ error: 'Token expiré' });
        }

        // Mettre à jour l'utilisateur
        await pool.query(
            `UPDATE UTILISATEURS 
             SET email_verifie = TRUE, token_verification = NULL, token_verification_expire = NULL 
             WHERE id = $1`,
            [user.id]
        );

        res.json({ message: 'Email vérifié avec succès' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Demander la réinitialisation du mot de passe
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email manquant' });
        }

        const result = await pool.query('SELECT * FROM UTILISATEURS WHERE email = $1', [email]);

        // Toujours retourner un succès pour ne pas révéler si l'email existe
        if (result.rows.length === 0) {
            return res.json({ message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' });
        }

        const user = result.rows[0];

        // Générer token de réinitialisation
        const resetToken = generateToken();
        const resetExpire = new Date();
        resetExpire.setHours(resetExpire.getHours() + 1); // 1h

        await pool.query(
            `UPDATE UTILISATEURS 
             SET token_reset_password = $1, token_reset_password_expire = $2 
             WHERE id = $3`,
            [resetToken, resetExpire, user.id]
        );

        // Envoyer l'email de réinitialisation
        try {
            await emailService.sendPasswordResetEmail(email, resetToken);
        } catch (emailError) {
            console.error('Erreur envoi email:', emailError);
            return res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email' });
        }

        res.json({ message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Réinitialiser le mot de passe
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token ou mot de passe manquant' });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères' });
        }

        const result = await pool.query(
            'SELECT * FROM UTILISATEURS WHERE token_reset_password = $1',
            [token]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Token invalide' });
        }

        const user = result.rows[0];

        // Vérifier si le token a expiré
        if (new Date() > new Date(user.token_reset_password_expire)) {
            return res.status(400).json({ error: 'Token expiré' });
        }

        // Hasher le nouveau mot de passe
        const hash = await bcrypt.hash(newPassword, 10);

        // Mettre à jour le mot de passe
        await pool.query(
            `UPDATE UTILISATEURS 
             SET mot_de_passe_hash = $1, token_reset_password = NULL, token_reset_password_expire = NULL 
             WHERE id = $2`,
            [hash, user.id]
        );

        res.json({ message: 'Mot de passe réinitialisé avec succès' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Erreur serveur' });
    }

};

// Récupérer le profil de l'utilisateur connecté
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        // Récupérer les informations de base de l'utilisateur
        const userResult = await pool.query(
            'SELECT id, email, role, adresse, ville, code_postal, pays FROM UTILISATEURS WHERE id = $1',
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        const user = userResult.rows[0];
        let profileData = {
            id: user.id,
            email: user.email,
            role: user.role,
            adresse: user.adresse,
            ville: user.ville,
            code_postal: user.code_postal,
            pays: user.pays
        };

        // Récupérer les détails spécifiques selon le rôle
        if (userRole === 'PARTICULIER') {
            const detailsResult = await pool.query(
                'SELECT prenom, nom, age, photo_profil_url FROM DETAILS_PARTICULIER WHERE utilisateur_id = $1',
                [userId]
            );

            if (detailsResult.rows.length > 0) {
                const details = detailsResult.rows[0];
                profileData = {
                    ...profileData,
                    prenom: details.prenom,
                    nom: details.nom,
                    age: details.age,
                    photo_profil_url: details.photo_profil_url
                };
            }
        } else if (userRole === 'PRO') {
            const detailsResult = await pool.query(
                'SELECT nom_entreprise, siret, kbis_url, site_web, specialites FROM DETAILS_PRO WHERE utilisateur_id = $1',
                [userId]
            );

            if (detailsResult.rows.length > 0) {
                const details = detailsResult.rows[0];
                profileData = {
                    ...profileData,
                    nom_entreprise: details.nom_entreprise,
                    siret: details.siret,
                    kbis_url: details.kbis_url,
                    site_web: details.site_web,
                    specialites: details.specialites
                };
            }
        }

        res.json(profileData);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Mettre à jour le profil de l'utilisateur connecté
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const { 
            email, adresse, ville, code_postal, pays, 
            prenom, nom, photo_profil_url,
            nom_entreprise, siret, kbis_url, site_web, specialites
        } = req.body;

        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Vérifier si l'email est déjà utilisé par un autre utilisateur
            if (email) {
                const emailCheck = await client.query(
                    'SELECT id FROM UTILISATEURS WHERE email = $1 AND id != $2',
                    [email, userId]
                );

                if (emailCheck.rows.length > 0) {
                    await client.query('ROLLBACK');
                    return res.status(400).json({ error: 'Cet email est déjà utilisé' });
                }
            }

            // Mettre à jour les informations de base
            await client.query(
                `UPDATE UTILISATEURS 
                 SET email = COALESCE($1, email),
                     adresse = COALESCE($2, adresse),
                     ville = COALESCE($3, ville),
                     code_postal = COALESCE($4, code_postal),
                     pays = COALESCE($5, pays),
                     mis_a_jour_le = CURRENT_TIMESTAMP
                 WHERE id = $6`,
                [email, adresse, ville, code_postal, pays, userId]
            );

            // Mettre à jour les détails spécifiques selon le rôle
            if (userRole === 'PARTICULIER') {
                await client.query(
                    `UPDATE DETAILS_PARTICULIER 
                     SET prenom = COALESCE($1, prenom),
                         nom = COALESCE($2, nom),
                         photo_profil_url = COALESCE($3, photo_profil_url)
                     WHERE utilisateur_id = $4`,
                    [prenom, nom, photo_profil_url, userId]
                );
            } else if (userRole === 'PRO') {
                await client.query(
                    `UPDATE DETAILS_PRO 
                     SET nom_entreprise = COALESCE($1, nom_entreprise),
                         siret = COALESCE($2, siret),
                         kbis_url = COALESCE($3, kbis_url),
                         site_web = COALESCE($4, site_web),
                         specialites = COALESCE($5, specialites)
                     WHERE utilisateur_id = $6`,
                    [nom_entreprise, siret, kbis_url, site_web, specialites, userId]
                );
            }

            await client.query('COMMIT');

            res.json({ message: 'Profil mis à jour avec succès' });
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

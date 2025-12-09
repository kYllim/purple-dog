const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const { z } = require('zod');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

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

            await client.query('COMMIT');
            const token = jwt.sign({ id: uid, role: 'PRO' }, SECRET_KEY, { expiresIn: '24h' });
            res.status(201).json({ message: 'Compte Pro créé', token, userId: uid });
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

            await client.query('COMMIT');
            const token = jwt.sign({ id: uid, role: 'PARTICULIER' }, SECRET_KEY, { expiresIn: '24h' });
            res.status(201).json({ message: 'Compte Particulier créé', token, userId: uid });
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
        res.json({ message: 'Connexion réussie', token, role: user.role });
    } catch (e) {
        if (e instanceof z.ZodError) return res.status(400).json({ error: e.errors });
        console.error(e);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

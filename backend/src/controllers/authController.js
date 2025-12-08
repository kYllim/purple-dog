const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const { z } = require('zod');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey'; // Move to env in production

// Validation schemas
const registerProSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    company_name: z.string().min(1),
    siret: z.string().min(9),
    address: z.string().optional(),
    city: z.string().optional(),
    zip_code: z.string().optional(),
    country: z.string().optional(),
});

const registerIndividualSchema = z.object({
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

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

exports.registerPro = async (req, res) => {
    try {
        const data = registerProSchema.parse(req.body);
        const { email, password, company_name, siret, address, city, zip_code, country } = data;

        // Check if user exists
        const userResult = await pool.query('SELECT id FROM UTILISATEURS WHERE email = $1', [email]);
        if (userResult.rows.length > 0) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Create User
            const userInsert = await client.query(
                `INSERT INTO UTILISATEURS (email, mot_de_passe_hash, role, adresse, ville, code_postal, pays)
         VALUES ($1, $2, 'PRO', $3, $4, $5, $6) RETURNING id`,
                [email, hashedPassword, address, city, zip_code, country]
            );
            const userId = userInsert.rows[0].id;

            // Create Pro Details
            await client.query(
                `INSERT INTO DETAILS_PRO (utilisateur_id, nom_entreprise, siret)
         VALUES ($1, $2, $3)`,
                [userId, company_name, siret]
            );

            // Create Subscription (1 month free)
            const oneMonthLater = new Date();
            oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

            await client.query(
                `INSERT INTO ABONNEMENTS_PRO (utilisateur_id, type, date_debut, date_fin, est_actif)
         VALUES ($1, 'GRATUIT_1_MOIS', NOW(), $2, TRUE)`,
                [userId, oneMonthLater]
            );

            await client.query('COMMIT');

            const token = jwt.sign({ id: userId, role: 'PRO' }, SECRET_KEY, { expiresIn: '24h' });
            res.status(201).json({ message: 'Professional account created', token, userId });
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ error: err.errors });
        }
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.registerIndividual = async (req, res) => {
    try {
        const data = registerIndividualSchema.parse(req.body);
        const { email, password, first_name, last_name, age, address, city, zip_code, country } = data;

        const userResult = await pool.query('SELECT id FROM UTILISATEURS WHERE email = $1', [email]);
        if (userResult.rows.length > 0) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Create User
            const userInsert = await client.query(
                `INSERT INTO UTILISATEURS (email, mot_de_passe_hash, role, adresse, ville, code_postal, pays)
         VALUES ($1, $2, 'PARTICULIER', $3, $4, $5, $6) RETURNING id`,
                [email, hashedPassword, address, city, zip_code, country]
            );
            const userId = userInsert.rows[0].id;

            // Create Individual Details
            await client.query(
                `INSERT INTO DETAILS_PARTICULIER (utilisateur_id, prenom, nom, age)
         VALUES ($1, $2, $3, $4)`,
                [userId, first_name, last_name, age]
            );

            await client.query('COMMIT');

            const token = jwt.sign({ id: userId, role: 'PARTICULIER' }, SECRET_KEY, { expiresIn: '24h' });
            res.status(201).json({ message: 'Individual account created', token, userId });
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ error: err.errors });
        }
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const result = await pool.query('SELECT * FROM UTILISATEURS WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.mot_de_passe_hash);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ message: 'Login successful', token, role: user.role });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ error: err.errors });
        }
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

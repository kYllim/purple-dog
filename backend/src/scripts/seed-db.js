const pool = require('../db/index');
const bcrypt = require('bcryptjs');

async function seed() {
    try {
        console.log('Seeding database...');

        // 1. Categories
        const categories = [
            { nom: "Bijoux & montres", slug: "bijoux-montres" },
            { nom: "Meubles anciens", slug: "meubles-anciens" },
            { nom: "Objets d'art", slug: "objets-art" },
            { nom: "Peintures & sculptures", slug: "peintures-sculptures" },
            { nom: "Accessoires de luxe", slug: "accessoires-luxe" }
        ];

        for (const cat of categories) {
            await pool.query(
                `INSERT INTO CATEGORIES (nom, slug, taux_commission_acheteur, taux_commission_vendeur)
                 VALUES ($1, $2, 0.1, 0.1)
                 ON CONFLICT (slug) DO NOTHING`,
                [cat.nom, cat.slug]
            );
        }
        console.log('Categories seeded.');

        // 2. User
        const hashedPassword = await bcrypt.hash('password123', 10);
        const userEmail = 'test@user.com';

        // Check if user exists
        const userRes = await pool.query('SELECT id FROM UTILISATEURS WHERE email = $1', [userEmail]);
        let userId;

        if (userRes.rowCount === 0) {
            const insertRes = await pool.query(
                `INSERT INTO UTILISATEURS (email, mot_de_passe_hash, role, ville, pays)
                 VALUES ($1, $2, 'PARTICULIER', 'Paris', 'France')
                 RETURNING id`,
                [userEmail, hashedPassword]
            );
            userId = insertRes.rows[0].id;
            console.log(`User created with ID: ${userId}`);

            // Details particulier
            await pool.query(
                `INSERT INTO DETAILS_PARTICULIER (utilisateur_id, prenom, nom, age)
                 VALUES ($1, 'Jean', 'Dupont', 30)`,
                [userId]
            );
        } else {
            console.log('User already exists.');
        }

        console.log('Seeding completed successfully.');
    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        await pool.end();
    }
}

seed();

const { Pool } = require('pg');
const emailService = require('../services/emailService');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

exports.submitFeedback = async (req, res) => {
    try {
        const { note, commentaire } = req.body;
        
       
        if (!note || note < 1 || note > 10) {
            return res.status(400).json({ error: 'Note invalide (1-10)' });
        }


        let auteurId = null;
        let auteurInfo = null;
        
        if (req.user) {
            auteurId = req.user.id;
            
            
            const userResult = await pool.query(
                'SELECT role FROM UTILISATEURS WHERE id = $1',
                [auteurId]
            );
            
            if (userResult.rows.length > 0) {
                const user = userResult.rows[0];
                
               
                if (user.role === 'PRO') {
                    const proResult = await pool.query(
                        'SELECT nom_entreprise FROM DETAILS_PRO WHERE utilisateur_id = $1',
                        [auteurId]
                    );
                    if (proResult.rows.length > 0) {
                        auteurInfo = proResult.rows[0].nom_entreprise;
                    }
                } else if (user.role === 'PARTICULIER') {
                    const particResult = await pool.query(
                        'SELECT prenom, nom FROM DETAILS_PARTICULIER WHERE utilisateur_id = $1',
                        [auteurId]
                    );
                    if (particResult.rows.length > 0) {
                        const partic = particResult.rows[0];
                        auteurInfo = `${partic.prenom} ${partic.nom}`;
                    }
                }
            }
        }


        const result = await pool.query(
            'INSERT INTO AVIS (auteur_id, note, commentaire) VALUES ($1, $2, $3) RETURNING *',
            [auteurId, note, commentaire || null]
        );

        const avis = result.rows[0];

        try {
            await emailService.sendFeedbackEmail(note, commentaire, auteurInfo);
        } catch (emailError) {
            console.error('Erreur envoi email feedback:', emailError);

        }

        res.status(201).json({ 
            message: 'Avis envoyé avec succès', 
            avis 
        });
    } catch (error) {
        console.error('Erreur submitFeedback:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

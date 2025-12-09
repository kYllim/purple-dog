const { z } = require('zod');
const service = require('../services/utilisateurService');

// Schémas de validation en Français (Zod)
const schemaCreation = z.object({
    role: z.enum(['PRO', 'PARTICULIER']),
    email: z.string().email(),
    password: z.string().min(8),
    // Champs conditionnels gérés souplement ou via un super refine,
    // mais pour rester simple on met tout optionnel et on vérifie dans le code ou on fait une union
    // Ici on laisse flexible pour l'exemple étudiant
}).passthrough();

const lister = async (req, res) => {
    try {
        const users = await service.listerUtilisateurs();
        res.json(users);
    } catch (e) {
        console.error(e);
        res.status(500).json({ erreur: 'Erreur serveur' });
    }
};

const voir = async (req, res) => {
    try {
        const user = await service.obtenirUtilisateurParId(req.params.id);
        if (!user) return res.status(404).json({ erreur: 'Utilisateur introuvable' });
        res.json(user);
    } catch (e) {
        console.error(e);
        res.status(500).json({ erreur: 'Erreur serveur' });
    }
};

const creer = async (req, res) => {
    try {
        // Validation basique
        const validation = schemaCreation.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ erreur: validation.error.errors });
        }

        const resultat = await service.creerUtilisateur(req.body);
        res.status(201).json(resultat);
    } catch (e) {
        console.error(e);
        res.status(400).json({ erreur: e.message });
    }
};

const modifier = async (req, res) => {
    try {
        const resultat = await service.modifierUtilisateur(req.params.id, req.body);
        if (!resultat) return res.status(404).json({ erreur: 'Utilisateur introuvable ou rien à modifier' });
        res.json(resultat);
    } catch (e) {
        console.error(e);
        res.status(500).json({ erreur: 'Erreur serveur' });
    }
};

const supprimer = async (req, res) => {
    try {
        const resultat = await service.supprimerUtilisateur(req.params.id);
        if (!resultat.trouve && resultat.trouve !== undefined) {
            return res.status(404).json({ erreur: 'Utilisateur introuvable' });
        }

        if (resultat.action === 'blacklist') {
            return res.json({ message: 'Compte professionnel désactivé (Blacklisté).' });
        } else {
            return res.json({ message: 'Compte particulier supprimé définitivement.' });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ erreur: 'Erreur serveur' });
    }
};

module.exports = {
    lister,
    voir,
    creer,
    modifier,
    supprimer
};
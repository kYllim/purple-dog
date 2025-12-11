const service = require('../services/objetService.js');
const { z } = require('zod');

const schemaObjet = z.object({
    titre: z.string(),
    description: z.string().optional(),
    categorie: z.string().optional(),
    type_vente: z.enum(['Encheres', 'Vente rapide']),
    prix_souhaite: z.number().optional(),
    prix_depart: z.number().optional(),
    prix_achat_immediat: z.number().optional(),
    photos: z.array(z.string()).optional(),
    documents: z.array(z.string()).optional(),
});

exports.creer = async (req, res) => {
    try {
        const data = schemaObjet.parse(req.body);
        const userId = req.utilisateur.id;

        const objet = await service.creerObjet(data, userId);
        res.status(201).json(objet);

    } catch (e) {
        console.error(e);
        res.status(400).json({ erreur: e.message });
    }
};

exports.lister = async (req, res) => {
    try {
        const objets = await service.listerObjets(req.query);
        res.json(objets);
    } catch (e) {
        console.error(e);
        res.status(500).json({ erreur: "Erreur serveur" });
    }
};

exports.voir = async (req, res) => {
    try {
        const objet = await service.getObjet(req.params.id);
        if (!objet) return res.status(404).json({ erreur: "Objet introuvable" });

        res.json(objet);
    } catch (e) {
        console.error(e);
        res.status(500).json({ erreur: "Erreur serveur" });
    }
};

exports.supprimer = async (req, res) => {
    try {
        const ok = await service.supprimerObjet(req.params.id, req.utilisateur.id);
        if (!ok) return res.status(403).json({ erreur: "Non autorisé ou objet introuvable" });

        res.json({ message: "Objet supprimé" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ erreur: "Erreur serveur" });
    }
};

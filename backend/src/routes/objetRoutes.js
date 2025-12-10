const express = require('express');
const objetController = require('../controllers/objetController');

const router = express.Router();

router.get('/objets', objetController.getObjets);
router.get('/favorites/:utilisateur_id', objetController.getFavorites);
router.get('/offres/:utilisateur_id', objetController.getOffres);
router.get('/encheres/:utilisateur_id', objetController.getEncheres);
router.get('/achats/:utilisateur_id', objetController.getAchats);
router.get('/encheres-perdues/:utilisateur_id', objetController.getEncheresperdues);
router.post('/favorites/toggle', objetController.toggleFavorite);

module.exports = router;
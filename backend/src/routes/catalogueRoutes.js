const express = require('express');
const catalogueController = require('../controllers/catalogueController');

const router = express.Router();

router.get('/catalogue', catalogueController.getObjets);
router.get('/favorites/:utilisateur_id', catalogueController.getFavorites);
router.get('/offres/:utilisateur_id', catalogueController.getOffres);
router.get('/encheres/:utilisateur_id', catalogueController.getEncheres);
router.get('/achats/:utilisateur_id', catalogueController.getAchats);
router.get('/encheres-perdues/:utilisateur_id', catalogueController.getEncheresperdues);
router.post('/favorites/toggle', catalogueController.toggleFavorite);
router.get('/catalogue/:id', catalogueController.getObjetById);

module.exports = router;
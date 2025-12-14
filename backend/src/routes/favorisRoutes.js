const express = require('express');
const router = express.Router();
const favorisController = require('../controllers/favorisController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, favorisController.obtenirFavoris);
router.post('/', authenticateToken, favorisController.ajouterFavori);
router.delete('/:objetId', authenticateToken, favorisController.retirerFavori);
router.get('/:objetId/check', authenticateToken, favorisController.estFavori);

module.exports = router;

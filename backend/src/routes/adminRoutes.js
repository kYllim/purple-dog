const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminUtilisateurController');
const estAdmin = require('../middlewares/adminMiddleware');

// Toutes les routes admin sont protégées
router.use(estAdmin);

router.get('/utilisateurs', controller.lister);
router.post('/utilisateurs', controller.creer);
router.get('/utilisateurs/:id', controller.voir);
router.put('/utilisateurs/:id', controller.modifier);
router.delete('/utilisateurs/:id', controller.supprimer);

module.exports = router;
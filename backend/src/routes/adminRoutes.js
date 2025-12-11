const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminUtilisateurController');
const objetsController = require('../controllers/adminObjetsController');
const estAdmin = require('../middlewares/adminMiddleware');


router.use(estAdmin);

router.get('/utilisateurs', controller.lister);
router.post('/utilisateurs', controller.creer);
router.get('/utilisateurs/:id', controller.voir);
router.put('/utilisateurs/:id', controller.modifier);
router.delete('/utilisateurs/:id', controller.supprimer);

router.get('/objets', objetsController.listerTout);
router.delete('/objets/:id', objetsController.supprimer);

module.exports = router;

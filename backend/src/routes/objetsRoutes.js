const express = require("express");
const objetsController = require("../controllers/objetsController");
const { authenticateToken: authMiddleware } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.get("/", require("../middlewares/authMiddleware").optionalAuth, objetsController.obtenirTousLesObjets);

router.get("/categories", objetsController.obtenirCategories);

router.get("/user/:userId", objetsController.obtenirObjetsUtilisateur);

router.get("/mes-encheres", authMiddleware, objetsController.obtenirMesEncheresParticipees);

router.get("/:id", objetsController.obtenirObjetParId);

router.post("/", authMiddleware, upload.fields([
    { name: 'photos', maxCount: 10 },
    { name: 'documents', maxCount: 5 }
]), objetsController.creerObjet);

router.post("/:id/encherir", authMiddleware, objetsController.placerEnchere);
router.post("/:id/offres", authMiddleware, objetsController.faireOffre);

router.put("/:id", authMiddleware, upload.fields([
    { name: 'photos', maxCount: 10 }
]), objetsController.mettreAJourObjet);

router.delete("/:id", authMiddleware, objetsController.supprimerObjet);

module.exports = router;

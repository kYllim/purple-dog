const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/objetsController");
const auth = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

// Créer un objet avec ou sans photos
router.post("/", auth, upload.array("photos", 10), ctrl.creer);

// Lister tous les objets
router.get("/", ctrl.lister);

// Voir un objet par ID
router.get("/:id", ctrl.voir);

// Supprimer un objet
router.delete("/:id", auth, ctrl.supprimer);

module.exports = router;

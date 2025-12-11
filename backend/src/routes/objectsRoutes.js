const express = require("express");
const { createObjet, getCategories, getUserObjects } = require("../controllers/objetsController");

const router = express.Router();

// Créer un objet
router.post("/", createObjet);

// Récupérer les catégories
router.get("/categories", getCategories);

// Récupérer les objets d'un utilisateur
router.get("/user/:userId", getUserObjects);

module.exports = router;

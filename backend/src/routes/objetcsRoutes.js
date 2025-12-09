import express from "express";
import { createObjet, getCategories } from "../controllers/objetsController.js";

const router = express.Router();

// Créer un objet
router.post("/", createObjet);

// Récupérer les catégories
router.get("/categories", getCategories);

export default router;

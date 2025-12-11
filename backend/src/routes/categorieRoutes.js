const express = require("express");
const router = express.Router();
const pool = require("../db/db"); // Assure-toi que le pool pointe vers la bonne DB

// GET /categories
router.get("/", async (req, res) => {
try {
// Attention aux majuscules : PostgreSQL est sensible si tu as créé la table avec "CATEGORIES"
const result = await pool.query('SELECT id, nom FROM CATEGORIES ORDER BY nom');
res.json(result.rows);
} catch (err) {
console.error("Erreur en récupérant les catégories :", err);
res.status(500).json({ erreur: err.message });
}
});

module.exports = router;

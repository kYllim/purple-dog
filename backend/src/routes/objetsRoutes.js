const express = require("express");
const objetsController = require("../controllers/objetsController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();


// Protected routes (Specific routes must be before /:id)
router.get("/mes-encheres", authMiddleware, objetsController.getMyParticipatedAuctions);

// Public routes
router.get("/categories", objetsController.getCategories);
router.get("/:id", objetsController.getObjetById); // New: Get details including auction status
router.post("/", authMiddleware, objetsController.createObjet);
router.post("/:id/encherir", authMiddleware, objetsController.placeBid);
router.post("/:id/offres", authMiddleware, objetsController.makeOffer);

module.exports = router;

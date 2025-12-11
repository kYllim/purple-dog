const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/objetsController");
const auth = require("../middlewares/adminMiddleware");

router.post("/", auth, ctrl.creer);
router.get("/", ctrl.lister);
router.get("/:id", ctrl.voir);
router.delete("/:id", auth, ctrl.supprimer);

module.exports = router;

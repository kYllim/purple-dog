const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register/pro', authController.registerPro);
router.post('/register/individual', authController.registerIndividual);
router.post('/login', authController.login);

module.exports = router;

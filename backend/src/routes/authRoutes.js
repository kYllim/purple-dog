const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const upload = require('../middlewares/uploadMiddleware');

// Routes publiques
router.post('/register/pro', upload.fields([
    { name: 'kbis', maxCount: 1 },
    { name: 'photo_profil', maxCount: 1 } // Au cas où
]), authController.registerPro);

router.post('/register/individual', upload.single('photo_profil'), authController.registerIndividual);
router.post('/login', authController.login);
router.post('/verify-email', authController.verifyEmail);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Routes protégées (nécessitent un token JWT)
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.updateProfile);

module.exports = router;

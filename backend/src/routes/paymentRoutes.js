const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.post('/create-checkout-session', authenticateToken, paymentController.createCheckoutSession);
router.post('/success', authenticateToken, paymentController.handlePaymentSuccess);
router.get('/commandes', authenticateToken, paymentController.getMyOrders);

module.exports = router;

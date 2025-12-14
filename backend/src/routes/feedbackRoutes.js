const express = require('express');
const feedbackController = require('../controllers/feedbackController');
const { optionalAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/feedback', optionalAuth, feedbackController.submitFeedback);

module.exports = router;

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware'); // Protect it!

router.post('/chat', authMiddleware, aiController.chatWithSalesAI);

module.exports = router;
const express = require('express');
const { processPayment, getPaymentHistory } = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');
const { getPaymentsBySale } = require('../models/Payment');

const router = express.Router();

router.post('/process', authMiddleware, processPayment);
router.get('/history', authMiddleware, getPaymentHistory);

module.exports = router;
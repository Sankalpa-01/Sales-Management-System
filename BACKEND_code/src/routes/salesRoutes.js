const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const authMiddleware = require('../middleware/authMiddleware');

// GET all sales with items
router.get('/', authMiddleware, salesController.getAllSales);

// GET a specific sale by ID
router.get('/:id', authMiddleware, salesController.getSaleById);

// POST a new sale
router.post('/', authMiddleware, salesController.createSale);

// DELETE a sale
router.delete('/:id', authMiddleware, salesController.deleteSale);

module.exports = router;

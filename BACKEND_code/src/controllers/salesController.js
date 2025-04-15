// DONE CHECKING

const Sale = require('../models/Sale');

// Get all sales with their items
const getAllSales = async (req, res, next) => {
    try {
        const sales = await Sale.getAllSalesWithItems();
        res.status(200).json(sales);
    } catch (err) {
        console.error('Error fetching sales:', err);
        next({ statusCode: 500, message: 'Database error', error: err });
    }
};

// Get a single sale by ID
const getSaleById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const sale = await Sale.getSaleByIdWithItems(id);

        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        res.status(200).json(sale);
    } catch (err) {
        console.error('Error fetching sale:', err);
        next({ statusCode: 500, message: 'Database error', error: err });
    }
};

// Create a new sale
const createSale = async (req, res, next) => {
    try {
        const { user_id, customer_id, total_amount, items } = req.body;

        if (!user_id || !customer_id || !total_amount || !Array.isArray(items)) {
            return res.status(400).json({ message: 'Missing required fields or invalid items' });
        }

        const sale_id = await Sale.createSale(user_id, customer_id, total_amount, items);
        res.status(201).json({ message: 'Sale created successfully', sale_id });
    } catch (err) {
        console.error('Error creating sale:', err);
        next({ statusCode: 500, message: 'Database error', error: err });
    }
};

// Delete a sale
const deleteSale = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await Sale.deleteSale(id);

        if (!deleted) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        res.status(200).json({ message: 'Sale deleted successfully' });
    } catch (err) {
        console.error('Error deleting sale:', err);
        next({ statusCode: 500, message: 'Database error', error: err });
    }
};

module.exports = {
    getAllSales,
    getSaleById,
    createSale,
    deleteSale
};

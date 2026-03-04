// DONE CHECKING

const Customer = require('../models/Customer');

const getAllCustomers = async (req, res, next) => {
    try {
        const customers = await Customer.getAllCustomers();
        res.status(200).json(customers);
    } catch (err) {
        next({ statusCode: 500, message: 'Database error', error: err });
    }
};

const getCustomerById = async (req, res, next) => {
    try {
        const customer = await Customer.getCustomerById(req.params.id);
        if (!customer) {
            return next({ statusCode: 404, message: 'Customer not found' });
        }
        res.status(200).json(customer);
    } catch (err) {
        next({ statusCode: 500, message: 'Database error', error: err });
    }
};

// controllers/customerController.js
const addCustomer = async (req, res, next) => {
    const { username, email, phone, address } = req.body;
    if (!username || !email || !phone) {
        return next({ statusCode: 400, message: 'All fields are required' });
    }

    try {
        const customerId = await Customer.addCustomer(username, email, phone, address);
        // Return full customer data including the generated ID
        res.status(201).json({ 
            customer_id: customerId,
            username,
            email,
            phone,
            address
        });
    } catch (err) {
        console.error('Database error:', err);
        next({ statusCode: 500, message: 'Failed to create customer', error: err.message });
    }
};

const updateCustomer = async (req, res) => {
    const { id } = req.params;
    const { username, email, phone, address } = req.body;

    try {
        const success = await Customer.updateCustomer(id, username, email, phone, address);
        if (!success) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.status(200).json({ message: 'Customer updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteCustomer = async (req, res, next) => {
    try {
        const deleted = await Customer.deleteCustomer(req.params.id);
        if (!deleted) {
            return next({ statusCode: 404, message: 'Customer not found' });
        }
        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (err) {
        next({ statusCode: 500, message: 'Database error', error: err });
    }
};

module.exports = {
    getAllCustomers,
    getCustomerById,
    addCustomer,
    updateCustomer,
    deleteCustomer
};

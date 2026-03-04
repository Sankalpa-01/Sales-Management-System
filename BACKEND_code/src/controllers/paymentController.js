// DONE CHECKING

const Payment = require('../models/Payment');

// Process a payment
const processPayment = async (req, res, next) => {
    try {
        const { sale_id, amount_paid, payment_method } = req.body;

        if (!sale_id || !amount_paid || !payment_method) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (isNaN(amount_paid) || amount_paid <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        const payment_id = await Payment.processPayment(sale_id, amount_paid, payment_method);
        res.status(201).json({ message: "Payment initiated", payment_id });
    } catch (err) {
        console.error("Error processing payment:", err);
        next({ statusCode: 500, message: "Database error", error: err });
    }
};

// Get all payment history
const getPaymentHistory = async (req, res, next) => {
    try {
        const payments = await Payment.getPaymentHistory();
        res.status(200).json(payments);
    } catch (err) {
        console.error("Error fetching payment history:", err);
        next({ statusCode: 500, message: "Database error", error: err });
    }
};

module.exports = { processPayment, getPaymentHistory };

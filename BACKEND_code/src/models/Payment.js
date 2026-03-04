const db = require('../config/db');

class Payment {
    static async processPayment(sale_id, amount_paid, payment_method, payment_status) {
        try {
            const query = `
                INSERT INTO payment (sale_id, amount_paid, payment_method, payment_status)
                VALUES (?, ?, ?, ?)
            `;
            const [result] = await db.query(query, [sale_id, amount_paid, payment_method, payment_status]);
            return result.insertId;
        } catch (error) {
            console.error('Error processing payment:', error);
            throw error; // Propagate error
        }
    }

    static async getPaymentHistory() {
        try {
            const query = "SELECT * FROM payment ORDER BY payment_date DESC";
            const [rows] = await db.query(query);
            return rows;
        } catch (error) {
            console.error('Error fetching payment history:', error);
            throw error; // Propagate error
        }
    }
}

module.exports = Payment;

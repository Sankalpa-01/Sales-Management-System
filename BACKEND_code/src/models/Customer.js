const db = require('../config/db');

class Customer {
    // checked
    static async getAllCustomers() {
        const [rows] = await db.query('SELECT * FROM customers');
        return rows;
    }

    // checked
    static async getCustomerById(id) {
        const [rows] = await db.query('SELECT * FROM customers WHERE customer_id = ?', [id]);
        return rows[0];
    }

    //checked
    static async addCustomer(username, email, phone, address) {
        const query = 'INSERT INTO customers (username, email, phone, address) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(query, [username, email, phone, address]);
        return result.insertId;
    }

    // checked
    static async updateCustomer(id, username, email, phone, address) {
        const query = 'UPDATE customers SET username = ?, email = ?, phone = ?, address = ? WHERE customer_id = ?';
        const [result] = await db.query(query, [username, email, phone, address, id]);
        return result.affectedRows > 0;
    }
    

    // checked
    static async deleteCustomer(id) {
        const query = 'DELETE FROM customers WHERE customer_id = ?';
        const [result] = await db.query(query, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Customer;

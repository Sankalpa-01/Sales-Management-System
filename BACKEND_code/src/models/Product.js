const db = require('../config/db');

class Product {
    static async getAllProducts() {
        const query = 'SELECT * FROM products';
        const [rows] = await db.query(query);
        return rows;
    }

    static async getProductById(id) {
        const query = 'SELECT * FROM products WHERE product_id = ?';
        const [rows] = await db.query(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    static async addProduct(product_name, product_description, price, stock_quantity) {
        const query = 'INSERT INTO products (product_name, product_description, price, stock_quantity) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(query, [product_name, product_description, price, stock_quantity]);
        return result.insertId;
    }

    static async updateProduct(product_id, product_name, price, stock_quantity) {
        const query = `
            UPDATE products 
            SET product_name = ?, price = ?, stock_quantity = ?
            WHERE product_id = ?
        `;
        const [result] = await db.query(query, [product_name, price, stock_quantity, product_id]);
        return result.affectedRows > 0;
    }
    

    static async deleteProduct(id) {
        const query = 'DELETE FROM products WHERE product_id = ?';
        const [result] = await db.query(query, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Product;

const db = require('../config/db');

class Sale {
    // Get all sales with their associated items
    static async getAllSalesWithItems() {
        const query = `
            SELECT 
                s.sale_id, s.user_id, s.customer_id, s.total_amount,
                si.sale_item_id, si.product_id, si.quantity, si.price
            FROM sales s
            LEFT JOIN sales_items si ON s.sale_id = si.sale_id
            ORDER BY s.sale_id;
        `;
        const [rows] = await db.query(query);

        // Group by sale_id
        const salesMap = new Map();
        rows.forEach(row => {
            if (!salesMap.has(row.sale_id)) {
                salesMap.set(row.sale_id, {
                    sale_id: row.sale_id,
                    user_id: row.user_id,
                    customer_id: row.customer_id,
                    total_amount: row.total_amount,
                    items: []
                });
            }
            if (row.sale_item_id) {
                salesMap.get(row.sale_id).items.push({
                    sale_item_id: row.sale_item_id,
                    product_id: row.product_id,
                    quantity: row.quantity,
                    price: row.price
                });
            }
        });

        return Array.from(salesMap.values());
    }

    // Get a single sale by ID with items
    static async getSaleByIdWithItems(saleId) {
        const query = `
            SELECT 
                s.sale_id, s.user_id, s.customer_id, s.total_amount,
                si.sale_item_id, si.product_id, si.quantity, si.price
            FROM sales s
            LEFT JOIN sales_items si ON s.sale_id = si.sale_id
            WHERE s.sale_id = ?;
        `;
        const [rows] = await db.query(query, [saleId]);

        if (rows.length === 0) return null;

        const sale = {
            sale_id: rows[0].sale_id,
            user_id: rows[0].user_id,
            customer_id: rows[0].customer_id,
            total_amount: rows[0].total_amount,
            items: []
        };

        rows.forEach(row => {
            if (row.sale_item_id) {
                sale.items.push({
                    sale_item_id: row.sale_item_id,
                    product_id: row.product_id,
                    quantity: row.quantity,
                    price: row.price
                });
            }
        });

        return sale;
    }

    // Create a new sale with items
    static async createSale(user_id, customer_id, total_amount, items) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const [saleResult] = await conn.query(
                'INSERT INTO sales (user_id, customer_id, total_amount) VALUES (?, ?, ?)',
                [user_id, customer_id, total_amount]
            );

            const sale_id = saleResult.insertId;

            for (const item of items) {
                await conn.query(
                    'INSERT INTO sales_items (sale_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                    [sale_id, item.product_id, item.quantity, item.price]
                );
            }

            await conn.commit();
            return sale_id;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }

    // Delete a sale
    static async deleteSale(sale_id) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            await conn.query('DELETE FROM sales_items WHERE sale_id = ?', [sale_id]);
            const [result] = await conn.query('DELETE FROM sales WHERE sale_id = ?', [sale_id]);

            await conn.commit();
            return result.affectedRows > 0;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }
}

module.exports = Sale;

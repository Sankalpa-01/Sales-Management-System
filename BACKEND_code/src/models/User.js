const db = require('../config/db');

class User {
    static async getAllUsers() {
        const query = 'SELECT user_id, username, email FROM users';
        const [rows] = await db.query(query);
        return rows;
    }

    static async getUserById(id) {
        const query = 'SELECT user_id, username, email FROM users WHERE user_id = ?';
        const [rows] = await db.query(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    static async registerUser(name, email, password) {
        const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        const [result] = await db.query(query, [name, email, password]);
        return result.insertId;
    }

    static async updateUser(user_id, username, email) {
        const query = 'UPDATE users SET username = ?, email = ? WHERE user_id = ?';
        const [result] = await db.query(query, [username, email, user_id]);
        return result.affectedRows > 0;
    }    

    static async deleteUser(id) {
        const query = 'DELETE FROM users WHERE user_id = ?';
        const [result] = await db.query(query, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = User;

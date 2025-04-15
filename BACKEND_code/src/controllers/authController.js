const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// **Register a new user**
const registerUser = async (req, res, next) => {
    const { username, email, password } = req.body; // use 'username' to match DB column

    if (!username || !email || !password) {
        return next({ statusCode: 400, message: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if user already exists
        const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return next({ statusCode: 400, message: 'User already exists' });
        }

        // Insert new user (use 'username' column)
        const [result] = await db.query(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        const token = generateToken(result.insertId);
        res.status(201).json({ message: 'User registered successfully', token });
    } catch (err) {
        console.error('Error in registerUser:', err);
        return next({ statusCode: 500, message: 'Server error' });
    }
};

// **Login user**
const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next({ statusCode: 400, message: 'All fields are required' });
    }

    try {
        const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (results.length === 0) {
            return next({ statusCode: 401, message: 'Invalid email or password' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password_hash); // fixed

        if (!isMatch) {
            return next({ statusCode: 401, message: 'Invalid email or password' });
        }

        const token = generateToken(user.user_id); // fixed
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Error in loginUser:', err);
        return next({ statusCode: 500, message: 'Server error' });
    }
};

// **Middleware to verify JWT token**
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return next({ statusCode: 401, message: 'Access denied, no token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded user info to request object
        next();
    } catch (err) {
        return next({ statusCode: 401, message: 'Invalid token' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    verifyToken
};

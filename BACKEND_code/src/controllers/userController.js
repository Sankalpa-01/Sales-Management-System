// DONE CHECKING

const User = require('../models/User');
const bcrypt = require('bcryptjs');

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        next({ statusCode: 500, message: 'Database error', error: err });
    }
};

const getUserById = async (req, res, next) => {
    try {
        const user = await User.getUserById(req.params.id);
        if (!user) {
            return next({ statusCode: 404, message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        next({ statusCode: 500, message: 'Database error', error: err });
    }
};

const updateUser = async (req, res, next) => {
    const { username, email } = req.body;
    if (!username || !email) {
        return next({ statusCode: 400, message: 'Both username and email are required' });
    }

    try {
        const updated = await User.updateUser(req.params.id, username, email);
        if (!updated) {
            return next({ statusCode: 404, message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        next({ statusCode: 500, message: 'Database error', error: err });
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const deleted = await User.deleteUser(req.params.id);
        if (!deleted) {
            return next({ statusCode: 404, message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        next({ statusCode: 500, message: 'Database error', error: err });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};

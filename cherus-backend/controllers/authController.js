// cherus-backend/controllers/authController.js
const { User } = require('../models');
const bcrypt = require('bcryptjs'); // Still needed for validPassword if not part of User model
const jwt = require('jsonwebtoken'); // ADD THIS LINE: Import jsonwebtoken

exports.register = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'User with that email already exists.' });
        }

        const newUser = await User.create({ email, password });

        // --- ADDED JWT TOKEN GENERATION ---
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email }, // Payload: data to store in the token
            process.env.JWT_SECRET,                  // Secret key from .env
            { expiresIn: '1h' }                      // Token expiration time (e.g., 1 hour)
        );
        // --- END ADDED JWT TOKEN GENERATION ---

        res.status(201).json({
            message: 'User registered successfully!',
            user: {
                id: newUser.id,
                email: newUser.email,
            },
            token: token // ADDED: Send the JWT token
        });

    } catch (error) {
        console.error('Error during user registration:', error);
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            return res.status(400).json({ message: 'Validation error', errors });
        }
        next(error);
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isValidPassword = user.validPassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // --- ADDED JWT TOKEN GENERATION ---
        const token = jwt.sign(
            { id: user.id, email: user.email }, // Payload: data to store in the token
            process.env.JWT_SECRET,           // Secret key from .env
            { expiresIn: '1h' }               // Token expiration time (e.g., 1 hour)
        );
        // --- END ADDED JWT TOKEN GENERATION ---

        res.status(200).json({
            message: 'Login successful!',
            user: {
                id: user.id,
                email: user.email,
            },
            token: token // ADDED: Send the JWT token
        });

    } catch (error) {
        console.error('Error during user login:', error);
        next(error);
    }
};
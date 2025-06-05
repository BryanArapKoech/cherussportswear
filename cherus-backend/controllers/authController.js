// cherus-backend/controllers/authController.js



const { User } = require('../models');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // Password validation logic
    const passwordErrors = [];
    if (password.length < 8) {
        passwordErrors.push('Password must be at least 8 characters long.');
    }
    if (!/[a-z]/.test(password)) {
        passwordErrors.push('Password must include at least one lowercase letter.');
    }
    if (!/[A-Z]/.test(password)) {
        passwordErrors.push('Password must include at least one uppercase letter.');
    }
    if (!/[0-9]/.test(password)) {
        passwordErrors.push('Password must include at least one number.');
    }
    if (!/[!@#$%^&*]/.test(password)) { // Check for special characters
        // Adjusted to match the frontend's expectation of a specific error message
        passwordErrors.push('Password must include at least one special character (e.g., !@#$%^&*).');
        }
    if (passwordErrors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Password validation failed.', // General message for the frontend to potentially display if it doesn't iterate errors
            errors: passwordErrors // Array of specific password issues for detailed feedback
        });
    }
    

    try {
        // Email format validation is handled by Sequelize model (isEmail: true)
        // which will be caught in the catch block if it fails.

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'User with that email already exists.' });
        }

        const newUser = await User.create({ email, password }); // Password will be hashed by the model's hook

        const token = jwt.sign(
            { id: newUser.id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            success: true,
            message: 'Account created successfully! Welcome to Cherus Sportswear!', // Matches frontend login.js success message
            user: { // Optional: sending back user info
                id: newUser.id,
                email: newUser.email,
            },
            token: token // Matches frontend login.js expectation (though not typically used immediately on register success by frontend)
        });

    } catch (error) {
        console.error('Error during user registration:', error);
        if (error.name === 'SequelizeValidationError') {
            // This will catch email format validation errors from the model
            const errors = error.errors.map(err => err.message);
            return res.status(400).json({ success: false, message: 'Validation error', errors });
        }
        // For other errors, provide a generic message to the frontend
        return res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
    }
};

// Path: cherus-backend/controllers/authController.js
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        // This was returning: return res.status(400).json({ message: 'Email and password are required.' });
        // Aligning with frontend expectation of success property:
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            // To match login.js error handling
            return res.status(401).json({ success: false, message: 'Invalid email or password. Please try again.' });
        }

        const isValidPassword = user.validPassword(password); // validPassword method from User model
        if (!isValidPassword) {
             // To match login.js error handling
            return res.status(401).json({ success: false, message: 'Invalid email or password. Please try again.' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            success: true, // To match login.js
            message: 'Login successful! Redirecting...', // To match login.js
            user: { // Optional
                id: user.id,
                email: user.email,
            },
            token: token // login.js expects this
        });

    } catch (error) {
        console.error('Error during user login:', error);
        // next(error);
        return res.status(500).json({ success: false, message: 'An error occurred. Please try again.' }); // To match login.js
    }
};
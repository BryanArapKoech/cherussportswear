// cherus-backend/controllers/passwordController.js
const { User } = require('../models');
const crypto = require('crypto'); // Make sure this line is here

exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        const user = await User.findOne({ where: { email: email } });

        if (user) {
            // Generate a secure, random token.
            const resetToken = crypto.randomBytes(32).toString('hex');
            
            // For testing, log the generated token.
            // In the next step, we will save this to the database.
            console.log(`User found for email ${email}. Generated token: ${resetToken}`);

        } else {
            console.log(`Password reset request: No user found for email ${email}`);
        }
        
        // This response will be updated in a later task.
        res.status(200).json({ message: 'Token generation process completed.' });

    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
};

exports.resetPassword = (req, res) => {
    res.status(200).json({ message: 'Reset password endpoint reached.' });
};
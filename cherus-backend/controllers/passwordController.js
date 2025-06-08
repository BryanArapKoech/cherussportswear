// cherus-backend/controllers/passwordController.js
const { User } = require('../models');
const crypto = require('crypto');

exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        const user = await User.findOne({ where: { email: email } });

        if (user) {
            const resetToken = crypto.randomBytes(32).toString('hex');
            
            // Set token and expiry (1 hour from now)
            user.reset_token = resetToken;
            user.reset_token_expires_at = new Date(Date.now() + 3600000); // 1 hour in ms

            // Save the updated user record to the database
            await user.save();
            
            console.log(`Token for ${email} saved to database.`);

        } else {
            console.log(`Password reset request: No user found for email ${email}`);
        }
        
        res.status(200).json({ message: 'Database update process completed.' });

    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
};

exports.resetPassword = (req, res) => {
    res.status(200).json({ message: 'Reset password endpoint reached.' });
};
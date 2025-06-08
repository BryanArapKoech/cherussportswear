// cherus-backend/controllers/passwordController.js
const { User } = require('../models');
const crypto = require('crypto');

exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            // This is a validation error, so it's okay to send a specific response.
            return res.status(400).json({ message: 'Email is required.' });
        }

        const user = await User.findOne({ where: { email: email } });

        if (user) {
            const resetToken = crypto.randomBytes(32).toString('hex');
            
            user.reset_token = resetToken;
            user.reset_token_expires_at = new Date(Date.now() + 3600000); // 1 hour

            await user.save();
            
            // --- START: Email Simulation ---
            // In a real application, you would use a service like Nodemailer or SendGrid here.
            // For now, we construct the link and log it to the console.
            // NOTE: The frontend URL is hardcoded here for now. In production, this should come from a .env variable.
            const resetUrl = `http://127.0.0.1:5500/reset-password.html?token=${resetToken}`;
            
            console.log('--- SIMULATING EMAIL ---');
            console.log(`To: ${user.email}`);
            console.log(`Subject: Password Reset Request`);
            console.log(`Body: To reset your password, please click on this link: ${resetUrl}`);
            console.log('------------------------');
            // --- END: Email Simulation ---
        }
        
        // IMPORTANT: Send the same generic response whether a user was found or not.
        // This prevents attackers from guessing which emails are registered.
        res.status(200).json({ 
            message: "If a matching account was found, an email has been sent to reset your password." 
        });

    } catch (error) {
        console.error('Forgot Password Error:', error);
        // Also send a generic error for internal server issues.
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
};

exports.resetPassword = (req, res) => {
    res.status(200).json({ message: 'Reset password endpoint reached.' });
};
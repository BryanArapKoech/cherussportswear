// cherus-backend/controllers/passwordController.js
const { User } = require('../models');
const { Op } = require('sequelize');
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
            user.reset_token_expires_at = new Date(Date.now() + 900000); // 15 minutes

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


exports.resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;

        // 1. Basic input validation
        if (!token || !password) {
            return res.status(400).json({ message: 'New password are required.' });
        }

        // 2.password complexity validation
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
        }
        if (!/[A-Z]/.test(password)) {
            return res.status(400).json({ message: 'Password must include at least one uppercase letter.' });
        }
        if (!/[a-z]/.test(password)) {
            return res.status(400).json({ message: 'Password must include at least one lowercase letter.' });
        }
        if (!/[0-9]/.test(password)) {
            return res.status(400).json({ message: 'Password must include at least one number.' });
        }
        if (!/[!@#$%^&*]/.test(password)) {
            return res.status(400).json({ message: 'Password must include at least one special character (e.g., !@#$%^&*).' });
        }

        // 3. Find the user by a valid token
        const user = await User.findOne({
            where: {
                reset_token: token,
                reset_token_expires_at: { [Op.gt]: new Date() }
            }
        });

        // 4. Handle invalid token
        if (!user) {
            console.log(`Reset attempt with invalid or expired token: ${token}`);
            return res.status(400).json({ message: 'Token is invalid or has expired.' });
        }

        // 5. Set the new password 
        user.password = password;
         user.reset_token = null;
        user.reset_token_expires_at = null;

        
         await user.save();
        console.log(`New password for ${user.email} has been successfully reset and token invalidated.`);
        
        // 6. Send ONE final response 
        // IMPORTANT: Do not send any sensitive information in the response.
        res.status(200).json({ message: 'Password has been successfully reset.' });

    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
};
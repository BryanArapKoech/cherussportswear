// cherus-backend/controllers/authController.js



const { User, LoginAttempt } = require('../models');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

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

    // --- Helper function to get client IP address, handling proxies ---
    // Place this helper inside or make it accessible if used elsewhere
    const getIpAddress = (request) => {
        const forwardedFor = request.headers['x-forwarded-for'];
        if (forwardedFor) {
            // 'x-forwarded-for' can be a comma-separated list if multiple proxies
            return forwardedFor.split(',').shift().trim();
        }
        return request.socket?.remoteAddress || request.ip; // Fallback to socket.remoteAddress or req.ip
    };

    const ipAddress = getIpAddress(req);
    const userAgent = req.headers['user-agent'] || null; // Get user agent, or null if not present

    // --- Helper function to log login attempt ---
    // This is created as a separate async function to avoid forgetting `await`
    // and to keep the main logic cleaner.
    const logAttempt = async (isSuccessful, reason = null) => {
        try {
            await LoginAttempt.create({
                emailAttempted: email, // Log the email that was attempted
                ipAddress: ipAddress,
                userAgent: userAgent,
                successful: isSuccessful,
                failureReason: reason
                // attemptedAt is set by defaultValue in the model/DB
            });
        } catch (logError) {
            // Log to console if LoginAttempt creation fails, but don't let it break the login flow
            console.error('Failed to log login attempt:', logError);
        }
    };
    // --- End helper function ---


    if (!email || !password) {             
        await logAttempt(false, 'missing_credentials');
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            // To match login.js error handling
            await logAttempt(false, 'user_not_found');
            return res.status(401).json({ success: false, message: 'Invalid email or password. Please try again.' });
        }

        const isValidPassword = user.validPassword(password); // validPassword method from User model
        if (!isValidPassword) {
             // To match login.js error handling
            await logAttempt(false, 'invalid_password');
            return res.status(401).json({ success: false, message: 'Invalid email or password. Please try again.' });
        }

         // If password is valid, log successful attempt
        await logAttempt(true);

        const authToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // CSRF Token Generation & Cookie Setting ---
        const csrfToken = crypto.randomBytes(32).toString('hex');

        res.cookie('csrfToken', csrfToken, { // Name of the cookie
            // HttpOnly: true, // JS cannot access. For double-submit, frontend *might* need to read it if not also sent in body.
                               // If frontend reads from JSON body, HttpOnly can be true for the cookie.
                               // Let's make it accessible to JS for simplicity if frontend needs to read from cookie directly.
            httpOnly: false,   // Set to true if frontend exclusively uses the CSRF token from JSON response body.
            secure: process.env.NODE_ENV === 'production', // Send only over HTTPS in production
            sameSite: 'Lax', // Or 'Strict'. 'Lax' is a good default.
            // path: '/', // Optional: cookie available for all paths
            // maxAge: 1 * 60 * 60 * 1000 // Optional: 1 hour expiry, same as JWT for consistency
        });
        


        res.status(200).json({
            success: true, // To match login.js
            message: 'Login successful! Redirecting...', // To match login.js
            user: { // Optional
                id: user.id,
                email: user.email,
            },
            token: authToken, // The JWT Auth Token
            csrfToken: csrfToken // Send CSRF token in body as well, for frontend to easily grab
        });

    } catch (error) {
        console.error('Error during user login:', error);
        // Log a generic server error attempt if it reaches here, though specific errors are caught above
        // This might not have `email` defined if the error is very early, so be cautious.
        // next(error);
         if (email) { // Only log if email was part of the request context
            await logAttempt(false, 'server_error');
        }
        return res.status(500).json({ success: false, message: 'An error occurred. Please try again.' }); // To match login.js
    }
};
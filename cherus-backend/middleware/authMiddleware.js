// cherus-backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    // Get token from header (e.g., "Bearer YOUR_TOKEN_HERE")
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'No authentication token provided.' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token part after "Bearer "

    if (!token) {
        return res.status(401).json({ message: 'Authentication token format is incorrect.' });
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded user payload to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Token verification failed:', error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Authentication token has expired.' });
        }
        return res.status(403).json({ message: 'Invalid authentication token.' }); // 403 Forbidden
    }
};
// cherus-backend/middleware/csrfMiddleware.js
module.exports = function verifyCsrfToken(req, res, next) {
    // This middleware should only apply to state-changing requests (POST, PUT, DELETE, PATCH)
    // that are also authenticated (i.e., after authMiddleware.verifyToken)
    // and are not the login/register requests themselves.

    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        const cookieCsrfToken = req.cookies['csrfToken']; // From cookie-parser
        const headerCsrfToken = req.headers['x-csrf-token']; // Custom header from frontend

        if (!cookieCsrfToken || !headerCsrfToken || cookieCsrfToken !== headerCsrfToken) {
            console.warn('CSRF token mismatch or missing. Cookie:', cookieCsrfToken, 'Header:', headerCsrfToken);
            return res.status(403).json({ success: false, message: 'Invalid CSRF token. Request forbidden.' });
        }
    }
    next();
};
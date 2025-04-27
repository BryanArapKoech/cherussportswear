// Basic Error Handler Middleware
const errorHandler = (err, req, res, next) => {
    console.error('-------------------- ERROR --------------------');
    console.error(err.stack || err);
    console.error('---------------------------------------------');

    const statusCode = err.statusCode || 500; // Use error's status code or default to 500
    const message = err.message || 'Internal Server Error';

    // Avoid sending detailed stack traces in production
    const errorResponse = {
        message: message,
        // Optionally include stack trace only in development
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        // Optionally include specific error codes or types
         ...(err.code && { code: err.code }),
    };


    res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
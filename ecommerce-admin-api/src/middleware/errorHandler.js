// src/middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error("An unhandled error occurred:", err.stack); // Log the full stack for better debugging

  // If the status code is still 200, it means it's an unhandled server error.
  // Otherwise, another part of the app might have set a specific error code (e.g., 404).
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: "An unexpected error occurred on the server.",
    // Only show the detailed error stack in development for security
    error: process.env.NODE_ENV === 'production' ? 'Error' : err.message
  });
};

module.exports = errorHandler;
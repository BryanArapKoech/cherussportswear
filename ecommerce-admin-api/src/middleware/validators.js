// src/middleware/validators.js

const { body, validationResult } = require('express-validator');

// Validation rules for creating a new admin
const adminCreationRules = () => {
  return [
    // email rule
    body('email')
      .isEmail()
      .withMessage('Must be a valid email address')
      .normalizeEmail(),

    // --- PASSWORD RULE ---
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/\d/)
      .withMessage('Password must contain at least one number')
      .matches(/[a-z]/)
      .withMessage('Password must contain at least one lowercase letter')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter')
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)'),
    
    // role_id rule 
    body('role_id')
      .isInt({ gt: 0 })
      .withMessage('role_id must be a positive integer'),
  ];
};

// The 'validate' function 
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

  return res.status(422).json({
    message: 'Validation failed',
    errors: extractedErrors,
  });
};

module.exports = {
  adminCreationRules,
  validate,
};
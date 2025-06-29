// src/middleware/authorize.js

const db = require('../config/database');

const authorize = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      // req.admin should have been attached by the authenticate middleware
      const { role_id } = req.admin;
      
      if (!role_id) {
        return res.status(403).json({ message: 'Forbidden: No role assigned' });
      }

      // Get the role's permissions from the database
      const { rows } = await db.query('SELECT permissions FROM roles WHERE id = $1', [role_id]);
      
      if (rows.length === 0) {
        return res.status(403).json({ message: 'Forbidden: Role not found' });
      }

      const permissions = rows[0].permissions?.permissions || [];

      // Check for wildcard permission or the specific required permission
      if (permissions.includes('*') || permissions.includes(requiredPermission)) {
        next(); // Permission granted, proceed to the route handler
      } else {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }
    } catch (error) {
      console.error('Authorization error:', error);
      res.status(500).json({ message: 'Server error during authorization' });
    }
  };
};

module.exports = authorize;
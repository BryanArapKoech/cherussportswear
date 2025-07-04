// src/utils/audit.js

const db = require('../config/database');

/**
 * Logs an administrative action to the audit_logs table.
 * @param {number} adminId - The ID of the admin performing the action.
 * @param {string} action - A description of the action (e.g., 'create_admin').
 * @param {object} details - A JSON object with relevant details.
 *   - target_resource: The type of resource being affected (e.g., 'admins').
 *   - target_id: The ID of the resource being affected.
 *   - ip_address: The IP address of the requestor.
 */
const logAction = async (adminId, action, details = {}) => {
  try {
    const { target_resource, target_id, ip_address, ...otherDetails } = details;

    await db.query(
      `INSERT INTO audit_logs (admin_id, action, target_resource, target_id, ip_address, details)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        adminId,
        action,
        target_resource || null,
        target_id || null,
        ip_address || null,
        Object.keys(otherDetails).length > 0 ? { ...otherDetails } : null
      ]
    );
  } catch (error) {
    // Log the error to the console but don't crash the main application
    console.error('Failed to write to audit log:', error);
  }
};

module.exports = {
  logAction,
};
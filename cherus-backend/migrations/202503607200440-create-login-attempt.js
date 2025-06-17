'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LoginAttempts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT // Using BIGINT for id as it's good practice for potentially large tables
      },
      emailAttempted: {
        type: Sequelize.STRING, // VARCHAR(255) by default for STRING
        allowNull: false
      },
      ipAddress: {
        type: Sequelize.STRING(45), // Explicitly VARCHAR(45)
        allowNull: false
      },
      userAgent: {
        type: Sequelize.TEXT,
        allowNull: true // User agent can be nullable
      },
      successful: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      attemptedAt: {
        type: Sequelize.DATE, // Sequelize DATE maps to TIMESTAMP WITH TIME ZONE in PostgreSQL
        allowNull: false,
        defaultValue: Sequelize.NOW // Set default to current timestamp
      },
      failureReason: {
        type: Sequelize.STRING,
        allowNull: true // Nullable as it only applies to failed attempts
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add indexes for commonly queried columns
    await queryInterface.addIndex('LoginAttempts', ['emailAttempted']);
    await queryInterface.addIndex('LoginAttempts', ['ipAddress']);
    await queryInterface.addIndex('LoginAttempts', ['attemptedAt']); // Indexing timestamp can be useful for time-based queries
  },
  async down(queryInterface, Sequelize) {
    // Remove indexes first (optional, but good practice if added separately)
    // await queryInterface.removeIndex('LoginAttempts', ['emailAttempted']);
    // await queryInterface.removeIndex('LoginAttempts', ['ipAddress']);
    // await queryInterface.removeIndex('LoginAttempts', ['attemptedAt']);
    // dropTable will typically drop associated indexes as well, but being explicit is safer for some DBs or complex index scenarios.
    // For simplicity here, dropTable is usually sufficient for indexes created by createTable or addIndex on that table.

    await queryInterface.dropTable('LoginAttempts');
  }
};
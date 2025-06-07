'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LoginAttempt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here if needed in the future
      // e.g., this.belongsTo(models.User, { foreignKey: 'userIdAttempted', targetKey: 'id' });
      // But for now, we are just logging the email string, not linking directly to a User ID.
    }
  }
  LoginAttempt.init({
    // id is auto-defined by Sequelize as primary key
    emailAttempted: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    successful: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    attemptedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    failureReason: {
      type: DataTypes.STRING,
      allowNull: true
    }
    // createdAt and updatedAt are handled by Sequelize by default (timestamps: true)
  }, {
    sequelize,
    modelName: 'LoginAttempt',
    // timestamps: true, // This is the default, so not strictly needed to specify
  });
  return LoginAttempt;
};
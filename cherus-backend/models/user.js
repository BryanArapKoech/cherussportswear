'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs'); // Import bcrypt library

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    
    static associate(models) {
      // A User HAS MANY Orders 
      User.hasMany(models.Order, {
        foreignKey: 'userId',
        as: 'orders'
      });
    }

    /**
     * Instance method to compare a plain password with the hashed password stored in the database.
     * @param {string} password The plain-text password to compare.
     * @returns {boolean} True if passwords match, false otherwise.
     */
    validPassword(password) {
      return bcrypt.compareSync(password, this.password);
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Email must be unique for each user
      validate: {
        isEmail: true, // Ensure the email is in a valid email format
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // --- START:Password Reset ---
    reset_token: {
        type: DataTypes.STRING,
        allowNull: true
    },
    reset_token_expires_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
    // --- END: Password Reset ---
  }, {
    sequelize,
    modelName: 'User',
    // Define hooks to hash passwords before saving them to the database
    hooks: {
      beforeCreate: async (user) => {
        // Hash password only if it's being set or changed during creation
        if (user.password) {
          const salt = await bcrypt.genSalt(10); // Generate a salt for hashing
          user.password = await bcrypt.hash(user.password, salt); // Hash the password
        }
      },
      beforeUpdate: async (user) => {
        // Hash password only if the password field has been changed during an update
        if (user.password && user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });
  return User;
};
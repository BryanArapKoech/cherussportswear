// models/order.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
      Order.hasMany(models.OrderItem, {
        foreignKey: 'orderId',
        as: 'items',
        onDelete: 'CASCADE'
      });
    }
  }
  Order.init({
    // --- THIS IS THE NEW ID FIELD ---
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    // --- End of new field ---
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    customerPhone: {
         type: DataTypes.STRING,
         allowNull: false,
    },
    customerEmail: DataTypes.STRING,
    shippingAddress: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'PENDING',
    },
    paymentMethod: {
         type: DataTypes.STRING,
         allowNull: false,
    },
    mpesaCheckoutRequestID: {
         type: DataTypes.STRING,
         unique: true,
         allowNull: true,
    },
    mpesaReceiptNumber: {
         type: DataTypes.STRING,
         allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // An Order BELONGS TO a User
      Order.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
      Order.hasMany(models.OrderItem, { // Order has many OrderItems
        foreignKey: 'orderId',
        as: 'items', // Alias to access items via order.items
        onDelete: 'CASCADE' // Delete items if order is deleted
      });
    }
  }
  Order.init({
     userId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Allow for guest orders in the future if needed
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    customerPhone: { // Store the primary phone used for order
         type: DataTypes.STRING,
         allowNull: false,
    },
    customerEmail: DataTypes.STRING, // Store the primary email used for order
    shippingAddress: { // Store structured shipping details
        type: DataTypes.JSON,
        allowNull: false,
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2), // Adjust precision as needed
        allowNull: false,
    },
    status: { // e.g., PENDING, PAID, FAILED, SHIPPED, DELIVERED, CANCELLED
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'PENDING',
    },
    paymentMethod: { // e.g., 'mpesa', 'card', 'paypal'
         type: DataTypes.STRING,
         allowNull: false,
    },
    mpesaCheckoutRequestID: { // To link M-Pesa callback to the order
         type: DataTypes.STRING,
         unique: true, // Ensure uniqueness
         allowNull: true, // Null until STK push is initiated
    },
    mpesaReceiptNumber: { // Store the M-Pesa transaction code on success
         type: DataTypes.STRING,
         allowNull: true,
    },
    // to add other fields like shippingCost, discountAmount etc. if needed
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};